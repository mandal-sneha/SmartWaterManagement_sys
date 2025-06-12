import React, { useState, useEffect } from "react";
import { useTheme } from "../UserDashboard.jsx";
import {
  FiArrowLeft,
  FiSearch,
  FiPlus,
  FiEdit3,
  FiMoreVertical,
  FiEye,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { HiOutlineOfficeBuilding, HiOutlineHome } from "react-icons/hi";
import { axiosInstance } from "../../lib/axios.js";
import desertCactus from "../../assets/desert-cactus.svg";

const AddProperty = () => {
  const { darkMode, colors } = useTheme();

  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    propertyName: "",
    exactLocation: "",
    typeOfProperty: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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

      const res = await axiosInstance.get(
        `/property/${user.userId}/view-properties`
      );

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

  const handleAddProperty = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.userId) {
        setError("User not found. Please login again.");
        setSubmitting(false);
        return;
      }

      if (
        !formData.propertyName.trim() ||
        !formData.exactLocation.trim() ||
        !formData.typeOfProperty
      ) {
        setError("Please fill in all required fields");
        setSubmitting(false);
        return;
      }

      const res = await axiosInstance.post(
        `/property/${user.userId}/add-property`,
        {
          propertyName: formData.propertyName.trim(),
          exactLocation: formData.exactLocation.trim(),
          typeOfProperty: formData.typeOfProperty,
          description: formData.description.trim(),
        }
      );

      if (res.data.success) {
        setProperties((prevProperties) => [
          ...prevProperties,
          res.data.property,
        ]);
        setShowAddModal(false);
        setFormData({
          propertyName: "",
          exactLocation: "",
          typeOfProperty: "",
          description: "",
        });
        setError("");
      } else {
        setError(res.data.message || "Failed to add property");
      }
    } catch (err) {
      console.error("Error adding property:", err);
      setError(err.response?.data?.message || "Failed to add property");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProperties = properties.filter(
    (property) =>
      property.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.exactLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.typeOfProperty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleEdit = (property) => console.log("Edit:", property);
  const handleDelete = (property) => console.log("Delete:", property);
  const handleView = (property) => console.log("View:", property);

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
      exactLocation: "", 
      typeOfProperty: "", 
      description: "" 
    });
    setError("");
  };

  return (
    <div
      className="font-sans min-h-screen max-h-screen overflow-hidden flex flex-col"
      style={{
        backgroundColor: colors.baseColor,
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div className="flex items-center mb-5 gap-4 flex-shrink-0">
        <button
          className={`bg-transparent border-none text-xl cursor-pointer p-2 rounded-lg transition-colors duration-200 ${
            darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
          }`}
          style={{ color: colors.textColor }}
        >
          <FiArrowLeft />
        </button>
        <h1
          className="text-2xl font-semibold tracking-tight"
          style={{ color: colors.textColor }}
        >
          Add Property
        </h1>
        <div className="ml-auto relative">
          <div className="relative">
            <FiSearch
              className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-base"
              style={{ color: colors.mutedText }}
            />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-70 py-2.5 pl-10 pr-4 border-2 rounded-full text-sm outline-none transition-all duration-200 ${
                searchTerm
                  ? `${
                      darkMode ? "shadow-indigo-500/20" : "shadow-indigo-500/10"
                    } shadow-sm`
                  : ""
              }`}
              style={{
                backgroundColor: colors.cardBg,
                color: darkMode ? "#b0b0b0" : "#374151",
                borderColor: searchTerm
                  ? colors.primaryBg
                  : darkMode
                  ? "#404040"
                  : "#e5e7eb",
                boxShadow: searchTerm
                  ? `0 0 0 3px ${
                      darkMode
                        ? "rgba(90, 90, 122, 0.2)"
                        : "rgba(99, 102, 241, 0.1)"
                    }`
                  : "none",
              }}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <div
          className="rounded-2xl overflow-hidden border h-full flex flex-col"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.borderColor,
            boxShadow: `0 4px 20px ${
              darkMode ? "rgba(0, 0, 0, 0.3)" : "rgba(75, 0, 130, 0.08)"
            }`,
          }}
        >
          <div
            className="flex justify-between items-center p-6 border-b flex-shrink-0"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.borderColor,
            }}
          >
            <h2
              className="text-lg font-semibold"
              style={{ color: colors.textColor }}
            >
              Properties List
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-white border-none rounded-lg py-2.5 px-5 text-xs font-semibold flex items-center gap-1.5 hover:-translate-y-0.5 transition-transform duration-200"
              style={{
                backgroundColor: colors.primaryBg,
                boxShadow: `0 2px 8px ${
                  darkMode
                    ? "rgba(90, 90, 122, 0.3)"
                    : "rgba(99, 102, 241, 0.25)"
                }`,
              }}
            >
              <FiPlus className="text-sm font-bold" />
              Add New Property
            </button>
          </div>

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 p-12 text-center">
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2"
                style={{ borderColor: colors.primaryBg }}
              ></div>
              <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
                Loading properties...
              </p>
            </div>
          )}

          {!loading && properties.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 p-12 text-center">
              <img
                src={desertCactus}
                alt="No properties"
                className="max-w-xs w-full"
              />
              <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
                You don't have any properties added yet.
              </p>
            </div>
          )}

          {!loading && filteredProperties.length > 0 && (
            <div
              className="flex-1 overflow-auto scrollbar-thin"
              style={{ maxHeight: "calc(100vh - 200px)" }}
            >
              <table className="w-full border-collapse">
                <thead
                  className="sticky top-0 z-10"
                  style={{ backgroundColor: darkMode ? "#333344" : "#fafbff" }}
                >
                  <tr>
                    {[
                      "Property Name",
                      "Address",
                      "No. of Tenants",
                      "Property Type",
                      "Action",
                    ].map((head, idx) => (
                      <th
                        key={idx}
                        className="py-4 px-6 text-left text-xs font-semibold uppercase tracking-wider border-b"
                        style={{
                          color: colors.mutedText,
                          borderColor: colors.borderColor,
                        }}
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: colors.cardBg }}>
                  {filteredProperties.map((property) => (
                    <tr
                      key={property._id}
                      className="border-b hover:bg-opacity-50 transition-colors duration-150"
                      style={{ borderColor: colors.borderColor }}
                    >
                      <td className="py-4 px-6 text-sm">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: darkMode ? "#404040" : "#f3f4f6",
                            }}
                          >
                            {getAvatarIcon(property.typeOfProperty)}
                          </div>
                          <div
                            className="font-semibold text-sm"
                            style={{ color: colors.textColor }}
                          >
                            {property.propertyName || "Unnamed Property"}
                          </div>
                        </div>
                      </td>
                      <td
                        className="py-4 px-6 text-sm"
                        style={{ color: colors.textColor }}
                      >
                        {property.exactLocation || "No address"}
                      </td>
                      <td
                        className="py-4 px-6 text-sm font-medium"
                        style={{ color: colors.textColor }}
                      >
                        {property.numberOfTenants || 0}
                      </td>
                      <td
                        className="py-4 px-6 text-sm font-medium"
                        style={{ color: colors.textColor }}
                      >
                        {property.typeOfProperty || "Unknown"}
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <div className="flex items-center gap-3 relative">
                          <button
                            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                            onClick={() => handleEdit(property)}
                            title="Edit"
                            style={{ color: colors.mutedText }}
                          >
                            <FiEdit3 className="text-sm" />
                          </button>
                          <button
                            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 rotate-90"
                            onClick={() => toggleDropdown(property._id)}
                            style={{ color: colors.mutedText }}
                          >
                            <FiMoreVertical />
                          </button>
                          {dropdownOpen === property._id && (
                            <div
                              className="absolute top-full right-0 border rounded-lg z-50 min-w-32 mt-1"
                              style={{
                                backgroundColor: colors.cardBg,
                                borderColor: darkMode ? "#404040" : "#e5e7eb",
                                boxShadow: `0 8px 20px ${
                                  darkMode
                                    ? "rgba(0, 0, 0, 0.4)"
                                    : "rgba(0, 0, 0, 0.15)"
                                }`,
                              }}
                            >
                              <button
                                onClick={() => {
                                  handleView(property);
                                  setDropdownOpen(null);
                                }}
                                className="w-full py-2.5 px-3.5 text-left text-xs cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                                style={{ color: colors.textColor }}
                              >
                                <div className="flex items-center gap-2">
                                  <FiEye className="text-xs" /> View Details
                                </div>
                              </button>
                              <button
                                onClick={() => {
                                  handleDelete(property);
                                  setDropdownOpen(null);
                                }}
                                className="w-full py-2.5 px-3.5 text-left text-xs cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                                style={{ color: colors.textColor }}
                              >
                                <div className="flex items-center gap-2">
                                  <FiTrash2 className="text-xs" /> Delete
                                </div>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Property Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="rounded-lg p-6 w-full max-w-md mx-4"
            style={{ backgroundColor: colors.cardBg }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                className="text-lg font-semibold"
                style={{ color: colors.textColor }}
              >
                Add New Property
              </h3>
              <button onClick={closeModal} style={{ color: colors.mutedText }}>
                <FiX className="text-xl hover:text-red-500 transition-colors duration-150" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleAddProperty}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Property Name *"
                  value={formData.propertyName}
                  onChange={(e) =>
                    setFormData({ ...formData, propertyName: e.target.value })
                  }
                  required
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-150"
                  style={{
                    backgroundColor: colors.baseColor,
                    color: colors.textColor,
                    borderColor: colors.borderColor,
                  }}
                />
                <input
                  type="text"
                  placeholder="Address *"
                  value={formData.exactLocation}
                  onChange={(e) =>
                    setFormData({ ...formData, exactLocation: e.target.value })
                  }
                  required
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-150"
                  style={{
                    backgroundColor: colors.baseColor,
                    color: colors.textColor,
                    borderColor: colors.borderColor,
                  }}
                />
                <select
                  value={formData.typeOfProperty}
                  onChange={(e) =>
                    setFormData({ ...formData, typeOfProperty: e.target.value })
                  }
                  required
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-150"
                  style={{
                    backgroundColor: colors.baseColor,
                    color: colors.textColor,
                    borderColor: colors.borderColor,
                  }}
                >
                  <option value="">Select Property Type *</option>
                  <option value="Personal Property">Personal Property</option>
                  <option value="Commercial Property">
                    Commercial Property
                  </option>
                </select>
                <textarea
                  placeholder="Description (Optional)"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-150 resize-none"
                  style={{
                    backgroundColor: colors.baseColor,
                    color: colors.textColor,
                    borderColor: colors.borderColor,
                  }}
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2 px-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  style={{
                    borderColor: colors.borderColor,
                    color: colors.textColor,
                  }}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 px-4 text-white rounded-lg hover:opacity-90 transition-opacity duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: colors.primaryBg }}
                >
                  {submitting ? "Adding..." : "Add Property"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProperty;