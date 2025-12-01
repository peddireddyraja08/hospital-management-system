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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Grid,
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { medicalRecordAPI, patientAPI, doctorAPI } from '../../services/api';

export default function MedicalRecordsList() {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    visitDate: '',
    chiefComplaint: '',
    diagnosis: '',
    treatmentPlan: '',
    prescriptions: '',
    notes: '',
    followUpDate: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [recordsRes, patientsRes, doctorsRes] = await Promise.all([
        medicalRecordAPI.getAll(),
        patientAPI.getAll(),
        doctorAPI.getAll(),
      ]);
      setRecords(recordsRes.data.data);
      setPatients(patientsRes.data.data);
      setDoctors(doctorsRes.data.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setEditMode(false);
    setFormData({
      patientId: '',
      doctorId: '',
      visitDate: '',
      chiefComplaint: '',
      diagnosis: '',
      treatmentPlan: '',
      prescriptions: '',
      notes: '',
      followUpDate: '',
    });
    setError('');
    setSuccess('');
  };

  const handleEditRecord = (record) => {
    setFormData({
      patientId: record.patient.id,
      doctorId: record.doctor.id,
      visitDate: record.visitDate,
      chiefComplaint: record.chiefComplaint,
      diagnosis: record.diagnosis,
      treatmentPlan: record.treatmentPlan,
      prescriptions: record.prescriptions,
      notes: record.notes,
      followUpDate: record.followUpDate || '',
    });
    setSelectedRecord(record);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setOpenViewDialog(true);
  };

  const handleDeleteRecord = async (id) => {
    if (window.confirm('Are you sure you want to delete this medical record?')) {
      try {
        await medicalRecordAPI.delete(id);
        setSuccess('Medical record deleted successfully');
        loadData();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete record');
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await medicalRecordAPI.update(selectedRecord.id, formData);
        setSuccess('Medical record updated successfully');
      } else {
        await medicalRecordAPI.create(formData);
        setSuccess('Medical record created successfully');
      }
      setOpenDialog(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${editMode ? 'update' : 'create'} record`);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Medical Records
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenDialog}>
          Add Record
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Visit Date</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Chief Complaint</TableCell>
              <TableCell>Diagnosis</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Loading...</TableCell>
              </TableRow>
            ) : records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No medical records found</TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.visitDate}</TableCell>
                  <TableCell>{record.patient.firstName} {record.patient.lastName}</TableCell>
                  <TableCell>Dr. {record.doctor.firstName} {record.doctor.lastName}</TableCell>
                  <TableCell>{record.chiefComplaint}</TableCell>
                  <TableCell>{record.diagnosis}</TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary" onClick={() => handleViewRecord(record)}>
                      <Visibility />
                    </IconButton>
                    <IconButton size="small" color="primary" onClick={() => handleEditRecord(record)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteRecord(record.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editMode ? 'Edit Medical Record' : 'Add Medical Record'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Patient"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  required
                >
                  {patients.map((patient) => (
                    <MenuItem key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName} ({patient.patientId})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Doctor"
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  required
                >
                  {doctors.map((doctor) => (
                    <MenuItem key={doctor.id} value={doctor.id}>
                      Dr. {doctor.firstName} {doctor.lastName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Visit Date"
                  name="visitDate"
                  type="date"
                  value={formData.visitDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Follow Up Date"
                  name="followUpDate"
                  type="date"
                  value={formData.followUpDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Chief Complaint"
                  name="chiefComplaint"
                  value={formData.chiefComplaint}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Diagnosis"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Treatment Plan"
                  name="treatmentPlan"
                  value={formData.treatmentPlan}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Prescriptions"
                  name="prescriptions"
                  value={formData.prescriptions}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editMode ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Medical Record Details</DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Patient</Typography>
                <Typography>{selectedRecord.patient.firstName} {selectedRecord.patient.lastName}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Doctor</Typography>
                <Typography>Dr. {selectedRecord.doctor.firstName} {selectedRecord.doctor.lastName}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Visit Date</Typography>
                <Typography>{selectedRecord.visitDate}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Follow Up Date</Typography>
                <Typography>{selectedRecord.followUpDate || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Chief Complaint</Typography>
                <Typography>{selectedRecord.chiefComplaint}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Diagnosis</Typography>
                <Typography>{selectedRecord.diagnosis}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Treatment Plan</Typography>
                <Typography>{selectedRecord.treatmentPlan}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Prescriptions</Typography>
                <Typography>{selectedRecord.prescriptions || 'None'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Notes</Typography>
                <Typography>{selectedRecord.notes || 'None'}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
