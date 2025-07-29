import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';

const UserIdRedirect = ({ children }) => {
  const { userid } = useParams();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState('');

  useEffect(() => {
    const checkAndRedirect = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.userId && parsed.userId !== userid) {
            const newPath = location.pathname.replace(`/u/${userid}`, `/u/${parsed.userId}`);
            setRedirectPath(newPath);
            setShouldRedirect(true);
          } else {
            setShouldRedirect(false);
          }
        } catch (e) {
          console.error('Invalid user in localStorage:', e);
        }
      }
    };

    checkAndRedirect();

    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        checkAndRedirect();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [userid, location.pathname]);

  if (shouldRedirect) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default UserIdRedirect;