// types
import { createSlice } from '@reduxjs/toolkit';

// ==============================|| SLICE - API DATA ||============================== //

const apiData = createSlice({
  name: 'apiData',
  initialState: {
    patientsList: null,
    reportsList: null
  },
  reducers: {
    setPatientsList: (state, action) => {
      state.patientsList = action.payload;
    },
    setReportsList: (state, action) => {
      state.reportsList = action.payload;
    }
  }
});

export default apiData.reducer;

export const { setPatientsList, setReportsList } = apiData.actions;
