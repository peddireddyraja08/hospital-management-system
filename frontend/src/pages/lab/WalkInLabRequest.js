import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Autocomplete,
  Divider,
} from '@mui/material';
import { PersonAdd, Assignment } from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';
const token = localStorage.getItem('token');

const api = {
  createLabRequestWithPatient: (data) => axios.post(`${API_BASE_URL}/lab-test-requests/with-patient`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getAllLabTests: () => axios.get(`${API_BASE_URL}/lab-tests`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getAllPatients: () => axios.get(`${API_BASE_URL}/patients`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getAllDoctors: () => axios.get(`${API_BASE_URL}/doctors`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
};

const steps = ['Select Patient Type', 'Patient Information', 'Test Selection', 'Review & Submit'];

const BLOOD_GROUPS = ['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE'];
const GENDERS = ['MALE', 'FEMALE', 'OTHER'];
const PRIORITIES = ['ROUTINE', 'URGENT', 'STAT'];

export default function WalkInLabRequest() {
  const [activeStep, setActiveStep] = useState(0);
  const [patientType, setPatientType] = useState('new'); // 'new' or 'existing'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [labTests, setLabTests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [formData, setFormData] = useState({
    // Patient Info
    existingPatientId: null,
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    phoneNumber: '',
    email: '',
    address: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    
    // Lab Test Request Info
    labTestId: null,
    doctorId: null,
    priority: 'ROUTINE',
    clinicalNotes: '',
    specialInstructions: '',
  });

  useEffect(() => {
    loadLabTests();
    loadPatients();
    loadDoctors();
  }, []);

  const loadLabTests = async () => {
    try {
      const response = await api.getAllLabTests();
      setLabTests(response.data.data);
    } catch (err) {
      console.error('Failed to load lab tests:', err);
    }
  };

  const loadPatients = async () => {
    try {
      const response = await api.getAllPatients();
      setPatients(response.data.data);
    } catch (err) {
      console.error('Failed to load patients:', err);
    }
  };

  const loadDoctors = async () => {
    try {
      const response = await api.getAllDoctors();
      setDoctors(response.data.data);
    } catch (err) {
      console.error('Failed to load doctors:', err);
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && patientType === 'existing' && !formData.existingPatientId) {
      setError('Please select a patient');
      return;
    }
    if (activeStep === 2 && !formData.labTestId) {
      setError('Please select a lab test');
      return;
    }
    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const submitData = {
        ...formData,
        existingPatientId: patientType === 'existing' ? formData.existingPatientId : null,
      };
      
      await api.createLabRequestWithPatient(submitData);
      setSuccess('Lab test request created successfully! Patient registered as outpatient.');
      setTimeout(() => {
        window.location.href = '/dashboard/lab/samples';
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create lab test request');
      setTimeout(() => setError(''), 5000);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ p: 3 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Patient Registration Type</FormLabel>
              <RadioGroup
                value={patientType}
                onChange={(e) => setPatientType(e.target.value)}
              >
                <FormControlLabel 
                  value="new" 
                  control={<Radio />} 
                  label="New Patient (Walk-in - Will be registered as OUTPATIENT with OUT prefix)" 
                />
                <FormControlLabel 
                  value="existing" 
                  control={<Radio />} 
                  label="Existing Patient" 
                />
              </RadioGroup>
            </FormControl>

            {patientType === 'existing' && (
              <Box sx={{ mt: 3 }}>
                <Autocomplete
                  options={patients}
                  getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.patientId})`}
                  value={selectedPatient}
                  onChange={(e, value) => {
                    setSelectedPatient(value);
                    setFormData({ ...formData, existingPatientId: value?.id || null });
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Patient" required />
                  )}
                />
              </Box>
            )}
          </Box>
        );

      case 1:
        if (patientType === 'existing') {
          return (
            <Box sx={{ p: 3 }}>
              <Alert severity="info">Using existing patient information</Alert>
              {selectedPatient && (
                <Paper sx={{ p: 2, mt: 2, bgcolor: 'grey.100' }}>
                  <Typography><strong>Name:</strong> {selectedPatient.firstName} {selectedPatient.lastName}</Typography>
                  <Typography><strong>Patient ID:</strong> {selectedPatient.patientId}</Typography>
                  <Typography><strong>DOB:</strong> {selectedPatient.dateOfBirth}</Typography>
                  <Typography><strong>Gender:</strong> {selectedPatient.gender}</Typography>
                  <Typography><strong>Phone:</strong> {selectedPatient.phoneNumber}</Typography>
                </Paper>
              )}
            </Box>
          );
        }

        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>New Patient Registration (OUTPATIENT)</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  required
                >
                  {GENDERS.map((gender) => (
                    <MenuItem key={gender} value={gender}>{gender}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Blood Group"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                >
                  <MenuItem value="">Select Blood Group</MenuItem>
                  {BLOOD_GROUPS.map((bg) => (
                    <MenuItem key={bg} value={bg}>{bg.replace('_', ' ')}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Emergency Contact Name"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Emergency Contact Number"
                  value={formData.emergencyContactNumber}
                  onChange={(e) => setFormData({ ...formData, emergencyContactNumber: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Lab Test Selection</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Autocomplete
                  options={labTests}
                  getOptionLabel={(option) => `${option.testName} - ${option.testCode} (${option.category})`}
                  value={selectedTest}
                  onChange={(e, value) => {
                    setSelectedTest(value);
                    setFormData({ ...formData, labTestId: value?.id || null });
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Lab Test" required />
                  )}
                />
              </Grid>

              {selectedTest && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: 'info.light' }}>
                    <Typography variant="body2"><strong>Test:</strong> {selectedTest.testName}</Typography>
                    <Typography variant="body2"><strong>Category:</strong> {selectedTest.category}</Typography>
                    <Typography variant="body2"><strong>Price:</strong> ₹{selectedTest.price}</Typography>
                    <Typography variant="body2"><strong>TAT:</strong> {selectedTest.turnaroundTime}</Typography>
                    {selectedTest.requiresFasting && (
                      <Typography variant="body2" color="error"><strong>Requires Fasting</strong></Typography>
                    )}
                  </Paper>
                </Grid>
              )}

              <Grid item xs={12}>
                <Autocomplete
                  options={doctors}
                  getOptionLabel={(option) => `Dr. ${option.firstName} ${option.lastName} (${option.specialization})`}
                  value={selectedDoctor}
                  onChange={(e, value) => {
                    setSelectedDoctor(value);
                    setFormData({ ...formData, doctorId: value?.id || null });
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Referring Doctor (Optional)" />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  required
                >
                  {PRIORITIES.map((priority) => (
                    <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Clinical Notes"
                  value={formData.clinicalNotes}
                  onChange={(e) => setFormData({ ...formData, clinicalNotes: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Special Instructions"
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Review & Confirm</Typography>
            
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom><strong>Patient Information</strong></Typography>
              <Divider sx={{ mb: 1 }} />
              {patientType === 'new' ? (
                <>
                  <Typography variant="body2"><strong>Type:</strong> New OUTPATIENT (ID will be generated with OUT prefix)</Typography>
                  <Typography variant="body2"><strong>Name:</strong> {formData.firstName} {formData.lastName}</Typography>
                  <Typography variant="body2"><strong>DOB:</strong> {formData.dateOfBirth}</Typography>
                  <Typography variant="body2"><strong>Gender:</strong> {formData.gender}</Typography>
                  <Typography variant="body2"><strong>Phone:</strong> {formData.phoneNumber}</Typography>
                  <Typography variant="body2"><strong>Email:</strong> {formData.email || 'N/A'}</Typography>
                </>
              ) : (
                <>
                  <Typography variant="body2"><strong>Type:</strong> Existing Patient</Typography>
                  <Typography variant="body2"><strong>Name:</strong> {selectedPatient?.firstName} {selectedPatient?.lastName}</Typography>
                  <Typography variant="body2"><strong>Patient ID:</strong> {selectedPatient?.patientId}</Typography>
                </>
              )}
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom><strong>Test Request Details</strong></Typography>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="body2"><strong>Test:</strong> {selectedTest?.testName}</Typography>
              <Typography variant="body2"><strong>Category:</strong> {selectedTest?.category}</Typography>
              <Typography variant="body2"><strong>Price:</strong> ₹{selectedTest?.price}</Typography>
              <Typography variant="body2"><strong>Priority:</strong> {formData.priority}</Typography>
              {selectedDoctor && (
                <Typography variant="body2"><strong>Referring Doctor:</strong> Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</Typography>
              )}
              {formData.clinicalNotes && (
                <Typography variant="body2"><strong>Clinical Notes:</strong> {formData.clinicalNotes}</Typography>
              )}
            </Paper>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <PersonAdd sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
        <Typography variant="h4">Walk-in Lab Test Request</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent()}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Assignment />}
                onClick={handleSubmit}
              >
                Submit Request
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
