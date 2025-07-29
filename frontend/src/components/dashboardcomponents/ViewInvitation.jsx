import React, { useState, useEffect } from 'react'
import { X, Clock, MapPin, User, Check, XCircle, Key } from 'lucide-react'

const ViewInvitation = ({ isOpen, onClose, theme }) => {
  // Sample invitation data - updated without meeting types
  const [invitations, setInvitations] = useState([
    {
      id: 1,
      memberName: "Alice Johnson",
      address: "123 Main Street, Downtown, City",
      startTime: "2024-07-15T14:30:00",
      duration: "2 hours",
      status: "pending"
    },
    {
      id: 2,
      memberName: "Bob Smith",
      address: "456 Oak Avenue, Uptown, City",
      startTime: "2024-07-16T10:00:00",
      duration: "1.5 hours",
      status: "pending"
    },
    {
      id: 3,
      memberName: "Carol Williams",
      address: "789 Pine Road, Suburb, City",
      startTime: "2024-07-17T16:45:00",
      duration: "3 hours",
      status: "pending"
    }
  ])

  const [otpModal, setOtpModal] = useState({ isOpen: false, invitationId: null })
  const [otp, setOtp] = useState('')

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const handleAccept = (id) => {
    setInvitations(prev => 
      prev.map(inv => 
        inv.id === id ? { ...inv, status: 'accepted' } : inv
      )
    )
  }

  const handleDecline = (id) => {
    setInvitations(prev => 
      prev.map(inv => 
        inv.id === id ? { ...inv, status: 'declined' } : inv
      )
    )
  }

  const handleOtp = (id) => {
    setOtpModal({ isOpen: true, invitationId: id })
  }

  const handleOtpSubmit = () => {
    if (otp.length === 6) {
      // Handle OTP verification
      console.log('OTP verified for invitation:', otpModal.invitationId, 'OTP:', otp)
      setOtpModal({ isOpen: false, invitationId: null })
      setOtp('')
    }
  }

  // Close popup when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (otpModal.isOpen) {
          setOtpModal({ isOpen: false, invitationId: null })
          setOtp('')
        } else {
          onClose()
        }
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, otpModal.isOpen, onClose])

  if (!isOpen) return null

  // Updated colors to match DashboardHome theme
  const darkMode = theme?.darkMode || false
  const colors = {
    backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
    baseColor: darkMode ? '#1e293b' : '#ffffff',
    textColor: darkMode ? '#f1f5f9' : '#1e293b',
    mutedText: darkMode ? '#94a3b8' : '#64748b',
    borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    primaryBg: darkMode ? '#3b82f6' : '#2563eb',
    accent: '#22c55e',
    cardHover: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
    modalBg: darkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(0,0,0,0.5)'
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" 
         style={{ backgroundColor: colors.modalBg }}>
      {/* Popup Content */}
      <div 
        className="rounded-2xl shadow-xl max-w-4xl w-full max-h-[85vh] overflow-hidden"
        style={{
          backgroundColor: colors.baseColor,
          color: colors.textColor,
          border: `1px solid ${colors.borderColor}`
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: colors.borderColor }}
        >
          <div>
            <h2 className="text-2xl font-bold" style={{ color: colors.textColor }}>
              Invitations from Members
            </h2>
            <p className="text-sm mt-1" style={{ color: colors.mutedText }}>
              Manage your pending invitations
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-opacity-10 transition-colors"
            style={{
              color: colors.mutedText,
              backgroundColor: 'transparent'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[65vh]">
          {invitations.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                   style={{ backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe' }}>
                <User size={32} style={{ color: colors.mutedText }} />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: colors.textColor }}>
                No Invitations
              </h3>
              <p style={{ color: colors.mutedText }} className="text-sm">
                No invitations available at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="border rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                  style={{
                    borderColor: colors.borderColor,
                    backgroundColor: colors.baseColor
                  }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                        style={{
                          background: darkMode 
                            ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
                            : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                        }}
                      >
                        {invitation.memberName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-1" style={{ color: colors.textColor }}>
                          {invitation.memberName}
                        </h3>
                        <p style={{ color: colors.mutedText }} className="text-sm">
                          Member invitation
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {invitation.status === 'accepted' && (
                        <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                          <Check size={16} />
                          Accepted
                        </span>
                      )}
                      {invitation.status === 'declined' && (
                        <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                          <XCircle size={16} />
                          Declined
                        </span>
                      )}
                      {invitation.status === 'pending' && (
                        <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mt-1"
                           style={{ backgroundColor: darkMode ? 'rgba(249, 115, 22, 0.2)' : '#fed7aa' }}>
                        <MapPin size={20} className="text-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-1" style={{ color: colors.textColor }}>
                          Location
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: colors.mutedText }}>
                          {invitation.address}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mt-1"
                           style={{ backgroundColor: darkMode ? 'rgba(34, 197, 94, 0.2)' : '#dcfce7' }}>
                        <Clock size={20} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-1" style={{ color: colors.textColor }}>
                          Time & Duration
                        </p>
                        <p className="text-sm" style={{ color: colors.mutedText }}>
                          {formatDateTime(invitation.startTime)}
                        </p>
                        <p className="text-sm mt-1" style={{ color: colors.mutedText }}>
                          Duration: {invitation.duration}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {invitation.status === 'pending' && (
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleAccept(invitation.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                      >
                        <Check size={18} />
                        Accept
                      </button>
                      <button
                        onClick={() => handleDecline(invitation.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                      >
                        <XCircle size={18} />
                        Decline
                      </button>
                      <button
                        onClick={() => handleOtp(invitation.id)}
                        className="text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                        style={{ backgroundColor: colors.primaryBg }}
                      >
                        <Key size={18} />
                        OTP
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div 
          className="border-t p-6"
          style={{ 
            borderColor: colors.borderColor,
            backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.5)' : '#f8fafc'
          }}
        >
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium" style={{ color: colors.mutedText }}>
              {invitations.filter(inv => inv.status === 'pending').length} pending invitation(s)
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
              style={{ 
                backgroundColor: colors.primaryBg,
                color: 'white'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {otpModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div 
            className="rounded-2xl p-8 max-w-md w-full shadow-2xl"
            style={{ backgroundColor: colors.baseColor }}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                   style={{ backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe' }}>
                <Key size={32} style={{ color: colors.primaryBg }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: colors.textColor }}>
                Enter OTP
              </h3>
              <p className="text-sm" style={{ color: colors.mutedText }}>
                Please enter the 6-digit OTP to verify your invitation
              </p>
            </div>
            
            <div className="mb-6">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-3 rounded-xl text-center text-lg font-mono tracking-wider border-2 focus:outline-none focus:ring-2 transition-all duration-300"
                style={{
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  borderColor: colors.borderColor,
                  color: colors.textColor
                }}
                maxLength="6"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleOtpSubmit}
                disabled={otp.length !== 6}
                className="flex-1 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: otp.length === 6 ? colors.primaryBg : colors.mutedText,
                  color: 'white'
                }}
              >
                Verify OTP
              </button>
              <button
                onClick={() => {
                  setOtpModal({ isOpen: false, invitationId: null })
                  setOtp('')
                }}
                className="px-6 py-3 rounded-xl font-semibold border-2 transition-all duration-300"
                style={{ 
                  borderColor: colors.borderColor,
                  color: colors.textColor,
                  backgroundColor: 'transparent'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewInvitation