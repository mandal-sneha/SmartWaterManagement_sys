import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../lib/axios.js';
import {
  FiDroplet, FiFileText, FiTruck, FiCreditCard, FiUsers
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

  if (loading) return <div className="text-center text-gray-400">Loading dashboard...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  if (dashboardData.hasWaterId === false) {
    return (
      <div className="flex flex-col items-center justify-center mt-16" style={{ color: colors.mutedText }}>
        <img src={desertCactus} alt="Empty Home" className="w-56 mb-8" />
        <p className="text-xl font-medium text-center max-w-md">
          Your dashboard is empty. To get started, <strong>join a house as a tenant</strong> or <strong>add your own property</strong> to begin tracking water usage and billing.
        </p>
      </div>
    );
  }

  const d = dashboardData;

  const Card = ({ icon, title, children, action }) => (
    <div
      className="rounded-xl p-6 transition-transform hover:-translate-y-1 hover:shadow-lg border"
      style={{
        backgroundColor: colors.cardBg,
        color: colors.textColor,
        borderColor: colors.borderColor,
        boxShadow: darkMode ? '0 4px 8px rgba(0,0,0,0.4)' : '0 4px 8px rgba(0,0,0,0.1)',
        borderTopWidth: '4px',
        borderTopColor: colors.primaryBg
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="text-2xl" style={{ color: colors.primaryBg }}>{icon}</div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="text-sm space-y-2">{children}</div>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );

  return (
    <div
      className="min-h-screen px-6 py-8"
      style={{
        backgroundColor: colors.baseColor,
        color: colors.textColor
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
        <Card icon={<FiDroplet />} title="Current Usage">
          <p>Water used this month: <strong>{d.waterUsedThisMonth}L</strong></p>
          <p>Water used this week: <strong>{d.waterUsedThisWeek}L</strong></p>
          <div className="flex items-center gap-2">
            <FiUsers />
            <span>Guests this month: <strong>{d.guestsThisMonth}</strong></span>
          </div>
        </Card>

        <Card icon={<FiFileText />} title="Bill Information">
          <p>This month bill: ₹<strong>{d.billThisMonth}</strong></p>
          <p>Last month bill: ₹<strong>{d.lastMonthBill}</strong></p>
          <p>Status: <span className={d.billStatus === 'paid' ? 'text-green-400' : 'text-red-400'}>{d.billStatus.toUpperCase()}</span></p>
          {d.billStatus === 'unpaid' && (
            <p>Due Date: {new Date(d.dueDate).toLocaleDateString()}</p>
          )}
        </Card>

        <Card icon={<FiTruck />} title="Upcoming Supply">
          <p>Next supply at: <strong>{d.nextSupplyTime}</strong></p>
          <p>{d.hoursUntilNext > 0 ? `${d.hoursUntilNext} hour(s) from now` : 'Supply time has passed for today'}</p>
          <p>Available times: 8 AM, 12 PM, 3 PM</p>
        </Card>

        <Card
          icon={<FiCreditCard />}
          title="Payment"
          action={
            <button
              className="px-5 py-2 rounded-md text-sm font-semibold transition-colors"
              style={{
                backgroundColor: colors.primaryBg,
                color: '#fff'
              }}
            >
              Pay Now
            </button>
          }
        >
          <p>Current month due: ₹<strong>{d.billThisMonth}</strong></p>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;