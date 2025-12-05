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
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { Add, CheckCircle, Warning, Error, Assessment } from '@mui/icons-material';
import { qcRunAPI, qcMaterialAPI } from '../../services/api';

const SHIFTS = ['MORNING', 'AFTERNOON', 'NIGHT'];

export default function QCDataEntry() {
  const [runs, setRuns] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [formData, setFormData] = useState({
    qcMaterialId: '',
    measuredValue: '',
    technicianName: '',
    comments: '',
    shift: 'MORNING',
    instrumentId: '',
    repeatRun: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const [materialsRes, runsRes] = await Promise.all([
        qcMaterialAPI.getAll(),
        qcRunAPI.getByDateRange(today.toISOString(), tomorrow.toISOString()),
      ]);
      
      setMaterials(materialsRes.data.data || []);
      setRuns(runsRes.data.data || []);
      setError('');
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load QC data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      qcMaterialId: '',
      measuredValue: '',
      technicianName: '',
      comments: '',
      shift: 'MORNING',
      instrumentId: '',
      repeatRun: false,
    });
    setSelectedMaterial(null);
    setOpenDialog(true);
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // If material is selected, load its details
    if (name === 'qcMaterialId') {
      const material = materials.find(m => m.id === parseInt(value));
      setSelectedMaterial(material);
    }
  };

  const calculateStatus = () => {
    if (!selectedMaterial || !formData.measuredValue) return null;

    const measured = parseFloat(formData.measuredValue);
    const mean = parseFloat(selectedMaterial.meanValue);
    const sd = parseFloat(selectedMaterial.stdDeviation);

    if (!mean || !sd) return null;

    const zScore = (measured - mean) / sd;
    const absZScore = Math.abs(zScore);

    if (absZScore > 3) {
      return { status: 'OUT_OF_CONTROL', color: 'error', label: 'Out of Control', zScore };
    } else if (absZScore > 2) {
      return { status: 'WARNING', color: 'warning', label: 'Warning', zScore };
    } else {
      return { status: 'IN_CONTROL', color: 'success', label: 'In Control', zScore };
    }
  };

  const statusInfo = calculateStatus();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const runData = {
        qcMaterial: { id: formData.qcMaterialId },
        measuredValue: parseFloat(formData.measuredValue),
        technicianName: formData.technicianName,
        comments: formData.comments,
        shift: formData.shift,
        instrumentId: formData.instrumentId,
        repeatRun: formData.repeatRun,
        runDate: new Date().toISOString(),
      };

      await qcRunAPI.create(runData);
      setSuccess('QC run recorded successfully');
      setOpenDialog(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record QC run');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'IN_CONTROL': return <CheckCircle color="success" />;
      case 'WARNING': return <Warning color="warning" />;
      case 'OUT_OF_CONTROL': return <Error color="error" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'IN_CONTROL': return 'success';
      case 'WARNING': return 'warning';
      case 'OUT_OF_CONTROL': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
          QC Data Entry
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenDialog}>
          Record QC Run
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Today's QC Runs</Typography>
        <Divider sx={{ mb: 2 }} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Test</TableCell>
                <TableCell>Material</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Measured Value</TableCell>
                <TableCell>Z-Score</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Technician</TableCell>
                <TableCell>Shift</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">Loading...</TableCell>
                </TableRow>
              ) : runs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">No QC runs recorded today</TableCell>
                </TableRow>
              ) : (
                runs.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell>
                      {new Date(run.runDate).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>{run.qcMaterial?.labTest?.testName || 'N/A'}</TableCell>
                    <TableCell>{run.qcMaterial?.materialName || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={run.qcMaterial?.level?.replace('_', ' ')} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      {run.measuredValue} {run.qcMaterial?.unit}
                    </TableCell>
                    <TableCell>
                      {run.zScore ? run.zScore.toFixed(2) : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStatusIcon(run.status)}
                        <Chip 
                          label={run.status?.replace('_', ' ')} 
                          color={getStatusColor(run.status)}
                          size="small" 
                        />
                      </Box>
                    </TableCell>
                    <TableCell>{run.technicianName}</TableCell>
                    <TableCell>{run.shift}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Record QC Run Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Record QC Run</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="QC Material"
                  name="qcMaterialId"
                  value={formData.qcMaterialId}
                  onChange={handleChange}
                  required
                >
                  {materials.map((material) => (
                    <MenuItem key={material.id} value={material.id}>
                      {material.labTest?.testName} - {material.materialName} ({material.level?.replace('_', ' ')}) - Lot: {material.lotNumber}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {selectedMaterial && (
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>Control Material Information</Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="body2"><strong>Mean:</strong> {selectedMaterial.meanValue} {selectedMaterial.unit}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2"><strong>SD:</strong> ±{selectedMaterial.stdDeviation} {selectedMaterial.unit}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2"><strong>±1SD Range:</strong> {(parseFloat(selectedMaterial.meanValue) - parseFloat(selectedMaterial.stdDeviation)).toFixed(2)} - {(parseFloat(selectedMaterial.meanValue) + parseFloat(selectedMaterial.stdDeviation)).toFixed(2)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2"><strong>±2SD Range:</strong> {(parseFloat(selectedMaterial.meanValue) - 2 * parseFloat(selectedMaterial.stdDeviation)).toFixed(2)} - {(parseFloat(selectedMaterial.meanValue) + 2 * parseFloat(selectedMaterial.stdDeviation)).toFixed(2)}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Measured Value"
                  name="measuredValue"
                  type="number"
                  value={formData.measuredValue}
                  onChange={handleChange}
                  required
                  inputProps={{ step: '0.0001' }}
                  helperText={selectedMaterial ? `Unit: ${selectedMaterial.unit}` : ''}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Technician Name"
                  name="technicianName"
                  value={formData.technicianName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                />
              </Grid>

              {statusInfo && (
                <Grid item xs={12}>
                  <Alert 
                    severity={statusInfo.color} 
                    icon={getStatusIcon(statusInfo.status)}
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Box>
                      <Typography variant="subtitle2">
                        <strong>Status: {statusInfo.label}</strong>
                      </Typography>
                      <Typography variant="body2">
                        Z-Score: {statusInfo.zScore.toFixed(4)} ({Math.abs(statusInfo.zScore).toFixed(2)}SD from mean)
                      </Typography>
                      {statusInfo.status !== 'IN_CONTROL' && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          ⚠️ This result is outside acceptable limits. Consider repeating the test or reviewing instrument calibration.
                        </Typography>
                      )}
                    </Box>
                  </Alert>
                </Grid>
              )}

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Shift"
                  name="shift"
                  value={formData.shift}
                  onChange={handleChange}
                  required
                >
                  {SHIFTS.map((shift) => (
                    <MenuItem key={shift} value={shift}>{shift}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Instrument ID"
                  name="instrumentId"
                  value={formData.instrumentId}
                  onChange={handleChange}
                  placeholder="e.g., ANALYZER-01"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Comments"
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  placeholder="Any observations or notes about this QC run"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained"
              color={statusInfo?.status === 'OUT_OF_CONTROL' ? 'error' : 'primary'}
            >
              Record QC Run
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
