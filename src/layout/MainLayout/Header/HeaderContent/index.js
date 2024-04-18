// material-ui
import { Box, IconButton, useMediaQuery } from '@mui/material';
import { MoonOutlined } from '@ant-design/icons';

// project import
import Profile from './Profile';
import MobileSection from './MobileSection';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <>
      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}

      <IconButton disableRipple color="secondary" sx={{ color: 'text.primary', bgcolor: 'grey.100' }}>
        <MoonOutlined />
      </IconButton>
      {!matchesXs && <Profile />}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;
