import React, {
  useState,
  useEffect,
  createContext,
  useContext
} from 'react';
import {
  FiPlus,
  FiUsers,
  FiPackage,
  FiBarChart2,
  FiMoon,
  FiSun,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiMail
} from 'react-icons/fi';
import { Outlet, useNavigate, useParams, useLocation } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const value = {
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
      hoverBg: 'rgba(255, 255, 255, 0.1)',
      borderColor: darkMode ? '#4a4a6a' : '#e0e0e0',
      mutedText: darkMode ? '#a0a0a0' : '#666666',
      activeBg: darkMode ? '#4a4a6a' : '#e2dcff'
    }
  };

  return (
    <ThemeContext.Provider value={value}>
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
  const [userData, setUserData] = useState({
    userName: '',
    userId: '',
    waterId: ''
  });

  const { userid } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const isWaterIdEmpty = !userData.waterId || userData.waterId.trim() === '';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserData({
          userName: parsed.userName || '',
          userId: parsed.userId || '',
          waterId: parsed.waterId || ''
        });
      } catch (e) {
        console.error('Invalid user in localStorage:', e);
      }
    }
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const DisabledTooltip = ({ children, message }) => (
    <div className="relative group">
      {children}
      <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 top-1/2 transform -translate-y-1/2">
        {message}
        <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-800"></div>
      </div>
    </div>
  );

  const isActiveRoute = (route) => location.pathname === route;

  const MenuItem = ({ icon, label, route, disabled = false, tooltipMessage = '' }) => {
    const content = (
      <div
        className={`p-4 text-base flex items-center gap-4 rounded-md font-medium transition-all duration-200 ${
          disabled
            ? 'text-gray-400 cursor-not-allowed opacity-60'
            : 'cursor-pointer'
        }`}
        style={{
          color: disabled
            ? theme.colors.mutedText
            : theme.colors.textColor,
          backgroundColor: isActiveRoute(route)
            ? theme.colors.activeBg
            : 'transparent'
        }}
        onClick={() => !disabled && route && navigate(route)}
        onMouseEnter={(e) => {
          if (!disabled && !isActiveRoute(route)) {
            e.currentTarget.style.background = theme.colors.hoverBg;
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !isActiveRoute(route)) {
            e.currentTarget.style.background = 'transparent';
          }
        }}
      >
        <span className="text-xl">{icon}</span>
        {sidebarOpen && label}
      </div>
    );

    return disabled ? (
      <DisabledTooltip message={tooltipMessage}>{content}</DisabledTooltip>
    ) : (
      content
    );
  };

  return (
    <div
      className="flex flex-row h-screen w-screen overflow-hidden shadow-2xl relative font-sans"
      style={{
        backgroundColor: theme.colors.baseColor,
        color: theme.colors.textColor
      }}
    >
      <button
        onClick={toggleSidebar}
        className="absolute top-5 z-50 bg-transparent border-none text-2xl transition-all duration-300"
        style={{
          left: sidebarOpen ? '270px' : '20px',
          color: theme.colors.textColor
        }}
      >
        {sidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
      </button>

      <button
        onClick={theme.toggleDarkMode}
        className="absolute top-5 right-8 z-50 bg-transparent border-none text-xl p-2 rounded-full transition-all duration-200"
        style={{
          color: theme.colors.textColor
        }}
        title={theme.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {theme.darkMode ? <FiSun /> : <FiMoon />}
      </button>

      <div
        className="flex flex-col flex-shrink-0 transition-all duration-300 gap-2 justify-between"
        style={{
          width: sidebarOpen ? '256px' : '0',
          padding: sidebarOpen ? '1.5rem' : '0',
          background: theme.colors.sidebarBg
        }}
      >
        <div className="flex flex-col gap-2">
          <MenuItem icon={<FiBarChart2 />} label="Dashboard" route={`/u/${userid}`} />
          <MenuItem icon={<FiPackage />} label="Add Property" route={`/u/${userid}/add-property`} />
          <MenuItem
            icon={<FiUsers />}
            label="Manage Members & Guests"
            disabled={isWaterIdEmpty}
            tooltipMessage="Please add a property or join as a tenant to access this feature"
          />
          <MenuItem
            icon={<FiPlus />}
            label="Register for Water"
            disabled={isWaterIdEmpty}
            tooltipMessage="Please add a property or join as a tenant to access this feature"
            route={`/u/${userid}/water-registration`}
          />
          <MenuItem
            icon={<FiBarChart2 />}
            label="Usage Insights"
            disabled={isWaterIdEmpty}
            tooltipMessage="Please add a property or join as a tenant to access this feature"
          />
          <MenuItem
            icon={<FiMail />}
            label="View Invitations"
            route={`/u/${userid}/invitations`}
          />
        </div>

        <div
          className="mt-auto pt-5 text-base font-bold text-center flex items-center justify-center rounded-xl p-3 gap-3"
          style={{
            display: sidebarOpen ? 'flex' : 'none',
            backgroundColor: theme.colors.secondaryBg,
            color: theme.colors.textColor
          }}
        >
          <FiUser />
          <span className="text-lg">{userData.userName || 'Guest'}</span>
        </div>
      </div>

      <div className="flex-grow p-8 min-w-0 flex-1" style={{ backgroundColor: theme.colors.baseColor }}>
        <div className="flex justify-between items-center flex-wrap mb-8">
          <h2 className="text-3xl font-semibold" style={{ color: theme.colors.textColor }}>
            Smart Water Dashboard
          </h2>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default UserDashboard;