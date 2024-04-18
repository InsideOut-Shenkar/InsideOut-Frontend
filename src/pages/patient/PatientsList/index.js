import React, { useState, useEffect } from 'react';

// material-ui
import { Typography, Box, Collapse, Alert, Backdrop, CircularProgress } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import PatientsTable from './patientsTable';

const calculateAge = (dob) => {
  const birthday = new Date(dob);
  const now = new Date();
  let ageInYears = now.getFullYear() - birthday.getFullYear();
  let ageInMonths = now.getMonth() - birthday.getMonth();

  if (ageInMonths < 0 || (ageInMonths === 0 && now.getDate() < birthday.getDate())) {
    ageInYears--;
    ageInMonths = 12 + ageInMonths;
  }

  if (ageInMonths === 0 && now.getDate() >= birthday.getDate()) {
    ageInMonths = 11;
  }

  return `${ageInYears}Y ${ageInMonths}M`;
};

// ==============================|| PATIENT LIST PAGE ||============================== //

const PatientsList = () => {
  const [openCollapse, setOpenCollapse] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  const handleCloseCollapse = () => {
    setOpenCollapse(false);
  };

  const handleDelete = async (rowSelectionModel) => {
    const selectedRowsData = rowSelectionModel.map((rowId) => rows.find((row) => row.id === rowId));
    const selectedIds = selectedRowsData.map((row) => row.idNumber);
    console.log('Deleting rows with ID numbers:', selectedIds);
    try {
      setOpenBackdrop(true);

      const response = await fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/patients`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedIds)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(data.details ? `${data.error}, details: ${data.details}` : data.error || 'Unknown error occurred');
      }
      console.log('Delete response:', responseData);
      setError('');
      setTimeout(() => {
        setRows((currentRows) => currentRows.filter((row) => !selectedIds.includes(row.idNumber)));
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      setError(`Error occurred during deletion, details: ${error.message}`);
    } finally {
      setTimeout(() => {
        setOpenBackdrop(false);
        setOpenCollapse(true);
      }, 1000);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/view/patients`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.details ? `${data.details}, details: ${data.details}` : data.error || 'Unknown error occurred');
        }

        const updatedRows = data.map((row, index) => ({
          id: index,
          idNumber: row['id_number'],
          age: calculateAge(row['date_of_birth']),
          assessmentNo: row['report_count'],
          addedBy: row['full_name']
        }));
        setRows(updatedRows);
      } catch (error) {
        console.error('Failed to fetch patients data:', error);
        setError(` data fetching, details: ${error.message}`);
        setOpenCollapse(true);
      }
    };
    fetchData();
  }, []);

  return (
    <Box>
      <Typography variant="h3">Patients List</Typography>
      <Collapse in={openCollapse}>
        <Alert variant="filled" severity={error ? 'error' : 'info'} sx={{ color: 'white', my: 3 }} onClose={handleCloseCollapse}>
          {error ? `${error}.` : 'Deleted successfully.'}
        </Alert>
      </Collapse>
      <MainCard content={false} sx={{ mt: 1.5 }}>
        <PatientsTable data={rows} handleDelete={handleDelete} />
      </MainCard>
      <Backdrop sx={{ color: '#fff', zIndex: 2000 }} open={openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default PatientsList;
