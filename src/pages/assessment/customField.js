import { useState } from 'react';

// material-ui
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const CustomField = ({ addField }) => {
  const [newField, setNewField] = useState({ label: '', placeholder: '' });
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddField = () => {
    addField((prevFields) => [...prevFields, newField]);
    setOpenDialog(false);
  };

  return (
    <>
      <Button onClick={handleOpenDialog} variant="outlined">
        Add Custom Field
      </Button>
      {openDialog && (
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Add a Custom Field</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Field Label"
              type="text"
              fullWidth
              variant="outlined"
              value={newField.label}
              onChange={(e) => setNewField({ ...newField, label: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Placeholder"
              type="text"
              fullWidth
              variant="outlined"
              value={newField.placeholder}
              onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleAddField}>Add</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default CustomField;
