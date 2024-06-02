// material-ui
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// assets
import NotFoundGIF from './empty.gif';
import DarkNotFoundGIF from './empty-dark.gif'

// ==============================|| NOT FOUND GIF ||============================== //

const Empty = ({ width, height }) => {
  const theme = useTheme();

  return (
    <Box sx={{ width: width, height: height }}>
      <img src={theme.palette.mode === 'dark' ? DarkNotFoundGIF : NotFoundGIF} alt="Not Found" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </Box>
  );
};

export default Empty;
