import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// project import
import userPool from 'utils/aws/cognito/userPool';

// ==============================|| AUTH GUARD ||============================== //

const AuthGuard = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const cognitoUser = userPool.getCurrentUser();

  useEffect(() => {
    const checkAuth = () => {
      if (cognitoUser) {
        cognitoUser.getSession((err, session) => {
          if (err || !session.isValid()) {
            navigate('/login', { state: { from: pathname } });
          } else if (pathname === '/login') {
            navigate('/', { state: { from: pathname } });
          }
        });
      } else {
        navigate('/login', { state: { from: pathname } });
      }
    };

    checkAuth();
  }, [pathname, navigate, cognitoUser]);

  return children || null;
};

export default AuthGuard;
