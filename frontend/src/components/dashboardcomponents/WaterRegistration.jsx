import React, { useState, useEffect, useContext, useRef } from 'react';
import { FaUsers, FaUserPlus, FaClock, FaEdit, FaTrash, FaCheck, FaTimes, FaTint, FaSpinner, FaExclamationTriangle, FaHourglassHalf, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { axiosInstance } from "../../lib/axios.js";
import { ThemeContext } from '../UserDashboard';

const useTheme = () => {
  const { darkMode, colors: themeColors } = useContext(ThemeContext);
  return { darkMode, colors: themeColors };
};

const getSlotFromTime = () => {
  const now = new Date();
  const hours = now.getHours();
  if (hours < 8) return 8;
  if (hours < 12) return 12;
  if (hours < 15) return 15;
  return 8;
};

const WaterRegistration = () => {
  const { darkMode, colors } = useTheme();
  const [familyMembers, setFamilyMembers] = useState([]);
  const [spMembers, setSpMembers] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [guests, setGuests] = useState([]);
  const [newGuest, setNewGuest] = useState({ name: '', entryTime: '', stayTime: '' });
  const [editingGuest, setEditingGuest] = useState(null);
  const [requestExtraWater, setRequestExtraWater] = useState(false);
  const [guestSearchLoading, setGuestSearchLoading] = useState(false);
  const [guestSearchError, setGuestSearchError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [requestStatus, setRequestStatus] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const toastTimeoutRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      await fetchFamilyMembers();
      await fetchRequestStatus();
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentUser?.waterId) {
        fetchRequestStatus();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [currentUser?.waterId]);

  const showToast = (message, type = 'success') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ show: true, message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

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

  const fetchRequestStatus = async () => {
    try {
      const response = await axiosInstance.get(`/waterregistration/${currentUser?.waterId}/request-status`);
      if (response.data.success && response.data.data.hasRequest) {
        const newStatus = response.data.data;
        setRequestStatus(newStatus);
        if (newStatus.status === 'approved' && requestStatus?.status !== 'approved') {
          showToast('Water request approved! Water will be allocated as requested.', 'success');
        } else if (newStatus.status === 'rejected' && requestStatus?.status !== 'rejected') {
          showToast(`Water request rejected: ${newStatus.rejectionReason || 'Please contact municipality'}`, 'error');
        }
      } else {
        setRequestStatus(null);
      }
    } catch (error) {
      console.error("Error fetching request status:", error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const isFamilyMember = (userId) => familyMembers.some(member => member.userId === userId) || userId === currentUser.userId;

  const toggleSpMember = (userId) => {
    const newSpMembers = new Set(spMembers);
    if (newSpMembers.has(userId)) newSpMembers.delete(userId);
    else newSpMembers.add(userId);
    setSpMembers(newSpMembers);
  };

  const fetchGuestUser = async (userId) => {
    try {
      setGuestSearchLoading(true);
      setGuestSearchError('');
      const response = await axiosInstance.get(`/user/${userId}/get-user`);
      if (response.data.success) return response.data.data;
      else throw new Error(response.data.message || 'User not found');
    } catch (error) {
      setGuestSearchError(error.response?.data?.message || 'User not found');
      throw error;
    } finally {
      setGuestSearchLoading(false);
    }
  };

  const addGuest = async () => {
    if (newGuest.name.trim() && newGuest.entryTime && newGuest.stayTime) {
      try {
        if (guests.find(g => g.userId === newGuest.name.trim())) {
          setGuestSearchError('Guest is already added');
          return;
        }
        if (isFamilyMember(newGuest.name.trim())) {
          setGuestSearchError('User is a family member');
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
      } catch (error) {}
    }
  };

  const handleRegisterForWater = async () => {
    try {
      setIsRegistering(true);
      const allFamilyMembers = [...familyMembers, { userId: currentUser.userId, userName: currentUser.userName }];
      const primaryMembers = allFamilyMembers.map(member => member.userId);
      const waterId = currentUser.waterId;

      const guestsData = guests.map(g => ({
        userId: g.userId,
        userName: g.userName,
        entryTime: g.entryTime,
        stayTime: g.stayTime
      }));

      const waterRes = await axiosInstance.post(`/waterregistration/${waterId}/register-for-water`, {
        primaryMembers,
        specialMembers: Array.from(spMembers),
        extraWaterRequested: requestExtraWater,
        guests: guestsData
      });

      if (!waterRes.data.success) {
        showToast(waterRes.data.message || 'Registration failed', 'error');
        return;
      }

      if (guests.length > 0) {
        const arrivalTime = {};
        const stayDuration = {};
        guests.forEach(g => {
          arrivalTime[g.userId] = g.entryTime;
          stayDuration[g.userId] = g.stayTime;
        });

        const inviteRes = await axiosInstance.post(`/invitation/${currentUser.userId}/${currentUser.waterId}/register-invitation`, {
          guests: guests.map(g => g.userId),
          arrivalTime,
          stayDuration
        });

        if (!inviteRes.data.success) {
          showToast('Registration submitted but invitation failed', 'error');
          return;
        }
      }

      showToast('Water registration submitted for admin approval', 'success');
      await fetchRequestStatus();
      setSpMembers(new Set());
      setGuests([]);
      setRequestExtraWater(false);

    } catch (error) {
      console.error("Registration error:", error);
      showToast(error.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setIsRegistering(false);
    }
  };

  const inputStyle = {
    backgroundColor: colors.cardBg,
    borderColor: colors.borderColor,
    color: colors.textColor,
  };

  if (loading || checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.baseColor }}>
        <FaSpinner className="animate-spin" size={48} style={{ color: colors.primaryBg }} />
      </div>
    );
  }

  const isPending = requestStatus && requestStatus.hasRequest && requestStatus.status === 'pending';
  const isApproved = requestStatus && requestStatus.hasRequest && requestStatus.status === 'approved';
  const isRejected = requestStatus && requestStatus.hasRequest && requestStatus.status === 'rejected';

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.baseColor }}>
      {toast.show && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className={`rounded-xl shadow-2xl px-6 py-4 flex items-center gap-3 border ${
            toast.type === 'success' 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
              : 'bg-rose-50 border-rose-300 text-rose-800'
          }`}>
            {toast.type === 'success' ? <FaCheckCircle size={20} /> : <FaExclamationTriangle size={20} />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {isPending && (
          <div className="mb-6 rounded-2xl p-4 border bg-amber-50 border-amber-200 flex items-center gap-3">
            <FaHourglassHalf className="text-amber-600" size={24} />
            <div>
              <p className="text-amber-800 font-semibold">Request Pending Approval</p>
              <p className="text-amber-600 text-sm">Your water request has been submitted and is awaiting admin approval.</p>
            </div>
          </div>
        )}

        {isApproved && (
          <div className="mb-6 rounded-2xl p-4 border bg-emerald-50 border-emerald-200 flex items-center gap-3">
            <FaCheckCircle className="text-emerald-600" size={24} />
            <div>
              <p className="text-emerald-800 font-semibold">Request Approved!</p>
              <p className="text-emerald-600 text-sm">Water will be allocated as requested. You can submit a new request for next slot.</p>
            </div>
          </div>
        )}

        {isRejected && (
          <div className="mb-6 rounded-2xl p-4 border bg-rose-50 border-rose-200 flex items-center gap-3">
            <FaTimesCircle className="text-rose-600" size={24} />
            <div>
              <p className="text-rose-800 font-semibold">Request Rejected</p>
              <p className="text-rose-600 text-sm">{requestStatus.rejectionReason || 'Please contact municipality for more information.'}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl p-6 border shadow-lg" style={{ backgroundColor: colors.cardBg, borderColor: colors.borderColor }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl" style={{ backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(110, 142, 251, 0.1)' }}>
                <FaUsers style={{ color: colors.primaryBg }} size={24} />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: colors.textColor }}>Family Members</h2>
            </div>
            <div className="space-y-4">
              {familyMembers.map(member => (
                <div key={member.userId} className="rounded-xl p-4 border flex items-center justify-between" style={{ backgroundColor: colors.cardBg, borderColor: colors.borderColor }}>
                  <div className="flex items-center gap-4">
                    <img src={member.userProfilePhoto || "https://via.placeholder.com/48"} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h3 className="font-semibold" style={{ color: colors.textColor }}>{member.userName}</h3>
                      <p className="text-xs" style={{ color: colors.mutedText }}>{member.userId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={spMembers.has(member.userId)} onChange={() => toggleSpMember(member.userId)} style={{ accentColor: colors.primaryBg }} className="w-5 h-5 rounded" />
                    <label className="text-sm font-medium" style={{ color: colors.textColor }}>SP Member</label>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-4">
              <button onClick={() => setRequestExtraWater(!requestExtraWater)} className="w-full py-4 rounded-xl font-semibold border-2 transition-all" style={{ backgroundColor: requestExtraWater ? colors.primaryBg : 'transparent', color: requestExtraWater ? '#fff' : colors.textColor, borderColor: requestExtraWater ? colors.primaryBg : colors.borderColor }}>
                {requestExtraWater ? '✓ Extra Water Requested' : 'Request Extra Water'}
              </button>
              <button onClick={handleRegisterForWater} disabled={isRegistering || isPending} className="w-full py-5 rounded-xl font-bold text-xl text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" style={{ background: colors.sidebarBg }}>
                {isRegistering ? <FaSpinner className="animate-spin mx-auto" /> : (isPending ? 'Request Pending' : 'Register for Water')}
              </button>
            </div>
          </div>

          <div className="rounded-2xl p-6 border shadow-lg" style={{ backgroundColor: colors.cardBg, borderColor: colors.borderColor }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl" style={{ backgroundColor: darkMode ? 'rgba(167, 119, 227, 0.1)' : 'rgba(205, 184, 242, 0.1)' }}>
                <FaUserPlus style={{ color: colors.secondaryBg }} size={24} />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: colors.textColor }}>Guest Management</h2>
            </div>
            <div className="space-y-4 max-h-80 overflow-y-auto mb-8">
              {guests.map(guest => (
                <div key={guest.id} className="p-4 rounded-xl border flex items-center justify-between" style={{ backgroundColor: colors.cardBg, borderColor: colors.borderColor }}>
                  <div className="flex items-center gap-3">
                    <img src={guest.userProfilePhoto || "https://via.placeholder.com/40"} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold" style={{ color: colors.textColor }}>{guest.userName}</h4>
                      <p className="text-xs" style={{ color: colors.mutedText }}>Entry: {guest.entryTime} • {guest.stayTime} hrs</p>
                    </div>
                  </div>
                  <button onClick={() => setGuests(guests.filter(g => g.id !== guest.id))} className="text-red-500 p-2"><FaTrash /></button>
                </div>
              ))}
            </div>
            <div className="space-y-4 border-t pt-6" style={{ borderColor: colors.borderColor }}>
              {guestSearchError && <p className="text-sm text-red-500">{guestSearchError}</p>}
              <input type="text" placeholder="Guest User ID" value={newGuest.name} onChange={(e) => setNewGuest({...newGuest, name: e.target.value})} className="w-full p-4 rounded-xl border outline-none" style={inputStyle} />
              <div className="grid grid-cols-2 gap-4">
                <input type="time" value={newGuest.entryTime} onChange={(e) => setNewGuest({...newGuest, entryTime: e.target.value})} className="p-4 rounded-xl border outline-none" style={inputStyle} />
                <input type="number" placeholder="Stay Duration (hours)" value={newGuest.stayTime} onChange={(e) => setNewGuest({...newGuest, stayTime: e.target.value})} className="p-4 rounded-xl border outline-none" style={inputStyle} />
              </div>
              <button onClick={addGuest} className="w-full py-4 rounded-xl text-white font-bold shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 cursor-pointer">
                + Add Guest
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterRegistration;