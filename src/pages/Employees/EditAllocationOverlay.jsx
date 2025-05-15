import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditAllocationForm from './EditAllocationForm'; // Assuming your form will be in EditAllocationForm.js

const EditAllocationOverlay = ({ open, onClose, onSuccess, allocationData }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="edit-allocation-slide-in"
      PaperProps={{
        sx: {
          width: { xs: '90%', sm: '400px' }, // Adjust width as needed
          maxWidth: '90%',
          height: '100%',
          maxHeight: '100%',
          position: 'fixed',
          top: 0,
          right: 0,
          m: 0,
          borderRadius: 0,
          boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <IconButton aria-label="close" onClick={onClose} sx={{ p: 0 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ py: 2, overflowY: 'auto' }}>
        <EditAllocationForm onSuccess={onSuccess} onCancel={onClose} allocationData={allocationData} />
      </DialogContent>
    </Dialog>
  );
};

export default EditAllocationOverlay;