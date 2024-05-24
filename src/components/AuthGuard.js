import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// ==============================|| AUTH GUARD ||============================== //
const AuthGuard = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get('jwt');
      if (!token) {
        // Redirect to login page if the token is not found or expired
        navigate('/login');
      }
    };

    checkAuth();
  }, [pathname, navigate]);

  return children || null;
};

export default AuthGuard;
