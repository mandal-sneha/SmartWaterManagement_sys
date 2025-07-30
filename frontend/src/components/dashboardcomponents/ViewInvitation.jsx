import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, Check, XCircle } from 'lucide-react';
import { axiosInstance } from '../../lib/axios.js';

const ViewInvitation = ({ isOpen, onClose, theme }) => {
  const [invitations, setInvitations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    if (!currentUser?.userId || !isOpen) return;

    const fetchInvitations = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/invitation/${currentUser.userId}/view-invitations`);
        if (response.data.success) {
          const pendingInvitations = response.data.invitations.filter(
            inv => inv.invitedGuests[currentUser.userId] === 'pending'
          );
          setInvitations(pendingInvitations);
        }
      } catch (error) {
        console.error("Failed to fetch invitations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvitations();
  }, [currentUser, isOpen]);

  const handleStatusChange = async (invitationId, newStatus) => {
    if (!currentUser?.userId) {
      alert("User not found, please log in again.");
      return;
    }

    const apiUrl = `/invitation/${invitationId}/${currentUser.userId}/update-state`;
    const requestBody = { status: newStatus };

    try {
      await axiosInstance.patch(apiUrl, requestBody);
      setInvitations(prev =>
        prev.filter(inv => inv._id !== invitationId)
      );
    } catch (error) {
      console.error("Failed to update invitation status:", error);
      alert("There was an error updating the invitation. Please try again.");
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  const darkMode = theme?.darkMode || false;
  const colors = {
    backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
    baseColor: darkMode ? '#1e293b' : '#ffffff',
    textColor: darkMode ? '#f1f5f9' : '#1e293b',
    mutedText: darkMode ? '#94a3b8' : '#64748b',
    borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    primaryBg: darkMode ? '#3b82f6' : '#2563eb',
    modalBg: darkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(0,0,0,0.5)'
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: colors.modalBg }}>
      <div className="rounded-2xl shadow-xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col" style={{ backgroundColor: colors.baseColor, color: colors.textColor, border: `1px solid ${colors.borderColor}` }}>
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: colors.borderColor }}>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: colors.textColor }}>Invitations from your relatives</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-opacity-10 transition-colors" style={{ color: colors.mutedText, backgroundColor: 'transparent' }}>
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          {isLoading ? (
            <div className="text-center py-12">Loading invitations...</div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2" style={{ color: colors.textColor }}>No Pending Invitations</h3>
              <p style={{ color: colors.mutedText }} className="text-sm">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {invitations.map((invitation) => (
                <div key={invitation._id} className="border rounded-2xl p-6 hover:shadow-lg transition-all duration-300" style={{ borderColor: colors.borderColor, backgroundColor: colors.baseColor }}>
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      {invitation.userProfilePhoto ? (
                        <img src={invitation.userProfilePhoto} alt={invitation.userName} className="w-14 h-14 rounded-xl object-cover" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ background: darkMode ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                          {invitation.userName?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-semibold" style={{ color: colors.textColor }}>{invitation.userName}</h3>
                        <p className="text-xs mt-1" style={{ color: colors.mutedText }}>{invitation.hostId}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {invitation.invitedGuests[currentUser.userId] === 'accepted' && <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"><Check size={16} />Accepted</span>}
                      {invitation.invitedGuests[currentUser.userId] === 'declined' && <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"><XCircle size={16} />Declined</span>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mb-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mt-1" style={{ backgroundColor: darkMode ? 'rgba(249, 115, 22, 0.2)' : '#fed7aa' }}>
                        <MapPin size={20} className="text-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-1" style={{ color: colors.textColor }}>Location</p>
                        <p className="text-sm leading-relaxed" style={{ color: colors.mutedText }}>
                          {`${invitation.propertyName}, ${invitation.municipality}, ${invitation.district}`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mt-1" style={{ backgroundColor: darkMode ? 'rgba(34, 197, 94, 0.2)' : '#dcfce7' }}>
                        <Clock size={20} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-1" style={{ color: colors.textColor }}>Time & Duration</p>
                        <p className="text-sm" style={{ color: colors.mutedText }}>Arrival Time: {invitation.arrivalTime}</p>
                        <p className="text-sm mt-1" style={{ color: colors.mutedText }}>Duration: {invitation.stayDuration} hour(s)</p>
                      </div>
                    </div>
                  </div>

                  {invitation.invitedGuests[currentUser.userId] === 'pending' && (
                    <div className="flex flex-wrap gap-3">
                      <button onClick={() => handleStatusChange(invitation._id, 'accepted')} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 cursor-pointer">
                        <Check size={18} /> Accept
                      </button>
                      <button onClick={() => handleStatusChange(invitation._id, 'declined')} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 cursor-pointer">
                        <XCircle size={18} /> Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t p-6" style={{ borderColor: colors.borderColor, backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.5)' : '#f8fafc' }}>
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium" style={{ color: colors.mutedText }}>{invitations.filter(inv => inv.invitedGuests[currentUser?.userId] === 'pending').length} pending invitation(s)</p>
            <button onClick={onClose} className="px-6 py-2 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg cursor-pointer" style={{ backgroundColor: colors.primaryBg, color: 'white' }}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInvitation;