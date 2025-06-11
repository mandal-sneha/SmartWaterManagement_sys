import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../lib/axios.js';
import {
  FiDroplet, FiFileText, FiTruck, FiCreditCard, FiUsers
} from 'react-icons/fi';
import desertCactus from '../../assets/desert-cactus.svg';

const DashboardHome = () => {
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

  const styles = {
    pageWrapper: {
      backgroundColor: '#f9f9fb',
      minHeight: '100vh',
      padding: '40px'
    },
    cardsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '40px',
    },
    card: {
      background: '#fff',
      padding: '30px',
      borderRadius: '16px',
      boxShadow: '0px 4px 16px rgba(0,0,0,0.06)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '220px',
      position: 'relative',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      borderTop: '4px solid #a777e3',
    },
    cardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0px 8px 20px rgba(0,0,0,0.08)',
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px'
    },
    cardIcon: {
      fontSize: '30px',
      marginRight: '14px',
      color: '#6e8efb'
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: 700
    },
    cardText: {
      fontSize: '16px',
      marginTop: '10px',
      lineHeight: '1.6',
      color: '#333'
    },
    payButton: {
      padding: '12px 20px',
      backgroundImage: 'linear-gradient(to right, #6e8efb, #a777e3)',
      border: 'none',
      borderRadius: '6px',
      color: '#fff',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '15px',
      alignSelf: 'flex-start',
      marginTop: '25px'
    },
    loadingText: {
      textAlign: 'center',
      fontSize: '18px',
      color: '#666'
    },
    errorText: {
      textAlign: 'center',
      fontSize: '18px',
      color: '#e74c3c'
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '60px',
      color: '#555'
    },
    emptyImage: {
      width: '220px',
      height: 'auto',
      marginBottom: '30px'
    },
    emptyText: {
      fontSize: '20px',
      fontWeight: 500,
      textAlign: 'center',
      maxWidth: '500px',
      lineHeight: '1.6'
    }
  };

  if (loading) return <div style={styles.loadingText}>Loading dashboard...</div>;
  if (error) return <div style={styles.errorText}>{error}</div>;

  if (dashboardData.hasWaterId === false) {
    return (
      <div style={styles.emptyState}>
        <img src={desertCactus} alt="Empty Home" style={styles.emptyImage} />
        <p style={styles.emptyText}>
          Your dashboard is empty. To get started, <strong>join a house as a tenant</strong> or <strong>add your own property</strong> to begin tracking water usage and billing.
        </p>
      </div>
    );
  }

  const d = dashboardData;
  const renderCard = (icon, title, content, extra = null) => (
    <div
      style={styles.card}
      onMouseEnter={e => Object.assign(e.currentTarget.style, styles.cardHover)}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = styles.card.boxShadow;
      }}
    >
      <div style={styles.cardHeader}>
        {icon}
        <h3 style={styles.cardTitle}>{title}</h3>
      </div>
      {content}
      {extra}
    </div>
  );

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.cardsGrid}>
        {renderCard(
          <FiDroplet style={styles.cardIcon} />,
          'Current Usage',
          <>
            <p style={styles.cardText}>Water used this month: <strong>{d.waterUsedThisMonth}L</strong></p>
            <p style={styles.cardText}>Water used this week: <strong>{d.waterUsedThisWeek}L</strong></p>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
              <FiUsers style={{ marginRight: '8px', color: '#6e8efb' }} />
              <span style={styles.cardText}>Guests this month: <strong>{d.guestsThisMonth}</strong></span>
            </div>
          </>
        )}

        {renderCard(
          <FiFileText style={styles.cardIcon} />,
          'Bill Information',
          <>
            <p style={styles.cardText}>This month bill: ₹<strong>{d.billThisMonth}</strong></p>
            <p style={styles.cardText}>Last month bill: ₹<strong>{d.lastMonthBill}</strong></p>
            <p style={styles.cardText}>
              Status: <span style={{ color: d.billStatus === 'paid' ? '#27ae60' : '#e74c3c' }}>
                {d.billStatus.toUpperCase()}
              </span>
            </p>
            {d.billStatus === 'unpaid' && (
              <p style={styles.cardText}>Due Date: {new Date(d.dueDate).toLocaleDateString()}</p>
            )}
          </>
        )}

        {renderCard(
          <FiTruck style={styles.cardIcon} />,
          'Upcoming Supply',
          <>
            <p style={styles.cardText}>Next supply at: <strong>{d.nextSupplyTime}</strong></p>
            <p style={styles.cardText}>
              {d.hoursUntilNext > 0
                ? `${d.hoursUntilNext} hour(s) from now`
                : 'Supply time has passed for today'}
            </p>
            <p style={styles.cardText}>Available times: 8 AM, 12 PM, 3 PM</p>
          </>
        )}

        {renderCard(
          <FiCreditCard style={styles.cardIcon} />,
          'Payment',
          <p style={styles.cardText}>Current month due: ₹<strong>{d.billThisMonth}</strong></p>,
          <button style={styles.payButton}>Pay Now</button>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;