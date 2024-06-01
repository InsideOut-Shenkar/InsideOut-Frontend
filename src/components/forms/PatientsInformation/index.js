import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

// material-ui
import { Box, Grid, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

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

// ==============================|| PATIENT INFORMATION FORM ||============================== //

const PatientsInformation = ({ handler, dob, id, children }) => {
  const [idNumber, setIdNumber] = useState('');
  const [dateError, setDateError] = useState(false);
  const [birthDate, setBirthDate] = useState(null);
  const [patternError, setPatternError] = useState(false);

  useEffect(() => {
    const pattern = /^\d{10}$/;
    setPatternError(!pattern.test(idNumber) && !idNumber.length == 0);
  }, [idNumber]);

  const handleDateChange = (newDob) => {
    if (newDob && dayjs(newDob).isAfter(dayjs())) {
      setDateError(true);
    } else {
      setDateError(false);
      setBirthDate(newDob);
    }
  };

  useEffect(() => {
    if (id) {
      setIdNumber(id);
    }
  }, [id]);

  useEffect(() => {
    if (dob) {
      const date = new Date(dob);
      const formattedDate = date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
      setBirthDate(dayjs(formattedDate));
    }
  }, [dob]);

  return (
    <Box
      component="form"
      autoComplete="off"
      onSubmit={handler}
      sx={{
        '& .MuiTextField-root': { m: 1, ...commonInputStyle }
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="idNumber"
            label="ID Number"
            placeholder="Enter 10 digit ID Number"
            inputProps={{ maxLength: 10 }}
            value={idNumber}
            onChange={(event) => setIdNumber(event.target.value)}
            error={patternError}
            helperText={patternError ? 'ID Number must be exactly 10 digits' : ''}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              name="dob"
              label="Date of Birth"
              value={birthDate}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: dateError,
                  helperText: dateError ? 'Date of Birth cannot be in the future' : '',
                  required: true
                }
              }}
            />
          </LocalizationProvider>
        </Grid>
        {children}
      </Grid>
    </Box>
  );
};

export default PatientsInformation;
