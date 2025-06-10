import React, { useState } from 'react';
import {
  FiPlus,
  FiUsers,
  FiPackage,
  FiBarChart2,
  FiDroplet,
  FiFileText,
  FiTruck,
  FiCreditCard,
  FiMenu,
  FiX,
  FiMoon,
  FiSun
} from 'react-icons/fi';

const UserDashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const baseColor = darkMode ? '#1f1f2e' : '#f8f6ff';
  const textColor = darkMode ? '#ffffff' : '#4b0082';
  const cardBg = darkMode ? '#2a2a3d' : '#ffffff';
  const sidebarBg = darkMode
    ? 'linear-gradient(to bottom, #23233a, #3a3a5e)'
    : 'linear-gradient(to bottom, #6e8efb, #a777e3)';

  const styles = {
    pageWrapper: {
      background: darkMode ? '#12121c' : 'linear-gradient(to right, #dfe9f3, #e7d9f8)',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '30px 10px',
      fontFamily: "'Poppins', sans-serif",
      color: textColor,
    },
    mainContainer: {
      display: 'flex',
      flexDirection: 'row',
      height:'100%',
      width: '100%',
      maxWidth: '1800px',
      height: '90vh',
      borderRadius: '5px',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      backgroundColor: cardBg,
      position: 'relative'
    },
    sidebar: {
      width: sidebarOpen ? '260px' : '0',
      background: sidebarBg,
      color: '#fff',
      padding: sidebarOpen ? '25px 20px' : '0',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      transition: 'width 0.3s ease',
      gap: '8px', // Added gap between menu items
    },
    toggleBtn: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      zIndex: 1000,
      cursor: 'pointer',
      fontSize: '24px',
      color: textColor,
      background: 'transparent',
      border: 'none',
    },
    themeToggle: {
      position: 'absolute',
      top: '20px',
      right: '30px',
      zIndex: 1000,
      cursor: 'pointer',
      fontSize: '22px',
      color: textColor,
      background: 'transparent',
      border: 'none',
    },
    menuItem: {
      padding: '18px 15px', // Increased padding
      fontSize: '16px', // Increased font size
      cursor: 'pointer',
      display: sidebarOpen ? 'flex' : 'none',
      alignItems: 'center',
      borderRadius: '6px', // Added border radius
      transition: 'all 0.2s ease',
      fontWeight: '500', // Added font weight
      ':hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.15)', // Hover effect
      },
    },
    icon: {
      marginRight: '15px', // Increased spacing
      fontSize: '20px', // Increased icon size
    },
    mainPage: {
      flexGrow: 1,
      padding: '30px',
      backgroundColor: baseColor,
      minWidth: 0,
      flex: 1,
    },
    topBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginBottom: '30px',
    },
    header: {
      fontSize: '26px',
      fontWeight: 600,
    },
    userIconBox: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      backgroundColor: darkMode ? '#3a3a5e' : '#eee6fb',
      padding: '8px 12px',
      borderRadius: '20px',
    },
    userIcon: {
      width: '35px',
      height: '35px',
      borderRadius: '50%',
      backgroundColor: '#a777e3',
    },
    welcomeText: {
      fontSize: '14px',
      fontWeight: '500',
      color: textColor,
    },
    cardsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '40px',
    },
    card: {
      backgroundColor: cardBg,
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '200px',
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
    },
    cardIcon: {
      fontSize: '28px',
      marginRight: '12px',
      color: '#6e8efb',
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: 600,
    },
    cardText: {
      fontSize: '16px',
      marginTop: '10px',
      lineHeight: '1.5',
    },
    payButton: {
      marginTop: '25px',
      padding: '12px 20px',
      backgroundImage: 'linear-gradient(to right, #6e8efb, #a777e3)',
      border: 'none',
      borderRadius: '6px',
      color: '#fff',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '15px',
      alignSelf: 'flex-start',
    },
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.mainContainer}>
        <button onClick={toggleSidebar} style={styles.toggleBtn}>
          {sidebarOpen ? <FiX /> : <FiMenu />}
        </button>
        <button onClick={toggleDarkMode} style={styles.themeToggle}>
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>

        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.menuItem}>
            <span style={styles.icon}>🏠</span> Dashboard
          </div>
          <div style={styles.menuItem} onClick={() => setActivePage('register')}>
            <FiPlus style={styles.icon} /> Register for Water
          </div>
          <div style={styles.menuItem} onClick={() => setActivePage('members')}>
            <FiUsers style={styles.icon} /> Manage Members & Guests
          </div>
          <div style={styles.menuItem} onClick={() => setActivePage('supply')}>
            <FiPackage style={styles.icon} /> Request Additional Supply
          </div>
          <div style={styles.menuItem} onClick={() => setActivePage('insights')}>
            <FiBarChart2 style={styles.icon} /> Usage Insights
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.mainPage}>
          <div style={styles.topBar}>
            <div>
              <h2 style={styles.header}>Smart Water Dashboard</h2>
              <p style={styles.welcomeText}>Welcome, Sneha Mandal</p>
            </div>
            <div style={styles.userIconBox}>
              <div style={styles.userIcon}></div>
              <span>Username</span>
            </div>
          </div>

          <div style={styles.cardsGrid}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <FiDroplet style={styles.cardIcon} />
                <h3 style={styles.cardTitle}>Current Usage</h3>
              </div>
              <p style={styles.cardText}>Water used this week: 1200L</p>
              <p style={styles.cardText}>Daily average: 170L</p>
              <p style={styles.cardText}>Remaining quota: 300L</p>
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <FiFileText style={styles.cardIcon} />
                <h3 style={styles.cardTitle}>Outstanding Bill</h3>
              </div>
              <p style={styles.cardText}>Due Amount: ₹650</p>
              <p style={styles.cardText}>Due Date: 15th June</p>
              <p style={styles.cardText}>Status: Unpaid</p>
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <FiTruck style={styles.cardIcon} />
                <h3 style={styles.cardTitle}>Upcoming Supply</h3>
              </div>
              <p style={styles.cardText}>Next: 12th June</p>
              <p style={styles.cardText}>Slot: 10 AM - 12 PM</p>
              <p style={styles.cardText}>Note: Bring container</p>
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <FiCreditCard style={styles.cardIcon} />
                <h3 style={styles.cardTitle}>Payment</h3>
              </div>
              <button style={styles.payButton}>Pay Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;