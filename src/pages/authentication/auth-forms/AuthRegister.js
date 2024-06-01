import { useState } from 'react';

// material-ui
import {
  Button,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  MenuItem,
  Select
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AWS from 'utils/aws/config';
import useAddUser from 'api/useAddUser';
import userPoolData from 'utils/aws/cognito/userPoolData';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

const capitalizeFullName = (fullName) => {
  // Split the full name into an array of words
  const words = fullName.split(' ');

  // Map over each word to capitalize the first letter and make the rest lowercase
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  // Join the array of words back into a single string
  const capitalizedFullName = capitalizedWords.join(' ');

  return capitalizedFullName;
};

// ============================|| FIREBASE - REGISTER ||============================ //

const AuthRegister = ({ setSnackbarOpen }) => {
  const [showPassword, setShowPassword] = useState(false);
  const addUser = useAddUser();
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    try {
      const { email, password, fullName, role } = values;

      const responseData = await addUser(email, fullName, role);
      const userID = responseData.id?.toString();

      // Create user
      const params = {
        UserPoolId: userPoolData.UserPoolId,
        Username: email,
        TemporaryPassword: password,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'name', Value: capitalizeFullName(fullName) },
          { Name: 'custom:user_rds_id', Value: userID }
        ]
      };

      await cognitoIdentityServiceProvider.adminCreateUser(params).promise();

      // Add user to 'insideout-doctors' group if role is 'doctor'
      if (role === 'doctor') {
        const groupParams = {
          GroupName: 'insideout-doctors',
          UserPoolId: userPoolData.UserPoolId,
          Username: email
        };

        await cognitoIdentityServiceProvider.adminAddUserToGroup(groupParams).promise();
      }

      setStatus({ success: true });
      setSubmitting(false);
      setSnackbarOpen(true);
    } catch (error) {
      console.error(error);
      setErrors({ submit: error.message });
      setStatus({ success: false });
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          fullName: '',
          role: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required'),
          fullName: Yup.string().max(255).required('Full name is required'),
          role: Yup.string().required('Role is required')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email">Email Address</InputLabel>
                  <OutlinedInput
                    id="email"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    autoComplete="email"
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="standard-weight-helper-text-email">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="full-name">Full Name</InputLabel>
                  <OutlinedInput
                    id="full-name"
                    type="text"
                    value={values.fullName}
                    name="fullName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    fullWidth
                    error={Boolean(touched.fullName && errors.fullName)}
                    autoComplete="name"
                  />
                  {touched.fullName && errors.fullName && (
                    <FormHelperText error id="standard-weight-helper-text-full-name">
                      {errors.fullName}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="role">Role</InputLabel>
                  <Select
                    id="role"
                    name="role"
                    value={values.role}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    displayEmpty
                    fullWidth
                    error={Boolean(touched.role && errors.role)}
                  >
                    <MenuItem value="" disabled>
                      Select role
                    </MenuItem>
                    <MenuItem value="doctor">Doctor</MenuItem>
                  </Select>
                  {touched.role && errors.role && (
                    <FormHelperText error id="standard-weight-helper-text-role">
                      {errors.role}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password">Temporary Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter password"
                    autoComplete="current-password"
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Create User
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthRegister;
