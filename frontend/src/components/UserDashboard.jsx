import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiUsers,
  FiPackage,
  FiBarChart2,
  FiMoon,
  FiSun,
  FiChevronLeft,
  FiChevronRight,
  FiUser
} from 'react-icons/fi';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';

const UserDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [userData, setUserData] = useState({ userName: '', userId: '' });
  const navigate = useNavigate();
  const { userid } = useParams();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData({
          userName: parsedUser.userName || '',
          userId: parsedUser.userId || '',
        });
      } catch (err) {
        console.error('Error parsing user from localStorage', err);
      }
    }
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const baseColor = darkMode ? '#1f1f2e' : '#f8f6ff';
  const textColor = darkMode ? '#ffffff' : '#4b0082';
  const cardBg = darkMode ? '#2a2a3d' : '#ffffff';
  const sidebarBg = darkMode
    ? 'linear-gradient(to bottom, #23233a, #3a3a5e)'
    : 'linear-gradient(to bottom, #6e8efb, #a777e3)';

  const styles = {
    mainContainer: {
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
      width: '100vw',
      borderRadius: '0',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      backgroundColor: cardBg,
      position: 'relative',
      fontFamily: "'Poppins', sans-serif",
      color: textColor,
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
      gap: '8px',
      justifyContent: 'space-between',
    },
    toggleBtn: {
      position: 'absolute',
      top: '20px',
      left: sidebarOpen ? '270px' : '20px',
      zIndex: 1000,
      cursor: 'pointer',
      fontSize: '24px',
      color: textColor,
      background: 'transparent',
      border: 'none',
      transition: 'left 0.3s ease',
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
      padding: '18px 15px',
      fontSize: '16px',
      cursor: 'pointer',
      display: sidebarOpen ? 'flex' : 'none',
      alignItems: 'center',
      borderRadius: '6px',
      transition: 'all 0.2s ease',
      fontWeight: '500',
    },
    icon: {
      marginRight: '15px',
      fontSize: '20px',
    },
    sidebarFooter: {
      marginTop: 'auto',
      paddingTop: '20px',
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#ffffff',
      textAlign: 'center',
      display: sidebarOpen ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: darkMode ? '#4a4a6a' : '#cdb8f2',
      borderRadius: '12px',
      padding: '10px',
      gap: '10px',
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
  };

  return (
    <div style={styles.mainContainer}>
      <button onClick={toggleSidebar} style={styles.toggleBtn}>
        {sidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
      </button>
      <button onClick={toggleDarkMode} style={styles.themeToggle}>
        {darkMode ? <FiSun /> : <FiMoon />}
      </button>

      <div style={styles.sidebar}>
        <div>
          <div style={styles.menuItem} onClick={() => navigate(`/u/${userid}`)}>
            <span style={styles.icon}>🏠</span> Dashboard
          </div>
          <div style={styles.menuItem} onClick={() => navigate(`/u/${userid}/water-registration`)}>
            <FiPlus style={styles.icon} /> Register for Water
          </div>
          <div style={styles.menuItem}>
            <FiUsers style={styles.icon} /> Manage Members & Guests
          </div>
          <div style={styles.menuItem}>
            <FiPackage style={styles.icon} /> Add Property
          </div>
          <div style={styles.menuItem}>
            <FiBarChart2 style={styles.icon} /> Usage Insights
          </div>
        </div>
        <div style={styles.sidebarFooter}>
          <FiUser />
          <span style={{ fontSize: '17px' }}>{userData.userName || 'Guest'}</span>
        </div>
      </div>

      <div style={styles.mainPage}>
        <div style={styles.topBar}>
          <h2 style={styles.header}>Smart Water Dashboard</h2>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default UserDashboard;