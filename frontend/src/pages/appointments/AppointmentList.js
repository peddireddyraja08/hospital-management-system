import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
} from '@mui/material';
import { Add, Cancel, CheckCircle } from '@mui/icons-material';
import { appointmentAPI, doctorAPI, patientAPI } from '../../services/api';

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    duration: 30,
    reason: '',
    appointmentType: 'CONSULTATION',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [apptResponse, docResponse, patResponse] = await Promise.all([
        appointmentAPI.getAll(),
        doctorAPI.getAll(),
        patientAPI.getAll(),
      ]);
      setAppointments(apptResponse.data.data);
      setDoctors(docResponse.data.data);
      setPatients(patResponse.data.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const appointmentData = {
        ...formData,
        patient: { id: formData.patientId },
        doctor: { id: formData.doctorId },
      };
      await appointmentAPI.create(appointmentData);
      setOpenDialog(false);
      loadData();
      setFormData({
        patientId: '',
        doctorId: '',
        appointmentDate: '',
        duration: 30,
        reason: '',
        appointmentType: 'CONSULTATION',
        notes: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create appointment');
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentAPI.cancel(id);
        loadData();
      } catch (err) {
        setError('Failed to cancel appointment');
      }
    }
  };

  const handleComplete = async (id) => {
    try {
      await appointmentAPI.complete(id);
      loadData();
    } catch (err) {
      setError('Failed to complete appointment');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED': return 'primary';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'error';
      case 'NO_SHOW': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Appointments</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Book Appointment
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date & Time</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Loading...</TableCell>
              </TableRow>
            ) : appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No appointments found</TableCell>
              </TableRow>
            ) : (
              appointments.map((apt) => (
                <TableRow key={apt.id}>
                  <TableCell>{new Date(apt.appointmentDate).toLocaleString()}</TableCell>
                  <TableCell>{apt.patient ? `${apt.patient.firstName} ${apt.patient.lastName}` : 'N/A'}</TableCell>
                  <TableCell>{apt.doctor ? `Dr. ${apt.doctor.firstName} ${apt.doctor.lastName}` : 'N/A'}</TableCell>
                  <TableCell>{apt.appointmentType}</TableCell>
                  <TableCell>{apt.duration} min</TableCell>
                  <TableCell>
                    <Chip label={apt.status} color={getStatusColor(apt.status)} size="small" />
                  </TableCell>
                  <TableCell>
                    {apt.status === 'SCHEDULED' && (
                      <>
                        <IconButton size="small" color="success" onClick={() => handleComplete(apt.id)}>
                          <CheckCircle />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleCancel(apt.id)}>
                          <Cancel />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Book New Appointment</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  required
                  label="Patient"
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                >
                  {patients.map((patient) => (
                    <MenuItem key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName} ({patient.patientId})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  required
                  label="Doctor"
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                >
                  {doctors.map((doctor) => (
                    <MenuItem key={doctor.id} value={doctor.id}>
                      Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  type="datetime-local"
                  label="Appointment Date & Time"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Type"
                  value={formData.appointmentType}
                  onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}
                >
                  <MenuItem value="CONSULTATION">Consultation</MenuItem>
                  <MenuItem value="FOLLOW_UP">Follow-up</MenuItem>
                  <MenuItem value="EMERGENCY">Emergency</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Duration (minutes)"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Book Appointment</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
