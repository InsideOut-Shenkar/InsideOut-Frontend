import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

// project import
import TableToolbar from './tableToolbar';
import NoRowsOverlay from './NoRowsOverlay';
import DeleteDialog from './DeleteDialog';

const columns = [
  {
    field: 'idNumber',
    headerName: 'ID Number',
    flex: 1
  },
  {
    field: 'age',
    headerName: 'Age',
    flex: 1
  },
  {
    field: 'assessmentNo',
    headerName: 'Assessments',
    flex: 1
  },
  {
    field: 'addedBy',
    headerName: 'Added by',
    flex: 1
  }
];

const DataTable = ({ data, handleDelete }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [resize, setResize] = useState(false);
  const drawerState = useSelector((state) => state.menu.drawerOpen);

  const handleSelectionChange = (newRowSelectionModel) => {
    setRowSelectionModel(newRowSelectionModel);
  };

  const handleClickDelete = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    setResize(true);
    const timeoutId = setTimeout(() => setResize(false), 220);
    return () => clearTimeout(timeoutId);
  }, [drawerState]);

  return (
    <Box>
      {!resize ? (
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
          slots={{ noResultsOverlay: NoRowsOverlay, noRowsOverlay: NoRowsOverlay, toolbar: handleDelete ? TableToolbar : undefined }}
          slotProps={{
            toolbar: handleDelete
              ? {
                  selectedRowCount: rowSelectionModel.length,
                  onDeleteSelected: handleClickDelete
                }
              : undefined
          }}
          sx={{ '--DataGrid-overlayHeight': '300px' }}
          onRowSelectionModelChange={handleSelectionChange}
          rowSelectionModel={rowSelectionModel}
        />
      ) : (
        <></>
      )}
      <DeleteDialog open={openDialog} handleClose={handleCloseDialog} handleDelete={handleDelete} rowSelectionModel={rowSelectionModel} />
    </Box>
  );
};

export default DataTable;
