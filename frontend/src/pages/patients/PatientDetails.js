import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { patientAPI, medicalRecordAPI, vitalSignAPI } from '../../services/api';

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ p: 3 }}>{children}</Box> : null;
}

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [vitalSigns, setVitalSigns] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchPatientData();
  }, [id]);

  const fetchPatientData = async () => {
    try {
      const patientResponse = await patientAPI.getById(id);
      setPatient(patientResponse.data.data);

      const recordsResponse = await medicalRecordAPI.getByPatientId(id);
      setMedicalRecords(recordsResponse.data.data || []);

      const vitalsResponse = await vitalSignAPI.getByPatientId(id);
      setVitalSigns(vitalsResponse.data.data || []);
    } catch (error) {
      console.error('Error fetching patient data:', error);
    }
  };

  if (!patient) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          {`${patient.firstName} ${patient.lastName}`}
        </Typography>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/patients/${id}/edit`)}
        >
          Edit
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Patient ID</Typography>
            <Typography variant="body1">{patient.patientId}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Email</Typography>
            <Typography variant="body1">{patient.email}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
            <Typography variant="body1">{patient.phoneNumber}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Blood Group</Typography>
            <Typography variant="body1">{patient.bloodGroup}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">Address</Typography>
            <Typography variant="body1">{patient.address}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Medical Records" />
          <Tab label="Vital Signs" />
          <Tab label="Prescriptions" />
          <Tab label="Lab Results" />
        </Tabs>
        <Divider />
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>Medical Records</Typography>
          {medicalRecords.length === 0 ? (
            <Typography color="text.secondary">No medical records found</Typography>
          ) : (
            medicalRecords.map((record) => (
              <Box key={record.id} sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="subtitle1">{record.diagnosis}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Date: {new Date(record.visitDate).toLocaleDateString()}
                </Typography>
              </Box>
            ))
          )}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>Vital Signs</Typography>
          {vitalSigns.length === 0 ? (
            <Typography color="text.secondary">No vital signs recorded</Typography>
          ) : (
            vitalSigns.map((vital) => (
              <Box key={vital.id} sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2">BP: {vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2">HR: {vital.heartRate} bpm</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2">Temp: {vital.temperature}°C</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2">SPO2: {vital.oxygenSaturation}%</Typography>
                  </Grid>
                </Grid>
              </Box>
            ))
          )}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <Typography>Prescriptions content</Typography>
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <Typography>Lab Results content</Typography>
        </TabPanel>
      </Paper>
    </Box>
  );
}
