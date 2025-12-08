import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Avatar,
  Card,
  CardContent,
  Collapse,
  IconButton,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
} from '@mui/material';
import {
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  LocalHospital as AdmissionIcon,
  ExitToApp as DischargeIcon,
  Assignment as OrderIcon,
  Science as LabIcon,
  Medication as MedicationIcon,
  SwapHoriz as TransferIcon,
  Timeline as TimelineIcon,
  CalendarToday as CalendarIcon,
  FavoriteOutlined as VitalIcon,
  Assessment as ScoreIcon,
} from '@mui/icons-material';
import { formatDate, parseISO } from '../../../utils/dateUtils';
import {
  admissionAPI,
  physicianOrderAPI,
  vitalSignAPI,
  clinicalScoreAPI,
  medicalRecordAPI,
} from '../../../services/api';

const PatientTimeline = ({ patient }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const timelineRef = useRef(null);

  useEffect(() => {
    if (patient) {
      fetchTimelineData();
    }
  }, [patient]);

  const fetchTimelineData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [
        admissionsRes,
        ordersRes,
        vitalsRes,
        scoresRes,
        recordsRes,
      ] = await Promise.all([
        admissionAPI.getByPatientId(patient.id).catch(() => ({ data: { data: [] } })),
        physicianOrderAPI.getByPatientId(patient.id).catch(() => ({ data: { data: [] } })),
        vitalSignAPI.getByPatientId(patient.id).catch(() => ({ data: { data: [] } })),
        clinicalScoreAPI.getByAdmissionId(patient.id).catch(() => ({ data: { data: [] } })),
        medicalRecordAPI.getByPatientId(patient.id).catch(() => ({ data: { data: [] } })),
      ]);

      // Transform data into timeline events
      const timelineEvents = [];

      // Add admission events
      (admissionsRes.data.data || []).forEach(admission => {
        timelineEvents.push({
          id: `admission-${admission.id}`,
          type: 'ADMISSION',
          title: 'Hospital Admission',
          timestamp: admission.admissionDate,
          data: admission,
          icon: <AdmissionIcon />,
          color: '#2196f3',
        });

        if (admission.dischargeDate) {
          timelineEvents.push({
            id: `discharge-${admission.id}`,
            type: 'DISCHARGE',
            title: 'Hospital Discharge',
            timestamp: admission.dischargeDate,
            data: admission,
            icon: <DischargeIcon />,
            color: '#4caf50',
          });
        }
      });

      // Add physician order events
      (ordersRes.data.data || []).forEach(order => {
        timelineEvents.push({
          id: `order-${order.id}`,
          type: 'ORDER',
          title: `${order.orderType || 'Medical'} Order`,
          timestamp: order.createdAt,
          data: order,
          icon: <OrderIcon />,
          color: '#ff9800',
        });
      });

      // Add vital signs events
      (vitalsRes.data.data || []).forEach(vital => {
        timelineEvents.push({
          id: `vital-${vital.id}`,
          type: 'VITAL',
          title: 'Vital Signs Recorded',
          timestamp: vital.recordedAt || vital.createdAt,
          data: vital,
          icon: <VitalIcon />,
          color: '#e91e63',
        });
      });

      // Add clinical score events
      (scoresRes.data.data || []).forEach(score => {
        timelineEvents.push({
          id: `score-${score.id}`,
          type: 'SCORE',
          title: `${score.scoreType} Score Calculated`,
          timestamp: score.createdAt,
          data: score,
          icon: <ScoreIcon />,
          color: '#9c27b0',
        });
      });

      // Add medical record events
      (recordsRes.data.data || []).forEach(record => {
        timelineEvents.push({
          id: `record-${record.id}`,
          type: 'RECORD',
          title: 'Medical Record Created',
          timestamp: record.visitDate || record.createdAt,
          data: record,
          icon: <MedicationIcon />,
          color: '#00bcd4',
        });
      });

      // Sort by timestamp (newest first)
      timelineEvents.sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return dateB - dateA;
      });

      setEvents(timelineEvents);
    } catch (err) {
      console.error('Error fetching timeline data:', err);
      setError('Failed to load timeline data');
    } finally {
      setLoading(false);
    }
  };

  const handleExpandEvent = (eventId) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilterType(newFilter);
    }
  };

  const filteredEvents = filterType === 'all' 
    ? events 
    : events.filter(event => event.type === filterType);

  const renderEventDetails = (event) => {
    switch (event.type) {
      case 'ADMISSION':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Admission Number</Typography>
              <Typography variant="body2">{event.data.admissionNumber || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Ward/Bed</Typography>
              <Typography variant="body2">
                {event.data.bed ? `${event.data.bed.wardName} - ${event.data.bed.bedNumber}` : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Priority</Typography>
              <Chip label={event.data.priority || 'N/A'} size="small" color="warning" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Status</Typography>
              <Chip label={event.data.status || 'N/A'} size="small" color="info" />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">Chief Complaint</Typography>
              <Typography variant="body2">{event.data.chiefComplaint || 'Not recorded'}</Typography>
            </Grid>
          </Grid>
        );

      case 'DISCHARGE':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Discharge Type</Typography>
              <Typography variant="body2">{event.data.dischargeType || 'Regular'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Length of Stay</Typography>
              <Typography variant="body2">
                {event.data.admissionDate && event.data.dischargeDate
                  ? `${Math.ceil((new Date(event.data.dischargeDate) - new Date(event.data.admissionDate)) / (1000 * 60 * 60 * 24))} days`
                  : 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        );

      case 'ORDER':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Order Type</Typography>
              <Typography variant="body2">{event.data.orderType || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Status</Typography>
              <Chip label={event.data.status || 'N/A'} size="small" color="info" />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">Order Details</Typography>
              <Typography variant="body2">{event.data.orderDetails || 'No details'}</Typography>
            </Grid>
            {event.data.doctor && (
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Ordered By</Typography>
                <Typography variant="body2">
                  Dr. {event.data.doctor.user?.firstName} {event.data.doctor.user?.lastName}
                </Typography>
              </Grid>
            )}
          </Grid>
        );

      case 'VITAL':
        return (
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary">Temperature</Typography>
              <Typography variant="body2">{event.data.temperature || 'N/A'}°C</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary">BP</Typography>
              <Typography variant="body2">
                {event.data.bloodPressureSystolic}/{event.data.bloodPressureDiastolic || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary">Heart Rate</Typography>
              <Typography variant="body2">{event.data.heartRate || 'N/A'} bpm</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary">SpO2</Typography>
              <Typography variant="body2">{event.data.oxygenSaturation || 'N/A'}%</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary">Resp. Rate</Typography>
              <Typography variant="body2">{event.data.respiratoryRate || 'N/A'}/min</Typography>
            </Grid>
            {event.data.recordedBy && (
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Recorded By</Typography>
                <Typography variant="body2">{event.data.recordedBy}</Typography>
              </Grid>
            )}
          </Grid>
        );

      case 'SCORE':
        return (
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4}>
              <Typography variant="caption" color="text.secondary">Score Type</Typography>
              <Typography variant="body2">{event.data.scoreType || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Typography variant="caption" color="text.secondary">Total Score</Typography>
              <Typography variant="h6" color="primary">{event.data.totalScore || 0}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" color="text.secondary">Risk Level</Typography>
              <Chip 
                label={event.data.riskLevel || 'N/A'} 
                size="small" 
                color={event.data.riskLevel === 'HIGH' ? 'error' : 'warning'} 
              />
            </Grid>
            {event.data.recommendedAction && (
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Recommended Action</Typography>
                <Typography variant="body2">{event.data.recommendedAction}</Typography>
              </Grid>
            )}
          </Grid>
        );

      case 'RECORD':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">Diagnosis</Typography>
              <Typography variant="body2">{event.data.diagnosis || 'Not recorded'}</Typography>
            </Grid>
            {event.data.treatment && (
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Treatment Plan</Typography>
                <Typography variant="body2">{event.data.treatment}</Typography>
              </Grid>
            )}
            {event.data.prescriptions && (
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Prescriptions</Typography>
                <Typography variant="body2">{event.data.prescriptions}</Typography>
              </Grid>
            )}
          </Grid>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Loading timeline...
        </Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Alert severity="error" onClose={() => setError(null)}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      {/* Patient Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
            {patient.firstName?.[0]}{patient.lastName?.[0]}
          </Avatar>
          <Box>
            <Typography variant="h6">
              {patient.firstName} {patient.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Patient ID: {patient.patientId || 'N/A'} | DOB: {patient.dateOfBirth || 'N/A'}
            </Typography>
          </Box>
        </Box>

        {/* Filter Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="body2" fontWeight="medium">Filter:</Typography>
          <ToggleButtonGroup
            value={filterType}
            exclusive
            onChange={handleFilterChange}
            size="small"
          >
            <ToggleButton value="all">All ({events.length})</ToggleButton>
            <ToggleButton value="ADMISSION">
              Admissions ({events.filter(e => e.type === 'ADMISSION').length})
            </ToggleButton>
            <ToggleButton value="ORDER">
              Orders ({events.filter(e => e.type === 'ORDER').length})
            </ToggleButton>
            <ToggleButton value="VITAL">
              Vitals ({events.filter(e => e.type === 'VITAL').length})
            </ToggleButton>
            <ToggleButton value="SCORE">
              Scores ({events.filter(e => e.type === 'SCORE').length})
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Timeline Events */}
      {filteredEvents.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <TimelineIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No events found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filterType === 'all' 
              ? 'No timeline events available for this patient'
              : `No ${filterType.toLowerCase()} events found`}
          </Typography>
        </Box>
      ) : (
        <Box ref={timelineRef} sx={{ position: 'relative' }}>
          {/* Timeline Line */}
          <Box
            sx={{
              position: 'absolute',
              left: 28,
              top: 0,
              bottom: 0,
              width: 2,
              bgcolor: 'divider',
            }}
          />

          {/* Events */}
          {filteredEvents.map((event, index) => (
            <Box key={event.id} sx={{ position: 'relative', mb: 3, ml: 7 }}>
              {/* Timeline Dot */}
              <Avatar
                sx={{
                  position: 'absolute',
                  left: -44,
                  top: 8,
                  width: 32,
                  height: 32,
                  bgcolor: event.color,
                  border: 3,
                  borderColor: 'background.paper',
                }}
              >
                {event.icon}
              </Avatar>

              {/* Event Card */}
              <Card 
                elevation={2}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateX(4px)',
                  },
                }}
                onClick={() => handleExpandEvent(event.id)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {event.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {event.timestamp ? formatDate(parseISO(event.timestamp)) : 'N/A'}
                      </Typography>
                    </Box>
                    <IconButton size="small">
                      {expandedEvent === event.id ? <CollapseIcon /> : <ExpandIcon />}
                    </IconButton>
                  </Box>

                  <Collapse in={expandedEvent === event.id}>
                    <Divider sx={{ my: 2 }} />
                    {renderEventDetails(event)}
                  </Collapse>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default PatientTimeline;
