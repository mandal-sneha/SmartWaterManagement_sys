import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaCamera } from 'react-icons/fa';
import UserDetails from './profilepagecomponents/UserDetails.jsx';
import CurrentProperty from './profilepagecomponents/CurrentProperty.jsx';
import FamilyMemberDetails from './profilepagecomponents/FamilyMemberDetails.jsx';

const useTheme = () => {
  const colors = {
    baseColor: '#f8fafc', cardBg: '#ffffff', textColor: '#1e293b', mutedText: '#64748b', 
    borderColor: '#e2e8f0', primaryBg: '#3b82f6', primaryHover: '#2563eb', secondaryBg: '#6366f1', 
    secondaryHover: '#4f46e5', accent: '#10b981', accentHover: '#059669', danger: '#ef4444', dangerHover: '#dc2626'
  };
  return { colors };
};

const Profile = () => {
  const { colors } = useTheme();
  const { userid } = useParams();
  
  const [user, setUser] = useState({
    userId: 'USR001', userName: 'John Doe', userProfilePhoto: null, aadharNo: '1234 5678 9012',
    email: 'john.doe@example.com', address: '123 Main Street, Kolkata, West Bengal, 700001'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({...user});
  const [expandedMember, setExpandedMember] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState('property1');
  const [showAddMember, setShowAddMember] = useState(false);

  const [familyMembers, setFamilyMembers] = useState([
    {
      userId: 'USR002', userName: 'Jane Doe',
      userProfilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b390?w=150&h=150&fit=crop&crop=face',
      aadharNo: '9876 5432 1098', email: 'jane.doe@example.com'
    },
    {
      userId: 'USR003', userName: 'Mike Doe',
      userProfilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      aadharNo: '5678 9012 3456', email: 'mike.doe@example.com'
    }
  ]);

  const properties = [
    { id: 'property1', name: 'Sunshine Apartments', municipality: 'Kolkata Municipal Corporation', district: 'Kolkata', tenants: 45, propertyType: 'Apartment' },
    { id: 'property2', name: 'Garden View Residency', municipality: 'New Town Kolkata Development Authority', district: 'North 24 Parganas', tenants: 32, propertyType: 'Apartment' },
    { id: 'property3', name: 'City Heights Complex', municipality: 'Kolkata Municipal Corporation', district: 'Kolkata', tenants: 1, propertyType: 'Personal Property' }
  ];

  const [newMemberUserId, setNewMemberUserId] = useState('');

  const handleEdit = () => { setIsEditing(true); setEditedUser({...user}); };
  const handleSave = () => { setUser({...editedUser}); setIsEditing(false); };
  const handleCancel = () => { setEditedUser({...user}); setIsEditing(false); };
  const handleInputChange = (field, value) => { setEditedUser(prev => ({ ...prev, [field]: value })); };
  const toggleMemberExpansion = (userId) => { setExpandedMember(expandedMember === userId ? null : userId); };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newUser = { ...editedUser, userProfilePhoto: e.target.result };
        setEditedUser(newUser);
        if (!isEditing) setUser(newUser);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteMember = (userId) => {
    setFamilyMembers(prev => prev.filter(member => member.userId !== userId));
    if (expandedMember === userId) setExpandedMember(null);
  };

  const handleAddMember = () => {
    if (newMemberUserId.trim()) {
      const newMember = {
        userId: newMemberUserId.trim(), userName: `User ${newMemberUserId.trim()}`, userProfilePhoto: null,
        aadharNo: 'XXXX XXXX XXXX', email: `${newMemberUserId.trim().toLowerCase()}@example.com`
      };
      setFamilyMembers(prev => [...prev, newMember]);
      setNewMemberUserId('');
      setShowAddMember(false);
    }
  };

  const sharedProps = {
    user, setUser, isEditing, setIsEditing, editedUser, setEditedUser,
    handleEdit, handleSave, handleCancel, handleInputChange, handleImageUpload,
    familyMembers, setFamilyMembers, expandedMember, setExpandedMember,
    toggleMemberExpansion, handleDeleteMember, handleAddMember,
    showAddMember, setShowAddMember, newMemberUserId, setNewMemberUserId,
    selectedProperty, setSelectedProperty, properties, colors
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.baseColor }}>
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 border-b border-gray-200">
        <div className="px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative flex-shrink-0">
                <div className="relative">
                  {(isEditing ? editedUser.userProfilePhoto : user.userProfilePhoto) ? (
                    <img src={isEditing ? editedUser.userProfilePhoto : user.userProfilePhoto} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" />
                  ) : (
                    <div className="w-32 h-32 rounded-full flex items-center justify-center text-white font-bold text-3xl border-4 border-white bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg">
                      {(isEditing ? editedUser.userName : user.userName).charAt(0).toUpperCase()}
                    </div>
                  )}
                  {isEditing && (
                    <label className="absolute bottom-1 right-1 p-3 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition-colors border-3 border-white shadow-md">
                      <FaCamera className="text-white" size={16} />
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{(isEditing ? editedUser.userName : user.userName)}</h1>
                <p className="text-xl text-gray-700 mb-1 font-medium">Water ID: {user.userId}</p>
                <p className="text-lg text-gray-600">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* User Details and Family Members - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - User Details and Current Property */}
            <div className="w-full space-y-8 lg:col-span-2">
              <UserDetails {...sharedProps} />
              <CurrentProperty {...sharedProps} />
            </div>
            
            {/* Right Column - Family Members */}
            <div className="w-full lg:col-span-1">
              <FamilyMemberDetails {...sharedProps} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;