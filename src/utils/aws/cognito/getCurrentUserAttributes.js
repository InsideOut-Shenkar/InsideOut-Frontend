// project import
import userPool from './userPool';

// ============================|| GET CURRENT USER DATA ||============================ //

/**
 * Get current user attributes
 * @returns {Promise<Object>} - A promise that resolves to an object containing user attributes
 */
const getCurrentUserAttributes = () => {
  return new Promise((resolve, reject) => {
    // Get the current user from the user pool
    const currentUser = userPool.getCurrentUser();

    if (currentUser) {
      // Get the session for the current user
      currentUser.getSession((err, session) => {
        if (err || !session) {
          reject(err || new Error('No current user.'));
        } else {
          // Get user attributes
          currentUser.getUserAttributes((err, attributes) => {
            if (err) {
              reject(err);
            } else {
              // Convert attributes array to an object
              const userAttributes = attributes.reduce((acc, attribute) => {
                acc[attribute.Name] = attribute.Value;
                return acc;
              }, {});
              resolve(userAttributes);
            }
          });
        }
      });
    } else {
      reject(new Error('No current user.'));
    }
  });
};

export default getCurrentUserAttributes;
