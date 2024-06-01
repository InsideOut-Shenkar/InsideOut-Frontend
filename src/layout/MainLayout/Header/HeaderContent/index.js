import { useContext } from 'react';

// material-ui
import { Box, IconButton, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

// project import
import Profile from './Profile';
import MobileSection from './MobileSection';
import ColorModeContext from 'utils/contexts/colorModeContext';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <>
      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}
      <IconButton
        color="secondary"
        sx={{
          color: 'text.primary',
          ml: 1,
          '&:hover': {
            bgcolor: 'grey.100',
            '& svg': {
              color: 'black'
            }
          }
        }}
        onClick={colorMode.toggleColorMode}
      >
        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon sx={{ color: 'white' }} />}
      </IconButton>
      {!matchesXs && <Profile />}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;
