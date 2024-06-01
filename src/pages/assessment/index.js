import { useState, useEffect } from 'react';

// material-ui
import { Box, Step, Alert, Button, Stepper, Backdrop, Collapse, StepButton, Typography, CircularProgress } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

// project import
import MainCard from 'components/MainCard';
import { DynamicInputs } from 'components/forms';
import { useGetPatient, useGetMedData } from 'api';
import { PatientsInformation, MedicalInformation, Setting } from 'components/forms';

const firstStepComponent = (
  <PatientsInformation>
    <DynamicInputs inputs_type={[{ information_type: 'personal' }]} />
  </PatientsInformation>
);

const secondStepComponent = (
  <MedicalInformation>
    <DynamicInputs inputs_type={[{ information_type: 'medical' }]} />
  </MedicalInformation>
);

const thirdStepComponent = <Setting />;

// ==============================|| RISK ASSESSMENT FORM PAGE ||============================== //

const AssessmentForm = () => {
  const [error, setError] = useState('');
  const [medData, setMedData] = useState({});
  const [medInput, setMedInput] = useState({});
  const [idNumber, setIdNumber] = useState('');
  const [seenSteps, setSeenSteps] = useState({});
  const [medDataID, setMedDataID] = useState('');
  const [completed, setCompleted] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openCollapse, setOpenCollapse] = useState(false);
  const [risk, setRisk] = useState(null);
  const { getPatient } = useGetPatient();
  const { getMedData } = useGetMedData();

  const steps = [
    {
      label: "Patient's information",
      component: firstStepComponent
    },
    {
      label: 'Medical information',
      component: secondStepComponent
    },
    {
      label: 'Setting',
      component: thirdStepComponent
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
      setRisk(data);
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

  const myFalse = false;

  if (myFalse) {
    console.log(medData);
    setMedInput([]);
    handleSubmit();
  }

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
    }

    fetchData();
  }, []);

  return (
    <Box sx={{ height: '83vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h3" gutterBottom>
        Assessment Risk
      </Typography>
      <Collapse in={openCollapse}>
        <Alert
          variant="filled"
          severity={error ? 'error' : risk === 'low' ? 'info' : risk === 'high' ? 'error' : 'warning'}
          sx={{ color: 'white', my: 3 }}
          onClose={handleCloseCollapse}
        >
          {error ? error : `The risk is ${risk}.`}
        </Alert>
      </Collapse>
      <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stepper nonLinear activeStep={activeStep} sx={{ flex: 0.1 }}>
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
        <Box sx={{ flex: 0.9, display: 'flex', flexDirection: 'column'  }}>
          {allStepsCompleted() ? (
            <>
              <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between',  height: '100%' }}>
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
            </Box>
          )}
        </Box>
      </Box>
      <Backdrop sx={{ color: '#fff', zIndex: 2000 }} open={openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};
export default AssessmentForm;
