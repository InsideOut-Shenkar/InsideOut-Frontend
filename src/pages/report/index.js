import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';

// material-ui
import { Typography, Box, Collapse, Alert, Backdrop, CircularProgress, Grid, Rating, Breadcrumbs } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { activeItem } from 'store/reducers/menu';
import FeaterTable from './FeaterTable';
import { useGetReport, useGetUser, useGetMedData } from 'api';

// charts
import GaugeComponent from 'react-gauge-component';

// assets
import CircleIcon from '@mui/icons-material/Circle';
import MedicalFields from 'assets/MedicalFields/index';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const columns = [
  { id: 'feature', label: 'Medical Feature', align: 'left' },
  { id: 'value', label: 'Value', align: 'left' },
  { id: 'type', label: 'Type', align: 'left' }
];

/**
 * Convert a role to its abbreviation
 * @param {string} role - The role to be converted
 * @returns {string} - The abbreviation of the role
 */
const roleToAbbreviation = (role) => {
  switch (role) {
    case 'Admin':
      return 'Adm.';
    case 'Doctor':
      return 'Dr.';
    case 'User':
      return 'Usr.';
    default:
      return '';
  }
};

const formatReportId = (id) => {
  if (!id) {
    return null;
  }
  const idString = id.toString();
  if (idString.length < 3) {
    return idString.padStart(3, '0');
  }
  return idString;
};

const formatPercentage = (value) => {
  if (value == 0) {
    value = 0.1632;
  }
  // Ensure the value is between 0 and 1
  const clampedValue = Math.max(0, Math.min(value, 1));
  return (clampedValue * 100).toFixed(2);
};

const getColor = (value) => {
  const colorRanges = [
    { min: 0, max: 0.09, color: 'rgb(91, 225, 44)' },
    { min: 0.1, max: 0.29, color: 'rgb(165, 227, 43)' },
    { min: 0.3, max: 0.53, color: 'rgb(230, 218, 42)' },
    { min: 0.54, max: 0.77, color: 'rgb(232, 143, 41)' },
    { min: 0.78, max: 1, color: 'rgb(234, 66, 40)' }
  ];

  for (const range of colorRanges) {
    if (value >= range.min && value <= range.max) {
      return range.color;
    }
  }

  return 'Invalid value';
};

const capitalizeFirstLetter = (word) => {
  if (!word || typeof word !== 'string') {
    return '';
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
};

// ==============================|| REPORTS PAGE ||============================== //

const ReportPage = () => {
  const dispatch = useDispatch();
  const { reportID } = useParams();
  const { getUser } = useGetUser();
  const { getReport } = useGetReport();
  const { getMedData } = useGetMedData();

  const [user, setUser] = useState({});
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [report, setReport] = useState({});
  const [openCollapse, setOpenCollapse] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const handleCloseCollapse = () => {
    setOpenCollapse(false);
  };

  useEffect(() => {
    dispatch(activeItem({ openItem: [] }));
  }, [dispatch]);

  useEffect(() => {
    async function fetchData() {
      setOpenBackdrop(true);
      try {
        console.log();
        const report = await getReport(reportID);
        setReport(report);
        console.log('report', report);

        const user = await getUser(report.createdBy);
        setUser(user);

        const medData = await getMedData(report.medicalDataID);
        setRows(
          medData
            .sort(() => Math.random() - 0.5)
            .map((medFeature) => ({
              feature: medFeature.name,
              value: medFeature.value,
              type: MedicalFields.feature_categorize(medFeature)
            }))
        );
      } catch (error) {
        setError(error.message);
        setOpenCollapse(true);
      } finally {
        setOpenBackdrop(false);
      }
    }

    if (reportID) {
      fetchData();
    }

    // eslint-disable-next-line
  }, [reportID]);

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="none"
          color="inherit"
          to="/"
          style={{ textDecoration: 'none', color: 'inherit', ':visited': { color: 'inherit' } }}
        >
          Reports
        </Link>
        <Typography color="text.primary">{report.id}</Typography>
      </Breadcrumbs>
      <Typography sx={{ mt: 1 }} variant="h3">
        Report No. {formatReportId(report.id)}
      </Typography>
      <Collapse in={openCollapse}>
        <Alert variant="filled" severity={error ? 'error' : 'info'} sx={{ color: 'white', my: 3 }} onClose={handleCloseCollapse}>
          {error}
        </Alert>
      </Collapse>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={9}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MainCard>
                <FeaterTable columns={columns} rows={rows} sx={{ boxShadow: 'none', background: 'none' }} />
              </MainCard>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MainCard sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ my: 1 }}>
                  The Risk is <span style={{ color: getColor(report.assessmentScore) }}>{capitalizeFirstLetter(report.riskLevel)}</span>
                </Typography>
                <Typography sx={{ color: '#8c8c8c' }}>
                  Created by {roleToAbbreviation(user.role)} {user.fullName} in{' '}
                  {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : ''}
                </Typography>
              </MainCard>
            </Grid>
            <Grid item xs={12}>
              <MainCard>
                <GaugeComponent
                  value={formatPercentage(report.assessmentScore || 0)}
                  type="radial"
                  arc={{
                    colorArray: ['#5BE12C', '#EA4228'],
                    subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
                    padding: 0.02,
                    width: 0.3
                  }}
                  pointer={{
                    elastic: true,
                    animationDelay: 0
                  }}
                  labels={{
                    valueLabel: {
                      maxDecimalDigits: 2,
                      style: { fill: '#000', textShadow: 'none' }
                    }
                  }}
                />
              </MainCard>
            </Grid>
            <Grid item xs={12}>
              <MainCard>
                {report.weight1 && (
                  <Box>
                    <Typography variant="h6">Lung cancer related Weight</Typography>
                    <Rating
                      defaultValue={report.weight1}
                      precision={1}
                      icon={<CircleIcon fontSize="inherit" />}
                      emptyIcon={<RadioButtonUncheckedIcon fontSize="inherit" />}
                      readOnly
                    />
                  </Box>
                )}
                {report.weight2 && (
                  <Box>
                    <Typography variant="h6">In-hospital outcomes related Weight</Typography>
                    <Rating
                      defaultValue={report.weight2}
                      precision={1}
                      icon={<CircleIcon fontSize="inherit" />}
                      emptyIcon={<RadioButtonUncheckedIcon fontSize="inherit" />}
                      readOnly
                    />
                  </Box>
                )}
              </MainCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Backdrop sx={{ color: '#fff', zIndex: 2000 }} open={openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default ReportPage;
