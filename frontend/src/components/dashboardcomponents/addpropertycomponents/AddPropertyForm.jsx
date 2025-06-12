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
  const isPersonal = formData.typeOfProperty === "Personal Property";
  const isApartment = formData.typeOfProperty === "Apartment";

  const handleAddProperty = async (e) => {
    e.preventDefault();
    
    // Add safety check for setSubmitting
    if (typeof setSubmitting === 'function') {
      setSubmitting(true);
    }
    
    // Add safety check for setError
    if (typeof setError === 'function') {
      setError("");
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.userId) {
      if (typeof setError === 'function') {
        setError("User not found. Please login again.");
      }
      if (typeof setSubmitting === 'function') {
        setSubmitting(false);
      }
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
    } = formData;

    if (
      !propertyName ||
      !district ||
      !municipality ||
      !wardNo ||
      !typeOfProperty ||
      (typeOfProperty === "Personal Property" && !holdingNo) ||
      (typeOfProperty === "Apartment" && !flatId)
    ) {
      if (typeof setError === 'function') {
        setError("All fields are required.");
      }
      if (typeof setSubmitting === 'function') {
        setSubmitting(false);
      }
      return;
    }

    const getPreciseLocation = () =>
      new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve(`${latitude.toFixed(6)},${longitude.toFixed(6)}`);
          },
          (err) => {
            reject("Failed to get location. Please enable location access.");
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      });

    try {
      const exactLocation = await getPreciseLocation();

      const res = await axiosInstance.post(
        `/property/${user.userId}/add-property`,
        {
          propertyName: propertyName.trim(),
          district: district.trim(),
          municipality: municipality.trim(),
          wardNumber: wardNo.trim(),
          typeOfProperty,
          holdingNumber:
            typeOfProperty === "Personal Property" ? holdingNo.trim() : undefined,
          flatId: typeOfProperty === "Apartment" ? flatId.trim() : undefined,
          exactLocation,
        }
      );

      if (res.data.success) {
        if (typeof setProperties === 'function') {
          setProperties((prev) => [...prev, res.data.property]);
        }
        if (typeof setFormData === 'function') {
          setFormData({
            propertyName: "",
            district: "",
            municipality: "",
            wardNo: "",
            typeOfProperty: "",
            holdingNo: "",
            flatId: "",
          });
        }
        if (typeof closeModal === 'function') {
          closeModal();
        }
      } else {
        if (typeof setError === 'function') {
          setError(res.data.message || "Failed to add property");
        }
      }
    } catch (err) {
      console.error("Error adding property:", err);
      if (typeof setError === 'function') {
        setError(
          typeof err === "string"
            ? err
            : err.response?.data?.message || "Failed to add property"
        );
      }
    } finally {
      if (typeof setSubmitting === 'function') {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="rounded-lg p-6 w-full max-w-md mx-4"
        style={{ backgroundColor: colors?.cardBg }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3
            className="text-lg font-semibold"
            style={{ color: colors?.textColor }}
          >
            Add New Property
          </h3>
          <button onClick={closeModal} style={{ color: colors?.mutedText }}>
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
              placeholder="Property Name * (max 50 characters)"
              value={formData?.propertyName || ""}
              onChange={(e) =>
                setFormData &&
                setFormData({
                  ...formData,
                  propertyName: e.target.value.slice(0, 50),
                })
              }
              required
              className="w-full p-3 border rounded-lg"
              style={{
                backgroundColor: colors?.baseColor,
                color: colors?.textColor,
                borderColor: colors?.borderColor,
              }}
            />

            <input
              type="text"
              placeholder="District *"
              value={formData?.district || ""}
              onChange={(e) =>
                setFormData &&
                setFormData({ ...formData, district: e.target.value })
              }
              required
              className="w-full p-3 border rounded-lg"
              style={{
                backgroundColor: colors?.baseColor,
                color: colors?.textColor,
                borderColor: colors?.borderColor,
              }}
            />

            <input
              type="text"
              placeholder="Municipality *"
              value={formData?.municipality || ""}
              onChange={(e) =>
                setFormData &&
                setFormData({ ...formData, municipality: e.target.value })
              }
              required
              className="w-full p-3 border rounded-lg"
              style={{
                backgroundColor: colors?.baseColor,
                color: colors?.textColor,
                borderColor: colors?.borderColor,
              }}
            />

            <input
              type="number"
              min="1"
              placeholder="Ward No. *"
              value={formData?.wardNo || ""}
              onChange={(e) =>
                setFormData &&
                setFormData({ ...formData, wardNo: e.target.value })
              }
              required
              className="w-full p-3 border rounded-lg"
              style={{
                backgroundColor: colors?.baseColor,
                color: colors?.textColor,
                borderColor: colors?.borderColor,
              }}
            />

            <select
              value={formData?.typeOfProperty || ""}
              onChange={(e) =>
                setFormData &&
                setFormData({
                  ...formData,
                  typeOfProperty: e.target.value,
                  holdingNo: "",
                  flatId: "",
                })
              }
              required
              className="w-full p-3 border rounded-lg"
              style={{
                backgroundColor: colors?.baseColor,
                color: colors?.textColor,
                borderColor: colors?.borderColor,
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
                onChange={(e) =>
                  setFormData &&
                  setFormData({ ...formData, holdingNo: e.target.value })
                }
                required
                className="w-full p-3 border rounded-lg"
                style={{
                  backgroundColor: colors?.baseColor,
                  color: colors?.textColor,
                  borderColor: colors?.borderColor,
                }}
              />
            )}

            {isApartment && (
              <input
                type="text"
                placeholder="Flat ID *"
                value={formData?.flatId || ""}
                onChange={(e) =>
                  setFormData &&
                  setFormData({ ...formData, flatId: e.target.value })
                }
                required
                className="w-full p-3 border rounded-lg"
                style={{
                  backgroundColor: colors?.baseColor,
                  color: colors?.textColor,
                  borderColor: colors?.borderColor,
                }}
              />
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 py-2 px-4 border rounded-lg"
              style={{
                borderColor: colors?.borderColor,
                color: colors?.textColor,
              }}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2 px-4 text-white rounded-lg"
              style={{ backgroundColor: colors?.primaryBg }}
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