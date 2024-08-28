import { forwardRef } from 'react';
// material-ui
import { Box, Grid } from '@mui/material';

const commonInputStyle = {
  height: 50,
  '& .MuiInputBase-root': {
    height: '100%',
    alignItems: 'center'
  },
  '& .MuiInputBase-input': {
    height: 'calc(100% - 20px)'
  }
};

// ==============================|| MEDICAL INFORMATION FORM ||============================== //

const MedicalInformation = forwardRef(({ handler, children }, ref) => (
  <Box
    component="form"
    autoComplete="off"
    onSubmit={handler}
    ref={ref}
    sx={{
      '& .MuiTextField-root': { m: 1, ...commonInputStyle }
    }}
  >
    <Grid container spacing={3}>
      {children}
    </Grid>
  </Box>
));

export default MedicalInformation;
