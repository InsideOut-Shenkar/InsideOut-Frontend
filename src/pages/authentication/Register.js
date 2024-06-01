import { useState } from 'react';
// material-ui
import { Grid, Snackbar, Alert } from '@mui/material';

// project import
import AuthWrapper from './AuthWrapper';
import AuthRegister from './auth-forms/AuthRegister';
import RegisterHeader from 'layout/MainLayout/Header/RegisterHeader';

// ================================|| REGISTER PAGE ||================================ //

const Register = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <AuthWrapper>
      <Grid container spacing={2}>
        <RegisterHeader />
        <Grid item xs={12}>
          <AuthRegister setSnackbarOpen={setSnackbarOpen} />
        </Grid>
      </Grid>
      <Snackbar open={snackbarOpen} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity="success">
          User created successfully
        </Alert>
      </Snackbar>
    </AuthWrapper>
  );
};

export default Register;
