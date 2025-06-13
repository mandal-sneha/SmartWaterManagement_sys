import React, { useState } from 'react';
import { FiX, FiSearch, FiUser, FiPlus, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const AddTenantForm = ({ isOpen, onClose, onSuccess, propertyId, axiosInstance }) => {
  const [userId, setUserId] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [addingTenant, setAddingTenant] = useState(false);

  const searchUser = async () => {
    if (!userId.trim()) {
      setError('Please enter a User ID');
      return;
    }

    setLoading(true);
    setError('');
    setUserDetails(null);

    try {
      const response = await axiosInstance.get(`/user/${userId}/get-user`);
      if (response.data.success) {
        setUserDetails(response.data.data);
      } else {
        setError('User not found');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'User not found');
    } finally {
      setLoading(false);
    }
  };

  const addTenant = async () => {
    if (!userDetails) return;

    setAddingTenant(true);
    setError('');
    setSuccess('');

    const user = JSON.parse(localStorage.getItem('user'));
    const rootId = user?.waterId?.split("_")[0];

    try {
      const response = await axiosInstance.post(`/tenant/${propertyId}/${userDetails.userId}/add-tenant`, { rootId });
      if (response.data.success) {
        setSuccess('Tenant added successfully!');
        setTimeout(() => {
          handleClose();
          onSuccess && onSuccess();
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add tenant');
    } finally {
      setAddingTenant(false);
    }
  };

  const handleClose = () => {
    setUserId('');
    setUserDetails(null);
    setError('');
    setSuccess('');
    onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchUser();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Add Tenant</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Enter User ID</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter user ID to search..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button
                onClick={searchUser}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <FiSearch className="w-4 h-4" />
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <FiAlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
              <FiCheckCircle className="w-4 h-4" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          {userDetails && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={userDetails.userProfilePhoto || "/assets/blank_pfp.jpg"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{userDetails.userName}</h3>
                  <p className="text-sm text-gray-600">ID: {userDetails.userId}</p>
                </div>
                <FiUser className="w-5 h-5 text-gray-400" />
              </div>

              <button
                onClick={addTenant}
                disabled={addingTenant}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                {addingTenant ? 'Adding Tenant...' : 'Add as Tenant'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddTenantForm;