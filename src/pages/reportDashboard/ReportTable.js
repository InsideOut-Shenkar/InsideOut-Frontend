import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Box, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

// project import
import Dot from 'components/@extended/Dot';
import ReportDialog from './reportDialog';

function createData(reportNo, createdBy, patientID, date, risk) {
  return { reportNo, createdBy, patientID, date, risk };
}

const rows = [
  createData('R001', 'Dr. Smith', 'P1001', '2024-03-01', '0'),
  createData('R002', 'Dr. Johnson', 'P1002', '2024-03-02', '2'),
  createData('R003', 'Dr. Williams', 'P1003', '2024-03-03', '1'),
  createData('R004', 'Dr. Brown', 'P1004', '2024-03-04', '2'),
  createData('R005', 'Dr. Jones', 'P1005', '2024-03-05', '0'),
  createData('R006', 'Dr. Garcia', 'P1006', '2024-03-06', '1'),
  createData('R007', 'Dr. Miller', 'P1007', '2024-03-07', '2'),
  createData('R008', 'Dr. Davis', 'P1008', '2024-03-08', '1'),
  createData('R009', 'Dr. Martinez', 'P1009', '2024-03-09', '0'),
  createData('R010', 'Dr. Hernandez', 'P1010', '2024-03-10', '2'),
  createData('R011', 'Dr. Lopez', 'P1011', '2024-03-11', '0'),
  createData('R012', 'Dr. Wilson', 'P1012', '2024-03-12', '2'),
  createData('R013', 'Dr. Anderson', 'P1013', '2024-03-13', '0'),
  createData('R014', 'Dr. Thomas', 'P1014', '2024-03-14', '1'),
  createData('R015', 'Dr. Taylor', 'P1015', '2024-03-15', '2')
];

// ==============================|| REPORTS TABLE - HEADER CELL ||============================== //

const headCells = [
  {
    id: 'reportNo',
    align: 'left',
    disablePadding: false,
    label: 'Report No.'
  },
  {
    id: 'createdBy',
    align: 'left',
    disablePadding: false,
    label: 'Created by'
  },
  {
    id: 'patientID',
    align: 'left',
    disablePadding: true,
    label: 'Patient ID'
  },
  {
    id: 'date',
    align: 'left',
    disablePadding: false,
    label: 'Date'
  },
  {
    id: 'risk',
    align: 'left',
    disablePadding: false,
    label: 'Risk'
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function ReportTableHead({ report, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? report : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

ReportTableHead.propTypes = {
  report: PropTypes.string,
  orderBy: PropTypes.string
};

// ==============================|| ORDER TABLE - STATUS ||============================== //

const ReportStatus = ({ status }) => {
  let color;
  let title;

  status = Number(status);

  switch (status) {
    case 0:
      color = 'warning';
      title = 'Medium';
      break;
    case 1:
      color = 'error';
      title = 'High';
      break;
    case 2:
      color = 'primary';
      title = 'Low';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
};

ReportStatus.propTypes = {
  status: PropTypes.number
};

// ==============================|| ORDER TABLE ||============================== //

const mocReport = rows[1];

export default function ReportTable() {
  const [report] = useState('asc');
  const [orderBy] = useState('reportNo');
  const [selected] = useState([]);

  const isSelected = (reportNo) => selected.indexOf(reportNo) !== -1;

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          sx={{
            '& .MuiTableCell-root:first-of-type': {
              pl: 2
            },
            '& .MuiTableCell-root:last-of-type': {
              pr: 3
            }
          }}
        >
          <ReportTableHead report={report} orderBy={orderBy} />
          <TableBody>
            {rows.map((row, index) => {
              const isItemSelected = isSelected(row.reportNo);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.reportNo}
                  selected={isItemSelected}
                >
                  <TableCell component="th" id={labelId} scope="row" align="left">
                    <Link color="secondary" component={RouterLink} to="">
                      {row.reportNo}
                    </Link>
                  </TableCell>
                  <TableCell align="left">{row.createdBy}</TableCell>
                  <TableCell align="left">{row.patientID}</TableCell>
                  <TableCell align="left">{row.date}</TableCell>
                  <TableCell align="left">
                    <ReportStatus status={row.risk} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <ReportDialog report={mocReport} />
    </Box>
  );
}
