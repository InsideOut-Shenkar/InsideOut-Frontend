// project import
import AWS from '../config';
import getCurrentUserAttributes from './getCurrentUserAttributes';

// ============================|| GET USER GROUP ||============================ //

/**
 * Get the current user's groups
 * @returns {Promise<Array>} - A promise that resolves to an array of group names
 */
const getUserGroup = async () => {
  try {
    const userAttributes = await getCurrentUserAttributes();

    const username = userAttributes['sub'];
    const userPoolId = process.env.REACT_APP_USER_POOL;

    const params = {
      UserPoolId: userPoolId,
      Username: username
    };

    const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
    const response = await cognitoIdentityServiceProvider.adminListGroupsForUser(params).promise();

    const groups = response.Groups.map((group) => group.GroupName);
    return groups;
  } catch (error) {
    console.error('Error fetching user group:', error);
    throw error;
  }
};

export default getUserGroup;
