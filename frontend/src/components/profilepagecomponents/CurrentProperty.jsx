import React from 'react';
import { FaHome, FaUsers, FaBuilding } from 'react-icons/fa';

const CurrentProperty = ({ selectedProperty, setSelectedProperty, properties, colors }) => {

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaHome className="text-blue-600" size={18} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Current Property</h3>
          </div>
        </div>
        
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select your current residence:
              </label>
              <div className="relative max-w-md">
                <select 
                  value={selectedProperty} 
                  onChange={(e) => setSelectedProperty(e.target.value)} 
                  className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-white text-gray-900 font-medium appearance-none cursor-pointer hover:border-blue-300 transition-colors"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '20px'
                  }}
                >
                  {properties.map(property => (
                    <option 
                      key={property.id} 
                      value={property.id} 
                      className="py-2"
                    >
                      {property.name} ({property.district}, Ward {property.wardNumber})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-4">
                  <span></span>
                  {selectedProperty && (
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold mr-8
                      ${properties.find(p => p.id === selectedProperty)?.label === 'owner' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'}`}>
                      {properties.find(p => p.id === selectedProperty)?.label === 'owner' ? 'Owner' : 'Tenant'}
                    </span>
                  )}
                </div>
                {selectedProperty && (
                  <div 
                    className={`absolute inset-0 rounded-lg pointer-events-none opacity-20
                      ${properties.find(p => p.id === selectedProperty)?.label === 'owner' 
                        ? 'bg-green-100' 
                        : 'bg-yellow-100'}`}
                  ></div>
                )}
              </div>
            </div>
            
            {selectedProperty && (
              <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 border-2 border-blue-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FaHome className="text-blue-600" size={20} />
                  </div>
                  <h4 className="font-bold text-gray-900 text-xl">
                    {properties.find(p => p.id === selectedProperty)?.name}
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white/90 p-3 rounded-lg shadow-sm border border-blue-100">
                    <div className="text-gray-600 font-medium mb-1 text-sm">Municipality</div>
                    <div className="text-gray-900 font-semibold text-base">
                      {properties.find(p => p.id === selectedProperty)?.municipality}
                    </div>
                  </div>
                  
                  <div className="bg-white/90 p-3 rounded-lg shadow-sm border border-blue-100">
                    <div className="text-gray-600 font-medium mb-1 text-sm">District</div>
                    <div className="text-gray-900 font-semibold text-base">
                      {properties.find(p => p.id === selectedProperty)?.district}
                    </div>
                  </div>
                  
                  <div className="bg-white/90 p-3 rounded-lg shadow-sm border border-blue-100">
                    <div className="text-gray-600 font-medium mb-1 text-sm">No. of Tenants</div>
                    <div className="text-gray-900 font-semibold flex items-center gap-2 text-base">
                      <FaUsers className="text-blue-600" size={16} />
                      {properties.find(p => p.id === selectedProperty)?.tenants}
                    </div>
                  </div>
                  
                  <div className="bg-white/90 p-3 rounded-lg shadow-sm border border-blue-100">
                    <div className="text-gray-600 font-medium mb-1 text-sm">Property Type</div>
                    <div className="text-gray-900 font-semibold flex items-center gap-2 text-base">
                      <FaBuilding className="text-blue-600" size={16} />
                      {properties.find(p => p.id === selectedProperty)?.propertyType}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentProperty;