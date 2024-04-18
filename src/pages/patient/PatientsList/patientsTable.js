import React, { useEffect, useState, forwardRef, useRef } from 'react';

// material-ui
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogContent, DialogActions, DialogTitle, DialogContentText, Slide } from '@mui/material';

// project import
import TableToolbar from './tableToolbar';
import NoRowsOverlay from './NoRowsOverlay';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const fields = [
  {
    field: 'idNumber',
    headerName: 'ID Number'
  },
  {
    field: 'age',
    headerName: 'Age'
  },
  {
    field: 'assessmentNo',
    headerName: 'Assessments'
  },
  {
    field: 'addedBy',
    headerName: 'Added by'
  }
];

export default function PatientsTable({ data, handleDelete }) {
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [columns, setColumns] = useState([]);
  const dataGridRef = useRef(null);

  const handleSelectionChange = (newRowSelectionModel) => {
    setRowSelectionModel(newRowSelectionModel);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const updateColumnWidths = () => {
      const { offsetWidth } = dataGridRef.current;
      const columnWidth = Math.floor(offsetWidth * 0.19);
      setColumns(
        fields.map((field) => ({
          ...field,
          width: columnWidth
        }))
      );
    };
    updateColumnWidths();
  }, []);

  return (
    <Box ref={dataGridRef}>
      <DataGrid
        autoHeight
        columns={columns}
        rows={data}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 }
          }
        }}
        checkboxSelection
        pageSizeOptions={[10, 25, 50, 100]}
        slots={{ noResultsOverlay: NoRowsOverlay, noRowsOverlay: NoRowsOverlay, toolbar: TableToolbar }}
        slotProps={{
          toolbar: {
            selectedRowCount: rowSelectionModel.length,
            onDeleteSelected: handleClickOpen
          }
        }}
        sx={{ '--DataGrid-overlayHeight': '300px' }}
        onRowSelectionModelChange={handleSelectionChange}
        rowSelectionModel={rowSelectionModel}
      />
      <Dialog open={open} TransitionComponent={Transition} onClose={handleClose} aria-describedby="alert-dialog-slide-description">
        <DialogTitle>{'Confirm Deletion'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete the selected {rowSelectionModel.length === 1 ? 'row' : 'rows'}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleClose();
              handleDelete(rowSelectionModel);
            }}
            color="secondary"
            sx={{
              '&:hover': {
                backgroundColor: 'red',
                color: '#fff'
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
