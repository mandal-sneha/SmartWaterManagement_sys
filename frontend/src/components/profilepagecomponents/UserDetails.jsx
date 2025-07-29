import React from 'react';
import { FaUser, FaEdit, FaSave, FaTimes, FaEnvelope, FaIdCard } from 'react-icons/fa';

const UserDetails = ({
  user,
  isEditing,
  editedUser,
  handleEdit,
  handleSave,
  handleCancel,
  handleInputChange,
  colors
}) => {

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaUser className="text-blue-600" size={18} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Profile Details</h3>
            </div>
            {!isEditing ? (
              <button 
                onClick={handleEdit} 
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
              >
                <FaEdit size={14} />Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={handleSave} 
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
                >
                  <FaSave size={14} />Save
                </button>
                <button 
                  onClick={handleCancel} 
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-gray-500 to-slate-600 text-white rounded-full hover:from-gray-600 hover:to-slate-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
                >
                  <FaTimes size={14} />Cancel
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FaUser size={12} className="text-blue-600" />Full Name
              </label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={editedUser.userName} 
                  onChange={(e) => handleInputChange('userName', e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {user.userName}
                </div>
              )}
            </div>
            
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FaIdCard size={12} className="text-green-600" />User ID
              </label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={editedUser.userId} 
                  onChange={(e) => handleInputChange('userId', e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  placeholder="Enter User ID" 
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {user.userId}
                </div>
              )}
            </div>
            
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FaEnvelope size={12} className="text-blue-600" />Email Address
              </label>
              {isEditing ? (
                <input 
                  type="email" 
                  value={editedUser.email} 
                  onChange={(e) => handleInputChange('email', e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  placeholder="Enter email address" 
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {user.email}
                </div>
              )}
            </div>
            
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FaIdCard size={12} className="text-orange-600" />Aadhar Number
              </label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={editedUser.aadharNo} 
                  onChange={(e) => handleInputChange('aadharNo', e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  placeholder="XXXX XXXX XXXX" 
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                  {user.aadharNo}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;