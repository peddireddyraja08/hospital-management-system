import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
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
} from '@mui/material';
import { Hotel, LocalHospital, Build } from '@mui/icons-material';
import { bedAPI, patientAPI } from '../../services/api';

export default function BedManagement() {
  const [beds, setBeds] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBed, setSelectedBed] = useState(null);
  const [openAdmitDialog, setOpenAdmitDialog] = useState(false);
  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [targetBedId, setTargetBedId] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bedResponse, patientResponse] = await Promise.all([
        bedAPI.getAll(),
        patientAPI.getAll(),
      ]);
      setBeds(bedResponse.data.data);
      setPatients(patientResponse.data.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
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
      <Typography variant="h4" gutterBottom>
        Bed Management (ADT)
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
                      <Button size="small" color="success" onClick={() => handleMarkAvailable(bed.id)}>
                        Mark Available
                      </Button>
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
    </Box>
  );
}
