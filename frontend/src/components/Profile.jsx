import React, { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaSave, FaTimes, FaUsers, FaHome, FaChevronDown, FaChevronUp, FaCamera, FaPhone, FaEnvelope, FaIdCard, FaMapMarkerAlt, FaPlus, FaTrash, FaCheck } from 'react-icons/fa';

const useTheme = () => {
  const darkMode = false;
  const colors = {
    baseColor: '#f8fafc', 
    cardBg: '#ffffff', 
    textColor: '#1e293b', 
    mutedText: '#64748b', 
    borderColor: '#e2e8f0', 
    primaryBg: '#3b82f6', 
    primaryHover: '#2563eb', 
    secondaryBg: '#6366f1', 
    secondaryHover: '#4f46e5', 
    accent: '#10b981', 
    accentHover: '#059669', 
    danger: '#ef4444', 
    dangerHover: '#dc2626', 
  };
  return { darkMode, colors };
};

const Profile = () => {
  const { colors } = useTheme();
  
  // Mock user data - replace with actual data from localStorage or API
  const [user, setUser] = useState({
    userId: 'USR001',
    userName: 'John Doe',
    userProfilePhoto: null,
    aadharNo: '1234 5678 9012',
    email: 'john.doe@example.com',
    phoneNo: '+91 9876543210',
    address: '123 Main Street, Kolkata, West Bengal, 700001'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({...user});
  const [expandedMember, setExpandedMember] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState('property1');

  // Mock family members data with special member status
  const [familyMembers, setFamilyMembers] = useState([
    {
      userId: 'USR002',
      userName: 'Jane Doe',
      userProfilePhoto: null,
      aadharNo: '9876 5432 1098',
      email: 'jane.doe@example.com',
      phoneNo: '+91 8765432109',
      address: '123 Main Street, Kolkata, West Bengal, 700001',
      isSpecialMember: true
    },
    {
      userId: 'USR003',
      userName: 'Mike Doe',
      userProfilePhoto: null,
      aadharNo: '5678 9012 3456',
      email: 'mike.doe@example.com',
      phoneNo: '+91 7654321098',
      address: '123 Main Street, Kolkata, West Bengal, 700001',
      isSpecialMember: false
    }
  ]);

  // Mock properties data
  const properties = [
    {
      id: 'property1',
      name: 'Sunshine Apartments',
      address: '123 Main Street, Sector 5, Salt Lake, Kolkata, West Bengal, 700091'
    },
    {
      id: 'property2',
      name: 'Garden View Residency',
      address: '456 Park Road, New Town, Kolkata, West Bengal, 700156'
    },
    {
      id: 'property3',
      name: 'City Heights Complex',
      address: '789 Central Avenue, Ballygunge, Kolkata, West Bengal, 700019'
    }
  ];

  const handleEdit = () => {
    setIsEditing(true);
    setEditedUser({...user});
  };

  const handleSave = () => {
    setUser({...editedUser});
    setIsEditing(false);
    console.log('Saving user data:', editedUser);
  };

  const handleCancel = () => {
    setEditedUser({...user});
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleMemberExpansion = (userId) => {
    setExpandedMember(expandedMember === userId ? null : userId);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newUser = { ...editedUser, userProfilePhoto: e.target.result };
        setEditedUser(newUser);
        if (!isEditing) {
          setUser(newUser);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteMember = (userId) => {
    setFamilyMembers(prev => prev.filter(member => member.userId !== userId));
    if (expandedMember === userId) {
      setExpandedMember(null);
    }
  };

  const toggleSpecialMember = (userId) => {
    setFamilyMembers(prev => prev.map(member => 
      member.userId === userId 
        ? { ...member, isSpecialMember: !member.isSpecialMember }
        : member
    ));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.baseColor }}>
      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 border-b border-gray-200">
        <div className="px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Enhanced Profile Picture */}
              <div className="relative flex-shrink-0">
                <div className="relative">
                  {(isEditing ? editedUser.userProfilePhoto : user.userProfilePhoto) ? (
                    <img 
                      src={isEditing ? editedUser.userProfilePhoto : user.userProfilePhoto}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full flex items-center justify-center text-white font-bold text-3xl border-4 border-white bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg">
                      {(isEditing ? editedUser.userName : user.userName).charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  {/* Camera Icon for Editing */}
                  {isEditing && (
                    <label className="absolute bottom-1 right-1 p-3 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition-colors border-3 border-white shadow-md">
                      <FaCamera className="text-white" size={16} />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="hidden" 
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Enhanced User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {(isEditing ? editedUser.userName : user.userName)}
                </h1>
                <p className="text-xl text-gray-700 mb-1 font-medium">Water ID: {user.userId}</p>
                <p className="text-lg text-gray-600">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Profile Details with Email */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <FaUser className="text-blue-600" size={18} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Profile Details</h3>
                    </div>
                    
                    {/* Edit Button with contrast colors */}
                    {!isEditing ? (
                      <button
                        onClick={handleEdit}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
                      >
                        <FaEdit size={14} />
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          onClick={handleSave}
                          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
                        >
                          <FaSave size={14} />
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-gray-500 to-slate-600 text-white rounded-full hover:from-gray-600 hover:to-slate-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
                        >
                          <FaTimes size={14} />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Fields including Email */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FaUser size={12} className="text-blue-600" />
                        Full Name
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

                    {/* User ID */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FaIdCard size={12} className="text-green-600" />
                        Water ID
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedUser.userId}
                          onChange={(e) => handleInputChange('userId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter Water ID"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                          {user.userId}
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FaEnvelope size={12} className="text-blue-600" />
                        Email Address
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

                    {/* Phone Number */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FaPhone size={12} className="text-red-600" />
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editedUser.phoneNo}
                          onChange={(e) => handleInputChange('phoneNo', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
                          {user.phoneNo}
                        </div>
                      )}
                    </div>

                    {/* Aadhar Number */}
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FaIdCard size={12} className="text-orange-600" />
                        Aadhar Number
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

            {/* Right Side - Family Members & Property */}
            <div className="space-y-6">
              {/* Enhanced Family Members Section */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <FaUsers className="text-purple-600" size={18} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Family Members</h3>
                  </div>
                </div>

                <div className="p-4">
                  <div className="space-y-3">
                    {familyMembers.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FaUsers size={32} className="mx-auto mb-2 opacity-50" />
                        <p>No family members found</p>
                      </div>
                    ) : (
                      familyMembers.map(member => (
                        <div key={member.userId} className="border border-gray-200 rounded-lg overflow-hidden">
                          
                          <div 
                            className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => toggleMemberExpansion(member.userId)}
                          >
                            <div className="flex items-center gap-3">
                              {member.userProfilePhoto ? (
                                <img 
                                  src={member.userProfilePhoto} 
                                  alt={member.userName}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium bg-gradient-to-br from-purple-400 to-pink-500">
                                  {member.userName.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-gray-900">{member.userName}</h4>
                                  {member.isSpecialMember && (
                                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                      Special
                                    </div>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500">ID: {member.userId}</p>
                              </div>
                            </div>
                            <div className="text-gray-400">
                              {expandedMember === member.userId ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                            </div>
                          </div>
                          
                          {expandedMember === member.userId && (
                            <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                              <div className="space-y-3 mt-3 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Aadhar:</span>
                                  <span className="text-gray-900 font-medium">{member.aadharNo}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Email:</span>
                                  <span className="text-gray-900 font-medium text-xs">{member.email}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Phone:</span>
                                  <span className="text-gray-900 font-medium">{member.phoneNo}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 block mb-1">Address:</span>
                                  <span className="text-gray-900 text-xs">{member.address}</span>
                                </div>
                                
                                {/* Special Member Controls - Better Positioned */}
                                <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      id={`special-${member.userId}`}
                                      checked={member.isSpecialMember}
                                      onChange={() => toggleSpecialMember(member.userId)}
                                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                                    />
                                    <label htmlFor={`special-${member.userId}`} className="text-sm text-gray-700 cursor-pointer font-medium">
                                      Special Member
                                    </label>
                                  </div>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteMember(member.userId);
                                    }}
                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg"
                                    title="Delete Member"
                                  >
                                    <FaTrash size={12} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Property Selection Section */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <FaHome className="text-green-600" size={18} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Current Property</h3>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select your current residence:
                      </label>
                      <select
                        value={selectedProperty}
                        onChange={(e) => setSelectedProperty(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {properties.map(property => (
                          <option key={property.id} value={property.id}>
                            {property.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedProperty && (
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <FaHome className="text-green-600" size={14} />
                          {properties.find(p => p.id === selectedProperty)?.name}
                        </h4>
                        <p className="text-sm text-gray-600 flex items-start gap-2">
                          <FaMapMarkerAlt className="text-green-600 mt-0.5 flex-shrink-0" size={12} />
                          {properties.find(p => p.id === selectedProperty)?.address}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;