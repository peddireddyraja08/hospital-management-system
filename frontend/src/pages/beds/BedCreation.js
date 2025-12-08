import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Hotel as BedIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import PageHeader from '../../components/PageHeader';
import { bedAPI } from '../../services/api';

const bedTypes = [
  'General',
  'ICU',
  'Private',
  'Semi-Private',
  'Emergency',
  'Pediatric',
  'Maternity',
  'Isolation',
  'VIP',
];

const bedStatuses = [
  'AVAILABLE',
  'OCCUPIED',
  'UNDER_MAINTENANCE',
  'CLEANING',
  'RESERVED',
  'BLOCKED',
];

export default function BedCreation() {
  const [activeStep, setActiveStep] = useState(0);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [bedsToCreate, setBedsToCreate] = useState([]);

  const [bedForm, setBedForm] = useState({
    wardName: '',
    floor: '',
    bedType: 'General',
    status: 'AVAILABLE',
    startNumber: '',
    endNumber: '',
    prefix: '',
    roomNumber: '',
    dailyCharge: '',
    hasOxygenSupport: false,
    hasVentilator: false,
    isIsolationBed: false,
  });

  const steps = ['Ward & Type', 'Bed Numbers', 'Features & Pricing', 'Review & Create'];

  useEffect(() => {
    fetchWards();
  }, []);

  const fetchWards = async () => {
    try {
      const response = await bedAPI.getAll();
      const beds = response.data.data || [];
      const uniqueWards = [...new Set(beds.map(b => b.wardName).filter(Boolean))];
      setWards(uniqueWards);
    } catch (err) {
      console.error('Error fetching wards:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setBedForm({
      ...bedForm,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const generateBedNumbers = () => {
    const { prefix, startNumber, endNumber } = bedForm;
    const beds = [];
    const start = parseInt(startNumber);
    const end = parseInt(endNumber);

    if (!start || !end || start > end) {
      setError('Invalid bed number range');
      return;
    }

    for (let i = start; i <= end; i++) {
      const bedNumber = prefix ? `${prefix}-${String(i).padStart(3, '0')}` : String(i).padStart(3, '0');
      beds.push({
        bedNumber,
        wardName: bedForm.wardName,
        bedType: bedForm.bedType,
        status: bedForm.status,
        floorNumber: parseInt(bedForm.floor),
        roomNumber: bedForm.roomNumber || null,
        dailyCharge: parseFloat(bedForm.dailyCharge) || 0,
        hasOxygenSupport: bedForm.hasOxygenSupport,
        hasVentilator: bedForm.hasVentilator,
        isIsolationBed: bedForm.isIsolationBed,
      });
    }

    setBedsToCreate(beds);
    setError(null);
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!bedForm.wardName || !bedForm.floor) {
        setError('Please fill in all required fields');
        return;
      }
    }
    if (activeStep === 1) {
      if (!bedForm.startNumber || !bedForm.endNumber) {
        setError('Please specify bed number range');
        return;
      }
      generateBedNumbers();
    }
    setError(null);
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError(null);
  };

  const handleRemoveBed = (index) => {
    setBedsToCreate(bedsToCreate.filter((_, i) => i !== index));
  };

  const handleCreateBeds = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create beds one by one
      const results = [];
      for (const bed of bedsToCreate) {
        try {
          const response = await bedAPI.create(bed);
          results.push({ success: true, bed: response.data.data });
        } catch (err) {
          results.push({ success: false, bed, error: err.message });
        }
      }

      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;

      if (successCount > 0) {
        setSuccess(`Successfully created ${successCount} bed(s)${failCount > 0 ? `, ${failCount} failed` : ''}`);
        setTimeout(() => {
          // Reset form
          setBedForm({
            wardName: '',
            floor: '',
            bedType: 'General',
            status: 'AVAILABLE',
            startNumber: '',
            endNumber: '',
            prefix: '',
            roomNumber: '',
            dailyCharge: '',
            hasOxygenSupport: false,
            hasVentilator: false,
            isIsolationBed: false,
          });
          setBedsToCreate([]);
          setActiveStep(0);
          setSuccess(null);
        }, 3000);
      }

      if (failCount > 0 && successCount === 0) {
        setError('Failed to create beds. Some bed numbers may already exist.');
      }

    } catch (err) {
      console.error('Error creating beds:', err);
      setError(err.response?.data?.message || 'Failed to create beds');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Ward Name"
                name="wardName"
                value={bedForm.wardName}
                onChange={handleChange}
                required
              >
                {wards.map((ward) => (
                  <MenuItem key={ward} value={ward}>
                    {ward}
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem value="custom">
                  <em>+ Add New Ward</em>
                </MenuItem>
              </TextField>
              {bedForm.wardName === 'custom' && (
                <TextField
                  fullWidth
                  label="New Ward Name"
                  name="wardName"
                  onChange={(e) => setBedForm({ ...bedForm, wardName: e.target.value })}
                  margin="normal"
                  placeholder="Enter new ward name"
                />
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Floor Number"
                name="floor"
                type="number"
                value={bedForm.floor}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Bed Type"
                name="bedType"
                value={bedForm.bedType}
                onChange={handleChange}
                required
              >
                {bedTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Initial Status"
                name="status"
                value={bedForm.status}
                onChange={handleChange}
              >
                {bedStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.replace('_', ' ')}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info">
                Generate multiple bed numbers at once by specifying a range. E.g., beds 001 to 020.
              </Alert>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Bed Number Prefix"
                name="prefix"
                value={bedForm.prefix}
                onChange={handleChange}
                placeholder="e.g., GW, ICU"
                helperText="Optional: e.g., 'GW' for General Ward"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Start Number"
                name="startNumber"
                type="number"
                value={bedForm.startNumber}
                onChange={handleChange}
                required
                placeholder="e.g., 1"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="End Number"
                name="endNumber"
                type="number"
                value={bedForm.endNumber}
                onChange={handleChange}
                required
                placeholder="e.g., 20"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                This will create beds: {bedForm.prefix && `${bedForm.prefix}-`}
                {bedForm.startNumber || '___'} to {bedForm.prefix && `${bedForm.prefix}-`}
                {bedForm.endNumber || '___'}
                {bedForm.startNumber && bedForm.endNumber && 
                  ` (Total: ${parseInt(bedForm.endNumber) - parseInt(bedForm.startNumber) + 1} beds)`
                }
              </Typography>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Room Number"
                name="roomNumber"
                value={bedForm.roomNumber}
                onChange={handleChange}
                placeholder="e.g., 201"
                helperText="Optional: Same for all beds in this batch"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Daily Charge (₹)"
                name="dailyCharge"
                type="number"
                value={bedForm.dailyCharge}
                onChange={handleChange}
                placeholder="e.g., 1500"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Bed Features
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={bedForm.hasOxygenSupport}
                    onChange={handleChange}
                    name="hasOxygenSupport"
                  />
                }
                label="Oxygen Support"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={bedForm.hasVentilator}
                    onChange={handleChange}
                    name="hasVentilator"
                  />
                }
                label="Ventilator"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={bedForm.isIsolationBed}
                    onChange={handleChange}
                    name="isIsolationBed"
                  />
                }
                label="Isolation Bed"
              />
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              Review the beds to be created. You can remove individual beds if needed.
            </Alert>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Bed Number</TableCell>
                    <TableCell>Ward</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Floor</TableCell>
                    <TableCell>Room</TableCell>
                    <TableCell>Charge</TableCell>
                    <TableCell>Features</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bedsToCreate.map((bed, index) => (
                    <TableRow key={index}>
                      <TableCell>{bed.bedNumber}</TableCell>
                      <TableCell>{bed.wardName}</TableCell>
                      <TableCell>{bed.bedType}</TableCell>
                      <TableCell>{bed.floorNumber}</TableCell>
                      <TableCell>{bed.roomNumber || '-'}</TableCell>
                      <TableCell>₹{bed.dailyCharge}</TableCell>
                      <TableCell>
                        {bed.hasOxygenSupport && <Chip label="O2" size="small" sx={{ mr: 0.5 }} />}
                        {bed.hasVentilator && <Chip label="Vent" size="small" sx={{ mr: 0.5 }} />}
                        {bed.isIsolationBed && <Chip label="ISO" size="small" />}
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleRemoveBed(index)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Total Beds to Create: {bedsToCreate.length}
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Bed Creation"
        subtitle="Create and configure hospital beds"
        icon={<BedIcon />}
      />

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 300 }}>
          {renderStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
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
                startIcon={<SaveIcon />}
                onClick={handleCreateBeds}
                disabled={loading || bedsToCreate.length === 0}
              >
                {loading ? 'Creating...' : `Create ${bedsToCreate.length} Bed(s)`}
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
