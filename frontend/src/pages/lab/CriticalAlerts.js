import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Typography,
  Tabs,
  Tab,
  alpha
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BlockIcon from '@mui/icons-material/Block';
import PageHeader from '../../components/PageHeader';
import { criticalAlertAPI } from '../../services/api';

export default function CriticalAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [tabValue, setTabValue] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [acknowledgeOpen, setAcknowledgeOpen] = useState(false);
  const [acknowledgeData, setAcknowledgeData] = useState({ acknowledgedBy: '', notes: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAlerts();
    // Poll for new alerts every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterAlerts();
  }, [tabValue, alerts]);

  const fetchAlerts = async () => {
    try {
      const response = await criticalAlertAPI.getAll();
      if (response.data.success) {
        setAlerts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const filterAlerts = () => {
    let filtered = alerts;
    switch (tabValue) {
      case 'active':
        filtered = alerts.filter(a => a.status === 'ACTIVE');
        break;
      case 'unacknowledged':
        filtered = alerts.filter(a => a.status === 'ACTIVE' || a.status === 'ESCALATED');
        break;
      case 'urgent':
        filtered = alerts.filter(a => a.priority === 'URGENT' && a.status === 'ACTIVE');
        break;
      default:
        filtered = alerts;
    }
    setFilteredAlerts(filtered);
  };

  const handleViewDetails = (alert) => {
    setSelectedAlert(alert);
    setDetailsOpen(true);
  };

  const handleAcknowledgeClick = (alert) => {
    setSelectedAlert(alert);
    setAcknowledgeOpen(true);
  };

  const handleAcknowledge = async () => {
    if (!acknowledgeData.acknowledgedBy) {
      alert('Please enter your name');
      return;
    }

    setLoading(true);
    try {
      await criticalAlertAPI.acknowledge(selectedAlert.id, acknowledgeData);
      setAcknowledgeOpen(false);
      setAcknowledgeData({ acknowledgedBy: '', notes: '' });
      fetchAlerts(); // Refresh list
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      alert('Failed to acknowledge alert');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT': return '#EF4444';
      case 'HIGH': return '#FB8C00';
      case 'MEDIUM': return '#F59E0B';
      case 'LOW': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'error';
      case 'ACKNOWLEDGED': return 'info';
      case 'RESOLVED': return 'success';
      case 'ESCALATED': return 'warning';
      case 'CANCELLED': return 'default';
      default: return 'default';
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return '-';
    return new Date(dateTime).toLocaleString();
  };

  return (
    <Box>
      <PageHeader
        title="Critical Value Alerts"
        subtitle="Monitor and manage critical lab result alerts"
      />

      <Paper sx={{ mb: 3, border: '1px solid #E5E7EB', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, fontSize: '0.875rem' },
            '& .Mui-selected': { color: '#1565C0' }
          }}
        >
          <Tab label={`All Alerts (${alerts.length})`} value="all" />
          <Tab
            label={`Active (${alerts.filter(a => a.status === 'ACTIVE').length})`}
            value="active"
          />
          <Tab
            label={`Unacknowledged (${alerts.filter(a => a.status === 'ACTIVE' || a.status === 'ESCALATED').length})`}
            value="unacknowledged"
          />
          <Tab
            label={`Urgent (${alerts.filter(a => a.priority === 'URGENT' && a.status === 'ACTIVE').length})`}
            value="urgent"
          />
        </Tabs>

        <Box sx={{ p: 2.5 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>Patient</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>Test Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>Result</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>Threshold</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>Alert Time</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAlerts.map((alert) => (
                  <TableRow
                    key={alert.id}
                    sx={{
                      '&:hover': { bgcolor: alpha('#1565C0', 0.04) },
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <TableCell>
                      <Chip
                        label={alert.priority}
                        size="small"
                        sx={{
                          bgcolor: alpha(getPriorityColor(alert.priority), 0.1),
                          color: getPriorityColor(alert.priority),
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.875rem', color: '#1F2937' }}>
                      {alert.patient.firstName} {alert.patient.lastName}
                      <Typography variant="caption" display="block" sx={{ color: '#6B7280' }}>
                        {alert.patient.patientId}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.875rem', color: '#1F2937', fontWeight: 500 }}>
                      {alert.testName}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.875rem', color: '#EF4444', fontWeight: 600 }}>
                      {alert.resultValue}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.875rem', color: '#6B7280' }}>
                      {alert.criticalThreshold}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.875rem', color: '#6B7280' }}>
                      {formatDateTime(alert.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={alert.status}
                        color={getStatusColor(alert.status)}
                        size="small"
                        sx={{ fontWeight: 500, fontSize: '0.75rem' }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        sx={{ color: '#1565C0', mr: 1 }}
                        title="View Details"
                        onClick={() => handleViewDetails(alert)}
                      >
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                      {(alert.status === 'ACTIVE' || alert.status === 'ESCALATED') && (
                        <IconButton
                          size="small"
                          sx={{ color: '#10B981' }}
                          title="Acknowledge"
                          onClick={() => handleAcknowledgeClick(alert)}
                        >
                          <CheckCircleOutlineIcon fontSize="small" />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredAlerts.length === 0 && (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No alerts found
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Alert Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#F9FAFB', fontWeight: 600 }}>
          Critical Alert Details
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedAlert && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Patient</Typography>
                <Typography variant="body1" fontWeight={500}>
                  {selectedAlert.patient.firstName} {selectedAlert.patient.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedAlert.patient.patientId}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Doctor</Typography>
                <Typography variant="body1" fontWeight={500}>
                  {selectedAlert.doctor ? `Dr. ${selectedAlert.doctor.firstName} ${selectedAlert.doctor.lastName}` : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Test Name</Typography>
                <Typography variant="body1" fontWeight={500}>{selectedAlert.testName}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Alert Type</Typography>
                <Typography variant="body1" fontWeight={500}>{selectedAlert.alertType}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Result Value</Typography>
                <Typography variant="body1" fontWeight={600} color="error">{selectedAlert.resultValue}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Critical Threshold</Typography>
                <Typography variant="body1" fontWeight={500}>{selectedAlert.criticalThreshold}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Priority</Typography>
                <Chip label={selectedAlert.priority} size="small" color={selectedAlert.priority === 'URGENT' ? 'error' : 'warning'} />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <Chip label={selectedAlert.status} size="small" color={getStatusColor(selectedAlert.status)} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Message</Typography>
                <Typography variant="body2">{selectedAlert.message}</Typography>
              </Grid>
              {selectedAlert.acknowledgedBy && (
                <>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Acknowledged By</Typography>
                    <Typography variant="body1">{selectedAlert.acknowledgedBy}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Acknowledged At</Typography>
                    <Typography variant="body1">{formatDateTime(selectedAlert.acknowledgedAt)}</Typography>
                  </Grid>
                  {selectedAlert.acknowledgmentNotes && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Acknowledgment Notes</Typography>
                      <Typography variant="body2">{selectedAlert.acknowledgmentNotes}</Typography>
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Acknowledge Dialog */}
      <Dialog open={acknowledgeOpen} onClose={() => setAcknowledgeOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#F9FAFB', fontWeight: 600 }}>
          Acknowledge Alert
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Your Name *"
            value={acknowledgeData.acknowledgedBy}
            onChange={(e) => setAcknowledgeData({ ...acknowledgeData, acknowledgedBy: e.target.value })}
            sx={{ mb: 2 }}
            size="small"
          />
          <TextField
            fullWidth
            label="Notes (Optional)"
            multiline
            rows={3}
            value={acknowledgeData.notes}
            onChange={(e) => setAcknowledgeData({ ...acknowledgeData, notes: e.target.value })}
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAcknowledgeOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAcknowledge}
            disabled={loading}
            sx={{ bgcolor: '#10B981' }}
          >
            Acknowledge
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
