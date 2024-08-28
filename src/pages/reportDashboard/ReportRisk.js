import PropTypes from 'prop-types';

// material-ui
import { Stack, Typography } from '@mui/material';

// project import
import Dot from 'components/@extended/Dot';

// ==============================|| REPORT STATUS ||============================== //

const ReportRisk = ({ level }) => {
  let color;
  let title;

  switch (level) {
    case 'medium':
      color = 'warning';
      title = 'Medium';
      break;
    case 'high':
      color = 'error';
      title = 'High';
      break;
    case 'low':
      color = 'primary';
      title = 'Low';
      break;
    default:
      color = 'default';
      title = 'Unknown';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
};

ReportRisk.propTypes = {
  level: PropTypes.string.isRequired
};

export default ReportRisk;
