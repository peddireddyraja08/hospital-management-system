import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  LocalHospital as TransferIcon,
  Assignment as OrderIcon,
  Science as LabIcon,
  Medication as MedicationIcon,
  ExitToApp as DischargeIcon,
  Assessment as VitalsIcon,
  NoteAdd as NoteIcon,
  SwapHoriz as SwapIcon,
} from '@mui/icons-material';
import { admissionAPI, bedAPI } from '../../../services/api';

const QuickActionsPanel = ({ selectedAdmission, onRefresh }) => {
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [dischargeDialogOpen, setDischargeDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [availableBeds, setAvailableBeds] = useState([]);
  const [selectedBedId, setSelectedBedId] = useState('');
  const [dischargeNotes, setDischargeNotes] = useState('');

  const handleTransferClick = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch available beds in same ward first, then all
      const response = selectedAdmission?.bed?.wardName
        ? await bedAPI.getAvailableByWard(selectedAdmission.bed.wardName)
        : await bedAPI.getAvailable();
      
      setAvailableBeds(response.data.data || []);
      setTransferDialogOpen(true);
    } catch (err) {
      setError('Failed to load available beds');
    } finally {
      setLoading(false);
    }
  };

  const handleTransferConfirm = async () => {
    if (!selectedBedId) {
      setError('Please select a bed');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await admissionAPI.transfer(selectedAdmission.id, selectedBedId);
      setSuccess('Patient transferred successfully');
      setTransferDialogOpen(false);
      setSelectedBedId('');
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to transfer patient');
    } finally {
      setLoading(false);
    }
  };

  const handleDischargeClick = () => {
    setDischargeDialogOpen(true);
  };

  const handleDischargeConfirm = async () => {
    try {
      setLoading(true);
      setError(null);
      await admissionAPI.discharge(selectedAdmission.id);
      setSuccess('Patient discharged successfully');
      setDischargeDialogOpen(false);
      setDischargeNotes('');
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to discharge patient');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      icon: <VitalsIcon />,
      label: 'Record Vitals',
      color: 'primary',
      onClick: () => alert('Record Vitals - Coming soon'),
      disabled: !selectedAdmission,
    },
    {
      icon: <OrderIcon />,
      label: 'New Order',
      color: 'primary',
      onClick: () => alert('New Order - Coming soon'),
      disabled: !selectedAdmission,
    },
    {
      icon: <LabIcon />,
      label: 'Lab Request',
      color: 'info',
      onClick: () => alert('Lab Request - Coming soon'),
      disabled: !selectedAdmission,
    },
    {
      icon: <MedicationIcon />,
      label: 'Prescribe Medication',
      color: 'success',
      onClick: () => alert('Prescribe Medication - Coming soon'),
      disabled: !selectedAdmission,
    },
    {
      icon: <SwapIcon />,
      label: 'Transfer Patient',
      color: 'warning',
      onClick: handleTransferClick,
      disabled: !selectedAdmission,
    },
    {
      icon: <DischargeIcon />,
      label: 'Discharge Patient',
      color: 'error',
      onClick: handleDischargeClick,
      disabled: !selectedAdmission || selectedAdmission.status === 'DISCHARGED',
    },
  ];

  return (
    <>
      <Paper sx={{ height: 'calc(100vh - 350px)', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight="bold">
            Quick Actions
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Common operations
          </Typography>
        </Box>

        {/* Success/Error Messages */}
        {success && (
          <Alert severity="success" sx={{ m: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ m: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Actions List */}
        <List sx={{ flex: 1, overflow: 'auto', p: 1 }}>
          {!selectedAdmission ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Select a patient to see available actions
              </Typography>
            </Box>
          ) : (
            quickActions.map((action, index) => (
              <React.Fragment key={index}>
                <ListItem
                  button
                  onClick={action.onClick}
                  disabled={action.disabled}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': {
                      bgcolor: action.color + '.light',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: action.color + '.main' }}>
                    {action.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={action.label}
                    primaryTypographyProps={{ fontWeight: 'medium', fontSize: '0.9rem' }}
                  />
                </ListItem>
              </React.Fragment>
            ))
          )}
        </List>

        {/* Patient Info Footer */}
        {selectedAdmission && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
            <Typography variant="caption" display="block" color="text.secondary">
              Selected Patient
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {selectedAdmission.patient?.firstName} {selectedAdmission.patient?.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {selectedAdmission.bed?.wardName} - {selectedAdmission.bed?.bedNumber}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Transfer Dialog */}
      <Dialog open={transferDialogOpen} onClose={() => setTransferDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Transfer Patient</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Transfer {selectedAdmission?.patient?.firstName} {selectedAdmission?.patient?.lastName} to a new bed
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : availableBeds.length === 0 ? (
            <Alert severity="warning" sx={{ mt: 2 }}>
              No available beds found
            </Alert>
          ) : (
            <TextField
              select
              fullWidth
              label="Select Bed"
              value={selectedBedId}
              onChange={(e) => setSelectedBedId(e.target.value)}
              SelectProps={{ native: true }}
              sx={{ mt: 2 }}
            >
              <option value="">-- Select a bed --</option>
              {availableBeds.map((bed) => (
                <option key={bed.id} value={bed.id}>
                  {bed.wardName} - {bed.bedNumber} ({bed.bedType})
                </option>
              ))}
            </TextField>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransferDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleTransferConfirm}
            variant="contained"
            disabled={loading || !selectedBedId || availableBeds.length === 0}
          >
            {loading ? 'Transferring...' : 'Transfer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Discharge Dialog */}
      <Dialog open={dischargeDialogOpen} onClose={() => setDischargeDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Discharge Patient</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to discharge {selectedAdmission?.patient?.firstName} {selectedAdmission?.patient?.lastName}?
            This action cannot be easily undone.
          </Alert>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Discharge Notes (Optional)"
            value={dischargeNotes}
            onChange={(e) => setDischargeNotes(e.target.value)}
            placeholder="Enter any discharge notes or instructions..."
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDischargeDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleDischargeConfirm}
            variant="contained"
            color="error"
            disabled={loading}
          >
            {loading ? 'Discharging...' : 'Discharge Patient'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default QuickActionsPanel;
