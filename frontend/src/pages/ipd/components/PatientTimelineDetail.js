import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  Tabs,
  Tab,
  Chip,
  Avatar,
  Divider,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Person as PersonIcon,
  LocalHospital as HospitalIcon,
  Assignment as AssignmentIcon,
  Science as ScienceIcon,
  Medication as MedicationIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { formatDate, formatDateShort, formatDistanceToNow } from '../../../utils/dateUtils';
import {
  vitalSignAPI,
  physicianOrderAPI,
  nurseTaskAPI,
  clinicalScoreAPI,
  medicalRecordAPI,
} from '../../../services/api';

const TabPanel = ({ children, value, index }) => (
  <Box hidden={value !== index} sx={{ py: 2 }}>
    {value === index && children}
  </Box>
);

const PatientTimelineDetail = ({ admission, onRefresh }) => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vitalSigns, setVitalSigns] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [clinicalScores, setClinicalScores] = useState([]);

  useEffect(() => {
    if (admission) {
      fetchPatientData();
    }
  }, [admission]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [vitalsRes, ordersRes, tasksRes, scoresRes] = await Promise.all([
        vitalSignAPI.getByPatientId(admission.patient.id).catch(() => ({ data: { data: [] } })),
        physicianOrderAPI.getByPatientId(admission.patient.id).catch(() => ({ data: { data: [] } })),
        nurseTaskAPI.getByAdmissionId(admission.id).catch(() => ({ data: { data: [] } })),
        clinicalScoreAPI.getByAdmissionId(admission.id).catch(() => ({ data: { data: [] } })),
      ]);

      setVitalSigns(vitalsRes.data.data || []);
      setOrders(ordersRes.data.data || []);
      setTasks(tasksRes.data.data || []);
      setClinicalScores(scoresRes.data.data || []);
    } catch (err) {
      console.error('Error fetching patient data:', err);
      setError('Failed to load patient details');
    } finally {
      setLoading(false);
    }
  };

  const getLatestVitalSign = () => {
    if (vitalSigns.length === 0) return null;
    return vitalSigns.sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt))[0];
  };

  const getLatestClinicalScore = () => {
    if (clinicalScores.length === 0) return null;
    return clinicalScores.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  };

  const getStatusColor = (status) => {
    const colors = {
      CRITICAL: 'error',
      HIGH: 'warning',
      MEDIUM: 'info',
      LOW: 'success',
      ACTIVE: 'success',
      PENDING: 'warning',
      COMPLETED: 'success',
      SCHEDULED: 'info',
    };
    return colors[status] || 'default';
  };

  if (!admission) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Select a patient to view details
        </Typography>
      </Paper>
    );
  }

  const latestVitals = getLatestVitalSign();
  const latestScore = getLatestClinicalScore();

  return (
    <Paper sx={{ height: 'calc(100vh - 350px)', display: 'flex', flexDirection: 'column' }}>
      {/* Patient Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
              {admission.patient?.firstName?.[0]}{admission.patient?.lastName?.[0]}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {admission.patient?.firstName} {admission.patient?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Admission #: {admission.admissionNumber}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                <Chip
                  label={admission.status}
                  size="small"
                  color={getStatusColor(admission.status)}
                />
                {admission.bed && (
                  <Chip
                    icon={<HospitalIcon />}
                    label={`${admission.bed.wardName} - ${admission.bed.bedNumber}`}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          </Box>
          <IconButton onClick={fetchPatientData} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Card variant="outlined" sx={{ bgcolor: 'background.default' }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="caption" color="text.secondary">
                  Admitted
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {admission.admissionDate ? formatDateShort(new Date(admission.admissionDate)) : 'N/A'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ({admission.admissionDate ? formatDistanceToNow(new Date(admission.admissionDate)) : 'N/A'} ago)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card variant="outlined" sx={{ bgcolor: 'background.default' }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="caption" color="text.secondary">
                  Expected D/C
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {admission.expectedDischargeDate ? formatDateShort(new Date(admission.expectedDischargeDate)) : 'Not set'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Alert severity="error" sx={{ m: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="Overview" />
        <Tab label="Vitals" />
        <Tab label="Orders" />
        <Tab label="Tasks" />
      </Tabs>

      {/* Tab Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Overview Tab */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={2}>
                {/* Chief Complaint */}
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                        Chief Complaint
                      </Typography>
                      <Typography variant="body2">
                        {admission.chiefComplaint || 'Not recorded'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Latest Vitals */}
                {latestVitals && (
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Latest Vital Signs
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {latestVitals.recordedAt ? formatDistanceToNow(new Date(latestVitals.recordedAt)) : ''} ago
                          </Typography>
                        </Box>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">Temperature</Typography>
                            <Typography variant="body2">{latestVitals.temperature || 'N/A'}°C</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">BP</Typography>
                            <Typography variant="body2">
                              {latestVitals.bloodPressureSystolic}/{latestVitals.bloodPressureDiastolic || 'N/A'} mmHg
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">Heart Rate</Typography>
                            <Typography variant="body2">{latestVitals.heartRate || 'N/A'} bpm</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">SpO2</Typography>
                            <Typography variant="body2">{latestVitals.oxygenSaturation || 'N/A'}%</Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Clinical Score */}
                {latestScore && (
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              Clinical Score ({latestScore.scoreType})
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {latestScore.createdAt ? formatDistanceToNow(new Date(latestScore.createdAt)) : ''} ago
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h4" fontWeight="bold" color={getStatusColor(latestScore.riskLevel) + '.main'}>
                              {latestScore.totalScore}
                            </Typography>
                            <Chip
                              label={latestScore.riskLevel}
                              size="small"
                              color={getStatusColor(latestScore.riskLevel)}
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Active Orders Count */}
                <Grid item xs={6}>
                  <Card variant="outlined" sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
                    <CardContent>
                      <Typography variant="h4" fontWeight="bold">{orders.length}</Typography>
                      <Typography variant="body2">Active Orders</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Pending Tasks Count */}
                <Grid item xs={6}>
                  <Card variant="outlined" sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                    <CardContent>
                      <Typography variant="h4" fontWeight="bold">
                        {tasks.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS').length}
                      </Typography>
                      <Typography variant="body2">Pending Tasks</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Vitals Tab */}
            <TabPanel value={tabValue} index={1}>
              <List>
                {vitalSigns.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    No vital signs recorded
                  </Typography>
                ) : (
                  vitalSigns.slice(0, 10).map((vital) => (
                    <ListItem key={vital.id} divider>
                      <ListItemText
                        primary={
                          <Box>
                            <Typography variant="body2" component="span">
                              Temp: {vital.temperature}°C | BP: {vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic} |
                              HR: {vital.heartRate} | SpO2: {vital.oxygenSaturation}%
                            </Typography>
                          </Box>
                        }
                        secondary={vital.recordedAt ? formatDate(new Date(vital.recordedAt)) : 'N/A'}
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </TabPanel>

            {/* Orders Tab */}
            <TabPanel value={tabValue} index={2}>
              <List>
                {orders.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    No orders found
                  </Typography>
                ) : (
                  orders.slice(0, 10).map((order) => (
                    <ListItem key={order.id} divider>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">{order.orderDetails}</Typography>
                            <Chip label={order.status} size="small" color={getStatusColor(order.status)} />
                          </Box>
                        }
                        secondary={
                          <>
                            {order.orderType} | {order.createdAt ? formatDate(new Date(order.createdAt)) : 'N/A'}
                          </>
                        }
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </TabPanel>

            {/* Tasks Tab */}
            <TabPanel value={tabValue} index={3}>
              <List>
                {tasks.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    No tasks assigned
                  </Typography>
                ) : (
                  tasks.map((task) => (
                    <ListItem key={task.id} divider>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">{task.taskDescription}</Typography>
                            <Chip label={task.status} size="small" color={getStatusColor(task.status)} />
                            <Chip label={task.priority} size="small" variant="outlined" />
                          </Box>
                        }
                        secondary={
                          <>
                            Due: {task.dueDate ? formatDate(new Date(task.dueDate)) : 'Not set'}
                          </>
                        }
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </TabPanel>
          </>
        )}
      </Box>
    </Paper>
  );
};

export default PatientTimelineDetail;
