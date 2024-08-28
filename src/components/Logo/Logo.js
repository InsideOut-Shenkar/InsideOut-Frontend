import { Typography } from '@mui/material';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

import logo from 'assets/images/logo/insideout-icon.svg';

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  // const theme = useTheme();

  return (
    <>
      <img src={logo} alt="InsideOut" width="60" />
      <Typography variant="h2" style={{ fontWeight: 'bold' }}>
        InsideOut
      </Typography>
    </>
  );
};

export default Logo;
