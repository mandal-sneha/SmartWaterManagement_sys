import React from "react";
import { FiX } from "react-icons/fi";
import { axiosInstance } from "../../../lib/axios";

const AddPropertyForm = ({
  colors,
  formData,
  setFormData,
  submitting,
  setSubmitting,
  error,
  setError,
  closeModal,
  setProperties,
}) => {
  const isPersonal = formData?.typeOfProperty === "Personal Property";
  const isApartment = formData?.typeOfProperty === "Apartment";

  const updateUserWaterId = async (userId) => {
    try {
      const response = await axiosInstance.get(`/user/${userId}/get-user`);
      if (response.data?.success && response.data.data?.waterId) {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        storedUser.waterId = response.data.data.waterId;
        localStorage.setItem("user", JSON.stringify(storedUser));
        return storedUser.waterId;
      }
    } catch (error) {
      console.error("Error fetching user waterId:", error);
    }
    return null;
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.userId) {
      setError("User not found. Please login again.");
      setSubmitting(false);
      return;
    }

    const {
      propertyName,
      district,
      municipality,
      wardNo,
      typeOfProperty,
      holdingNo,
      flatId,
    } = formData || {};

    if (!propertyName?.trim()) {
      setError("Property name is required.");
      setSubmitting(false);
      return;
    }

    if (!district?.trim()) {
      setError("District is required.");
      setSubmitting(false);
      return;
    }

    if (!municipality?.trim()) {
      setError("Municipality is required.");
      setSubmitting(false);
      return;
    }

    if (!wardNo || parseInt(wardNo) < 1) {
      setError("Valid ward number is required.");
      setSubmitting(false);
      return;
    }

    if (!typeOfProperty) {
      setError("Property type is required.");
      setSubmitting(false);
      return;
    }

    if (typeOfProperty === "Personal Property" && !holdingNo?.trim()) {
      setError("Holding number is required for personal property.");
      setSubmitting(false);
      return;
    }

    if (typeOfProperty === "Apartment" && !flatId?.trim()) {
      setError("Flat ID is required for apartment.");
      setSubmitting(false);
      return;
    }

    const getPreciseLocation = () =>
      new Promise((resolve) => {
        if (!navigator.geolocation) {
          resolve("0,0");
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(`${position.coords.latitude.toFixed(6)},${position.coords.longitude.toFixed(6)}`),
          () => resolve("0,0"),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
        );
      });

    try {
      const exactLocation = await getPreciseLocation();
      const requestPayload = {
        propertyName: propertyName.trim(),
        district: district.trim(),
        municipality: municipality.trim(),
        wardNumber: parseInt(wardNo),
        typeOfProperty,
        exactLocation,
        idType: typeOfProperty === "Personal Property" ? "holdingNumber" : "flatId",
        id: typeOfProperty === "Personal Property" ? holdingNo.trim() : flatId.trim(),
      };

      const res = await axiosInstance.post(`/property/${user.userId}/add-property`, requestPayload);

      if (res.data?.success) {
        const newProperty = res.data.property;
        setProperties((prev) => [...prev, newProperty]);

        const updatedWaterId = await updateUserWaterId(user.userId);
        if (!updatedWaterId) {
          console.error("Failed to update waterId after property creation");
        }

        setFormData({
          propertyName: "",
          district: "",
          municipality: "",
          wardNo: "",
          typeOfProperty: "",
          holdingNo: "",
          flatId: "",
        });

        closeModal();
      } else {
        setError(res.data?.message || "Failed to add property");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to add property. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePropertyTypeChange = (value) => {
    setFormData((prev) => ({ ...prev, typeOfProperty: value, holdingNo: "", flatId: "" }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: colors?.cardBg || "#ffffff" }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold" style={{ color: colors?.textColor || "#000000" }}>Add New Property</h3>
          <button onClick={closeModal} style={{ color: colors?.mutedText || "#666666" }} type="button">
            <FiX className="text-xl hover:text-red-500 transition-colors duration-150" />
          </button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleAddProperty}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Property Name * (max 50 characters)"
              value={formData?.propertyName || ""}
              onChange={(e) => handleInputChange("propertyName", e.target.value.slice(0, 50))}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: colors?.baseColor || "#ffffff",
                color: colors?.textColor || "#000000",
                borderColor: colors?.borderColor || "#cccccc",
              }}
            />

            <input
              type="text"
              placeholder="District *"
              value={formData?.district || ""}
              onChange={(e) => handleInputChange("district", e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: colors?.baseColor || "#ffffff",
                color: colors?.textColor || "#000000",
                borderColor: colors?.borderColor || "#cccccc",
              }}
            />

            <input
              type="text"
              placeholder="Municipality *"
              value={formData?.municipality || ""}
              onChange={(e) => handleInputChange("municipality", e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: colors?.baseColor || "#ffffff",
                color: colors?.textColor || "#000000",
                borderColor: colors?.borderColor || "#cccccc",
              }}
            />

            <input
              type="number"
              min="1"
              placeholder="Ward No. *"
              value={formData?.wardNo || ""}
              onChange={(e) => handleInputChange("wardNo", e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: colors?.baseColor || "#ffffff",
                color: colors?.textColor || "#000000",
                borderColor: colors?.borderColor || "#cccccc",
              }}
            />

            <select
              value={formData?.typeOfProperty || ""}
              onChange={(e) => handlePropertyTypeChange(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: colors?.baseColor || "#ffffff",
                color: colors?.textColor || "#000000",
                borderColor: colors?.borderColor || "#cccccc",
              }}
            >
              <option value="">Select Property Type *</option>
              <option value="Personal Property">Personal Property</option>
              <option value="Apartment">Apartment</option>
            </select>

            {isPersonal && (
              <input
                type="text"
                placeholder="Holding No. *"
                value={formData?.holdingNo || ""}
                onChange={(e) => handleInputChange("holdingNo", e.target.value)}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: colors?.baseColor || "#ffffff",
                  color: colors?.textColor || "#000000",
                  borderColor: colors?.borderColor || "#cccccc",
                }}
              />
            )}

            {isApartment && (
              <input
                type="text"
                placeholder="Flat ID *"
                value={formData?.flatId || ""}
                onChange={(e) => handleInputChange("flatId", e.target.value)}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: colors?.baseColor || "#ffffff",
                  color: colors?.textColor || "#000000",
                  borderColor: colors?.borderColor || "#cccccc",
                }}
              />
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 py-2 px-4 border rounded-lg hover:bg-gray-50 transition-colors duration-150"
              style={{
                borderColor: colors?.borderColor || "#cccccc",
                color: colors?.textColor || "#000000",
              }}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2 px-4 text-white rounded-lg hover:opacity-90 transition-opacity duration-150 disabled:opacity-50"
              style={{ backgroundColor: colors?.primaryBg || "#007bff" }}
            >
              {submitting ? "Adding..." : "Add Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyForm;