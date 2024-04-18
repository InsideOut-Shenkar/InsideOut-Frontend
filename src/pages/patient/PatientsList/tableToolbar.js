import { IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const TableToolbar = ({ selectedRowCount, onDeleteSelected }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: 1 }}>
    <IconButton onClick={onDeleteSelected} disabled={selectedRowCount === 0}>
      <DeleteIcon />
    </IconButton>
  </Box>
);

export default TableToolbar;
