import { Fragment, useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts';
import { Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const reportStatus = (status) => {
  let color;
  let title;

  status = Number(status);

  switch (status) {
    case 0:
      color = 'warning';
      title = 'Medium';
      break;
    case 1:
      color = 'success';
      title = 'None';
      break;
    case 2:
      color = 'error';
      title = 'High';
      break;
    case 3:
      color = 'primary';
      title = 'Low';
      break;
    default:
      color = 'inherit';
      title = 'Unknown';
  }
  return { color, title };
};

const getColor = (colorName) => {
  switch (colorName) {
    case 'primary':
      return '#3f51b5';
    case 'success':
      return '#4caf50';
    case 'warning':
      return '#ff9800';
    case 'error':
      return '#f44336';
    default:
      return 'inherit';
  }
};

export default function ReportDialog({ report }) {
  const [open, setOpen] = useState(false);
  const [riskStatus, setRiskStatus] = useState({ color: 'inherit', title: 'Unknown' });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    handleOpen();
    setRiskStatus(reportStatus(report.risk));
  }, [report]);

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          }
        }}
      >
        <DialogTitle>Report No. {report.reportNo}</DialogTitle>
        <DialogContent>
          <Typography variant="h3">
            The Risk is <span style={{ color: getColor(riskStatus.color) }}>{riskStatus.title}</span>
          </Typography>
          <DialogContentText>
            Created by {report.createdBy} in {report.date}
          </DialogContentText>
          <br />
          <Typography variant="h5">Features that appeared on the assessment</Typography>
          <BarChart
            series={[
              { data: [120, 130, 115, 140, 110], stack: 'Blood Pressure', label: 'Systolic BP' },
              { data: [80, 85, 78, 90, 82], stack: 'Blood Pressure', label: 'Diastolic BP' },
              { data: [190, 220, 210, 180, 200], stack: 'Cholesterol', label: 'Total Cholesterol' },
              { data: [60, 75, 65, 70, 68], stack: 'Heart Rate', label: 'Heart Rate' }
            ]}
            width={600}
            height={350}
          />
          <DialogContentText>Last modified in 2024-03-08</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
