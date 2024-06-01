// project import
import userPool from 'utils/aws/cognito/userPool';

export const checkUserRole = (callback) => {
  const cognitoUser = userPool.getCurrentUser();

  if (cognitoUser) {
    cognitoUser.getSession((err, session) => {
      if (err) {
        callback(false);
        return;
      }

      const groups = session.getIdToken().payload['cognito:groups'];
      const isAdmin = groups && groups.includes('insideout-admins');
      callback(isAdmin);
    });
  } else {
    callback(false);
  }
};
