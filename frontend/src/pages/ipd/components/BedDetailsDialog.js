import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  Avatar,
  Divider,
  Card,
  CardContent,
  TextField,
  Alert,
  CircularProgress,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  LocalHospital as HospitalIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Build as MaintenanceIcon,
  CleaningServices as CleaningIcon,
  CheckCircle as AvailableIcon,
  Block as BlockIcon,
  SwapHoriz as TransferIcon,
} from '@mui/icons-material';
import { formatDateShort } from '../../../utils/dateUtils';
import { bedAPI, admissionAPI } from '../../../services/api';

const TabPanel = ({ children, value, index }) => (
  <Box hidden={value !== index} sx={{ py: 2 }}>
    {value === index && children}
  </Box>
);

const BedDetailsDialog = ({ bed, open, onClose, onRefresh }) => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(null);

  const getBedStatusColor = (status) => {
    const colors = {
      AVAILABLE: 'success',
      OCCUPIED: 'error',
      CLEANING: 'warning',
      UNDER_MAINTENANCE: 'default',
      RESERVED: 'info',
      BLOCKED: 'default',
    };
    return colors[status] || 'default';
  };

  const getBedStatusIcon = (status) => {
    const icons = {
      AVAILABLE: <AvailableIcon />,
      OCCUPIED: <PersonIcon />,
      CLEANING: <CleaningIcon />,
      UNDER_MAINTENANCE: <MaintenanceIcon />,
      RESERVED: <CalendarIcon />,
      BLOCKED: <BlockIcon />,
    };
    return icons[status] || <HospitalIcon />;
  };

  const handleDischarge = async () => {
    if (!bed.currentAdmission?.id) return;
    
    if (!window.confirm(`Discharge patient ${bed.currentPatient?.firstName} ${bed.currentPatient?.lastName}?`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setActionInProgress('discharge');
      await admissionAPI.discharge(bed.currentAdmission.id);
      setSuccess('Patient discharged successfully');
      setTimeout(() => {
        onRefresh();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to discharge patient');
    } finally {
      setLoading(false);
      setActionInProgress(null);
    }
  };

  const handleMarkForCleaning = async () => {
    try {
      setLoading(true);
      setError(null);
      setActionInProgress('cleaning');
      // In a real app, you'd call: await bedAPI.markForCleaning(bed.id);
      alert('This would mark the bed for cleaning');
      onRefresh();
      onClose();
    } catch (err) {
      setError('Failed to mark bed for cleaning');
    } finally {
      setLoading(false);
      setActionInProgress(null);
    }
  };

  const handleMarkForMaintenance = async () => {
    try {
      setLoading(true);
      setError(null);
      setActionInProgress('maintenance');
      await bedAPI.markForMaintenance(bed.id);
      setSuccess('Bed marked for maintenance');
      setTimeout(() => {
        onRefresh();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark bed for maintenance');
    } finally {
      setLoading(false);
      setActionInProgress(null);
    }
  };

  const handleMarkAsAvailable = async () => {
    try {
      setLoading(true);
      setError(null);
      setActionInProgress('available');
      await bedAPI.markAsAvailable(bed.id);
      setSuccess('Bed marked as available');
      setTimeout(() => {
        onRefresh();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark bed as available');
    } finally {
      setLoading(false);
      setActionInProgress(null);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: getBedStatusColor(bed.bedStatus) + '.main',
                width: 56,
                height: 56,
              }}
            >
              {getBedStatusIcon(bed.bedStatus)}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {bed.wardName} - Bed {bed.bedNumber}
              </Typography>
              <Chip
                label={bed.bedStatus.replace('_', ' ')}
                size="small"
                color={getBedStatusColor(bed.bedStatus)}
              />
            </Box>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Details" />
          <Tab label="Patient Info" disabled={!bed.currentPatient} />
          <Tab label="Actions" />
        </Tabs>

        {/* Bed Details Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="caption" color="text.secondary">Bed Type</Typography>
                  <Typography variant="body1" fontWeight="medium">{bed.bedType}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="caption" color="text.secondary">Daily Charge</Typography>
                  <Typography variant="body1" fontWeight="medium">₹{bed.dailyCharge || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="caption" color="text.secondary">Gender Preference</Typography>
                  <Typography variant="body1" fontWeight="medium">{bed.genderPreference || 'Any'}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="caption" color="text.secondary">Features</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                    {bed.isIsolation && <Chip label="Isolation" size="small" color="warning" />}
                    {bed.hasOxygen && <Chip label="Oxygen" size="small" variant="outlined" />}
                    {bed.hasMonitor && <Chip label="Monitor" size="small" variant="outlined" />}
                    {!bed.isIsolation && !bed.hasOxygen && !bed.hasMonitor && (
                      <Typography variant="body2" color="text.secondary">None</Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            {bed.description && (
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">Description</Typography>
                    <Typography variant="body2">{bed.description}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </TabPanel>

        {/* Patient Info Tab */}
        <TabPanel value={tabValue} index={1}>
          {bed.currentPatient ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ bgcolor: 'background.default' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
                        {bed.currentPatient.firstName?.[0]}{bed.currentPatient.lastName?.[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {bed.currentPatient.firstName} {bed.currentPatient.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Patient ID: {bed.currentPatient.patientId}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Gender</Typography>
                        <Typography variant="body2">{bed.currentPatient.gender}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Age</Typography>
                        <Typography variant="body2">{bed.currentPatient.age || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Blood Group</Typography>
                        <Typography variant="body2">{bed.currentPatient.bloodGroup || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Contact</Typography>
                        <Typography variant="body2">{bed.currentPatient.phone || 'N/A'}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              {bed.currentAdmission && (
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Admission Details
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">Admission Number</Typography>
                          <Typography variant="body2">{bed.currentAdmission.admissionNumber}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">Admission Date</Typography>
                          <Typography variant="body2">
                            {bed.currentAdmission.admissionDate 
                              ? formatDateShort(new Date(bed.currentAdmission.admissionDate))
                              : 'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">Chief Complaint</Typography>
                          <Typography variant="body2">{bed.currentAdmission.chiefComplaint || 'N/A'}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
              No patient currently assigned
            </Typography>
          )}
        </TabPanel>

        {/* Actions Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={2}>
            {bed.bedStatus === 'OCCUPIED' && bed.currentPatient && (
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  startIcon={<PersonIcon />}
                  onClick={handleDischarge}
                  disabled={loading}
                >
                  {actionInProgress === 'discharge' ? <CircularProgress size={24} /> : 'Discharge Patient'}
                </Button>
              </Grid>
            )}
            {bed.bedStatus === 'AVAILABLE' && (
              <Grid item xs={12}>
                <Alert severity="info">
                  Bed is available for admission. Use the admission form to assign a patient.
                </Alert>
              </Grid>
            )}
            {bed.bedStatus === 'OCCUPIED' && (
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<TransferIcon />}
                  onClick={() => alert('Transfer feature coming soon')}
                >
                  Transfer Patient
                </Button>
              </Grid>
            )}
            {(bed.bedStatus === 'AVAILABLE' || bed.bedStatus === 'CLEANING') && (
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="warning"
                  startIcon={<MaintenanceIcon />}
                  onClick={handleMarkForMaintenance}
                  disabled={loading}
                >
                  {actionInProgress === 'maintenance' ? <CircularProgress size={24} /> : 'Mark for Maintenance'}
                </Button>
              </Grid>
            )}
            {(bed.bedStatus === 'UNDER_MAINTENANCE' || bed.bedStatus === 'CLEANING') && (
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<AvailableIcon />}
                  onClick={handleMarkAsAvailable}
                  disabled={loading}
                >
                  {actionInProgress === 'available' ? <CircularProgress size={24} /> : 'Mark as Available'}
                </Button>
              </Grid>
            )}
          </Grid>
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BedDetailsDialog;
