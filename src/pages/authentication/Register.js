// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project import
import AuthRegister from './auth-forms/AuthRegister';
import AuthWrapper from './AuthWrapper';

// ================================|| Register ||================================ //

const Register = () => (
  <AuthWrapper>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
          <Typography variant="h3">Register new user</Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <AuthRegister />
      </Grid>
    </Grid>
  </AuthWrapper>
);

export default Register;
