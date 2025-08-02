import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaCamera } from 'react-icons/fa';
import { axiosInstance } from '../lib/axios.js';
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
    userId: '', userName: '', userProfilePhoto: null, aadharNo: '',
    email: '', address: '', waterId: ''
  });

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [expandedMember, setExpandedMember] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);

  const [familyMembers, setFamilyMembers] = useState([]);
  const [familyMembersLoading, setFamilyMembersLoading] = useState(false);

  const [newMemberUserId, setNewMemberUserId] = useState('');

  const fetchFamilyMembers = async (userIdToFetch) => {
    try {
      setFamilyMembersLoading(true);
      const response = await axiosInstance.get(`/user/${userIdToFetch}/get-family-members`);
      if (response.data.success) {
        const transformedMembers = response.data.members.map(member => ({
          ...member,
          aadharNo: member.adhaarNumber?.toString() || ''
        }));
        setFamilyMembers(transformedMembers);
      }
    } catch (err) {
      console.error('Error fetching family members:', err);
    } finally {
      setFamilyMembersLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const userIdToFetch = userid || storedUser?.userId;

        if (!userIdToFetch) {
          setError('User ID not found');
          setLoading(false);
          return;
        }

        const response = await axiosInstance.get(`/user/${userIdToFetch}/get-profile-details`);
        const { user: userData, properties: propertiesData } = response.data;

        const transformedUser = {
          userId: userData.userId,
          userName: userData.userName,
          userProfilePhoto: userData.userProfilePhoto,
          aadharNo: userData.adhaarNumber?.toString() || '',
          email: userData.email || storedUser?.email || '',
          address: '',
          waterId: userData.waterId
        };

        const transformedProperties = propertiesData.map((prop, index) => ({
          id: `property${index + 1}`,
          name: prop.propertyName,
          municipality: prop.municipality,
          district: prop.district,
          wardNumber: prop.wardNumber,
          tenants: prop.numberOfTenants,
          propertyType: prop.typeOfProperty,
          label: prop.label
        }));

        setUser(transformedUser);
        setProperties(transformedProperties);
        setEditedUser(transformedUser);

        if (transformedProperties.length > 0) {
          setSelectedProperty(transformedProperties[0].id);
        }

        await fetchFamilyMembers(userIdToFetch);

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch profile details');
        setLoading(false);
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfileDetails();
  }, [userid]);

  const handleEdit = () => { setIsEditing(true); setEditedUser({ ...user }); };

  const handleSave = async () => {
    try {
      setUpdateLoading(true);
      setError(null);

      const storedUser = JSON.parse(localStorage.getItem('user'));
      const userIdToUpdate = userid || storedUser?.userId;

      if (!userIdToUpdate) {
        setError('User ID not found');
        return;
      }

      const updateData = {
        userName: editedUser.userName?.trim(),
        userProfilePhoto: editedUser.userProfilePhoto,
        email: editedUser.email?.trim(),
        userId: editedUser.userId?.trim()
      };

      const response = await axiosInstance.put(`/user/${userIdToUpdate}/update-profile`, updateData);

      if (response.data.success) {
        const updatedUserData = response.data.user;
        const newUser = {
          userId: updatedUserData.userId,
          userName: updatedUserData.userName,
          userProfilePhoto: updatedUserData.userProfilePhoto,
          aadharNo: updatedUserData.adhaarNumber?.toString() || user.aadharNo,
          email: updatedUserData.email,
          address: user.address,
          waterId: updatedUserData.waterId || user.waterId
        };

        setUser(newUser);
        setEditedUser(newUser);
        setIsEditing(false);

        const updatedStoredUser = {
          email: updatedUserData.email,
          userId: updatedUserData.userId,
          userName: updatedUserData.userName,
          waterId: updatedUserData.waterId
        };
        localStorage.setItem('user', JSON.stringify(updatedStoredUser));
      } else {
        setError(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile';
      setError(errorMessage);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancel = () => { setEditedUser({ ...user }); setIsEditing(false); };
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

  const handleAddMember = async () => {
    if (newMemberUserId.trim()) {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const currentUserId = userid || storedUser?.userId;

        const response = await axiosInstance.post(`/user/${currentUserId}/${newMemberUserId.trim()}/add-family-member`);

        if (response.status === 200) {
          await fetchFamilyMembers(currentUserId);
          setNewMemberUserId('');
          setShowAddMember(false);
        }
      } catch (err) {
        console.error('Error adding family member:', err);
        setError('Failed to add family member');
      }
    }
  };

  const sharedProps = {
    user, setUser, isEditing, setIsEditing, editedUser, setEditedUser,
    handleEdit, handleSave, handleCancel, handleInputChange, handleImageUpload,
    familyMembers, setFamilyMembers, expandedMember, setExpandedMember,
    toggleMemberExpansion, handleDeleteMember, handleAddMember,
    showAddMember, setShowAddMember, newMemberUserId, setNewMemberUserId,
    selectedProperty, setSelectedProperty, properties, colors, familyMembersLoading,
    updateLoading
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.baseColor }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.baseColor }}>
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.baseColor }}>
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
                <p className="text-xl text-gray-700 mb-1 font-medium">User ID: {user.userId}</p>
                <p className="text-lg text-gray-600 mb-1">Water ID: {user.waterId}</p>
                <p className="text-lg text-gray-600">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="w-full space-y-8 lg:col-span-2">
              <UserDetails {...sharedProps} />
              <CurrentProperty {...sharedProps} />
            </div>
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