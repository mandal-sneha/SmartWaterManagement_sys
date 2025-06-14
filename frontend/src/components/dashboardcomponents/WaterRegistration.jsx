import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserPlus, FaClock, FaEdit, FaTrash, FaCheck, FaTimes, FaTint, FaSpinner } from 'react-icons/fa';
import { axiosInstance } from "../../lib/axios.js";

const useTheme = () => {
  const darkMode = false;
  const colors = {
    baseColor: '#f3f4f6', 
    cardBg: 'rgba(255, 255, 255, 0.5)', 
    textColor: '#1e1b4b', 
    mutedText: '#6b7280', 
    borderColor: '#d1d5db', 
    primaryBg: '#6366f1', 
    primaryHover: '#4f46e5', 
    secondaryBg: '#8b5cf6', 
    secondaryHover: '#7c3aed', 
    accent: '#10b981', 
    accentHover: '#059669', 
    danger: '#ef4444', 
    dangerHover: '#dc2626', 
  };
  return { darkMode, colors };
};

const WaterRegistration = () => {
  const { darkMode, colors } = useTheme();
  const [familyMembers, setFamilyMembers] = useState([]);
  const [spMembers, setSpMembers] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [guests, setGuests] = useState([]);
  const [newGuest, setNewGuest] = useState({
    name: '',
    entryTime: '',
    stayTime: ''
  });
  const [editingGuest, setEditingGuest] = useState(null);
  const [requestExtraWater, setRequestExtraWater] = useState(false);
  const [guestSearchLoading, setGuestSearchLoading] = useState(false);
  const [guestSearchError, setGuestSearchError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        setLoading(true);
        const userId = currentUser?.userId;
        const response = await axiosInstance.get(`/user/${userId}/get-family-members`);
        if (response.data.success) {
          setFamilyMembers(response.data.members);
        }
      } catch (error) {
        console.error('Error fetching family members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyMembers();
  }, []);

  const isFamilyMember = (userId) => {
    return familyMembers.some(member => member.userId === userId) || 
           userId === currentUser.userId;
  };

  const toggleSpMember = (userId) => {
    const newSpMembers = new Set(spMembers);
    if (newSpMembers.has(userId)) {
      newSpMembers.delete(userId);
    } else {
      newSpMembers.add(userId);
    }
    setSpMembers(newSpMembers);
  };

  const fetchGuestUser = async (userId) => {
    try {
      setGuestSearchLoading(true);
      setGuestSearchError('');
      const response = await axiosInstance.get(`/user/${userId}/get-user`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'User not found');
      }
    } catch (error) {
      console.error('Error fetching guest user:', error);
      setGuestSearchError(error.response?.data?.message || 'User not found');
      throw error;
    } finally {
      setGuestSearchLoading(false);
    }
  };

  const addGuest = async () => {
    if (newGuest.name.trim() && newGuest.entryTime && newGuest.stayTime) {
      try {
        const existingGuest = guests.find(guest => guest.userId === newGuest.name.trim());
        if (existingGuest) {
          setGuestSearchError('Guest is already added to the list');
          return;
        }

        if (isFamilyMember(newGuest.name.trim())) {
          setGuestSearchError('This user is a family member and cannot be added as a guest');
          return;
        }

        const guestUserData = await fetchGuestUser(newGuest.name.trim());
        
        const newGuestEntry = {
          id: Date.now(),
          userId: guestUserData.userId,
          userName: guestUserData.userName,
          userProfilePhoto: guestUserData.userProfilePhoto,
          entryTime: newGuest.entryTime,
          stayTime: newGuest.stayTime
        };

        setGuests([...guests, newGuestEntry]);
        setNewGuest({ name: '', entryTime: '', stayTime: '' });
        setGuestSearchError('');
      } catch (error) {
        console.error('Failed to add guest:', error);
      }
    }
  };

  const removeGuest = (id) => {
    setGuests(guests.filter(guest => guest.id !== id));
  };

  const startEditGuest = (guest) => {
    setEditingGuest(guest);
  };

  const saveEditGuest = (id, updatedGuest) => {
    setGuests(guests.map(guest => 
      guest.id === id ? { ...guest, ...updatedGuest } : guest
    ));
    setEditingGuest(null);
  };

  const cancelEditGuest = () => {
    setEditingGuest(null);
  };

  const handleRegisterForWater = async () => {
    try {
      setIsRegistering(true);
      console.log('Registering for water with:', {
        familyMembers: familyMembers.length,
        spMembers: Array.from(spMembers),
        guests: guests,
        requestExtraWater: requestExtraWater
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Water registration submitted successfully!');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const EditableGuestRow = ({ guest }) => {
    const [editData, setEditData] = useState({
      stayTime: guest.stayTime
    });

    return (
      <div className="rounded-xl p-4 border shadow-lg backdrop-blur-sm" style={{ backgroundColor: colors.cardBg, borderColor: colors.borderColor }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            {guest.userProfilePhoto ? (
              <img 
                src={guest.userProfilePhoto} 
                alt={guest.userName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold bg-gradient-to-r from-indigo-500 to-purple-600">
                {guest.userName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="font-medium" style={{ color: colors.textColor }}>{guest.userName}</div>
              <div className="text-sm" style={{ color: colors.mutedText }}>ID: {guest.userId}</div>
            </div>
          </div>
          <div className="flex items-center" style={{ color: colors.textColor }}>
            {guest.entryTime}
          </div>
          <input
            type="text"
            value={editData.stayTime}
            onChange={(e) => setEditData({...editData, stayTime: e.target.value})}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.8)', 
              borderColor: colors.borderColor, 
              color: colors.textColor
            }}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => saveEditGuest(guest.id, editData)}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors hover:opacity-90"
            style={{ backgroundColor: colors.accent }}
            onMouseEnter={(e) => e.target.style.backgroundColor = colors.accentHover}
            onMouseLeave={(e) => e.target.style.backgroundColor = colors.accent}
          >
            <FaCheck size={14} />
            Save
          </button>
          <button
            onClick={cancelEditGuest}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors hover:opacity-90"
            style={{ backgroundColor: colors.mutedText }}
          >
            <FaTimes size={14} />
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.baseColor }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl p-6 border shadow-lg backdrop-blur-sm" style={{ backgroundColor: colors.cardBg, borderColor: colors.borderColor }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#e0e7ff' }}>
                <FaUsers style={{ color: colors.primaryBg }} size={24} />
              </div>
              <h2 className="text-xl font-semibold" style={{ color: colors.textColor }}>Family Members</h2>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8" style={{ color: colors.mutedText }}>
                  <FaSpinner className="animate-spin mx-auto mb-3" size={48} />
                  <p>Loading family members...</p>
                </div>
              ) : familyMembers.length === 0 ? (
                <div className="text-center py-8" style={{ color: colors.mutedText }}>
                  <FaUsers size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No family members found</p>
                </div>
              ) : (
                familyMembers.map(member => (
                  <div key={member.userId} className="rounded-xl p-4 border flex items-center justify-between shadow-sm backdrop-blur-sm" style={{ backgroundColor: colors.cardBg, borderColor: colors.borderColor }}>
                    <div className="flex items-center gap-3">
                      {member.userProfilePhoto ? (
                        <img 
                          src={member.userProfilePhoto} 
                          alt={member.userName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold bg-gradient-to-r from-indigo-500 to-purple-600">
                          {member.userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium" style={{ color: colors.textColor }}>{member.userName}</h3>
                        <p className="text-sm" style={{ color: colors.mutedText }}>ID: {member.userId}</p>
                        {spMembers.has(member.userId) && (
                          <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">SP Member</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={spMembers.has(member.userId)}
                        onChange={() => toggleSpMember(member.userId)}
                        className="w-4 h-4 rounded focus:ring-2 focus:ring-indigo-500"
                        style={{ accentColor: colors.primaryBg }}
                      />
                      <label className="text-sm" style={{ color: colors.textColor }}>SP Member</label>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 space-y-4">
              <button
                onClick={() => setRequestExtraWater(!requestExtraWater)}
                className="w-full py-3 px-4 rounded-lg transition-all font-medium border focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  backgroundColor: requestExtraWater ? colors.accent : 'rgba(255, 255, 255, 0.8)',
                  color: requestExtraWater ? 'white' : colors.textColor,
                  borderColor: requestExtraWater ? colors.accent : colors.borderColor,
                  focusRingColor: requestExtraWater ? colors.accent : colors.primaryBg
                }}
              >
                {requestExtraWater ? '✓ Extra Water Requested' : 'Request Extra Water'}
              </button>

              <button
                onClick={handleRegisterForWater}
                disabled={isRegistering}
                className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none group"
                style={{
                  background: isRegistering 
                    ? 'linear-gradient(45deg, #60a5fa, #818cf8, #a78bfa)' 
                    : 'linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed, #0ea5e9)',
                  backgroundSize: '300% 300%',
                  animation: isRegistering ? 'none' : 'gradient-shift 3s ease infinite'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                
                <div className="relative flex items-center justify-center gap-3">
                  {isRegistering ? (
                    <>
                      <FaSpinner className="animate-spin" size={20} />
                      <span className="font-bold tracking-wide">Processing Registration...</span>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <FaTint size={20} className="drop-shadow-lg animate-pulse" />
                        <span className="font-bold tracking-wide text-shadow">Register for Water</span>
                      </div>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>

          <div className="rounded-2xl p-6 border shadow-lg backdrop-blur-sm" style={{ backgroundColor: colors.cardBg, borderColor: colors.borderColor }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#f3e8ff' }}>
                <FaUserPlus style={{ color: colors.secondaryBg }} size={24} />
              </div>
              <h2 className="text-xl font-semibold" style={{ color: colors.textColor }}>Guest Management</h2>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-3" style={{ color: colors.textColor }}>Current Guests</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {guests.length === 0 ? (
                  <div className="text-center py-6" style={{ color: colors.mutedText }}>
                    <FaUserPlus size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No guests registered</p>
                  </div>
                ) : (
                  guests.map(guest => (
                    <div key={guest.id}>
                      {editingGuest?.id === guest.id ? (
                        <EditableGuestRow guest={guest} />
                      ) : (
                        <div className="rounded-xl p-4 border shadow-sm backdrop-blur-sm hover:shadow-lg transition-all duration-300 group" style={{ backgroundColor: colors.cardBg, borderColor: colors.borderColor }}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {guest.userProfilePhoto ? (
                                <img 
                                  src={guest.userProfilePhoto} 
                                  alt={guest.userName}
                                  className="w-12 h-12 rounded-full object-cover shadow-lg"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                                  {guest.userName.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div className="space-y-1">
                                <h4 className="font-semibold text-lg" style={{ color: colors.textColor }}>{guest.userName}</h4>
                                <div className="text-sm" style={{ color: colors.mutedText }}>ID: {guest.userId}</div>
                                <div className="flex items-center gap-4 text-sm" style={{ color: colors.mutedText }}>
                                  <div className="flex items-center gap-1">
                                    <FaClock size={12} />
                                    <span>Entry: {guest.entryTime}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span>•</span>
                                    <span>Duration: {guest.stayTime}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <button
                                onClick={() => startEditGuest(guest)}
                                className="p-2 rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg"
                                style={{ backgroundColor: '#f0f9ff', color: colors.primaryBg }}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = colors.primaryBg;
                                  e.target.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = '#f0f9ff';
                                  e.target.style.color = colors.primaryBg;
                                }}
                                title="Edit guest"
                              >
                                <FaEdit size={16} />
                              </button>
                              <button
                                onClick={() => removeGuest(guest.id)}
                                className="p-2 rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg"
                                style={{ backgroundColor: '#fef2f2', color: colors.danger }}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = colors.danger;
                                  e.target.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = '#fef2f2';
                                  e.target.style.color = colors.danger;
                                }}
                                title="Remove guest"
                              >
                                <FaTrash size={16} />
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

            <div className="border-t pt-6" style={{ borderColor: colors.borderColor }}>
              <h3 className="font-medium mb-4" style={{ color: colors.textColor }}>Add New Guest</h3>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Guest User ID"
                    value={newGuest.name}
                    onChange={(e) => {
                      setNewGuest({...newGuest, name: e.target.value});
                      setGuestSearchError('');
                    }}
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderColor: colors.borderColor,
                      color: colors.textColor
                    }}
                    disabled={guestSearchLoading}
                  />
                  {guestSearchError && (
                    <p className="text-sm mt-1 text-red-500">{guestSearchError}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="time"
                    value={newGuest.entryTime}
                    onChange={(e) => setNewGuest({...newGuest, entryTime: e.target.value})}
                    className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderColor: colors.borderColor,
                      color: colors.textColor
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Stay Duration"
                    value={newGuest.stayTime}
                    onChange={(e) => setNewGuest({...newGuest, stayTime: e.target.value})}
                    className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderColor: colors.borderColor,
                      color: colors.textColor
                    }}
                  />
                </div>
                <button
                  onClick={addGuest}
                  disabled={!newGuest.name.trim() || !newGuest.entryTime || !newGuest.stayTime || guestSearchLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 rounded-lg transition-all font-medium hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {guestSearchLoading ? (
                    <>
                      <FaSpinner className="animate-spin" size={16} />
                      Searching User...
                    </>
                  ) : (
                    <>
                      <FaUserPlus size={16} />
                      Add Guest
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default WaterRegistration;