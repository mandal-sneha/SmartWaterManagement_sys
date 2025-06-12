import React, { useState, useEffect, createContext, useContext } from 'react';
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

export const ThemeContext = createContext();

export const ThemeProvider = ({ children, darkMode, toggleDarkMode }) => {
  const themeConfig = {
    darkMode,
    toggleDarkMode,
    colors: {
      baseColor: darkMode ? '#1f1f2e' : '#f8f6ff',
      textColor: darkMode ? '#ffffff' : '#4b0082',
      cardBg: darkMode ? '#2a2a3d' : '#ffffff',
      sidebarBg: darkMode
        ? 'linear-gradient(to bottom, #23233a, #3a3a5e)'
        : 'linear-gradient(to bottom, #6e8efb, #a777e3)',
      primaryBg: darkMode ? '#3a3a5e' : '#6e8efb',
      secondaryBg: darkMode ? '#4a4a6a' : '#cdb8f2',
      hoverBg: darkMode ? '#4a4a6a' : 'rgba(255, 255, 255, 0.2)',
      borderColor: darkMode ? '#4a4a6a' : '#e0e0e0',
      mutedText: darkMode ? '#a0a0a0' : '#666666'
    }
  };

  return (
    <ThemeContext.Provider value={themeConfig}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const UserDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });
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

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

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
      padding: '8px',
      borderRadius: '50%',
      transition: 'all 0.2s ease',
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
    <ThemeProvider darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <div style={styles.mainContainer}>
        <button onClick={toggleSidebar} style={styles.toggleBtn}>
          {sidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
        </button>
        <button 
          onClick={toggleDarkMode} 
          style={styles.themeToggle}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
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
            <div style={styles.menuItem} onClick={() => navigate(`/u/${userid}/add-property`)}>
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
    </ThemeProvider>
  );
};

export default UserDashboard;