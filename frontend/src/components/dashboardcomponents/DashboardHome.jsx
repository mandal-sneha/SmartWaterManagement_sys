import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../lib/axios.js';
import {
  FiDroplet,
  FiFileText,
  FiTruck,
  FiCreditCard,
  FiUsers,
  FiCalendar,
  FiCheck,
  FiAlertCircle,
  FiUser,
  FiSettings
} from 'react-icons/fi';
import { useTheme } from '../UserDashboard';
import desertCactus from '../../assets/desert-cactus.svg';

const DashboardHome = () => {
  const { darkMode, colors } = useTheme();
  const [dashboardData, setDashboardData] = useState(null);
  const [guestData, setGuestData] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const userObject = localStorage.getItem('user');
        const userId = userObject ? JSON.parse(userObject).userId : null;
        const waterId = userObject ? JSON.parse(userObject).waterId : null;

        if (!userId) {
          setLoading(false);
          return;
        }

        if (!waterId) {
            const { data } = await axiosInstance.get(`/user/${userId}/dashboard`);
            setDashboardData(data);
            setLoading(false);
            return;
        }

        const { data } = await axiosInstance.get(`/user/${userId}/dashboard`);
        setDashboardData(data);

        try {
          const guestResponse = await axiosInstance.get(`/user/${waterId}/get-currentday-guests`);
          setGuestData(Array.isArray(guestResponse.data) ? guestResponse.data : []);
        } catch (guestError) {
          setGuestData([]);
        }

        try {
          const registrationResponse = await axiosInstance.get(`/waterregistration/${waterId}/get-registration-details`);
          if (registrationResponse.data.success) {
            setFamilyMembers(registrationResponse.data.data.primaryMembers || []);
          } else {
            setFamilyMembers([]);
          }
        } catch (registrationError) {
          setFamilyMembers([]);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formatTime = (time24) => {
    if (!time24 || !time24.includes(':')) return 'Invalid Time';
    const [hours, minutes] = time24.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const period = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${period}`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.baseColor }}>
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4"
               style={{ borderColor: 'rgba(110, 142, 251, 0.2)', borderTopColor: colors.primaryBg }}>
          </div>
        </div>
        <p className="text-lg font-medium" style={{ color: colors.textColor }}>Loading your dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.baseColor }}>
      <div className="text-center rounded-2xl p-8 shadow-lg" style={{ backgroundColor: colors.cardBg }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
          <FiAlertCircle className="w-8 h-8" style={{color: colors.danger || '#ef4444'}} />
        </div>
        <p className="text-lg font-medium" style={{ color: colors.textColor }}>{error}</p>
      </div>
    </div>
  );

  if (!dashboardData || dashboardData.hasWaterId === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" style={{ backgroundColor: colors.baseColor }}>
        <div className="rounded-3xl p-12 shadow-xl max-w-md" style={{ backgroundColor: colors.cardBg }}>
          <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8" style={{ backgroundColor: 'rgba(110, 142, 251, 0.1)' }}>
            <img src={desertCactus} alt="Empty Dashboard" className="w-20 h-20 opacity-90" />
          </div>
          <h3 className="text-3xl font-bold mb-4" style={{ color: colors.textColor }}>
            Your Water Dashboard
          </h3>
          <p className="leading-relaxed text-lg mb-6" style={{ color: colors.mutedText }}>
            Connect to a property to start tracking water usage and payments with beautiful insights
          </p>
          <button className="text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  style={{ backgroundColor: colors.primaryBg }}>
            Get Started
          </button>
        </div>
      </div>
    );
  }

  const d = dashboardData;

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.baseColor }}>
      <div className="shadow-sm border-b" style={{ backgroundColor: colors.cardBg, borderColor: colors.borderColor }}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2" style={{ color: colors.mutedText }}>
              <FiCalendar className="w-4 h-4" />
              <span className="text-sm font-medium">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.borderColor}` }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(110, 142, 251, 0.1)' }}>
                <FiDroplet className="w-6 h-6" style={{ color: colors.primaryBg }} />
              </div>
              <span className="text-2xl font-bold" style={{ color: colors.textColor }}>{d.waterUsedThisMonth}L</span>
            </div>
            <p className="text-sm font-medium" style={{ color: colors.mutedText }}>Water Used</p>
            <p className="text-xs mt-1" style={{ color: colors.mutedText, opacity: 0.7 }}>This month</p>
          </div>

          <div className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.borderColor}` }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                <FiUsers className="w-6 h-6" style={{ color: colors.accent || '#10b981' }} />
              </div>
              <span className="text-2xl font-bold" style={{ color: colors.textColor }}>{d.guestsThisMonth}</span>
            </div>
            <p className="text-sm font-medium" style={{ color: colors.mutedText }}>Guests</p>
            <p className="text-xs mt-1" style={{ color: colors.mutedText, opacity: 0.7 }}>This month</p>
          </div>

          <div className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.borderColor}` }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(167, 119, 227, 0.1)' }}>
                <FiCreditCard className="w-6 h-6" style={{ color: colors.secondaryBg }}/>
              </div>
              <span className="text-2xl font-bold" style={{ color: colors.textColor }}>₹{d.billThisMonth}</span>
            </div>
            <p className="text-sm font-medium" style={{ color: colors.mutedText }}>Current Bill</p>
            <div className="flex items-center gap-1 mt-1">
              <FiCheck className="w-3 h-3" style={{ color: colors.accent || '#10b981' }} />
              <p className="text-xs font-medium" style={{ color: colors.accent || '#10b981' }}>{d.billStatus.toUpperCase()}</p>
            </div>
          </div>

          <div className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.borderColor}` }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)' }}>
                <FiTruck className="w-6 h-6" style={{ color: '#f97316' }}/>
              </div>
              <span className="text-lg font-bold" style={{ color: colors.textColor }}>{d.nextSupplyTime}</span>
            </div>
            <p className="text-sm font-medium" style={{ color: colors.mutedText }}>Next Supply</p>
            <p className="text-xs mt-1" style={{ color: colors.mutedText, opacity: 0.7 }}>
              {d.hoursUntilNext > 0 && `In ${d.hoursUntilNext} hour${d.hoursUntilNext > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 rounded-2xl p-8 shadow-lg" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.borderColor}` }}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textColor }}>Today's Guest Details</h3>
              {guestData.length > 0 ? (
                <div className="space-y-4">
                  {guestData.filter(guest => guest.status.toLowerCase() === 'accepted').length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-3" style={{ color: colors.accent || '#10b981' }}>Accepted Guests</h4>
                      <div className="space-y-3">
                        {guestData.filter(guest => guest.status.toLowerCase() === 'accepted').map((guest, index) => (
                          <div key={index} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: `1px solid ${colors.accent || '#10b981'}` }}>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden"><img src={guest.userProfilePhoto} alt={guest.userName} className="w-full h-full object-cover"/></div>
                              <div>
                                <div className="font-medium" style={{ color: colors.textColor }}>{guest.userName}</div>
                                <div className="text-xs" style={{ color: colors.mutedText }}>{guest.userId}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-sm" style={{ color: colors.textColor }}>{formatTime(guest.arrivalTime)}</div>
                              <div className="text-xs" style={{ color: colors.mutedText }}>{guest.stayDuration} hour{guest.stayDuration > 1 ? 's' : ''} stay</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {guestData.filter(guest => guest.status.toLowerCase() === 'pending').length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-3" style={{ color: '#f59e0b' }}>Pending Guests</h4>
                      <div className="space-y-3">
                        {guestData.filter(guest => guest.status.toLowerCase() === 'pending').map((guest, index) => (
                          <div key={index} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b' }}>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden"><img src={guest.userProfilePhoto} alt={guest.userName} className="w-full h-full object-cover"/></div>
                              <div>
                                <div className="font-medium" style={{ color: colors.textColor }}>{guest.userName}</div>
                                <div className="text-xs" style={{ color: colors.mutedText }}>{guest.userId}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-sm" style={{ color: colors.textColor }}>{formatTime(guest.arrivalTime)}</div>
                              <div className="text-xs" style={{ color: colors.mutedText }}>{guest.stayDuration} hour{guest.stayDuration > 1 ? 's' : ''} stay</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8" style={{ color: colors.mutedText }}>
                  <FiUsers className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No guests invited for today</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textColor }}>Family Members Present Today</h3>
              {familyMembers.length > 0 ? (
                <div className="space-y-3">
                  {familyMembers.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: member.isSpecial ? 'rgba(110, 142, 251, 0.1)' : colors.hoverBg, borderColor: member.isSpecial ? colors.primaryBg : colors.borderColor }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden"><img src={member.userProfilePhoto} alt={member.userName} className="w-full h-full object-cover"/></div>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-medium" style={{ color: colors.textColor }}>{member.userName}</div>
                            {member.isSpecial && (
                              <div className="flex items-center">
                                <input type="checkbox" checked={member.isSpecial} readOnly className="w-4 h-4 rounded" style={{accentColor: colors.primaryBg}}/>
                                <label className="ml-1 text-xs font-medium" style={{ color: colors.primaryBg }}>Special</label>
                              </div>
                            )}
                          </div>
                          <div className="text-xs" style={{ color: colors.mutedText }}>ID: {member.userId}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8" style={{ color: colors.mutedText }}>
                  <FiUser className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Family has not registered for water today</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.borderColor}` }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(167, 119, 227, 0.1)' }}>
                  <FiFileText className="w-5 h-5" style={{ color: colors.secondaryBg }}/>
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: colors.textColor }}>Billing</h3>
                  <p className="text-xs" style={{ color: colors.mutedText }}>Current cycle</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: colors.hoverBg }}>
                  <span className="text-sm" style={{ color: colors.mutedText }}>Current Bill</span>
                  <span className="font-bold" style={{ color: colors.textColor }}>₹{d.billThisMonth}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: colors.hoverBg }}>
                  <span className="text-sm" style={{ color: colors.mutedText }}>Last Month</span>
                  <span className="font-bold" style={{ color: colors.textColor }}>₹{d.lastMonthBill}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                  <span className="text-sm" style={{ color: colors.mutedText }}>Status</span>
                  <div className="flex items-center gap-2">
                    <FiCheck className="w-4 h-4" style={{ color: colors.accent || '#10b981' }} />
                    <span className="font-bold" style={{ color: colors.accent || '#10b981' }}>{d.billStatus.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.borderColor}` }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)' }}>
                  <FiTruck className="w-5 h-5" style={{ color: '#f97316' }}/>
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: colors.textColor }}>Supply Schedule</h3>
                  <p className="text-xs" style={{ color: colors.mutedText }}>Today's timeline</p>
                </div>
              </div>

              <div className="space-y-3">
                {['8 AM', '12 PM', '3 PM'].map((time) => (
                  <div
                    key={time}
                    className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300`}
                    style={{
                      backgroundColor: time === d.nextSupplyTime ? 'rgba(110, 142, 251, 0.1)' : colors.hoverBg,
                      color: time === d.nextSupplyTime ? colors.primaryBg : colors.textColor,
                      border: time === d.nextSupplyTime ? `1px solid ${colors.primaryBg}` : '1px solid transparent'
                    }}
                  >
                    <span className="font-medium">{time}</span>
                    {time === d.nextSupplyTime && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium">NEXT</span>
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.primaryBg }}></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.borderColor}` }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: colors.textColor }}>Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-3 p-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105" style={{ backgroundColor: colors.hoverBg, color: colors.textColor, border: `1px solid ${colors.borderColor}`}}>
                  <FiFileText className="w-5 h-5" />
                  Payment History
                </button>
                <button className="w-full flex items-center justify-center gap-3 p-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105" style={{ backgroundColor: colors.hoverBg, color: colors.textColor, border: `1px solid ${colors.borderColor}` }}>
                  <FiSettings className="w-5 h-5" />
                  Manage Guests
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;