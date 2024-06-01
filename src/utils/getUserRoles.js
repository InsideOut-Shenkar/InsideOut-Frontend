// project import
import getUserGroups from './aws/cognito/getUserGroups';

// ============================|| GET USER ROLES ||============================ //

/**
 * Get current user roles
 * @returns {Promise<Array>} - A promise that resolves to an array of user roles
 */
const getUserRoles = async () => {
  try {
    const userGroups = await getUserGroups();
    const roles = userGroups.map((group) => {
      switch (group) {
        case 'insideout-admins':
          return 'Admin';
        case 'insideout-doctors':
          return 'Doctor';
        default:
          return 'User';
      }
    });

    // Remove duplicates
    return [...new Set(roles)];
  } catch (error) {
    console.error('Error fetching user roles:', error);
    throw error;
  }
};

export default getUserRoles;
