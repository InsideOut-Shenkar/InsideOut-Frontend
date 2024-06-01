import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

// project import
import userPool from 'utils/aws/cognito/userPool';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = ({ setSnackbarOpen, formMode }) => {
  const [checked, setChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [cognitoUser, setCognitoUser] = useState(null);
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    if (formMode === 'login') {
      try {
        const user = new CognitoUser({
          Username: values.email,
          Pool: userPool
        });

        const authenticationDetails = new AuthenticationDetails({
          Username: values.email,
          Password: values.password
        });

        user.authenticateUser(authenticationDetails, {
          onSuccess: (result) => {
            console.log('Authentication successful', result);
            setStatus({ success: true });
            setSubmitting(false);
            navigate('/');
          },
          onFailure: (err) => {
            console.error('Authentication failed:', err);
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          },
          newPasswordRequired: (userAttributes, requiredAttributes) => {
            console.log('New password required:', userAttributes, requiredAttributes);
            setStatus({ success: false });
            setErrors({ submit: 'New password required. Please update your password.' });
            setCognitoUser(user);
            setSubmitting(false);
            setSnackbarOpen(true);
          }
        });
      } catch (err) {
        console.error('An error occurred during login:', err);
        setStatus({ success: false });
        setErrors({ submit: err.message });
        setSubmitting(false);
      }
    } else if (formMode === 'newPassword') {
      if (cognitoUser) {
        cognitoUser.completeNewPasswordChallenge(
          values.password,
          {},
          {
            onSuccess: (result) => {
              console.log('Password change successful', result);
              setStatus({ success: true });
              setSubmitting(false);
              setSnackbarOpen(true);
            },
            onFailure: (err) => {
              console.error('Password change failed:', err);
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        );
      }
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          email: 'demo@shiba.ac.il',
          password: '123456',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
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
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password"
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
                    autoComplete="password"
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} sx={{ mt: -1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                        name="checked"
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="h6">Keep me sign in</Typography>}
                  />
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
                    {formMode === 'login' ? 'Login' : 'Set New Password'}
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

export default AuthLogin;
