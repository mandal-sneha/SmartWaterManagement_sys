import React, { useState } from 'react';
import { FaUsers, FaUserPlus, FaClock, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

// Mock theme context similar to AddProperty.jsx
const useTheme = () => {
  const darkMode = false;
  const colors = {
    baseColor: darkMode ? '#1f2937' : '#f9fafb',
    cardBg: darkMode ? '#374151' : '#ffffff',
    textColor: darkMode ? '#f9fafb' : '#111827',
    mutedText: darkMode ? '#9ca3af' : '#6b7280',
    borderColor: darkMode ? '#4b5563' : '#e5e7eb',
    primaryBg: '#ef4444',
    primaryHover: '#dc2626',
    secondaryBg: '#f97316',
    secondaryHover: '#ea580c',
  };
  return { darkMode, colors };
};

const WaterRegistration = () => {
  const { darkMode, colors } = useTheme();
  const [primaryMembers, setPrimaryMembers] = useState([]);
  const [guests, setGuests] = useState([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [isSpMember, setIsSpMember] = useState(false);
  const [newGuest, setNewGuest] = useState({
    name: '',
    entryTime: '',
    stayTime: ''
  });
  const [editingGuest, setEditingGuest] = useState(null);
  const [requestExtraWater, setRequestExtraWater] = useState(false);

  const addPrimaryMember = () => {
    if (newMemberName.trim()) {
      setPrimaryMembers([...primaryMembers, {
        id: Date.now(),
        name: newMemberName.trim(),
        isSpMember: isSpMember
      }]);
      setNewMemberName('');
      setIsSpMember(false);
    }
  };

  const removePrimaryMember = (id) => {
    setPrimaryMembers(primaryMembers.filter(member => member.id !== id));
  };

  const addGuest = () => {
    if (newGuest.name.trim() && newGuest.entryTime && newGuest.stayTime) {
      setGuests([...guests, {
        id: Date.now(),
        ...newGuest,
        name: newGuest.name.trim()
      }]);
      setNewGuest({ name: '', entryTime: '', stayTime: '' });
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

  const EditableGuestRow = ({ guest }) => {
    const [editData, setEditData] = useState({
      name: guest.name,
      stayTime: guest.stayTime
    });

    return (
      <div className="rounded-xl p-4 border shadow-md" style={{ backgroundColor: colors.cardBg, borderColor: colors.borderColor }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({...editData, name: e.target.value})}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
            style={{ 
              backgroundColor: colors.cardBg, 
              borderColor: colors.borderColor, 
              color: colors.textColor
            }}
          />
          <div className="flex items-center" style={{ color: colors.textColor }}>
            {guest.entryTime}
          </div>
          <input
            type="text"
            value={editData.stayTime}
            onChange={(e) => setEditData({...editData, stayTime: e.target.value})}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
            style={{ 
              backgroundColor: colors.cardBg, 
              borderColor: colors.borderColor, 
              color: colors.textColor
            }}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => saveEditGuest(guest.id, editData)}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors hover:opacity-90"
            style={{ backgroundColor: '#10b981' }}
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
          {/* Primary Members Section */}
          <div className="rounded-2xl p-6 border shadow-lg" style={{ backgroundColor: colors.cardBg, borderColor: colors.borderColor }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg" style={{ backgroundColor: darkMode ? '#7f1d1d' : '#fecaca' }}>
                <FaUsers style={{ color: colors.primaryBg }} size={24} />
              </div>
              <h2 className="text-xl font-semibold" style={{ color: colors.textColor }}>Primary Members</h2>
            </div>

            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Member Name"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.borderColor,
                    color: colors.textColor
                  }}
                />
                <button
                  onClick={addPrimaryMember}
                  disabled={!newMemberName.trim()}
                  className="text-white px-6 py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: colors.primaryBg }}
                  onMouseEnter={(e) => !e.target.disabled && (e.target.style.backgroundColor = colors.primaryHover)}
                  onMouseLeave={(e) => !e.target.disabled && (e.target.style.backgroundColor = colors.primaryBg)}
                >
                  Add Member
                </button>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <input
                  type="checkbox"
                  id="spMember"
                  checked={isSpMember}
                  onChange={(e) => setIsSpMember(e.target.checked)}
                  className="w-4 h-4 rounded focus:ring-2"
                  style={{ accentColor: colors.primaryBg }}
                />
                <label htmlFor="spMember" className="text-sm" style={{ color: colors.textColor }}>SP Member</label>
              </div>
            </div>

            <div className="space-y-3">
              {primaryMembers.length === 0 ? (
                <div className="text-center py-8" style={{ color: colors.mutedText }}>
                  <FaUsers size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No primary members added yet</p>
                </div>
              ) : (
                primaryMembers.map(member => (
                  <div key={member.id} className="rounded-xl p-4 border flex items-center justify-between shadow-sm" style={{ backgroundColor: colors.cardBg, borderColor: colors.borderColor }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: `linear-gradient(135deg, ${colors.primaryBg}, #ec4899)` }}>
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-medium" style={{ color: colors.textColor }}>{member.name}</h3>
                        {member.isSpMember && (
                          <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>SP Member</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removePrimaryMember(member.id)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: '#ef4444' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = darkMode ? '#374151' : '#fef2f2'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6">
              <button
                onClick={() => setRequestExtraWater(!requestExtraWater)}
                className="w-full py-3 px-4 rounded-lg transition-colors font-medium border"
                style={{
                  backgroundColor: requestExtraWater ? '#10b981' : colors.cardBg,
                  color: requestExtraWater ? 'white' : colors.textColor,
                  borderColor: requestExtraWater ? '#10b981' : colors.borderColor
                }}
              >
                {requestExtraWater ? '✓ Extra Water Requested' : 'Request Extra Water'}
              </button>
            </div>
          </div>

          {/* Guests Section */}
          <div className="rounded-2xl p-6 border shadow-lg" style={{ backgroundColor: colors.cardBg, borderColor: colors.borderColor }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg" style={{ backgroundColor: darkMode ? '#7c2d12' : '#fed7aa' }}>
                <FaUserPlus style={{ color: colors.secondaryBg }} size={24} />
              </div>
              <h2 className="text-xl font-semibold" style={{ color: colors.textColor }}>Guest Management</h2>
            </div>

            {/* Existing Guests */}
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
                        <div className="rounded-xl p-4 border shadow-sm" style={{ backgroundColor: colors.cardBg, borderColor: colors.borderColor }}>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <div className="font-medium" style={{ color: colors.textColor }}>{guest.name}</div>
                            <div className="flex items-center gap-2" style={{ color: colors.mutedText }}>
                              <FaClock size={14} />
                              {guest.entryTime}
                            </div>
                            <div style={{ color: colors.mutedText }}>{guest.stayTime}</div>
                          </div>
                          <div className="flex justify-end gap-2 mt-3">
                            <button
                              onClick={() => startEditGuest(guest)}
                              className="flex items-center gap-2 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                              style={{ backgroundColor: '#3b82f6' }}
                            >
                              <FaEdit size={14} />
                              Edit
                            </button>
                            <button
                              onClick={() => removeGuest(guest.id)}
                              className="flex items-center gap-2 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                              style={{ backgroundColor: '#ef4444' }}
                            >
                              <FaTrash size={14} />
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Add New Guest */}
            <div className="border-t pt-6" style={{ borderColor: colors.borderColor }}>
              <h3 className="font-medium mb-4" style={{ color: colors.textColor }}>Add New Guest</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Guest Name"
                  value={newGuest.name}
                  onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.borderColor,
                    color: colors.textColor
                  }}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="time"
                    value={newGuest.entryTime}
                    onChange={(e) => setNewGuest({...newGuest, entryTime: e.target.value})}
                    className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{
                      backgroundColor: colors.cardBg,
                      borderColor: colors.borderColor,
                      color: colors.textColor
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Stay Duration"
                    value={newGuest.stayTime}
                    onChange={(e) => setNewGuest({...newGuest, stayTime: e.target.value})}
                    className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{
                      backgroundColor: colors.cardBg,
                      borderColor: colors.borderColor,
                      color: colors.textColor
                    }}
                  />
                </div>
                <button
                  onClick={addGuest}
                  disabled={!newGuest.name.trim() || !newGuest.entryTime || !newGuest.stayTime}
                  className="w-full text-white py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: colors.secondaryBg }}
                  onMouseEnter={(e) => !e.target.disabled && (e.target.style.backgroundColor = colors.secondaryHover)}
                  onMouseLeave={(e) => !e.target.disabled && (e.target.style.backgroundColor = colors.secondaryBg)}
                >
                  Add Guest
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterRegistration;