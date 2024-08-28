import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// material-ui
import { Typography, Box, Collapse, Alert, Backdrop, CircularProgress } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import DataTable from 'components/DataTable';
import { useGetPatients, useDeletePatients } from 'api';
import { setPatientsList } from 'store/reducers/apiData';

const columns = [
  {
    field: 'idNumber',
    headerName: 'ID Number',
    flex: 1
  },
  {
    field: 'age',
    headerName: 'Age',
    flex: 1
  },
  {
    field: 'assessmentNo',
    headerName: 'Assessments',
    flex: 1
  },
  {
    field: 'addedBy',
    headerName: 'Added by',
    flex: 1
  }
];

// ==============================|| PATIENT LIST PAGE ||============================== //

const PatientsList = () => {
  const dispatch = useDispatch();

  const { fetchData } = useGetPatients();
  const [error, setError] = useState(null);
  const { deletePatients } = useDeletePatients();
  const [isLoading, setIsLoading] = useState(false);
  const [openCollapse, setOpenCollapse] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const { patientsList } = useSelector((state) => state.apiData);

  const fetchDataAsync = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchData();
      dispatch(setPatientsList(data));
    } catch (err) {
      setError(err.message);
      setOpenCollapse(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!patientsList) {
      fetchDataAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const handleCloseCollapse = () => {
    setOpenCollapse(false);
  };

  const handleDelete = async (rowSelectionModel) => {
    const selectedRowsData = patientsList.filter((row) => rowSelectionModel.includes(row.id));
    const selectedIds = selectedRowsData.map(({ idNumber }) => idNumber);
    try {
      setError(null);
      setOpenBackdrop(true);
      await deletePatients(selectedIds);
      setTimeout(() => {
        dispatch(setPatientsList(patientsList.filter((row) => !selectedIds.includes(row.idNumber))));
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
        <DataTable data={patientsList} handleDelete={handleDelete} columns={columns} loading={isLoading} reloadHandler={fetchDataAsync} />
      </MainCard>
      <Backdrop sx={{ color: '#fff', zIndex: 2000 }} open={openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default PatientsList;
