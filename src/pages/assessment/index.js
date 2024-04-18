import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// material-ui
import { Box, Step, Alert, Button, Stepper, Backdrop, Collapse, StepButton, Typography, CircularProgress } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

// project import
import MainCard from 'components/MainCard';
// import MedicalFields from 'assets/medical-fields';
import PatientDemographicsForm from 'components/PatientDemographicsForm';

const getPatient = async (id) => {
  const response = await fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/patients/${id}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.details ? `${data.details}, details: ${data.details}` : data.error || 'Unknown error occurred');
  }
  return data;
};

const getMedData = async (id) => {
  console.log('getMedData', id);
  const response = await fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/medical_data/${id}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.details ? `${data.details}, details: ${data.details}` : data.error || 'Unknown error occurred');
  }
  return data;
};

const parseQuery = (queryString) => {
  const query = new URLSearchParams(queryString);
  const idNumber = query.get('idNumber');
  const medDataId = query.get('medDataId');

  return { idNumber, medDataId };
};


// ==============================|| RISK ASSESSMENT FORM PAGE ||============================== //

const AssessmentForm = () => {
  // const navigate = useNavigate();
  const [error, setError] = useState('');
  // const [fields, setFields] = useState([]);
  const [medData, setMedData] = useState({});
  const [medInput, setMedInput] = useState({});
  const [idNumber, setIdNumber] = useState('');
  const [seenSteps, setSeenSteps] = useState({});
  const [medDataID, setMedDataID] = useState('');
  const [completed, setCompleted] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  // const [idDisabling, setIdDisabling] = useState(true);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openCollapse, setOpenCollapse] = useState(false);

  const [dis, setDis] = useState(true);

  const handleDemographics = (idNumber, birthDate, inputValues, completed) => {
    console.log(idNumber, birthDate, completed);
    console.table(inputValues);
    // const pattern = /^\d{10}$/;
    // if (pattern.test(idNumber)) {
    //   setIdDisabling(false);
    // }
    setMedInput((prevValues) => ({
      ...prevValues,
      date_of_birth: birthDate,
      ...inputValues
    }));
    setIdNumber(idNumber);
    if (
      idNumber.length == 10 &&
      birthDate &&
      Object.values(inputValues).every((value) => value !== undefined)
    ) {
      setDis(false);
    }
  };

  const steps = [
    {
      label: 'Demographics information',
      component: <PatientDemographicsForm handler={handleDemographics} defaultValues={medData} />
    },
    {
      label: 'Medical data',
      component: <></>
    },
    {
      label: 'Weights setting',
      component: <></>
    }
  ];

  const handleSubmit = async () => {
    // event.preventDefault();
    setOpenBackdrop(true);
    const body = {
      patient_id: idNumber,
      user_id: 1,
      medical_info: medInput
    };
    console.log(body);
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/assessment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(data);
        throw new Error(data.details ? `${data.error}, details: ${data.details}.` : data.error || 'Unknown error occurred');
      }
      console.log('response:', data);
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setTimeout(() => {
        setOpenBackdrop(false);
        setOpenCollapse(true);
      }, 2000);
    }
  };

  const handleCloseCollapse = () => {
    setOpenCollapse(false);
  };

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    console.log(medDataID);
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep = isLastStep() && !allStepsCompleted() ? steps.findIndex((step, i) => !(i in completed)) : activeStep + 1;
    handleSeen();
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    handleSeen();
    setActiveStep(step);
  };

  const handleComplete = () => {
    setCompleted((previous) => ({
      ...previous,
      [activeStep]: true
    }));
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
    setSeenSteps({});
  };

  const isStepFailed = (step) => {
    return completed[step] !== true && seenSteps[step] === true;
  };

  const handleSeen = () => {
    setSeenSteps((previous) => ({
      ...previous,
      [activeStep]: true
    }));
  };

  useEffect(() => {
    async function fetchData() {
      // const medFieldsList = MedicalFields.get([], ['vital status']);
      // console.table(medFieldsList);
      // setFields(medFieldsList);

      const { idNumber, medDataId } = parseQuery(location.search);

      try {
        if (idNumber) {
          console.log('idNumber', idNumber);
          const pattern = /^\d{10}$/;
          if (pattern.test(idNumber)) {
            const patient = await getPatient(idNumber);
            console.table(patient);
            setIdNumber(idNumber);
            if (medDataId) {
              console.log('medDataId', medDataId);
              const medData = await getMedData(medDataId);
              console.table(medData);
              setMedDataID(medDataId);
              setMedData((previous) => ({
                ...previous,
                ...medData.reduce((acc, data) => {
                  acc[data.name] = data.value;
                  return acc;
                }, {}),
                idNumber: patient['id_number'],
                dob: patient['date_of_birth']
              }));
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch:', error);
      }

      // navigate(window.location.pathname, { replace: true });
    }

    fetchData();
  }, []);

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        Assessment Risk
      </Typography>
      <Collapse in={openCollapse}>
        <Alert variant="filled" severity={error ? 'error' : 'success'} sx={{ color: 'white', my: 3 }} onClose={handleCloseCollapse}>
          {error ? error : 'succeed.'}
        </Alert>
      </Collapse>
      <Box sx={{ width: '100%', height: '100%' }}>
        <Stepper nonLinear activeStep={activeStep}>
          {steps.map((step, index) => {
            const labelProps = {};
            if (isStepFailed(index)) {
              labelProps.optional = (
                <Typography variant="caption" color="error">
                  Uncompleted step
                </Typography>
              );
              labelProps.icon = <ErrorIcon color="error" />;
            }

            return (
              <Step key={step.label} completed={completed[index]}>
                <StepButton color="inherit" {...labelProps} onClick={handleStep(index)}>
                  {step.label}
                </StepButton>
              </Step>
            );
          })}
        </Stepper>
        <>
          {allStepsCompleted() ? (
            <>
              <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </>
          ) : (
            <>
              <MainCard sx={{ my: 3 }}>{steps[activeStep].component}</MainCard>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleNext} sx={{ mr: 1 }}>
                  Next
                </Button>
                {activeStep !== steps.length &&
                  (completed[activeStep] ? (
                    <Typography variant="caption" sx={{ display: 'inline-block' }}>
                      Step {activeStep + 1} already completed
                    </Typography>
                  ) : (
                    <Button onClick={handleComplete}>{completedSteps() === totalSteps() - 1 ? 'Finish' : 'Complete Step'}</Button>
                  ))}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ my: 1 }}
                  onClick={handleSubmit}
                  disabled={dis}
                >
                  Get Assessment
                </Button>
              </Box>
            </>
          )}
        </>
      </Box>
      <Backdrop sx={{ color: '#fff', zIndex: 2000 }} open={openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};
export default AssessmentForm;
