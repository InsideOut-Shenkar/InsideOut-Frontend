import { useEffect, useState } from 'react';

// material-ui
import { Box, Grid, Button, TextField } from '@mui/material';

// project import
import MedicalFields from 'assets/medical-fields';
import NumericField from 'components/NumericField';
import FieldSelector from 'components/FieldSelector';

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

// ==============================|| PATIENT DEMOGRAPHICS FORM ||============================== //

const PatientDemographicsForm = ({ handler, idDisabling, submitButton, defaultValues }) => {
  const [fields, setFields] = useState([]);
  const [idNumber, setIdNumber] = useState('');
  const [inputValues, setInputValues] = useState({});
  const [isDateError, setIsDateError] = useState(false);
  const [birthDate, setBirthDate] = useState(undefined);
  const [isPatternError, setIsPatternError] = useState(false);
  const [allInputsFilled, setAllInputsFilled] = useState(false);

  const handleChange = (event, setter = undefined) => {
    const { name, value } = event.target;
    if (setter != undefined) {
      setter(value);
    } else {
      setInputValues((prevValues) => ({
        ...prevValues,
        [name]: value
      }));
    }
  };

  const sendToParent = () => {
    handler(idNumber, birthDate, inputValues, allInputsFilled);
  };

  useEffect(() => {
    setAllInputsFilled(
      idNumber.length == 10 &&
        birthDate &&
        !isDateError &&
        !isPatternError &&
        Object.values(inputValues).every((value) => value !== undefined)
    );
  }, [idNumber, birthDate, isDateError, isPatternError, inputValues]);

  useEffect(() => {
    const pattern = /^\d{10}$/;
    setIsPatternError(!pattern.test(idNumber) && !idNumber.length == 0);
  }, [idNumber]);

  useEffect(() => {
    if (!submitButton) {
      sendToParent();
    }
  }, [allInputsFilled, submitButton]);

  useEffect(() => {
    const now = new Date();
    const birthDateObj = new Date(birthDate);
    setIsDateError(birthDateObj >= now);
    console.log(birthDate);
  }, [birthDate]);

  useEffect(() => {
    if (defaultValues) {
      if ('idNumber' in defaultValues) {
        setIdNumber(defaultValues.idNumber);
      }
      if ('dob' in defaultValues) {
        console.log(42);
        const date = new Date(defaultValues.dob);
        const formattedDate = date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
        setBirthDate(formattedDate);
      }
      const updatedInputValues = { ...inputValues };
      Object.keys(defaultValues).forEach((key) => {
        if (key in inputValues) {
          updatedInputValues[key] = defaultValues[key];
        }
      });
      console.log('updatedInputValues', updatedInputValues);
      setInputValues(updatedInputValues);
    }
  }, [defaultValues]);

  useEffect(() => {
    async function fetchFields() {
      try {
        const addPatientMedFields = await MedicalFields.get([], ['vital status', 'age']);
        console.table(addPatientMedFields);
        setFields(addPatientMedFields);

        const initialValues = addPatientMedFields.reduce((acc, medField) => {
          acc[medField.name] = undefined;
          return acc;
        }, {});

        setInputValues(initialValues);
      } catch (error) {
        console.error('Failed to fetch medical fields:', error);
      }
    }
    fetchFields();
  }, []);

  return (
    <Box
      component="form"
      autoComplete="off"
      onSubmit={(event) => handler(event, idNumber, birthDate, inputValues)}
      sx={{
        '& .MuiTextField-root': { m: 1, ...commonInputStyle }
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="idNumber"
            label="ID Number"
            placeholder="Enter 10 digit ID Number"
            inputProps={{ maxLength: 10 }}
            value={idNumber}
            onChange={(event) => handleChange(event, setIdNumber)}
            error={isPatternError}
            helperText={isPatternError ? 'ID Number must be exactly 10 digits' : ''}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="dateOfBirth"
            label="Date of Birth"
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            value={birthDate}
            onChange={(event) => handleChange(event, setBirthDate)}
            error={isDateError}
            helperText={isDateError ? 'Date of Birth cannot be in the future' : ''}
            disabled={idDisabling}
          />
        </Grid>
        {fields
          .filter((field) => field.type === 'category')
          .map((field, index) => (
            <Grid item xs={12} sm={6} key={field.id || index}>
              <FieldSelector
                field={field}
                handleChange={handleChange}
                idDisabling={idDisabling}
                defaultValue={defaultValues && field.name in defaultValues ? defaultValues[field.name] : undefined}
                index={index}
              />
            </Grid>
          ))}
        {fields
          .filter((field) => field.type === 'int' || field.type === 'float')
          .map((field, index) => (
            <Grid item xs={12} sm={6} key={field.id || index}>
              <NumericField
                field={field}
                handleChange={handleChange}
                idDisabling={idDisabling}
                defaultValue={defaultValues && field.name in defaultValues ? defaultValues[field.name] : undefined}
                index={index}
              />
            </Grid>
          ))}
        {!submitButton || submitButton.hidden ? (
          <></>
        ) : (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3, ml: 1 }}
                disabled={!allInputsFilled || submitButton.disabled}
                type="submit"
              >
                {submitButton.label}
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default PatientDemographicsForm;
