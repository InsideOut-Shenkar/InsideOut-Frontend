import AWS from 'aws-sdk';

// ============================|| AWS CONFIGURATION ||============================ //

AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION,
  credentials: new AWS.Credentials(process.env.REACT_APP_ACCESS_KEY_ID, process.env.REACT_APP_SECRET_ACCESS_KEY)
});

export default AWS;
