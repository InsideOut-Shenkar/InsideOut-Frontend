import { useState, useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ReactTyped } from 'react-typed';

// material-ui
import { Box, Step, Alert, Button, Stepper, Collapse, StepButton, Typography, Snackbar, ButtonBase } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

// project import
import LottieHeart from './LottieHeart';
import MainCard from 'components/MainCard';
import { DynamicInputs } from 'components/forms';
import getCurrentUserAttributes from 'utils/aws/cognito/getCurrentUserAttributes';
import { PatientsInformation, MedicalInformation, Setting } from 'components/forms';
import {
  useGetPatient,
  useGetMedData,
  useRiskAssessment,
  useAddMedicalFeature,
  useUpdateMedicalFeature,
  useGetPatientByIDNumber,
  useAddPatient,
  useAddMedicalData
} from 'api';

// assets
import MedicalFields from 'assets/MedicalFields';

const calculateAge = (birthdate) => {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const getUserID = async () => {
  try {
    const userAttributes = await getCurrentUserAttributes();
    return userAttributes['custom:user_rds_id'];
  } catch (error) {
    throw new Error(`Error fetching user attributes: ${error.message}`);
  }
};

const findDifferences = (dataInitialState, medData) => {
  const differences = {
    changed: {},
    added: {}
  };

  // Find keys with changed values
  Object.keys(dataInitialState).forEach((key) => {
    if (key in medData && dataInitialState[key] !== medData[key]) {
      differences.changed[key] = medData[key];
    }
  });

  // Find new key-value pairs
  Object.keys(medData).forEach((key) => {
    if (!(key in dataInitialState)) {
      differences.added[key] = medData[key];
    }
  });

  return differences;
};

// ==============================|| RISK ASSESSMENT FORM PAGE ||============================== //

const AssessmentForm = () => {
  const medicalFormRef = useRef(null);
  const settingFormRef = useRef(null);
  const personalFormRef = useRef(null);

  const { getPatient } = useGetPatient();
  const { getMedData } = useGetMedData();
  const { addPatient } = useAddPatient();
  const { addMedicalData } = useAddMedicalData();
  const { riskAssessment } = useRiskAssessment();
  const { addMedicalFeature } = useAddMedicalFeature();
  const { getPatientByIDNumber } = useGetPatientByIDNumber();
  const { updateMedicalFeature } = useUpdateMedicalFeature();

  const [dob, setDob] = useState(null);
  const [error, setError] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [needEdit, setNeedEdit] = useState({});
  const [reportID, setReportID] = useState(null);
  const [seenSteps, setSeenSteps] = useState({});
  const [completed, setCompleted] = useState({});
  const [savedForms, setSavedForms] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [enableEffect, setEnableEffect] = useState(true);
  const [runAnimation, setRunAnimation] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openCollapse, setOpenCollapse] = useState(false);
  const [snackbarMessage, setOpenMessage] = useState(null);
  const [dataInitialState, setDataInitialState] = useState({});
  const [prevCompletedSteps, setPrevCompletedSteps] = useState(0);
  const [values, setValues] = useState({
    personal: {},
    medical: {},
    weight: {}
  });

  const patientID = useSelector((state) => state.patientData.patientID);
  const medDataID = useSelector((state) => state.patientData.medDataID);

  const stepsSubmitsHandler = (event, category) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const entries = Object.fromEntries(formData.entries());
    const { idNumber, dob, ...formValues } = entries;
    setValues((previous) => ({
      ...previous,
      [category]: formValues
    }));
    if (form === personalFormRef.current) {
      setIdNumber(idNumber);
      setDob(dob);
    }
    console.log('Form values:', formValues);
    if (prevCompletedSteps < completedSteps()) {
      handleNext();
      setPrevCompletedSteps(completedSteps());
    }
  };

  const steps = [
    {
      label: "Patient's information",
      component: (
        <PatientsInformation ref={personalFormRef} handler={(event) => stepsSubmitsHandler(event, 'personal')} id={idNumber} dob={dob}>
          <DynamicInputs inputs_type={[{ information_type: 'personal' }]} defaultValues={values.personal} />
        </PatientsInformation>
      )
    },
    {
      label: 'Medical information',
      component: (
        <MedicalInformation ref={medicalFormRef} handler={(event) => stepsSubmitsHandler(event, 'medical')}>
          <DynamicInputs inputs_type={[{ information_type: 'medical' }]} defaultValues={values.medical} />
        </MedicalInformation>
      )
    },
    {
      label: 'Setting',
      component: <Setting ref={settingFormRef} defaultValues={values.weight} handler={(event) => stepsSubmitsHandler(event, 'weight')} />
    }
  ];

  const handleSubmit = async () => {
    setOpenBackdrop(true);
    setSubmitted(true);
    setEnableEffect(false);
    setRunAnimation(true);
    try {
      const userID = await getUserID();
      let localPatientID = patientID || null;
      if (!patientID) {
        try {
          const patient = await getPatientByIDNumber(idNumber);
          console.log('getPatientByIDNumber', patient);
          localPatientID = patient.id;
        } catch (err) {
          if (err.message?.includes('Patient not found')) {
            try {
              const addResponse = await addPatient(idNumber, dob, userID);
              setOpenSnackbar(true);
              setOpenMessage(addResponse.message);
              localPatientID = addResponse.id;
            } catch (addError) {
              console.error('Error adding patient:', addError);
              throw new Error(addError);
            }
          } else {
            console.error('Error fetching patient:', err);
            throw new Error(err);
          }
        }
      }

      const medData = {
        ...values.personal,
        ...values.medical,
        age: calculateAge(dob)
      };
      let localMedDataID = medDataID || null;
      if (!medDataID) {
        const medDataRes = await addMedicalData(medData, localPatientID);
        localMedDataID = medDataRes.id;
      } else {
        const { changed, added } = findDifferences(dataInitialState, medData);
        if (!isObjEmpty(changed)) {
          await updateMedicalFeature(localMedDataID, changed);
        }
        if (!isObjEmpty(added)) {
          await addMedicalFeature(localMedDataID, added);
        }
      }

      console.log('before risk assessment', values);

      const reportRes = await riskAssessment(userID, localPatientID, localMedDataID, values.weight);
      const reportID = reportRes.id;
      setReportID(reportID);
      console.log('response:', reportID);
      setError(null);
    } catch (error) {
      setSubmitted(false);
      console.error('Error:', error);
      setError(error.message);
    } finally {
      handleReset();
      setOpenBackdrop(false);
      setOpenCollapse(true);
      setRunAnimation(false);
    }
  };

  const handleSavedForms = () => {
    setSavedForms((previous) => previous + 1);
  };

  const isAllFormsSaved = () => {
    return savedForms === totalSteps();
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
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const nextIncompleteStep = (fromIndex = activeStep + 1) => steps.findIndex((step, i) => !(i in completed) && i >= fromIndex);

    let newActiveStep = nextIncompleteStep();
    if (newActiveStep === -1 || isLastStep()) {
      newActiveStep = nextIncompleteStep(0);
    }

    if (newActiveStep !== -1) {
      setActiveStep(newActiveStep);
    }
    handleSeen();
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
  };

  const handleUnComplete = () => {
    setNeedEdit((previous) => ({
      ...previous,
      [activeStep]: true
    }));
    setCompleted((previous) => {
      const updated = { ...previous };
      delete updated[activeStep];
      return updated;
    });
    setPrevCompletedSteps((previous) => previous - 1);
  };

  const handleReset = () => {
    setSavedForms(0);
    setActiveStep(0);
    setCompleted({});
    setSeenSteps({});
    setNeedEdit({});
    setPrevCompletedSteps(0);
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

  const isObjEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  };

  const handleUnNeed = (step) => {
    setNeedEdit((previous) => {
      const updated = { ...previous };
      delete updated[step];
      return updated;
    });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleFormSubmission = (formRef, needEdit, valuesKey, step) => {
    if (formRef?.current && ((needEdit && needEdit[step]) || isObjEmpty(values[valuesKey]))) {
      if (formRef.current.checkValidity()) {
        // Create a synthetic event object to pass to handleSubmit
        const syntheticEvent = new Event('submit', {
          bubbles: true,
          cancelable: true
        });
        // Dispatch the synthetic event to the form
        formRef.current.dispatchEvent(syntheticEvent);
      } else {
        // If the form is invalid, trigger the native form validation messages
        setCompleted((previous) => {
          const updated = { ...previous };
          delete updated[activeStep];
          return updated;
        });
        formRef.current.reportValidity();
      }
      handleUnNeed(step);
      handleSavedForms();
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        if (patientID && medDataID) {
          const patient = await getPatient(patientID);
          console.table(patient);
          setIdNumber(patientID.idNumber);
          setDob(patient.dob);

          const medData = await getMedData(medDataID);
          console.table(medData);
          const categorizedMedData = await MedicalFields.categorize(medData);
          console.log(categorizedMedData);
          setDataInitialState(
            ...medData.reduce((acc, data) => {
              acc[data.name] = data.value;
              return acc;
            }, {})
          );
          setValues((previous) => ({
            ...previous,
            ...categorizedMedData
          }));
        }
      } catch (error) {
        console.error('Failed to fetch:', error);
      }
    }

    if (enableEffect) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientID, medDataID, enableEffect]);

  useEffect(() => {
    const forms = [
      { ref: personalFormRef, needEdit: needEdit['0'], valuesKey: 'personal', step: 0 },
      { ref: medicalFormRef, needEdit: needEdit['1'], valuesKey: 'medical', step: 1 },
      { ref: settingFormRef, needEdit: needEdit['2'], valuesKey: 'weight', step: 2 }
    ];
    forms.forEach(({ ref, needEdit, valuesKey, step }) => {
      if (completed[step]) {
        handleFormSubmission(ref, needEdit, valuesKey, step);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed]);

  useEffect(() => handleReset(), []);

  return (
    <Box sx={{ height: '75vh' }}>
      <Typography variant="h3" gutterBottom>
        Risk Assessment
      </Typography>
      <Collapse in={openCollapse}>
        <Alert variant="filled" severity={error ? 'error' : 'info'} sx={{ color: 'white', my: 3 }} onClose={handleCloseCollapse}>
          {error ? error : ' Your risk assessment report is ready. Please click the link below to view the report. '}
          {!error && (
            <ButtonBase
              disableRipple
              component={RouterLink}
              to={`/report/${reportID}`}
              sx={{ color: 'inherit', textDecoration: 'underline' }}
            >
              View Risk Assessment Report
            </ButtonBase>
          )}
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
        <Box sx={{ flex: 0.9, display: 'flex', flexDirection: 'column' }}>
          {allStepsCompleted() && isAllFormsSaved() ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
              <MainCard sx={{ my: 3, p: 4, textAlign: 'center' }}>
                <LottieHeart run={runAnimation} />
                {!submitted ? (
                  <>
                    <Typography variant="h5" sx={{ mt: 2, mb: 3 }}>
                      All steps completed
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      Please submit the form to receive a risk assessment.
                    </Typography>
                  </>
                ) : (
                  runAnimation && (
                    <Typography variant="h5" sx={{ mt: 2, mb: 3 }}>
                      Computing <ReactTyped strings={['...']} typeSpeed={100} loop />
                    </Typography>
                  )
                )}
              </MainCard>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button onClick={handleReset} disabled={openBackdrop}>
                  Reset
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                <Box sx={{ flex: '1 1 auto' }} />
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={submitted}>
                  Submit
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
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
                    <Button onClick={handleUnComplete}>Edit</Button>
                  ) : (
                    <Button onClick={handleComplete}>Save</Button>
                  ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleSnackbarClose}>
        <Alert severity="success" variant="filled" sx={{ width: '100%' }} onClose={handleSnackbarClose}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
export default AssessmentForm;
