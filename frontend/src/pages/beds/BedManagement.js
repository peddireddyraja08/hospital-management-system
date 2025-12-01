import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Hotel, LocalHospital, Build, Add, Edit, Delete } from '@mui/icons-material';
import { bedAPI, patientAPI } from '../../services/api';

export default function BedManagement() {
  const [beds, setBeds] = useState([]);
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedBed, setSelectedBed] = useState(null);
  const [openAdmitDialog, setOpenAdmitDialog] = useState(false);
  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const [openBedDialog, setOpenBedDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [targetBedId, setTargetBedId] = useState('');
  const [bedFormData, setBedFormData] = useState({
    bedNumber: '',
    wardName: '',
    roomNumber: '',
    floorNumber: '',
    bedType: '',
    dailyCharge: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bedResponse, patientResponse] = await Promise.all([
        bedAPI.getAll(),
        patientAPI.getAll(),
      ]);
      setBeds(bedResponse.data.data);
      setPatients(patientResponse.data.data);
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const handleAdmit = async () => {
    try {
      await bedAPI.admitPatient(selectedBed.id, selectedPatient);
      setOpenAdmitDialog(false);
      setSelectedBed(null);
      setSelectedPatient('');
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to admit patient');
    }
  };

  const handleDischarge = async (bedId) => {
    if (window.confirm('Are you sure you want to discharge this patient?')) {
      try {
        await bedAPI.dischargePatient(bedId);
        loadData();
      } catch (err) {
        setError('Failed to discharge patient');
      }
    }
  };

  const handleTransfer = async () => {
    try {
      await bedAPI.transferPatient(selectedBed.id, targetBedId);
      setOpenTransferDialog(false);
      setSelectedBed(null);
      setTargetBedId('');
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to transfer patient');
    }
  };

  const handleMaintenance = async (bedId) => {
    try {
      await bedAPI.markForMaintenance(bedId);
      loadData();
    } catch (err) {
      setError('Failed to mark bed for maintenance');
    }
  };

  const handleMarkAvailable = async (bedId) => {
    try {
      await bedAPI.markAsAvailable(bedId);
      loadData();
    } catch (err) {
      setError('Failed to mark bed as available');
    }
  };

  const handleOpenBedDialog = () => {
    setOpenBedDialog(true);
    setEditMode(false);
    setBedFormData({
      bedNumber: '',
      wardName: '',
      roomNumber: '',
      floorNumber: '',
      bedType: '',
      dailyCharge: '',
    });
    setError('');
    setSuccess('');
  };

  const handleEditBed = (bed) => {
    setBedFormData({
      bedNumber: bed.bedNumber,
      wardName: bed.wardName,
      roomNumber: bed.roomNumber,
      floorNumber: bed.floorNumber,
      bedType: bed.bedType,
      dailyCharge: bed.dailyCharge,
    });
    setSelectedBed(bed);
    setEditMode(true);
    setOpenBedDialog(true);
  };

  const handleDeleteBed = async (bedId) => {
    if (window.confirm('Are you sure you want to delete this bed?')) {
      try {
        await bedAPI.delete(bedId);
        setSuccess('Bed deleted successfully');
        loadData();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete bed');
      }
    }
  };

  const handleBedFormChange = (e) => {
    setBedFormData({
      ...bedFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBedSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await bedAPI.update(selectedBed.id, bedFormData);
        setSuccess('Bed updated successfully');
      } else {
        await bedAPI.create(bedFormData);
        setSuccess('Bed created successfully');
      }
      setOpenBedDialog(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${editMode ? 'update' : 'create'} bed`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'success';
      case 'OCCUPIED': return 'error';
      case 'UNDER_MAINTENANCE': return 'warning';
      case 'CLEANING': return 'info';
      case 'RESERVED': return 'primary';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'UNDER_MAINTENANCE': return <Build />;
      case 'OCCUPIED': return <LocalHospital />;
      default: return <Hotel />;
    }
  };

  const groupByWard = (beds) => {
    return beds.reduce((acc, bed) => {
      if (!acc[bed.wardName]) {
        acc[bed.wardName] = [];
      }
      acc[bed.wardName].push(bed);
      return acc;
    }, {});
  };

  const bedsByWard = groupByWard(beds);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Bed Management (ADT)
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenBedDialog}>
          Add Bed
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {Object.entries(bedsByWard).map(([wardName, wardBeds]) => (
        <Box key={wardName} sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>{wardName}</Typography>
          <Grid container spacing={2}>
            {wardBeds.map((bed) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={bed.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      {getStatusIcon(bed.status)}
                      <Chip
                        label={bed.status}
                        color={getStatusColor(bed.status)}
                        size="small"
                      />
                    </Box>
                    <Typography variant="h6">{bed.bedNumber}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Type: {bed.bedType}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Room: {bed.roomNumber} | Floor: {bed.floorNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Charge: ₹{bed.dailyCharge}/day
                    </Typography>
                    {bed.currentPatient && (
                      <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                        Patient: {bed.currentPatient.firstName} {bed.currentPatient.lastName}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    {bed.status === 'AVAILABLE' && (
                      <>
                        <Button
                          size="small"
                          onClick={() => {
                            setSelectedBed(bed);
                            setOpenAdmitDialog(true);
                          }}
                        >
                          Admit
                        </Button>
                        <Button size="small" onClick={() => handleMaintenance(bed.id)}>
                          Maintenance
                        </Button>
                        <IconButton size="small" color="primary" onClick={() => handleEditBed(bed)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteBed(bed.id)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </>
                    )}
                    {bed.status === 'OCCUPIED' && (
                      <>
                        <Button size="small" color="error" onClick={() => handleDischarge(bed.id)}>
                          Discharge
                        </Button>
                        <Button
                          size="small"
                          onClick={() => {
                            setSelectedBed(bed);
                            setOpenTransferDialog(true);
                          }}
                        >
                          Transfer
                        </Button>
                      </>
                    )}
                    {bed.status === 'UNDER_MAINTENANCE' && (
                      <>
                        <Button size="small" color="success" onClick={() => handleMarkAvailable(bed.id)}>
                          Mark Available
                        </Button>
                        <IconButton size="small" color="primary" onClick={() => handleEditBed(bed)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteBed(bed.id)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {/* Admit Patient Dialog */}
      <Dialog open={openAdmitDialog} onClose={() => setOpenAdmitDialog(false)}>
        <DialogTitle>Admit Patient to {selectedBed?.bedNumber}</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Select Patient"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            sx={{ mt: 2, minWidth: 300 }}
          >
            {patients.map((patient) => (
              <MenuItem key={patient.id} value={patient.id}>
                {patient.firstName} {patient.lastName} ({patient.patientId})
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdmitDialog(false)}>Cancel</Button>
          <Button onClick={handleAdmit} variant="contained" disabled={!selectedPatient}>
            Admit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Transfer Patient Dialog */}
      <Dialog open={openTransferDialog} onClose={() => setOpenTransferDialog(false)}>
        <DialogTitle>Transfer Patient from {selectedBed?.bedNumber}</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Select Target Bed"
            value={targetBedId}
            onChange={(e) => setTargetBedId(e.target.value)}
            sx={{ mt: 2, minWidth: 300 }}
          >
            {beds
              .filter((bed) => bed.status === 'AVAILABLE')
              .map((bed) => (
                <MenuItem key={bed.id} value={bed.id}>
                  {bed.bedNumber} - {bed.wardName} ({bed.bedType})
                </MenuItem>
              ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTransferDialog(false)}>Cancel</Button>
          <Button onClick={handleTransfer} variant="contained" disabled={!targetBedId}>
            Transfer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create/Edit Bed Dialog */}
      <Dialog open={openBedDialog} onClose={() => setOpenBedDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleBedSubmit}>
          <DialogTitle>{editMode ? 'Edit Bed' : 'Add New Bed'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bed Number"
                  name="bedNumber"
                  value={bedFormData.bedNumber}
                  onChange={handleBedFormChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ward Name"
                  name="wardName"
                  value={bedFormData.wardName}
                  onChange={handleBedFormChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Room Number"
                  name="roomNumber"
                  value={bedFormData.roomNumber}
                  onChange={handleBedFormChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Floor Number"
                  name="floorNumber"
                  type="number"
                  value={bedFormData.floorNumber}
                  onChange={handleBedFormChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Bed Type"
                  name="bedType"
                  value={bedFormData.bedType}
                  onChange={handleBedFormChange}
                  required
                >
                  <MenuItem value="ICU">ICU</MenuItem>
                  <MenuItem value="General">General</MenuItem>
                  <MenuItem value="Private">Private</MenuItem>
                  <MenuItem value="Semi-Private">Semi-Private</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Daily Charge"
                  name="dailyCharge"
                  type="number"
                  value={bedFormData.dailyCharge}
                  onChange={handleBedFormChange}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenBedDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editMode ? 'Update Bed' : 'Create Bed'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
