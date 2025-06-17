import React, { useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import { axiosInstance } from "../../../lib/axios.js";
import blankPfp from "../../../assets/blank_pfp.jpg";

const PropertyTenants = ({ property, updateTenantCount }) => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (property && property._id) {
      fetchTenants();
    }
  }, [property?._id]);

  useEffect(() => {
    const handleRefreshTenants = () => {
      fetchTenants();
    };

    window.addEventListener('refreshTenants', handleRefreshTenants);
    return () => {
      window.removeEventListener('refreshTenants', handleRefreshTenants);
    };
  }, []);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axiosInstance.get(`/tenant/${property._id}/get-property-tenants`);
      if (res.data.success) {
        setTenants(res.data.tenants || []);
      } else {
        setError(res.data.message || "Failed to fetch tenants");
      }
    } catch (err) {
      console.error("Error fetching tenants:", err);
      setError(err.response?.data?.message || "Failed to fetch tenants");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tenantUserId) => {
    try {
      const res = await axiosInstance.delete(`/tenant/${property._id}/${tenantUserId}/delete-tenant`);
      if (res.data.success) {
        setTenants((prev) => prev.filter((tenant) => tenant.userId !== tenantUserId));
        updateTenantCount(property._id, -1);
      } else {
        alert(res.data.message || "Failed to delete tenant");
      }
    } catch (err) {
      console.error("Error deleting tenant:", err);
      alert(err.response?.data?.message || "Failed to delete tenant");
    }
  };

  if (loading) {
    return (
      <div className="p-4 border-t" style={{ backgroundColor: "#f9fafb" }} data-property-id={property._id}>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border-t" style={{ backgroundColor: "#f9fafb" }} data-property-id={property._id}>
        <div className="text-center py-4 text-red-600 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 border-t" style={{ backgroundColor: "#f9fafb" }} data-property-id={property._id}>
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold text-gray-700">
          Tenants for: <span className="text-indigo-600">{property.propertyName}</span>
        </h4>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border border-gray-200 rounded">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-2">Photo</th>
              <th className="px-4 py-2">Tenant Name</th>
              <th className="px-4 py-2">User ID</th>
              <th className="px-4 py-2">Water ID</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant, idx) => (
              <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2">
                  <img
                    src={tenant.image || blankPfp}
                    alt={tenant.name}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = blankPfp;
                    }}
                  />
                </td>
                <td className="px-4 py-2 text-gray-800">{tenant.name}</td>
                <td className="px-4 py-2 text-gray-700">{tenant.userId}</td>
                <td className="px-4 py-2 text-gray-700">{tenant.waterId}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(tenant.userId)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Tenant"
                  >
                    <FiTrash2 className="text-base" />
                  </button>
                </td>
              </tr>
            ))}
            {tenants.length === 0 && !loading && (
              <tr>
                <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                  No tenants added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PropertyTenants;