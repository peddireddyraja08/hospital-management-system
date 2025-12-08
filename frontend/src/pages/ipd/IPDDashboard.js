import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  useTheme,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { admissionAPI } from '../../services/api';
import InpatientsList from './components/InpatientsList';
import PatientTimelineDetail from './components/PatientTimelineDetail';
import QuickActionsPanel from './components/QuickActionsPanel';

const IPDDashboard = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeAdmissions, setActiveAdmissions] = useState([]);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [stats, setStats] = useState({
    totalInpatients: 0,
    criticalPatients: 0,
    pendingDischarges: 0,
    newAdmissions: 0,
  });

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchActiveAdmissions();
    const interval = setInterval(fetchActiveAdmissions, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchActiveAdmissions = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (user?.role === 'DOCTOR') {
        response = await admissionAPI.getByDoctorId(user.id);
      } else {
        response = await admissionAPI.getActive();
      }

      const admissions = response.data.data || [];
      setActiveAdmissions(admissions);

      // Calculate stats
      const critical = admissions.filter(a => a.priority === 'CRITICAL' || a.priority === 'EMERGENCY').length;
      const pendingDischarge = admissions.filter(a => a.expectedDischargeDate && 
        new Date(a.expectedDischargeDate) <= new Date()).length;
      const today = new Date().setHours(0, 0, 0, 0);
      const newToday = admissions.filter(a => 
        new Date(a.admissionDate).setHours(0, 0, 0, 0) === today).length;

      setStats({
        totalInpatients: admissions.length,
        criticalPatients: critical,
        pendingDischarges: pendingDischarge,
        newAdmissions: newToday,
      });

      // Auto-select first admission if none selected
      if (!selectedAdmission && admissions.length > 0) {
        setSelectedAdmission(admissions[0]);
      }
    } catch (err) {
      console.error('Error fetching admissions:', err);
      setError(err.response?.data?.message || 'Failed to load IPD data');
    } finally {
      setLoading(false);
    }
  };

  const handleAdmissionSelect = (admission) => {
    setSelectedAdmission(admission);
  };

  const handleRefresh = () => {
    fetchActiveAdmissions();
  };

  if (loading && activeAdmissions.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Inpatient Department (IPD)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Real-time inpatient monitoring and management
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              bgcolor: theme.palette.primary.main,
              color: 'white',
              borderRadius: 2,
            }}
          >
            <Typography variant="h3" fontWeight="bold">
              {stats.totalInpatients}
            </Typography>
            <Typography variant="body2">Total Inpatients</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              bgcolor: theme.palette.error.main,
              color: 'white',
              borderRadius: 2,
            }}
          >
            <Typography variant="h3" fontWeight="bold">
              {stats.criticalPatients}
            </Typography>
            <Typography variant="body2">Critical Patients</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              bgcolor: theme.palette.warning.main,
              color: 'white',
              borderRadius: 2,
            }}
          >
            <Typography variant="h3" fontWeight="bold">
              {stats.pendingDischarges}
            </Typography>
            <Typography variant="body2">Pending Discharges</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              bgcolor: theme.palette.success.main,
              color: 'white',
              borderRadius: 2,
            }}
          >
            <Typography variant="h3" fontWeight="bold">
              {stats.newAdmissions}
            </Typography>
            <Typography variant="body2">New Today</Typography>
          </Paper>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* 3-Column Layout */}
      <Grid container spacing={2}>
        {/* Left Column: My Inpatients List */}
        <Grid item xs={12} md={3}>
          <InpatientsList
            admissions={activeAdmissions}
            selectedAdmission={selectedAdmission}
            onSelectAdmission={handleAdmissionSelect}
            onRefresh={handleRefresh}
            loading={loading}
          />
        </Grid>

        {/* Center Column: Patient Timeline Detail */}
        <Grid item xs={12} md={6}>
          {selectedAdmission ? (
            <PatientTimelineDetail
              admission={selectedAdmission}
              onRefresh={handleRefresh}
            />
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center', minHeight: 400 }}>
              <Typography variant="h6" color="text.secondary">
                Select a patient from the list to view details
              </Typography>
            </Paper>
          )}
        </Grid>

        {/* Right Column: Quick Actions Panel */}
        <Grid item xs={12} md={3}>
          <QuickActionsPanel
            selectedAdmission={selectedAdmission}
            onRefresh={handleRefresh}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default IPDDashboard;
