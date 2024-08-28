// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import apiData from './apiData';
import patientData from './patientData';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu, apiData, patientData });

export default reducers;
