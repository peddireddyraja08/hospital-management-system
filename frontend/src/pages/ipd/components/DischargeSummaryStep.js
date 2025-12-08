import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  Person as PersonIcon,
  LocalHospital as BedIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';

const DischargeSummaryStep = ({ admission, data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const patient = admission?.patient;
  const bed = admission?.bed;
  const doctor = admission?.doctor;

  // Calculate length of stay
  const admissionDate = new Date(admission?.admissionDate);
  const today = new Date();
  const lengthOfStay = Math.ceil((today - admissionDate) / (1000 * 60 * 60 * 24));

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Discharge Summary
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Complete the discharge summary with clinical details
      </Typography>

      {/* Patient Summary Card */}
      <Card sx={{ mb: 3, bgcolor: 'action.hover' }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PersonIcon color="primary" />
                <Typography variant="subtitle2" fontWeight="bold">
                  Patient Information
                </Typography>
              </Box>
              <Typography variant="body2">
                <strong>Name:</strong> {patient?.firstName} {patient?.lastName}
              </Typography>
              <Typography variant="body2">
                <strong>Age:</strong>{' '}
                {patient?.dateOfBirth
                  ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
                  : 'N/A'}{' '}
                years
              </Typography>
              <Typography variant="body2">
                <strong>Gender:</strong> {patient?.gender}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <BedIcon color="primary" />
                <Typography variant="subtitle2" fontWeight="bold">
                  Admission Details
                </Typography>
              </Box>
              <Typography variant="body2">
                <strong>Admission #:</strong> {admission?.admissionNumber}
              </Typography>
              <Typography variant="body2">
                <strong>Bed:</strong> {bed?.wardName} - {bed?.bedNumber}
              </Typography>
              <Typography variant="body2">
                <strong>Priority:</strong>{' '}
                <Chip
                  label={admission?.priority}
                  size="small"
                  color={admission?.priority === 'EMERGENCY' ? 'error' : 'default'}
                />
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CalendarIcon color="primary" />
                <Typography variant="subtitle2" fontWeight="bold">
                  Stay Duration
                </Typography>
              </Box>
              <Typography variant="body2">
                <strong>Admitted:</strong>{' '}
                {admissionDate.toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </Typography>
              <Typography variant="body2">
                <strong>Length of Stay:</strong> {lengthOfStay} day{lengthOfStay !== 1 ? 's' : ''}
              </Typography>
              <Typography variant="body2">
                <strong>Attending Doctor:</strong> Dr. {doctor?.firstName} {doctor?.lastName}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Discharge Summary Form */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Discharge Type</InputLabel>
            <Select
              value={data.dischargeType}
              label="Discharge Type"
              onChange={(e) => handleChange('dischargeType', e.target.value)}
            >
              <MenuItem value="ROUTINE">Routine</MenuItem>
              <MenuItem value="AGAINST_MEDICAL_ADVICE">Against Medical Advice (AMA)</MenuItem>
              <MenuItem value="TRANSFER">Transfer to Another Facility</MenuItem>
              <MenuItem value="EXPIRED">Expired</MenuItem>
              <MenuItem value="ABSCONDED">Absconded</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Condition at Discharge"
            value={data.conditionAtDischarge}
            onChange={(e) => handleChange('conditionAtDischarge', e.target.value)}
            placeholder="e.g., Stable, Improved, Critical"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            multiline
            rows={3}
            label="Primary Diagnosis"
            value={data.diagnosis}
            onChange={(e) => handleChange('diagnosis', e.target.value)}
            placeholder="Enter primary diagnosis and any secondary diagnoses"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Hospital Course / Summary of Stay"
            value={data.hospitalCourse}
            onChange={(e) => handleChange('hospitalCourse', e.target.value)}
            placeholder="Summarize the patient's hospital stay, treatments received, and response to treatment"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Procedures Performed"
            value={data.proceduresPerformed}
            onChange={(e) => handleChange('proceduresPerformed', e.target.value)}
            placeholder="List any procedures, surgeries, or interventions performed during stay"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Discharge Medications"
            value={data.dischargeMedications}
            onChange={(e) => handleChange('dischargeMedications', e.target.value)}
            placeholder="List medications patient should continue after discharge"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Diet Instructions"
            value={data.dietInstructions}
            onChange={(e) => handleChange('dietInstructions', e.target.value)}
            placeholder="Any dietary restrictions or recommendations"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Activity Restrictions"
            value={data.activityRestrictions}
            onChange={(e) => handleChange('activityRestrictions', e.target.value)}
            placeholder="Physical activity limitations or restrictions"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Special Instructions"
            value={data.specialInstructions}
            onChange={(e) => handleChange('specialInstructions', e.target.value)}
            placeholder="Any additional instructions for patient care at home"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DischargeSummaryStep;
