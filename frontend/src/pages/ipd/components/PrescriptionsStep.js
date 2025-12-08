import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Medication as MedicationIcon,
} from '@mui/icons-material';
import { prescriptionAPI } from '../../../services/api';

const PrescriptionsStep = ({ admission, data, onChange }) => {
  const [loading, setLoading] = useState(true);
  const [existingPrescriptions, setExistingPrescriptions] = useState([]);
  const [selectedPrescriptions, setSelectedPrescriptions] = useState(data || []);

  useEffect(() => {
    fetchPrescriptions();
  }, [admission]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await prescriptionAPI.getByPatient(admission.patient.id);
      const prescriptions = response.data.data || [];
      
      // Filter active prescriptions
      const activePrescriptions = prescriptions.filter(
        p => p.status === 'PENDING' || p.status === 'PARTIALLY_DISPENSED'
      );
      setExistingPrescriptions(activePrescriptions);
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePrescription = (prescription) => {
    const exists = selectedPrescriptions.find(p => p.id === prescription.id);
    let updated;
    
    if (exists) {
      updated = selectedPrescriptions.filter(p => p.id !== prescription.id);
    } else {
      updated = [...selectedPrescriptions, prescription];
    }
    
    setSelectedPrescriptions(updated);
    onChange(updated);
  };

  const isSelected = (prescriptionId) => {
    return selectedPrescriptions.some(p => p.id === prescriptionId);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Discharge Prescriptions
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select medications that the patient should continue after discharge
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Select prescriptions from the list below to include in the discharge summary. These will be printed on the discharge documents.
      </Alert>

      {loading ? (
        <Typography>Loading prescriptions...</Typography>
      ) : existingPrescriptions.length === 0 ? (
        <Alert severity="warning">
          No active prescriptions found for this patient.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Medication</TableCell>
                <TableCell>Dosage</TableCell>
                <TableCell>Frequency</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Instructions</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Include</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {existingPrescriptions.map((prescription) => (
                <TableRow 
                  key={prescription.id}
                  sx={{ 
                    bgcolor: isSelected(prescription.id) ? 'action.selected' : 'inherit',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MedicationIcon color="primary" fontSize="small" />
                      <Typography variant="body2" fontWeight="bold">
                        {prescription.medication?.name || 'N/A'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {prescription.dosage} {prescription.medication?.dosageForm}
                  </TableCell>
                  <TableCell>{prescription.frequency}</TableCell>
                  <TableCell>
                    {prescription.durationDays ? `${prescription.durationDays} days` : 'As needed'}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 200 }}>
                      {prescription.instructions || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={prescription.status}
                      size="small"
                      color={prescription.status === 'PENDING' ? 'warning' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant={isSelected(prescription.id) ? 'contained' : 'outlined'}
                      onClick={() => handleTogglePrescription(prescription)}
                    >
                      {isSelected(prescription.id) ? 'Selected' : 'Select'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {selectedPrescriptions.length > 0 && (
        <Alert severity="success" sx={{ mt: 3 }}>
          {selectedPrescriptions.length} prescription(s) selected for discharge summary
        </Alert>
      )}
    </Box>
  );
};

export default PrescriptionsStep;
