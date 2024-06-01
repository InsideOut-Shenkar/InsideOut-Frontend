import React, { useEffect, useState } from 'react';

// material-ui
import { Typography, Box, Collapse, Alert, Backdrop, CircularProgress } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import DataTable from 'components/DataTable';
import { useGetPatients, useDeletePatients } from 'api';

// ==============================|| PATIENT LIST PAGE ||============================== //

const PatientsList = () => {
  const [rows, setRows] = useState([]);
  const { fetchData } = useGetPatients();
  const [error, setError] = useState(null);
  const { deletePatients } = useDeletePatients();
  const [openCollapse, setOpenCollapse] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        setError(null);
        const data = await fetchData();
        setRows(data);
      } catch (err) {
        setError(err.message);
        setOpenCollapse(true);
      }
    };

    fetchDataAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const handleCloseCollapse = () => {
    setOpenCollapse(false);
  };

  const handleDelete = async (rowSelectionModel) => {
    const selectedRowsData = rows.filter((row) => rowSelectionModel.includes(row.id));
    const selectedIds = selectedRowsData.map(({ idNumber }) => idNumber);
    console.log('Deleting rows with ID numbers:', selectedIds);
    try {
      setError(null);
      setOpenBackdrop(true);
      await deletePatients(selectedIds);
      setTimeout(() => {
        setRows((currentRows) => currentRows.filter((row) => !selectedIds.includes(row.idNumber)));
      }, 1000);
    } catch (err) {
      console.error('Error:', err);
      setError(`Error occurred during deletion, details: ${err.message}`);
    } finally {
      setTimeout(() => {
        setOpenBackdrop(false);
        setOpenCollapse(true);
      }, 1000);
    }
  };

  return (
    <Box>
      <Typography variant="h3">Patients List</Typography>
      <Collapse in={openCollapse}>
        <Alert variant="filled" severity={error ? 'error' : 'info'} sx={{ color: 'white', my: 3 }} onClose={handleCloseCollapse}>
          {error ? `${error}.` : 'Deleted successfully.'}
        </Alert>
      </Collapse>
      <MainCard content={false} sx={{ mt: 1.5 }}>
        <DataTable data={rows} handleDelete={handleDelete} />
      </MainCard>
      <Backdrop sx={{ color: '#fff', zIndex: 2000 }} open={openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default PatientsList;
