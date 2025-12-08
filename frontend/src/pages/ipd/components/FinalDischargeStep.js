import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Person as PersonIcon,
  LocalHospital as HospitalIcon,
  Receipt as BillIcon,
  CalendarToday as CalendarIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

const FinalDischargeStep = ({ admission, dischargeData }) => {
  const patient = admission?.patient;
  const doctor = admission?.doctor;
  const bed = admission?.bed;

  // Calculate length of stay
  const admissionDate = new Date(admission?.admissionDate);
  const today = new Date();
  const lengthOfStay = Math.ceil((today - admissionDate) / (1000 * 60 * 60 * 24));

  const handlePrintSummary = () => {
    // This would trigger a print dialog with the discharge summary
    window.print();
  };

  const handleDownloadPDF = () => {
    // This would generate and download a PDF of the discharge summary
    alert('PDF generation would be implemented here using a library like jsPDF or by calling a backend API');
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Final Discharge Review
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Review all discharge information before confirming
      </Typography>

      <Alert severity="success" icon={<CheckIcon />} sx={{ mb: 3 }}>
        <Typography variant="body1" fontWeight="bold">
          All Steps Completed
        </Typography>
        <Typography variant="body2">
          Please review the discharge summary below. Once confirmed, the patient will be officially discharged.
        </Typography>
      </Alert>

      {/* Patient Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon color="primary" />
            Patient Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Name:</strong> {patient?.firstName} {patient?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Patient ID:</strong> {patient?.patientId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Age/Gender:</strong>{' '}
                {patient?.dateOfBirth
                  ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
                  : 'N/A'}{' '}
                years / {patient?.gender}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Admission Number:</strong> {admission?.admissionNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Admission Date:</strong>{' '}
                {admissionDate.toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Length of Stay:</strong> {lengthOfStay} day{lengthOfStay !== 1 ? 's' : ''}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Discharge Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HospitalIcon color="primary" />
            Discharge Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Discharge Type:</strong>
              </Typography>
              <Chip
                label={dischargeData.dischargeSummary.dischargeType.replace(/_/g, ' ')}
                color="primary"
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Condition at Discharge:</strong>
              </Typography>
              <Typography variant="body2">
                {dischargeData.dischargeSummary.conditionAtDischarge}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                <strong>Primary Diagnosis:</strong>
              </Typography>
              <Typography variant="body2">{dischargeData.dischargeSummary.diagnosis}</Typography>
            </Grid>
            {dischargeData.dischargeSummary.hospitalCourse && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Hospital Course:</strong>
                </Typography>
                <Typography variant="body2">
                  {dischargeData.dischargeSummary.hospitalCourse}
                </Typography>
              </Grid>
            )}
            {dischargeData.dischargeSummary.proceduresPerformed && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Procedures Performed:</strong>
                </Typography>
                <Typography variant="body2">
                  {dischargeData.dischargeSummary.proceduresPerformed}
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Medications & Instructions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Discharge Medications & Instructions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                <strong>Medications:</strong>
              </Typography>
              <Typography variant="body2">
                {dischargeData.dischargeSummary.dischargeMedications || 'None specified'}
              </Typography>
            </Grid>
            {dischargeData.prescriptions.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Selected Prescriptions:</strong> {dischargeData.prescriptions.length} item(s)
                </Typography>
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Diet Instructions:</strong>
              </Typography>
              <Typography variant="body2">
                {dischargeData.dischargeSummary.dietInstructions || 'No specific restrictions'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Activity Restrictions:</strong>
              </Typography>
              <Typography variant="body2">
                {dischargeData.dischargeSummary.activityRestrictions || 'No specific restrictions'}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Follow-up */}
      {dischargeData.followUp.followUpRequired && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon color="primary" />
              Follow-up Appointment
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Date:</strong>
                </Typography>
                <Typography variant="body2">
                  {dischargeData.followUp.followUpDate
                    ? new Date(dischargeData.followUp.followUpDate).toLocaleString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Doctor:</strong>
                </Typography>
                <Typography variant="body2">{dischargeData.followUp.followUpDoctor}</Typography>
              </Grid>
              {dischargeData.followUp.followUpInstructions && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Instructions:</strong>
                  </Typography>
                  <Typography variant="body2">
                    {dischargeData.followUp.followUpInstructions}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Warning Symptoms */}
      {dischargeData.followUp.warningSymptoms && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            Warning Symptoms - Seek Immediate Medical Attention:
          </Typography>
          <Typography variant="body2">{dischargeData.followUp.warningSymptoms}</Typography>
        </Alert>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
        <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrintSummary}>
          Print Summary
        </Button>
        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownloadPDF}>
          Download PDF
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Alert severity="info">
        <Typography variant="body2" fontWeight="bold" gutterBottom>
          What happens after discharge confirmation:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <CheckIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText primary="Patient admission status will be updated to DISCHARGED" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText primary="Hospital bed will be released and marked as available" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText primary="Discharge summary will be saved to medical records" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText primary="Patient can collect discharge documents from reception" />
          </ListItem>
        </List>
      </Alert>
    </Box>
  );
};

export default FinalDischargeStep;
