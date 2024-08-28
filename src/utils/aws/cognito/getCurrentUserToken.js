import userPool from './userPool';

/**
 * Get the current user's session token
 * @returns {Promise<string>} - A promise that resolves to the session token
 */
const getCurrentUserToken = () => {
  return new Promise((resolve, reject) => {
    const currentUser = userPool.getCurrentUser();

    if (currentUser) {
      currentUser.getSession((err, session) => {
        if (err || !session) {
          reject(err || new Error('No current user session.'));
        } else {
          resolve(session.getIdToken().getJwtToken());
        }
      });
    } else {
      reject(new Error('No current user.'));
    }
  });
};

export default getCurrentUserToken;
