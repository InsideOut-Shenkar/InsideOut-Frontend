// material-ui
import { Grid, Stack, Typography, Box, SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material';

// project import
import useLogout from 'utils/auth';

// assets
import { LogoutOutlined } from '@ant-design/icons';

// ================================|| REGISTER HEADER ||================================ //

const RegisterHeader = () => {
  const logout = useLogout();
  const actions = [{ icon: <LogoutOutlined />, name: 'Logout', action: logout }];
  return (
    <Grid item xs={12}>
      <Stack direction="row" justifyContent="space-between" alignItems="baseline">
        <Typography variant="h3">Register new user</Typography>
        <Box sx={{ position: 'relative' }}>
          <SpeedDial ariaLabel="SpeedDial" icon={<SpeedDialIcon />} direction="left" FabProps={{ size: 'small' }}>
            {actions.map((action) => (
              <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} onClick={action.action} />
            ))}
          </SpeedDial>
        </Box>
      </Stack>
    </Grid>
  );
};

export default RegisterHeader;
