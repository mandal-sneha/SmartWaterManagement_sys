import React, { useState, useEffect } from "react";
import { useTheme } from "../UserDashboard.jsx";
import {
  FiArrowLeft,
  FiSearch,
  FiPlus,
  FiEdit3,
  FiMoreVertical,
  FiTrash2,
} from "react-icons/fi";
import { HiOutlineOfficeBuilding, HiOutlineHome } from "react-icons/hi";
import { axiosInstance } from "../../lib/axios.js";
import desertCactus from "../../assets/desert-cactus.svg";
import AddPropertyForm from "./addpropertycomponents/AddPropertyForm.jsx";
import PropertyTenants from "./addpropertycomponents/PropertyTenants.jsx";

const AddProperty = () => {
  const { darkMode, colors } = useTheme();
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [expandedPropertyId, setExpandedPropertyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    propertyName: "",
    district: "",
    municipality: "",
    wardNo: "",
    typeOfProperty: "",
    holdingNo: "",
    flatId: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    rootId: null,
    name: "",
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError("");
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.userId) {
        setError("User not found. Please login again.");
        setLoading(false);
        return;
      }

      const res = await axiosInstance.get(`/property/${user.userId}/view-properties`);
      if (res.data.success) {
        setProperties(res.data.properties || []);
      } else {
        setError(res.data.message || "Failed to fetch properties");
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError(err.response?.data?.message || "Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
    setExpandedPropertyId(dropdownOpen === id ? null : id);
  };

  const handleDeleteProperty = async () => {
    if (!confirmDelete.rootId) return;

    try {
      const res = await axiosInstance.delete(`/property/${confirmDelete.rootId}/delete-property`);
      if (res.data.success) {
        setProperties((prev) =>
          prev.filter((p) => p.rootId !== confirmDelete.rootId)
        );
        setConfirmDelete({ open: false, rootId: null, name: "" });
      } else {
        alert("Failed to delete property");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Something went wrong while deleting");
    }
  };

  const getAvatarIcon = (type) =>
    type === "Personal Property" ? (
      <HiOutlineHome className="text-lg" />
    ) : (
      <HiOutlineOfficeBuilding className="text-lg" />
    );

  const closeModal = () => {
    setShowAddModal(false);
    setFormData({
      propertyName: "",
      district: "",
      municipality: "",
      wardNo: "",
      typeOfProperty: "",
      holdingNo: "",
      flatId: "",
    });
    setError("");
  };

  const filteredProperties = properties.filter(
    (property) =>
      property.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.exactLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.typeOfProperty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="font-sans min-h-screen max-h-screen overflow-hidden flex flex-col" style={{ backgroundColor: colors.baseColor }}>
      <div className="flex items-center mb-5 gap-4 flex-shrink-0">
        <button className={`bg-transparent text-xl p-2 rounded-lg ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`} style={{ color: colors.textColor }}>
          <FiArrowLeft />
        </button>
        <h1 className="text-2xl font-semibold" style={{ color: colors.textColor }}>
          Add Property
        </h1>
        <div className="ml-auto relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base" style={{ color: colors.mutedText }} />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-70 py-2.5 pl-10 pr-4 border-2 rounded-full text-sm outline-none"
            style={{
              backgroundColor: colors.cardBg,
              color: colors.textColor,
              borderColor: searchTerm ? colors.primaryBg : colors.borderColor,
            }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: "#fdecea", color: "#b91c1c", border: "1px solid #fca5a5" }}>
          {error}
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <div className="rounded-2xl overflow-hidden border h-full flex flex-col" style={{ backgroundColor: colors.cardBg, borderColor: colors.borderColor }}>
          <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: colors.borderColor }}>
            <h2 className="text-lg font-semibold" style={{ color: colors.textColor }}>
              Properties List
            </h2>
            <button onClick={() => setShowAddModal(true)} className="text-white border-none rounded-lg py-2.5 px-5 text-xs font-semibold flex items-center gap-1.5" style={{ backgroundColor: colors.primaryBg }}>
              <FiPlus className="text-sm font-bold" />
              Add New Property
            </button>
          </div>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.primaryBg }}></div>
              <p className="text-sm font-medium" style={{ color: colors.mutedText }}>
                Loading properties...
              </p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 p-12 text-center">
              <img src={desertCactus} alt="No properties" className="max-w-xs w-full" />
              <p className="text-base font-medium" style={{ color: colors.mutedText }}>
                You don't have any properties added yet.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10" style={{ backgroundColor: colors.baseColor }}>
                  <tr>
                    {["Property Name", "Address", "No. of Tenants", "Property Type", "Action"].map((head, idx) => (
                      <th key={idx} className="py-4 px-6 text-left text-xs font-semibold uppercase tracking-wider border-b" style={{ color: colors.mutedText, borderColor: colors.borderColor }}>
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: colors.cardBg }}>
                  {filteredProperties.map((property) => (
                    <React.Fragment key={property._id}>
                      <tr className="border-b" style={{ borderColor: colors.borderColor }}>
                        <td className="py-4 px-6 text-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: darkMode ? "#404040" : "#f3f4f6", color: colors.textColor }}>
                              {getAvatarIcon(property.typeOfProperty)}
                            </div>
                            <div className="font-semibold text-sm" style={{ color: colors.textColor }}>
                              {property.propertyName || "Unnamed Property"}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm" style={{ color: colors.textColor }}>
                          {property.exactLocation || "No address"}
                        </td>
                        <td className="py-4 px-6 text-sm font-medium" style={{ color: colors.textColor }}>
                          {Math.max(0, (property.numberOfTenants || 1) - 1)}
                        </td>
                        <td className="py-4 px-6 text-sm font-medium" style={{ color: colors.textColor }}>
                          {property.typeOfProperty || "Unknown"}
                        </td>
                        <td className="py-4 px-6 text-sm flex items-center gap-2">
                          <button
                            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 rotate-90"
                            onClick={() => toggleDropdown(property._id)}
                            style={{ color: colors.mutedText }}
                          >
                            <FiMoreVertical />
                          </button>
                          <button
                            onClick={() =>
                              setConfirmDelete({
                                open: true,
                                rootId: property.rootId,
                                name: property.propertyName,
                              })
                            }
                            className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-700"
                            style={{ color: "red" }}
                            title="Delete Property"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                      {expandedPropertyId === property._id && (
                        <tr>
                          <td colSpan={5} className="p-0">
                            <PropertyTenants property={property} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddPropertyForm
          colors={colors}
          formData={formData}
          setFormData={setFormData}
          submitting={submitting}
          setSubmitting={setSubmitting}
          error={error}
          setError={setError}
          closeModal={closeModal}
          setProperties={setProperties}
        />
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-2 text-red-600">Confirm Deletion</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to delete <strong>{confirmDelete.name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete({ open: false, rootId: null, name: "" })}
                className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProperty}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProperty;
