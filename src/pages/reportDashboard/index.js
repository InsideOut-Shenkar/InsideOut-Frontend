import React, { useState } from 'react';
import { Box, Grid, TextField, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import ReportTable from './ReportTable';

export default function ReportDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    // Implement search functionality if necessary
  };

  return (
    <Box>
      {/*rowe no. 1*/}
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h3">Reports List</Typography>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <TextField fullWidth label="search reports" variant="outlined" value={searchTerm} onChange={handleSearchChange} />
        </MainCard>
      </Grid>
      {/*rowe no. 2*/}
      <Grid item xs={12} md={7} lg={8}>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <ReportTable />
        </MainCard>
      </Grid>
    </Box>
  );
}
