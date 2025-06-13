import React, { useState } from "react";
import { FiTrash2, FiPlus } from "react-icons/fi";

const PropertyTenants = ({ property }) => {
  // Mock tenant data (can be replaced with props or fetched from backend)
  const [tenants, setTenants] = useState([
    { name: "Aarav Sharma", waterId: "PROP001_000" },
    { name: "Sara Menon", waterId: "PROP001_001" },
    { name: "Kabir Nair", waterId: "PROP001_002" },
  ]);

  const handleDelete = (index) => {
    setTenants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTenant = () => {
    const newTenant = {
      name: `New Tenant ${tenants.length + 1}`,
      waterId: `PROP001_00${tenants.length + 1}`,
    };
    setTenants((prev) => [...prev, newTenant]);
  };

  return (
    <div className="p-4 border-t" style={{ backgroundColor: "#f9fafb" }}>
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold text-gray-700">
          Tenants for: <span className="text-indigo-600">{property.propertyName}</span>
        </h4>
        <button
          onClick={handleAddTenant}
          className="flex items-center gap-1 text-sm text-white font-medium bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded"
        >
          <FiPlus className="text-base" />
          Add Tenant
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border border-gray-200 rounded">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-2">Tenant Name</th>
              <th className="px-4 py-2">Water ID</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant, idx) => (
              <tr
                key={idx}
                className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2 text-gray-800">{tenant.name}</td>
                <td className="px-4 py-2 text-gray-700">{tenant.waterId}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(idx)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Tenant"
                  >
                    <FiTrash2 className="text-base" />
                  </button>
                </td>
              </tr>
            ))}
            {tenants.length === 0 && (
              <tr>
                <td colSpan="3" className="px-4 py-3 text-center text-gray-500">
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
