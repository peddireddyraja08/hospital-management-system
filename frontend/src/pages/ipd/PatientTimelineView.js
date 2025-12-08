import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Autocomplete,
  Button,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { patientAPI } from '../../services/api';
import PatientTimeline from './components/PatientTimeline';

const PatientTimelineView = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await patientAPI.getAll();
      setPatients(response.data.data || []);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (event, patient) => {
    setSelectedPatient(patient);
  };

  const handleRefresh = () => {
    if (selectedPatient) {
      // Trigger refresh of timeline by updating the key
      setSelectedPatient({ ...selectedPatient });
    }
    fetchPatients();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TimelineIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Patient Timeline
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View comprehensive patient event history
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleRefresh} disabled={loading}>
          <RefreshIcon />
        </IconButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Patient Search */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Select Patient
        </Typography>
        <Autocomplete
          options={patients}
          getOptionLabel={(option) =>
            `${option.firstName} ${option.lastName} - ${option.patientId || 'N/A'}`
          }
          value={selectedPatient}
          onChange={handlePatientSelect}
          inputValue={searchQuery}
          onInputChange={(e, value) => setSearchQuery(value)}
          loading={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search patient by name or ID..."
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          renderOption={(props, option) => (
            <li {...props}>
              <Box>
                <Typography variant="body1">
                  {option.firstName} {option.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ID: {option.patientId || 'N/A'} | DOB: {option.dateOfBirth || 'N/A'} | 
                  {option.gender ? ` ${option.gender}` : ''}
                </Typography>
              </Box>
            </li>
          )}
          fullWidth
        />
      </Paper>

      {/* Timeline */}
      {selectedPatient ? (
        <PatientTimeline patient={selectedPatient} key={selectedPatient.id} />
      ) : (
        <Paper sx={{ p: 8, textAlign: 'center' }}>
          <TimelineIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Select a patient to view their timeline
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Use the search box above to find a patient
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default PatientTimelineView;
