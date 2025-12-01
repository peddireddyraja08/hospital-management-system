import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
} from '@mui/material';
import { Warning } from '@mui/icons-material';
import { medicationAPI, prescriptionAPI } from '../../services/api';

export default function PharmacyDashboard() {
  const [lowStockMeds, setLowStockMeds] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [medsResponse, prescResponse] = await Promise.all([
        medicationAPI.getLowStock(),
        prescriptionAPI.getAll(),
      ]);
      setLowStockMeds(medsResponse.data.data);
      setPrescriptions(prescResponse.data.data.filter(p => p.status === 'PENDING'));
    } catch (err) {
      setError('Failed to load pharmacy data');
    } finally {
      setLoading(false);
    }
  };

  const handleDispense = async (id) => {
    try {
      await prescriptionAPI.dispense(id);
      loadData();
    } catch (err) {
      setError('Failed to dispense prescription');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Pharmacy Dashboard
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Warning color="warning" sx={{ mr: 1 }} />
              <Typography variant="h6">Low Stock Medications</Typography>
            </Box>
            {lowStockMeds.length === 0 ? (
              <Typography color="text.secondary">No low stock items</Typography>
            ) : (
              <Grid container spacing={2}>
                {lowStockMeds.map((med) => (
                  <Grid item xs={12} key={med.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1">{med.medicationName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Stock: {med.stockQuantity} | Reorder Level: {med.reorderLevel}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Code: {med.medicationCode}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Pending Prescriptions
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Patient</TableCell>
                    <TableCell>Medication</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prescriptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No pending prescriptions
                      </TableCell>
                    </TableRow>
                  ) : (
                    prescriptions.map((presc) => (
                      <TableRow key={presc.id}>
                        <TableCell>
                          {presc.patient ? `${presc.patient.firstName} ${presc.patient.lastName}` : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {presc.medication ? presc.medication.medicationName : 'N/A'}
                        </TableCell>
                        <TableCell>{presc.quantity}</TableCell>
                        <TableCell>
                          <Button size="small" onClick={() => handleDispense(presc.id)}>
                            Dispense
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
