import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const FollowUpStep = ({ admission, data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const doctor = admission?.doctor;

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Follow-up Instructions
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Schedule follow-up appointments and provide care instructions
      </Typography>

      <Grid container spacing={3}>
        {/* Follow-up Required Toggle */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: 'action.hover' }}>
            <CardContent>
              <FormControlLabel
                control={
                  <Switch
                    checked={data.followUpRequired}
                    onChange={(e) => handleChange('followUpRequired', e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Follow-up Appointment Required
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Patient needs to return for a follow-up visit
                    </Typography>
                  </Box>
                }
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Follow-up Details (shown only if required) */}
        {data.followUpRequired && (
          <>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Follow-up Date *"
                  value={data.followUpDate}
                  onChange={(value) => handleChange('followUpDate', value)}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                  minDateTime={new Date()}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Follow-up Doctor"
                value={data.followUpDoctor}
                onChange={(e) => handleChange('followUpDoctor', e.target.value)}
                placeholder={`Dr. ${doctor?.firstName} ${doctor?.lastName}`}
                helperText="Doctor to see for follow-up appointment"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Follow-up Instructions"
                value={data.followUpInstructions}
                onChange={(e) => handleChange('followUpInstructions', e.target.value)}
                placeholder="Specific instructions for the follow-up visit (tests to bring, documents needed, etc.)"
              />
            </Grid>
          </>
        )}

        {/* Warning Symptoms */}
        <Grid item xs={12}>
          <Card sx={{ border: 2, borderColor: 'warning.main' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <WarningIcon color="warning" />
                <Typography variant="subtitle1" fontWeight="bold">
                  Warning Symptoms
                </Typography>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="When to Seek Immediate Medical Attention"
                value={data.warningSymptoms}
                onChange={(e) => handleChange('warningSymptoms', e.target.value)}
                placeholder="List symptoms that require immediate medical attention (e.g., high fever, severe pain, difficulty breathing, excessive bleeding)"
                helperText="Important: Patient should seek emergency care if these symptoms occur"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Emergency Contact */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Emergency Contact Information"
            value={data.emergencyContact}
            onChange={(e) => handleChange('emergencyContact', e.target.value)}
            placeholder="Hospital emergency number or doctor's contact for urgent concerns"
            helperText="Contact number to call in case of emergency or urgent concerns"
          />
        </Grid>

        {/* Home Care Instructions */}
        <Grid item xs={12}>
          <Alert severity="info">
            <Typography variant="body2" fontWeight="bold" gutterBottom>
              General Home Care Instructions:
            </Typography>
            <Typography variant="body2" component="div">
              • Take all medications as prescribed<br />
              • Keep the surgical site/wound clean and dry (if applicable)<br />
              • Follow diet and activity restrictions<br />
              • Monitor for warning symptoms<br />
              • Attend follow-up appointments as scheduled<br />
              • Contact your doctor if you have any concerns
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FollowUpStep;
