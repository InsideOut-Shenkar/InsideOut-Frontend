// material-ui
import { Box } from '@mui/material';
import NotFoundGIF from './empty.gif';

// ==============================|| NOT FOUND GIF ||============================== //

const Empty = ({ width, height }) => {
  return (
    <Box sx={{ width: width, height: height }}>
      <img src={NotFoundGIF} alt="Not Found" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </Box>
  );
};

export default Empty;
