import { useNavigate } from 'react-router-dom';

// project import
import userPool from './aws/cognito/userPool';

// ==============================|| LOGOUT HOOK ||============================== //

const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    const cognitoUser = userPool.getCurrentUser();

    if (cognitoUser) {
      cognitoUser.signOut();
      console.log('User has been logged out.');
    }
    // Redirect to login page
    navigate('/login');
  };

  return logout;
};

export default useLogout;
