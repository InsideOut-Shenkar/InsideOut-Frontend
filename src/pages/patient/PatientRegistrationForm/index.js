import { useState, useEffect } from 'react';

// material-ui
import { Box, Link, Alert, Backdrop, Collapse, Typography, CircularProgress } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import PatientDemographicsForm from 'components/PatientDemographicsForm';

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.details ? `${data.error}, details: ${data.details}.` : data.error || 'Unknown error occurred');
  }
  return data;
};

// ==============================|| PATIENT REGISTRATION FORM PAGE ||============================== //

const PatientRegistrationForm = () => {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [medDataID, setMedDataID] = useState('');
  const [submitButton, setSubmitButton] = useState({});
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openCollapse, setOpenCollapse] = useState(false);

  const handleSubmit = async (event, idNumber, birthDate, inputValues) => {
    event.preventDefault();
    setOpenBackdrop(true);

    try {
      const body = {
        id_number: idNumber,
        date_of_birth: birthDate,
        created_by: 3
      };

      // Post patient data
      const patientResponse = await fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const patientData = await handleResponse(patientResponse);
      setMessage(patientData.message);
      setIdNumber(idNumber);
      console.log('Patient ID:', patientData.id);

      // Prepare body for second request
      body.patient_id = patientData.id;
      body.medical_info = Object.keys(inputValues).map((key) => ({ name: key, value: inputValues[key] }));
      delete body.created_by;
      delete body.id_number;
      delete body.date_of_birth;

      // Post medical data
      const medicalResponse = await fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/medical_data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const medicalData = await handleResponse(medicalResponse);
      setMedDataID(medicalData.id);
      setError('');
      console.log('Medical data ID:', medicalData.id);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setTimeout(() => {
        setOpenBackdrop(false);
        setOpenCollapse(true);
      }, 1000);
    }
  };

  const handleClose = () => {
    setOpenCollapse(false);
  };

  useEffect(() => {
    setSubmitButton((previous) => ({
      ...previous,
      disabled: openBackdrop || openCollapse
    }));
  }, [openBackdrop, openCollapse]);

  useEffect(() => {
    setSubmitButton({
      label: 'Add Patient',
      hidden: false
    });
  }, []);

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        Add a New Patient
      </Typography>
      <Collapse in={openCollapse}>
        <Alert variant="filled" severity={error ? 'error' : 'success'} sx={{ color: 'white', my: 3 }} onClose={handleClose}>
          {error ? error : `${message}, `}
          {error ? (
            <></>
          ) : (
            <Link underline="hover" color="inherit" href={`risk-assessment?idNumber=${idNumber}&medDataId=${medDataID}`}>
              click here to assess the risk.
            </Link>
          )}
        </Alert>
      </Collapse>
      <MainCard>
        <PatientDemographicsForm handler={handleSubmit} submitButton={submitButton} />
      </MainCard>
      <Backdrop sx={{ color: '#fff', zIndex: 2000 }} open={openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};
export default PatientRegistrationForm;
