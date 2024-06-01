import { useState } from 'react';

// material-ui
import { Box, Link, Alert, Backdrop, Collapse, Typography, CircularProgress, Grid, Button } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { DynamicInputs } from 'components/forms';
import { PatientsInformation } from 'components/forms';
import { useAddPatient, useAddMedicalData } from 'api';
import AnimateButton from 'components/@extended/AnimateButton';

// ==============================|| PATIENT REGISTRATION FORM PAGE ||============================== //

const PatientRegistration = () => {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openCollapse, setOpenCollapse] = useState(false);
  const { addMedicalData } = useAddMedicalData();
  const { addPatient } = useAddPatient();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    setOpenBackdrop(true);

    try {
      const entries = Object.fromEntries(formData.entries());
      const { idNumber, dob, ...medicalData } = entries;
      const userId = 3; // to be replaced
      const addResponse = await addPatient(idNumber, dob, userId);
      setMessage(addResponse.message);
      const patientID = addResponse.id;
      const medDataRes = await addMedicalData(medicalData, patientID);
      const medDataID = medDataRes.id;
      console.log(medDataID);
    } catch (err) {
      console.error('handleSubmit error:', err.message);
      setError(err.message);
      return;
    } finally {
      setTimeout(() => {
        setOpenBackdrop(false);
        setOpenCollapse(true);
      }, 1000);
    }
  };

  const handleClose = () => {
    setError(null);
    setOpenCollapse(false);
  };

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        Add a New Patient
      </Typography>
      <Collapse in={openCollapse}>
        <Alert variant="filled" severity={error ? 'error' : 'success'} sx={{ color: 'white', my: 3 }} onClose={handleClose}>
          {error ? error : `${message}, `}
          {!error && (
            <Link underline="hover" color="inherit" href={`risk-assessment`}>
              click here to assess the risk.
            </Link>
          )}
        </Alert>
      </Collapse>
      <MainCard>
        <PatientsInformation handler={handleSubmit}>
          <DynamicInputs inputs_type={[{ information_type: 'personal' }]} />
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <AnimateButton>
                <Button variant="contained" color="primary" sx={{ mt: 3, ml: 1 }} type="submit">
                  Add Patient
                </Button>
              </AnimateButton>
            </Box>
          </Grid>
        </PatientsInformation>
      </MainCard>
      <Backdrop sx={{ color: '#fff', zIndex: 2000 }} open={openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default PatientRegistration;
