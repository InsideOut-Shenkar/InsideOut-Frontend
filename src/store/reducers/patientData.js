// types
import { createSlice } from '@reduxjs/toolkit';

// ==============================|| SLICE - PATIENT DATA ||============================== //

const patientData = createSlice({
  name: 'patientData',
  initialState: {
    patientID: null,
    medDataID: null
  },
  reducers: {
    setPatientID: (state, action) => {
      state.patientID = action.payload;
    },
    setMedDataID: (state, action) => {
      state.medDataID = action.payload;
    }
  }
});

export default patientData.reducer;

export const { setPatientID, setMedDataID } = patientData.actions;
