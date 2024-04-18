// material-ui
import { Box } from '@mui/material';
import DoctorSvg from './doctor.svg';

// ==============================|| AUTH BLUR BACK SVG ||============================== //

const AuthBackground = () => {
  return (
    <Box sx={{ position: 'absolute', filter: 'blur(1px)', zIndex: -1, bottom: 0, height: '65%' }}>
      <img src={DoctorSvg} alt="Background" style={{ width: '100%', height: '100%' }} />
    </Box>
  );
};

export default AuthBackground;
