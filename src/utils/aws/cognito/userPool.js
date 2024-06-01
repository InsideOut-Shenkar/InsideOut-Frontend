import { CognitoUserPool } from 'amazon-cognito-identity-js';

// project import
import userPoolData from './userPoolData';

// ============================|| AMAZON COGNITO USER POOL ||============================ //

// Initialize User Pool
const userPool = new CognitoUserPool(userPoolData);

export default userPool;
