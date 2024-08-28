import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// material-ui
import { Box, Collapse, Alert, Backdrop, CircularProgress, Typography, ButtonBase } from '@mui/material';

// project import
import ReportRisk from './ReportRisk';
import MainCard from 'components/MainCard';
import DataTable from 'components/DataTable';
import { useGetReports, useDeleteReports } from 'api';
import { setReportsList } from 'store/reducers/apiData';

const formatID = (id) => {
  if (!id) {
    return null;
  }
  const idString = id.toString();
  if (idString.length < 3) {
    return idString.padStart(3, '0');
  }
  return idString;
};

const columns = [
  {
    field: 'reportNo',
    headerName: 'Report No.',
    renderCell: (params) => (
      <ButtonBase disableRipple component={RouterLink} to={`/report/${params.row.id}`} sx={{ textDecoration: 'none' }}>
        R{formatID(params.row.id)}
      </ButtonBase>
    ),
    flex: 1
  },
  {
    field: 'createdBy',
    headerName: 'Created by',
    flex: 1
  },
  {
    field: 'patientID',
    headerName: "Patient's ID",
    flex: 1
  },
  {
    field: 'date',
    headerName: 'Date',
    renderCell: (params) => <>{new Date(params.row.createdAt).toLocaleDateString()}</>,
    flex: 1
  },
  {
    field: 'riskLevel',
    headerName: 'Risk',
    renderCell: (params) => <ReportRisk level={params.row.riskLevel} />,
    flex: 1
  }
];

const ReportDashboard = () => {
  const dispatch = useDispatch();
  const { getReports } = useGetReports();
  const [error, setError] = useState(null);
  const { deleteReports } = useDeleteReports();
  const [isLoading, setIsLoading] = useState(false);
  const [openCollapse, setOpenCollapse] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const { reportsList } = useSelector((state) => state.apiData);

  const handleDelete = async (selectedIds) => {
    try {
      setError(null);
      setOpenBackdrop(true);
      await deleteReports(selectedIds);
      setTimeout(() => {
        dispatch(setReportsList(reportsList.filter((row) => !selectedIds.includes(row.id))));
      }, 1000);
    } catch (err) {
      console.error('Error:', err);
      setError(`Error occurred during deletion, details: ${err.message}`);
    } finally {
      setTimeout(() => {
        setOpenBackdrop(false);
        setOpenCollapse(true);
      }, 1000);
    }
  };

  const handleCloseCollapse = () => {
    setOpenCollapse(false);
  };

  const fetchDataAsync = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getReports();
      dispatch(setReportsList(data));
    } catch (err) {
      setError(err.message);
      setOpenCollapse(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!reportsList) {
      fetchDataAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return (
    <Box>
      <Typography variant="h3">Report List</Typography>
      <Collapse in={openCollapse}>
        <Alert variant="filled" severity={error ? 'error' : 'info'} sx={{ color: 'white', my: 3 }} onClose={handleCloseCollapse}>
          {error ? `${error}.` : 'Deleted successfully.'}
        </Alert>
      </Collapse>
      <MainCard content={false} sx={{ mt: 1.5 }}>
        <DataTable data={reportsList} handleDelete={handleDelete} columns={columns} loading={isLoading} reloadHandler={fetchDataAsync} />
      </MainCard>
      <Backdrop sx={{ color: '#fff', zIndex: 2000 }} open={openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default ReportDashboard;
