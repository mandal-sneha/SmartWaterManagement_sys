import React, { useState, useEffect, useContext } from 'react';
import { FaUsers, FaUserPlus, FaClock, FaEdit, FaTrash, FaCheck, FaTimes, FaTint, FaSpinner } from 'react-icons/fa';
import { axiosInstance } from "../../lib/axios.js";
import { ThemeContext } from '../UserDashboard';

const useTheme = () => {
  const { darkMode, colors: themeColors } = useContext(ThemeContext);
  
  // Enhanced colors for better dark mode contrast
  const enhancedColors = {
    ...themeColors,
    // Light mode colors
    ...((!darkMode) && {
      baseColor: '#f8fafc',
      cardBg: 'rgba(255, 255, 255, 0.8)',
      textColor: '#1e293b',
      mutedText: '#64748b',
      borderColor: '#e2e8f0',
      primaryBg: '#3b82f6',
      primaryHover: '#2563eb',
      secondaryBg: '#8b5cf6',
      secondaryHover: '#7c3aed',
      accent: '#10b981',
      accentHover: '#059669',
      danger: '#ef4444',
      dangerHover: '#dc2626',
      inputBg: 'rgba(255, 255, 255, 0.9)',
      gradientFrom: '#3b82f6',
      gradientTo: '#8b5cf6',
      hoverShadow: 'rgba(59, 130, 246, 0.15)',
    }),
    // Dark mode colors with high contrast
    ...(darkMode && {
      baseColor: '#0f172a',
      cardBg: 'rgba(30, 41, 59, 0.8)',
      textColor: '#f1f5f9',
      mutedText: '#94a3b8',
      borderColor: '#334155',
      primaryBg: '#3b82f6',
      primaryHover: '#2563eb',
      secondaryBg: '#8b5cf6',
      secondaryHover: '#7c3aed',
      accent: '#10b981',
      accentHover: '#059669',
      danger: '#f87171',
      dangerHover: '#ef4444',
      inputBg: 'rgba(51, 65, 85, 0.6)',
      gradientFrom: '#4f46e5',
      gradientTo: '#7c3aed',
      hoverShadow: 'rgba(79, 70, 229, 0.25)',
    })
  };

  return { darkMode, colors: enhancedColors };
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
      
      const allFamilyMembers = [...familyMembers];
      allFamilyMembers.push({
        userId: currentUser.userId,
        userName: currentUser.userName
      });
      
      const primaryMembers = allFamilyMembers.map(member => member.userId);
      const specialMembers = Array.from(spMembers);
      const invitedGuests = guests.map(guest => guest.userId);
      
      const waterId = currentUser.waterId;
      
      const waterRegistrationResponse = await axiosInstance.post(`/waterregistration/${waterId}/register-for-water`, {
        primaryMembers,
        specialMembers,
        extraWaterRequested: requestExtraWater
      });
      
      if (!waterRegistrationResponse.data.success) {
        return;
      }

      if (guests.length > 0) {
        const guestIds = guests.map(guest => guest.userId);
        const arrivalTime = {};
        const stayDuration = {};
        
        guests.forEach(guest => {
          arrivalTime[guest.userId] = guest.entryTime;
          stayDuration[guest.userId] = guest.stayTime;
        });
        
        const hostId = currentUser.userId;
        const hostWaterId = currentUser.waterId;

        const invitationResponse = await axiosInstance.post(`/invitation/${hostId}/${hostWaterId}/register-invitation`, {
          guests: guestIds,
          arrivalTime,
          stayDuration
        });
        
        if (!invitationResponse.data.success) {
          alert('Water registration successful but failed to send guest invitations: ' + (invitationResponse.data.message || 'Please try again.'));
          return;
        }
        
        alert('Water registration and guest invitations sent successfully!');
      } else {
        alert('Water registration submitted successfully!');
      }
      
      setSpMembers(new Set());
      setGuests([]);
      setRequestExtraWater(false);
      
    } catch (error) {
      console.error('Registration failed:', error);
      console.error('Error details:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      alert(errorMessage);
    } finally {
      setIsRegistering(false);
    }
  };

  const EditableGuestRow = ({ guest }) => {
    const [editData, setEditData] = useState({
      stayTime: guest.stayTime
    });

    return (
      <div 
        className="rounded-xl p-4 border shadow-lg backdrop-blur-sm transition-all duration-300" 
        style={{ 
          backgroundColor: colors.cardBg, 
          borderColor: colors.borderColor,
          boxShadow: darkMode 
            ? '0 10px 25px rgba(0, 0, 0, 0.3), 0 6px 10px rgba(0, 0, 0, 0.15)' 
            : '0 10px 25px rgba(0, 0, 0, 0.1), 0 6px 10px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            {guest.userProfilePhoto ? (
              <img 
                src={guest.userProfilePhoto} 
                alt={guest.userName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-opacity-50"
                style={{ ringColor: colors.primaryBg }}
              />
            ) : (
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.gradientFrom}, ${colors.gradientTo})`
                }}
              >
                {guest.userName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="font-medium" style={{ color: colors.textColor }}>{guest.userName}</div>
              <div className="text-sm" style={{ color: colors.mutedText }}>{guest.userId}</div>
            </div>
          </div>
          <div className="flex items-center" style={{ color: colors.textColor }}>
            {guest.entryTime}
          </div>
          <input
            type="text"
            value={editData.stayTime}
            onChange={(e) => setEditData({...editData, stayTime: e.target.value})}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
            style={{ 
              backgroundColor: colors.inputBg, 
              borderColor: colors.borderColor, 
              color: colors.textColor,
              focusRingColor: colors.primaryBg
            }}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => saveEditGuest(guest.id, editData)}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
            style={{ 
              backgroundColor: colors.accent,
              boxShadow: darkMode 
                ? '0 4px 15px rgba(16, 185, 129, 0.3)' 
                : '0 4px 15px rgba(16, 185, 129, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.accentHover;
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = colors.accent;
              e.target.style.transform = 'scale(1)';
            }}
          >
            <FaCheck size={14} />
            Save
          </button>
          <button
            onClick={cancelEditGuest}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
            style={{ 
              backgroundColor: colors.mutedText,
              boxShadow: darkMode 
                ? '0 4px 15px rgba(148, 163, 184, 0.3)' 
                : '0 4px 15px rgba(148, 163, 184, 0.2)'
            }}
          >
            <FaTimes size={14} />
            Cancel
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.baseColor }}>
        <div className="text-center">
          <FaSpinner className="animate-spin mx-auto mb-4" size={48} style={{ color: colors.primaryBg }} />
          <p className="text-lg">Loading family members...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-6 transition-all duration-300" 
      style={{ backgroundColor: colors.baseColor }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Family Members Section */}
          <div 
            className="rounded-2xl p-6 border shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl" 
            style={{ 
              backgroundColor: colors.cardBg, 
              borderColor: colors.borderColor,
              boxShadow: darkMode 
                ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 8px 16px rgba(0, 0, 0, 0.15)' 
                : '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="p-3 rounded-xl shadow-lg" 
                style={{ 
                  backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe',
                  boxShadow: darkMode 
                    ? '0 4px 15px rgba(59, 130, 246, 0.3)' 
                    : '0 4px 15px rgba(59, 130, 246, 0.15)'
                }}
              >
                <FaUsers style={{ color: colors.primaryBg }} size={24} />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: colors.textColor }}>Family Members</h2>
            </div>

            <div className="space-y-4">
              {familyMembers.length === 0 ? (
                <div className="text-center py-12" style={{ color: colors.mutedText }}>
                  <FaUsers size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No family members found</p>
                </div>
              ) : (
                familyMembers.map(member => (
                  <div 
                    key={member.userId} 
                    className="rounded-xl p-4 border flex items-center justify-between shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:scale-105" 
                    style={{ 
                      backgroundColor: colors.cardBg, 
                      borderColor: colors.borderColor,
                      boxShadow: darkMode 
                        ? '0 6px 20px rgba(0, 0, 0, 0.25)' 
                        : '0 6px 20px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {member.userProfilePhoto ? (
                        <img 
                          src={member.userProfilePhoto} 
                          alt={member.userName}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-opacity-50 shadow-lg"
                          style={{ ringColor: colors.primaryBg }}
                        />
                      ) : (
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                          style={{ 
                            background: `linear-gradient(135deg, ${colors.gradientFrom}, ${colors.gradientTo})`
                          }}
                        >
                          {member.userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg" style={{ color: colors.textColor }}>{member.userName}</h3>
                        <p className="text-sm" style={{ color: colors.mutedText }}>{member.userId}</p>
                        {spMembers.has(member.userId) && (
                          <span 
                            className="text-xs px-3 py-1 rounded-full font-medium mt-1 inline-block"
                            style={{ 
                              backgroundColor: darkMode ? '#fbbf24' : '#fef3c7', 
                              color: darkMode ? '#1f2937' : '#92400e' 
                            }}
                          >
                            SP Member
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={spMembers.has(member.userId)}
                        onChange={() => toggleSpMember(member.userId)}
                        className="w-5 h-5 rounded focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                        style={{ 
                          accentColor: colors.primaryBg,
                          focusRingColor: colors.primaryBg
                        }}
                      />
                      <label className="text-sm font-medium" style={{ color: colors.textColor }}>SP Member</label>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-8 space-y-4">
              <button
                onClick={() => setRequestExtraWater(!requestExtraWater)}
                className="w-full py-4 px-6 rounded-xl transition-all duration-300 font-semibold text-lg border-2 focus:outline-none focus:ring-4 focus:ring-offset-2 hover:scale-105 shadow-lg"
                style={{
                  backgroundColor: requestExtraWater ? colors.accent : colors.inputBg,
                  color: requestExtraWater ? 'white' : colors.textColor,
                  borderColor: requestExtraWater ? colors.accent : colors.borderColor,
                  focusRingColor: requestExtraWater ? colors.accent : colors.primaryBg,
                  boxShadow: requestExtraWater 
                    ? (darkMode ? '0 8px 25px rgba(16, 185, 129, 0.4)' : '0 8px 25px rgba(16, 185, 129, 0.3)')
                    : (darkMode ? '0 4px 15px rgba(0, 0, 0, 0.2)' : '0 4px 15px rgba(0, 0, 0, 0.1)')
                }}
              >
                {requestExtraWater ? '✓ Extra Water Requested' : 'Request Extra Water'}
              </button>

              <button
                onClick={handleRegisterForWater}
                disabled={isRegistering}
                className="w-full relative overflow-hidden text-white py-5 px-8 rounded-xl font-bold text-xl shadow-2xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none group"
                style={{
                  background: isRegistering 
                    ? (darkMode 
                        ? 'linear-gradient(135deg, #64748b, #94a3b8)' 
                        : 'linear-gradient(135deg, #94a3b8, #cbd5e1)')
                    : (darkMode 
                        ? 'linear-gradient(135deg, #4f46e5, #7c3aed, #3b82f6, #06b6d4)' 
                        : 'linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed, #0ea5e9)'),
                  backgroundSize: '300% 300%',
                  animation: isRegistering ? 'none' : 'gradient-shift 3s ease infinite',
                  focusRingColor: colors.primaryBg,
                  boxShadow: darkMode 
                    ? '0 15px 35px rgba(79, 70, 229, 0.4), 0 8px 20px rgba(79, 70, 229, 0.2)' 
                    : '0 15px 35px rgba(37, 99, 235, 0.3), 0 8px 20px rgba(37, 99, 235, 0.15)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                
                <div className="relative flex items-center justify-center gap-3">
                  {isRegistering ? (
                    <>
                      <FaSpinner className="animate-spin" size={24} />
                      <span className="tracking-wide">Processing Registration...</span>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <FaTint size={24} className="drop-shadow-lg animate-pulse" />
                        <span className="tracking-wide text-shadow">Register for Water</span>
                      </div>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Guest Management Section */}
          <div 
            className="rounded-2xl p-6 border shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl" 
            style={{ 
              backgroundColor: colors.cardBg, 
              borderColor: colors.borderColor,
              boxShadow: darkMode 
                ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 8px 16px rgba(0, 0, 0, 0.15)' 
                : '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="p-3 rounded-xl shadow-lg" 
                style={{ 
                  backgroundColor: darkMode ? 'rgba(139, 92, 246, 0.2)' : '#f3e8ff',
                  boxShadow: darkMode 
                    ? '0 4px 15px rgba(139, 92, 246, 0.3)' 
                    : '0 4px 15px rgba(139, 92, 246, 0.15)'
                }}
              >
                <FaUserPlus style={{ color: colors.secondaryBg }} size={24} />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: colors.textColor }}>Guest Management</h2>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4" style={{ color: colors.textColor }}>Current Guests</h3>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {guests.length === 0 ? (
                  <div className="text-center py-8" style={{ color: colors.mutedText }}>
                    <FaUserPlus size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No guests registered</p>
                  </div>
                ) : (
                  guests.map(guest => (
                    <div key={guest.id}>
                      {editingGuest?.id === guest.id ? (
                        <EditableGuestRow guest={guest} />
                      ) : (
                        <div 
                          className="rounded-xl p-5 border shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 group hover:scale-105" 
                          style={{ 
                            backgroundColor: colors.cardBg, 
                            borderColor: colors.borderColor,
                            boxShadow: darkMode 
                              ? '0 8px 25px rgba(0, 0, 0, 0.25)' 
                              : '0 8px 25px rgba(0, 0, 0, 0.08)'
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {guest.userProfilePhoto ? (
                                <img 
                                  src={guest.userProfilePhoto} 
                                  alt={guest.userName}
                                  className="w-14 h-14 rounded-full object-cover shadow-xl ring-2 ring-opacity-50"
                                  style={{ ringColor: colors.gradientFrom }}
                                />
                              ) : (
                                <div 
                                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl"
                                  style={{ 
                                    background: `linear-gradient(135deg, ${colors.gradientFrom}, ${colors.gradientTo})`
                                  }}
                                >
                                  {guest.userName.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div className="space-y-2">
                                <h4 className="font-bold text-xl" style={{ color: colors.textColor }}>{guest.userName}</h4>
                                <div className="text-sm" style={{ color: colors.mutedText }}>{guest.userId}</div>
                                <div className="flex items-center gap-6 text-sm" style={{ color: colors.mutedText }}>
                                  <div className="flex items-center gap-2">
                                    <FaClock size={14} style={{ color: colors.primaryBg }} />
                                    <span className="font-medium">Entry: {guest.entryTime}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span style={{ color: colors.primaryBg }}>•</span>
                                    <span className="font-medium">Duration: {guest.stayTime}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <button
                                onClick={() => startEditGuest(guest)}
                                className="p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
                                style={{ 
                                  backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe', 
                                  color: colors.primaryBg,
                                  boxShadow: colors.hoverShadow 
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = colors.primaryBg;
                                  e.target.style.color = 'white';
                                  e.target.style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = darkMode ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe';
                                  e.target.style.color = colors.primaryBg;
                                  e.target.style.transform = 'scale(1)';
                                }}
                                title="Edit guest"
                              >
                                <FaEdit size={18} />
                              </button>
                              <button
                                onClick={() => removeGuest(guest.id)}
                                className="p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
                                style={{ 
                                  backgroundColor: darkMode ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2', 
                                  color: colors.danger,
                                  boxShadow: darkMode 
                                    ? '0 4px 15px rgba(239, 68, 68, 0.3)' 
                                    : '0 4px 15px rgba(239, 68, 68, 0.15)'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = colors.danger;
                                  e.target.style.color = 'white';
                                  e.target.style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = darkMode ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2';
                                  e.target.style.color = colors.danger;
                                  e.target.style.transform = 'scale(1)';
                                }}
                                title="Remove guest"
                              >
                                <FaTrash size={18} />
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

            <div 
              className="border-t pt-6" 
              style={{ 
                borderColor: colors.borderColor,
                borderWidth: darkMode ? '1px' : '1px'
              }}
            >
              <h3 className="font-semibold text-lg mb-6" style={{ color: colors.textColor }}>Add New Guest</h3>
              <div className="space-y-5">
                <div>
                  <input
                    type="text"
                    placeholder="Guest User ID"
                    value={newGuest.name}
                    onChange={(e) => {
                      setNewGuest({...newGuest, name: e.target.value});
                      setGuestSearchError('');
                    }}
                    className="w-full border-2 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-transparent transition-all duration-200 text-lg"
                    style={{
                      backgroundColor: colors.inputBg,
                      borderColor: guestSearchError ? colors.danger : colors.borderColor,
                      color: colors.textColor,
                      focusRingColor: colors.primaryBg,
                      boxShadow: darkMode 
                        ? '0 4px 15px rgba(0, 0, 0, 0.2)' 
                        : '0 4px 15px rgba(0, 0, 0, 0.05)'
                    }}
                    disabled={guestSearchLoading}
                  />
                  {guestSearchError && (
                    <p 
                      className="text-sm mt-2 font-medium px-3 py-2 rounded-lg"
                      style={{ 
                        color: colors.danger,
                        backgroundColor: darkMode ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2'
                      }}
                    >
                      {guestSearchError}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input
                    type="time"
                    value={newGuest.entryTime}
                    onChange={(e) => setNewGuest({...newGuest, entryTime: e.target.value})}
                    className="border-2 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-transparent transition-all duration-200 text-lg"
                    style={{
                      backgroundColor: colors.inputBg,
                      borderColor: colors.borderColor,
                      color: colors.textColor,
                      focusRingColor: colors.primaryBg,
                      boxShadow: darkMode 
                        ? '0 4px 15px rgba(0, 0, 0, 0.2)' 
                        : '0 4px 15px rgba(0, 0, 0, 0.05)'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Stay Duration (e.g., 2 hours)"
                    value={newGuest.stayTime}
                    onChange={(e) => setNewGuest({...newGuest, stayTime: e.target.value})}
                    className="border-2 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-transparent transition-all duration-200 text-lg"
                    style={{
                      backgroundColor: colors.inputBg,
                      borderColor: colors.borderColor,
                      color: colors.textColor,
                      focusRingColor: colors.primaryBg,
                      boxShadow: darkMode 
                        ? '0 4px 15px rgba(0, 0, 0, 0.2)' 
                        : '0 4px 15px rgba(0, 0, 0, 0.05)'
                    }}
                  />
                </div>
                <button
                  onClick={addGuest}
                  disabled={!newGuest.name.trim() || !newGuest.entryTime || !newGuest.stayTime || guestSearchLoading}
                  className="w-full text-white py-4 px-6 rounded-xl transition-all duration-300 font-bold text-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 shadow-xl"
                  style={{
                    background: darkMode 
                      ? 'linear-gradient(135deg, #7c3aed, #8b5cf6)' 
                      : 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                    focusRingColor: colors.secondaryBg,
                    boxShadow: darkMode 
                      ? '0 10px 25px rgba(124, 58, 237, 0.4)' 
                      : '0 10px 25px rgba(139, 92, 246, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.background = darkMode 
                        ? 'linear-gradient(135deg, #6d28d9, #7c3aed)' 
                        : 'linear-gradient(135deg, #7c3aed, #8b5cf6)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.background = darkMode 
                        ? 'linear-gradient(135deg, #7c3aed, #8b5cf6)' 
                        : 'linear-gradient(135deg, #8b5cf6, #a855f7)';
                    }
                  }}
                >
                  {guestSearchLoading ? (
                    <>
                      <FaSpinner className="animate-spin" size={20} />
                      <span className="tracking-wide">Searching User...</span>
                    </>
                  ) : (
                    <>
                      <FaUserPlus size={20} className="drop-shadow-lg" />
                      <span className="tracking-wide">Add Guest</span>
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

        /* Enhanced scrollbar styling for dark mode */
        .space-y-4::-webkit-scrollbar {
          width: 8px;
        }
        
        .space-y-4::-webkit-scrollbar-track {
          background: ${darkMode ? 'rgba(51, 65, 85, 0.3)' : 'rgba(241, 245, 249, 0.8)'};
          border-radius: 10px;
        }
        
        .space-y-4::-webkit-scrollbar-thumb {
          background: ${darkMode ? 'rgba(148, 163, 184, 0.6)' : 'rgba(100, 116, 139, 0.6)'};
          border-radius: 10px;
          transition: background 0.3s ease;
        }
        
        .space-y-4::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? 'rgba(148, 163, 184, 0.8)' : 'rgba(100, 116, 139, 0.8)'};
        }

        /* Smooth transitions for all interactive elements */
        * {
          transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
        }

        /* Enhanced focus states for accessibility */
        input:focus, button:focus {
          outline: none;
          box-shadow: 0 0 0 3px ${darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'};
        }

        /* Improved checkbox styling for dark mode */
        input[type="checkbox"] {
          appearance: none;
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid ${colors.borderColor};
          border-radius: 0.375rem;
          background-color: ${colors.inputBg};
          position: relative;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        input[type="checkbox"]:checked {
          background-color: ${colors.primaryBg};
          border-color: ${colors.primaryBg};
        }

        input[type="checkbox"]:checked::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 0.875rem;
          font-weight: bold;
        }

        input[type="checkbox"]:hover {
          border-color: ${colors.primaryBg};
          box-shadow: 0 0 0 2px ${darkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)'};
        }

        /* Time input styling enhancement */
        input[type="time"] {
          color-scheme: ${darkMode ? 'dark' : 'light'};
        }

        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: ${darkMode ? 'invert(1)' : 'none'};
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default WaterRegistration;