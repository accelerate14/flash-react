import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditEmployeeForm from './EditEmployeeForm';

const EditEmployeeOverlay = ({ open, onClose, onSuccess, employeeData }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="edit-employee-slide-in"
      PaperProps={{
        sx: {
          width: { xs: '90%', sm: '400px' },
          maxWidth: '90%',
          height: '100%',
          maxHeight: '100%',
          position: 'fixed',
          top: 0,
          right: 0,
          m: 0,
          borderRadius: 0,
          boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
          transform: open ? 'translateX(0)' : 'translateX(100%)', // Slide in/out based on 'open'
          transition: 'transform 0.3s ease-in-out',
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Edit Employee
        <IconButton aria-label="close" onClick={onClose} sx={{ p: 0 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ py: 2, overflowY: 'auto' }}>
        <EditEmployeeForm onSuccess={onSuccess} onCancel={onClose} employeeData={employeeData} />
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeOverlay;