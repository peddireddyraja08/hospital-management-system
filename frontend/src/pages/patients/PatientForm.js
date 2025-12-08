import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Grid,
  MenuItem,
} from '@mui/material';
import { patientAPI } from '../../services/api';

export default function PatientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    patientType: 'OUTPATIENT',
    phoneNumber: '',
    email: '',
    address: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    insuranceNumber: '',
    insuranceProvider: '',
    allergies: '',
    medicalHistory: '',
  });

  useEffect(() => {
    if (id) {
      fetchPatient();
    }
  }, [id]);

  const fetchPatient = async () => {
    try {
      const response = await patientAPI.getById(id);
      setPatient(response.data.data);
    } catch (error) {
      console.error('Error fetching patient:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean up the patient data - remove empty strings for optional enum fields
      const patientData = {
        ...patient,
        gender: patient.gender || null,
        bloodGroup: patient.bloodGroup || null,
        dateOfBirth: patient.dateOfBirth || null,
        email: patient.email?.trim() || null,
        phoneNumber: patient.phoneNumber?.trim() || null,
        address: patient.address?.trim() || null,
        emergencyContactName: patient.emergencyContactName?.trim() || null,
        emergencyContactNumber: patient.emergencyContactNumber?.trim() || null,
        insuranceNumber: patient.insuranceNumber?.trim() || null,
        insuranceProvider: patient.insuranceProvider?.trim() || null,
        allergies: patient.allergies?.trim() || null,
        medicalHistory: patient.medicalHistory?.trim() || null,
      };

      if (id) {
        await patientAPI.update(id, patientData);
      } else {
        await patientAPI.create(patientData);
      }
      navigate('/patients');
    } catch (error) {
      console.error('Error saving patient:', error);
      alert('Error saving patient: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {id ? 'Edit Patient' : 'Add New Patient'}
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="First Name"
                name="firstName"
                value={patient.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Last Name"
                name="lastName"
                value={patient.lastName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={patient.dateOfBirth}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Gender"
                name="gender"
                value={patient.gender}
                onChange={handleChange}
              >
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Blood Group"
                name="bloodGroup"
                value={patient.bloodGroup}
                onChange={handleChange}
              >
                {['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 
                  'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE'].map(bg => (
                  <MenuItem key={bg} value={bg}>{bg.replace('_', ' ')}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                select
                label="Patient Type"
                name="patientType"
                value={patient.patientType}
                onChange={handleChange}
                helperText="Select INPATIENT for admitted patients. Type will auto-update on admission."
              >
                <MenuItem value="OUTPATIENT">Outpatient (OPD) - Walk-in/Consultation</MenuItem>
                <MenuItem value="INPATIENT">Inpatient (IPD) - Admitted/Hospitalized</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={patient.phoneNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={patient.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={2}
                value={patient.address}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Emergency Contact Name"
                name="emergencyContactName"
                value={patient.emergencyContactName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Emergency Contact Number"
                name="emergencyContactNumber"
                value={patient.emergencyContactNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Insurance Number"
                name="insuranceNumber"
                value={patient.insuranceNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Insurance Provider"
                name="insuranceProvider"
                value={patient.insuranceProvider}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Allergies"
                name="allergies"
                multiline
                rows={2}
                value={patient.allergies}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Medical History"
                name="medicalHistory"
                multiline
                rows={3}
                value={patient.medicalHistory}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" gap={2}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/patients')}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
