import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../lib/axios.js';
import {
  FiDroplet, 
  FiFileText, 
  FiTruck, 
  FiCreditCard, 
  FiUsers,
  FiTrendingUp,
  FiCalendar,
  FiCheck,
  FiAlertCircle,
  FiPlus
} from 'react-icons/fi';
import { useTheme } from '../UserDashboard';
import desertCactus from '../../assets/desert-cactus.svg';

const DashboardHome = () => {
  const { darkMode, colors } = useTheme();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const userObject = localStorage.getItem('user');
        const userId = userObject ? JSON.parse(userObject).userId : localStorage.getItem('userId');
        if (!userId) throw new Error('User ID not found');
        const { data } = await axiosInstance.get(`/user/${userId}/dashboard`);
        setDashboardData(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: darkMode ? '#1a1a1a' : '#f8fafc' }}>
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" 
               style={{ 
                 borderColor: darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)',
                 borderTopColor: colors.primaryBg 
               }}></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-pulse mx-auto" 
               style={{ borderBottomColor: colors.accent }}></div>
        </div>
        <p className="text-lg font-medium" style={{ color: colors.textColor }}>Loading your dashboard...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center" 
         style={{ backgroundColor: darkMode ? '#1a1a1a' : '#fef2f2' }}>
      <div className="text-center rounded-2xl p-8 shadow-lg" style={{ backgroundColor: colors.baseColor }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" 
             style={{ backgroundColor: darkMode ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2' }}>
          <FiAlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-lg font-medium" style={{ color: colors.textColor }}>{error}</p>
      </div>
    </div>
  );

  if (dashboardData?.hasWaterId === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" 
           style={{ backgroundColor: darkMode ? '#0f172a' : '#f1f5f9' }}>
        <div className="rounded-3xl p-12 shadow-xl max-w-md" style={{ backgroundColor: colors.baseColor }}>
          <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8" 
               style={{ backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe' }}>
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
    <div className="min-h-screen" style={{ backgroundColor: darkMode ? '#0f172a' : '#f8fafc' }}>
      {/* Header */}
      <div className="shadow-sm border-b" 
           style={{ 
             backgroundColor: colors.baseColor,
             borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
           }}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            {/* <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                 style={{ backgroundColor: colors.primaryBg }}>
              <FiDroplet className="w-8 h-8 text-white" />
            </div> */}
            {/* <h1 className="text-4xl font-bold mb-2" style={{ color: colors.textColor }}>
              Water Dashboard
            </h1> */}
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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
               style={{ backgroundColor: colors.baseColor }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                   style={{ backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe' }}>
                <FiDroplet className="w-6 h-6" style={{ color: colors.primaryBg }} />
              </div>
              <span className="text-2xl font-bold" style={{ color: colors.textColor }}>{d.waterUsedThisMonth}L</span>
            </div>
            <p className="text-sm font-medium" style={{ color: colors.mutedText }}>Water Used</p>
            <p className="text-xs mt-1" style={{ color: colors.mutedText, opacity: 0.7 }}>This month</p>
          </div>

          <div className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
               style={{ backgroundColor: colors.baseColor }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                   style={{ backgroundColor: darkMode ? 'rgba(34, 197, 94, 0.2)' : '#dcfce7' }}>
                <FiUsers className="w-6 h-6" style={{ color: colors.accent || '#22c55e' }} />
              </div>
              <span className="text-2xl font-bold" style={{ color: colors.textColor }}>{d.guestsThisMonth}</span>
            </div>
            <p className="text-sm font-medium" style={{ color: colors.mutedText }}>Guests</p>
            <p className="text-xs mt-1" style={{ color: colors.mutedText, opacity: 0.7 }}>This month</p>
          </div>

          <div className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
               style={{ backgroundColor: colors.baseColor }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                   style={{ backgroundColor: darkMode ? 'rgba(168, 85, 247, 0.2)' : '#f3e8ff' }}>
                <FiCreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold" style={{ color: colors.textColor }}>₹{d.billThisMonth}</span>
            </div>
            <p className="text-sm font-medium" style={{ color: colors.mutedText }}>Current Bill</p>
            <div className="flex items-center gap-1 mt-1">
              <FiCheck className="w-3 h-3" style={{ color: colors.accent || '#22c55e' }} />
              <p className="text-xs font-medium" style={{ color: colors.accent || '#22c55e' }}>
                {d.billStatus.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
               style={{ backgroundColor: colors.baseColor }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                   style={{ backgroundColor: darkMode ? 'rgba(249, 115, 22, 0.2)' : '#fed7aa' }}>
                <FiTruck className="w-6 h-6 text-orange-600" />
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
          {/* Water Usage Chart */}
          <div className="lg:col-span-2 rounded-2xl p-8 shadow-lg" style={{ backgroundColor: colors.baseColor }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textColor }}>Today's Water Allocation</h2>
                <p style={{ color: colors.mutedText }}>Daily water distribution and usage</p>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.mutedText }}>
                <FiDroplet className="w-4 h-4" />
                <span>Today</span>
              </div>
            </div>
            
            {/* Daily Water Allocation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 rounded-xl" 
                   style={{ backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.1)' : '#f0f9ff' }}>
                <div className="text-3xl font-bold mb-2" style={{ color: colors.primaryBg }}>
                  {d.dailyWaterAllocation || '500'}L
                </div>
                <div className="text-sm font-medium" style={{ color: colors.mutedText }}>Daily Allocation</div>
                <div className="text-xs mt-1" style={{ color: colors.mutedText, opacity: 0.7 }}>Base quota</div>
              </div>
              
              <div className="text-center p-6 rounded-xl" 
                   style={{ backgroundColor: darkMode ? 'rgba(34, 197, 94, 0.1)' : '#f0fdf4' }}>
                <div className="text-3xl font-bold mb-2" style={{ color: colors.accent || '#22c55e' }}>
                  {d.todayGuests || 3}
                </div>
                <div className="text-sm font-medium" style={{ color: colors.mutedText }}>Today's Guests</div>
                <div className="text-xs mt-1" style={{ color: colors.mutedText, opacity: 0.7 }}>Invited today</div>
              </div>
              
              <div className="text-center p-6 rounded-xl" 
                   style={{ backgroundColor: darkMode ? 'rgba(249, 115, 22, 0.1)' : '#fff7ed' }}>
                <div className="text-3xl font-bold mb-2 text-orange-600">
                  {d.extraWaterRequested || '200'}L
                </div>
                <div className="text-sm font-medium" style={{ color: colors.mutedText }}>Extra Water</div>
                <div className="text-xs mt-1" style={{ color: colors.mutedText, opacity: 0.7 }}>Requested</div>
              </div>
            </div>

            {/* Guest Details */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textColor }}>Today's Guest Details</h3>
              <div className="space-y-3">
                {(d.guestDetails || [
                  { name: 'Rajesh Kumar', waterAllocation: '60L', timeSlot: '9:00 AM - 1:00 PM',  },
                  { name: 'Priya Sharma', waterAllocation: '45L', timeSlot: '2:00 PM - 5:00 PM',  },
                  { name: 'Amit Singh', waterAllocation: '75L', timeSlot: '6:00 PM - 9:00 PM',  }
                ]).map((guest, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border"
                       style={{ 
                         backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                         borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                       }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center"
                           style={{ backgroundColor: colors.accent || '#22c55e' }}>
                        <FiUsers className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium" style={{ color: colors.textColor }}>{guest.name}</div>
                        <div className="text-xs" style={{ color: colors.mutedText }}>{guest.timeSlot}</div>
                        <div className="text-xs" style={{ color: colors.mutedText, opacity: 0.7 }}>{guest.phone}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg" style={{ color: colors.textColor }}>{guest.waterAllocation}</div>
                      <div className="text-xs" style={{ color: colors.mutedText }}>Allocated</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Extra Water Requests */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textColor }}>Extra Water Requests</h3>
              <div className="space-y-3">
                {(d.extraWaterRequests || [
                  { reason: 'Additional bathroom cleaning', amount: '80L', time: '11:30 AM', status: 'approved', requestedBy: 'House Owner' },
                  { reason: 'Garden watering & plant care', amount: '70L', time: '3:15 PM', status: 'approved', requestedBy: 'Gardener' },
                  { reason: 'Car washing', amount: '50L', time: '5:45 PM', status: 'pending', requestedBy: 'Rajesh Kumar' }
                ]).map((request, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border"
                       style={{ 
                         backgroundColor: darkMode ? 'rgba(249, 115, 22, 0.1)' : '#fff7ed',
                         borderColor: request.status === 'approved' ? (colors.accent || '#22c55e') : '#f59e0b'
                       }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center"
                           style={{ backgroundColor: request.status === 'approved' ? (colors.accent || '#22c55e') : '#f59e0b' }}>
                        <FiPlus className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium" style={{ color: colors.textColor }}>{request.reason}</div>
                        <div className="text-xs" style={{ color: colors.mutedText }}>Requested by {request.requestedBy}</div>
                        <div className="text-xs" style={{ color: colors.mutedText, opacity: 0.7 }}>At {request.time}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-orange-600">{request.amount}</div>
                      <div className={`text-xs font-medium px-2 py-1 rounded ${
                        request.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {request.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Total Extra Water Summary */}
              <div className="mt-4 p-4 rounded-lg border-2 border-dashed"
                   style={{ 
                     backgroundColor: darkMode ? 'rgba(249, 115, 22, 0.05)' : '#fef3c7',
                     borderColor: '#f59e0b'
                   }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold" style={{ color: colors.textColor }}>Total Extra Water Today</div>
                    <div className="text-xs" style={{ color: colors.mutedText }}>Approved: 150L • Pending: 50L</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">200L</div>
                    <div className="text-xs" style={{ color: colors.mutedText }}>Additional</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Billing Card */}
            <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: colors.baseColor }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                     style={{ backgroundColor: darkMode ? 'rgba(168, 85, 247, 0.2)' : '#f3e8ff' }}>
                  <FiFileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: colors.textColor }}>Billing</h3>
                  <p className="text-xs" style={{ color: colors.mutedText }}>Current cycle</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg" 
                     style={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
                  <span className="text-sm" style={{ color: colors.mutedText }}>Current Bill</span>
                  <span className="font-bold" style={{ color: colors.textColor }}>₹{d.billThisMonth}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg" 
                     style={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
                  <span className="text-sm" style={{ color: colors.mutedText }}>Last Month</span>
                  <span className="font-bold" style={{ color: colors.textColor }}>₹{d.lastMonthBill}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg" 
                     style={{ backgroundColor: darkMode ? 'rgba(34, 197, 94, 0.1)' : '#f0fdf4' }}>
                  <span className="text-sm" style={{ color: colors.mutedText }}>Status</span>
                  <div className="flex items-center gap-2">
                    <FiCheck className="w-4 h-4" style={{ color: colors.accent || '#22c55e' }} />
                    <span className="font-bold" style={{ color: colors.accent || '#22c55e' }}>
                      {d.billStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              
              {d.billStatus === 'unpaid' && (
                <button className="w-full mt-6 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        style={{ backgroundColor: colors.primaryBg }}>
                  Pay Now
                </button>
              )}
            </div>

            {/* Water Supply Schedule */}
            <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: colors.baseColor }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                     style={{ backgroundColor: darkMode ? 'rgba(249, 115, 22, 0.2)' : '#fed7aa' }}>
                  <FiTruck className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: colors.textColor }}>Supply Schedule</h3>
                  <p className="text-xs" style={{ color: colors.mutedText }}>Today's timeline</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {['8 AM', '12 PM', '3 PM'].map((time, index) => (
                  <div 
                    key={time}
                    className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300`}
                    style={{
                      backgroundColor: time === d.nextSupplyTime 
                        ? colors.primaryBg
                        : darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                      color: time === d.nextSupplyTime ? '#fff' : colors.textColor
                    }}
                  >
                    <span className="font-medium">{time}</span>
                    {time === d.nextSupplyTime && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium">NEXT</span>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: colors.baseColor }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: colors.textColor }}>Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-3 p-3 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        style={{ backgroundColor: colors.primaryBg }}>
                  <FiUsers className="w-5 h-5" />
                  Manage Guests
                </button>
                <button className="w-full flex items-center justify-center gap-3 p-3 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        style={{ backgroundColor: colors.accent || '#22c55e' }}>
                  <FiCreditCard className="w-5 h-5" />
                  Payment History
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