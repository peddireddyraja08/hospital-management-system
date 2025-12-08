import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  ArrowForward as ForwardIcon,
  Check as CheckIcon,
  LocalHospital as HospitalIcon,
} from '@mui/icons-material';
import { admissionAPI, billAPI } from '../../services/api';
import DischargeSummaryStep from './components/DischargeSummaryStep';
import PrescriptionsStep from './components/PrescriptionsStep';
import FollowUpStep from './components/FollowUpStep';
import BillingClearanceStep from './components/BillingClearanceStep';
import FinalDischargeStep from './components/FinalDischargeStep';

const steps = [
  'Discharge Summary',
  'Prescriptions',
  'Follow-up Instructions',
  'Billing Clearance',
  'Final Discharge',
];

const DischargeWizard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const admissionId = searchParams.get('admissionId');

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [admission, setAdmission] = useState(null);
  const [bill, setBill] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Discharge data collected from all steps
  const [dischargeData, setDischargeData] = useState({
    // Step 1: Discharge Summary
    dischargeSummary: {
      dischargeType: 'ROUTINE',
      diagnosis: '',
      proceduresPerformed: '',
      hospitalCourse: '',
      conditionAtDischarge: '',
      dischargeMedications: '',
      dietInstructions: '',
      activityRestrictions: '',
      specialInstructions: '',
    },
    // Step 2: Prescriptions
    prescriptions: [],
    // Step 3: Follow-up
    followUp: {
      followUpRequired: false,
      followUpDate: null,
      followUpDoctor: '',
      followUpInstructions: '',
      warningSymptoms: '',
      emergencyContact: '',
    },
    // Step 4: Billing (read-only, for verification)
    billingCleared: false,
    // Step 5: Final discharge confirmation
    dischargeDate: new Date(),
    dischargedBy: '',
  });

  useEffect(() => {
    if (admissionId) {
      fetchAdmissionDetails();
    } else {
      setError('No admission ID provided');
      setLoading(false);
    }
  }, [admissionId]);

  const fetchAdmissionDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const admissionResponse = await admissionAPI.getById(admissionId);
      const admissionData = admissionResponse.data.data;
      setAdmission(admissionData);

      // Try to fetch bill
      try {
        const billResponse = await billAPI.getByPatient(admissionData.patient.id);
        const bills = billResponse.data.data || [];
        const admissionBill = bills.find(b => b.admission?.id === parseInt(admissionId));
        if (admissionBill) {
          setBill(admissionBill);
        }
      } catch (err) {
        // No bill found for this admission
      }
    } catch (err) {
      console.error('Error fetching admission:', err);
      setError('Failed to load admission details');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Final step - show confirmation dialog
      setConfirmDialogOpen(true);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleStepChange = (step) => {
    if (step < activeStep) {
      setActiveStep(step);
    }
  };

  const handleDischargeDataChange = (stepKey, data) => {
    setDischargeData((prev) => ({
      ...prev,
      [stepKey]: data,
    }));
  };

  const handleConfirmDischarge = async () => {
    try {
      setLoading(true);
      setError(null);

      // Prepare discharge request
      const dischargeRequest = {
        dischargeType: dischargeData.dischargeSummary.dischargeType,
        dischargeSummary: JSON.stringify(dischargeData.dischargeSummary),
        dischargeMedications: dischargeData.dischargeSummary.dischargeMedications,
        followUpInstructions: dischargeData.followUp.followUpInstructions,
        dischargeDate: dischargeData.dischargeDate.toISOString(),
      };

      await admissionAPI.discharge(admissionId, dischargeRequest);
      
      setSuccess('Patient discharged successfully');
      setConfirmDialogOpen(false);

      // Navigate back to IPD dashboard after 2 seconds
      setTimeout(() => {
        navigate('/ipd');
      }, 2000);
    } catch (err) {
      console.error('Error discharging patient:', err);
      setError(err.response?.data?.message || 'Failed to discharge patient');
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0: // Discharge Summary
        return dischargeData.dischargeSummary.diagnosis && 
               dischargeData.dischargeSummary.conditionAtDischarge;
      case 1: // Prescriptions
        return true; // Optional
      case 2: // Follow-up
        return !dischargeData.followUp.followUpRequired || 
               (dischargeData.followUp.followUpDate && dischargeData.followUp.followUpDoctor);
      case 3: // Billing Clearance
        return dischargeData.billingCleared || !bill || bill.status === 'PAID';
      case 4: // Final Discharge
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    if (!admission) return null;

    switch (activeStep) {
      case 0:
        return (
          <DischargeSummaryStep
            admission={admission}
            data={dischargeData.dischargeSummary}
            onChange={(data) => handleDischargeDataChange('dischargeSummary', data)}
          />
        );
      case 1:
        return (
          <PrescriptionsStep
            admission={admission}
            data={dischargeData.prescriptions}
            onChange={(data) => handleDischargeDataChange('prescriptions', data)}
          />
        );
      case 2:
        return (
          <FollowUpStep
            admission={admission}
            data={dischargeData.followUp}
            onChange={(data) => handleDischargeDataChange('followUp', data)}
          />
        );
      case 3:
        return (
          <BillingClearanceStep
            admission={admission}
            bill={bill}
            onBillingCleared={(cleared) => handleDischargeDataChange('billingCleared', cleared)}
          />
        );
      case 4:
        return (
          <FinalDischargeStep
            admission={admission}
            dischargeData={dischargeData}
          />
        );
      default:
        return null;
    }
  };

  if (loading && !admission) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error && !admission) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/ipd')}>
          Back to IPD Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <HospitalIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Discharge Wizard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {admission?.patient?.firstName} {admission?.patient?.lastName} - {admission?.admissionNumber}
            </Typography>
          </Box>
        </Box>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/ipd')}>
          Back to Dashboard
        </Button>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label} onClick={() => handleStepChange(index)} sx={{ cursor: index < activeStep ? 'pointer' : 'default' }}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Step Content */}
      <Paper sx={{ p: 3, mb: 3, minHeight: 400 }}>
        {renderStepContent()}
      </Paper>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<BackIcon />}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          endIcon={activeStep === steps.length - 1 ? <CheckIcon /> : <ForwardIcon />}
          disabled={!isStepValid() || loading}
        >
          {activeStep === steps.length - 1 ? 'Discharge Patient' : 'Next'}
        </Button>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Patient Discharge</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone. Please ensure all information is correct.
          </Alert>
          <Typography variant="body1" gutterBottom>
            <strong>Patient:</strong> {admission?.patient?.firstName} {admission?.patient?.lastName}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Admission Number:</strong> {admission?.admissionNumber}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Discharge Type:</strong> {dischargeData.dischargeSummary.dischargeType}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Diagnosis:</strong> {dischargeData.dischargeSummary.diagnosis}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmDischarge}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <CheckIcon />}
          >
            Confirm Discharge
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DischargeWizard;
