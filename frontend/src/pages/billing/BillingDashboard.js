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
  Grid,
  MenuItem,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { billAPI, patientAPI } from '../../services/api';

export default function BillingDashboard() {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [openBillDialog, setOpenBillDialog] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [billFormData, setBillFormData] = useState({
    patientId: '',
    billDate: new Date().toISOString().split('T')[0],
    consultationCharges: '',
    labCharges: '',
    medicationCharges: '',
    roomCharges: '',
    procedureCharges: '',
    otherCharges: '',
  });

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    try {
      setLoading(true);
      const [billsRes, patientsRes] = await Promise.all([
        billAPI.getAll(),
        patientAPI.getAll(),
      ]);
      setBills(billsRes.data.data);
      setPatients(patientsRes.data.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async () => {
    try {
      await billAPI.addPayment(selectedBill.id, {
        amount: parseFloat(paymentAmount),
        paymentMethod: paymentMethod,
      });
      setSuccess('Payment added successfully');
      setOpenPaymentDialog(false);
      setPaymentAmount('');
      loadBills();
    } catch (err) {
      setError('Failed to add payment');
    }
  };

  const handleOpenBillDialog = () => {
    setOpenBillDialog(true);
    setBillFormData({
      patientId: '',
      billDate: new Date().toISOString().split('T')[0],
      consultationCharges: '',
      labCharges: '',
      medicationCharges: '',
      roomCharges: '',
      procedureCharges: '',
      otherCharges: '',
    });
    setError('');
    setSuccess('');
  };

  const handleBillChange = (e) => {
    setBillFormData({
      ...billFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBillSubmit = async (e) => {
    e.preventDefault();
    try {
      const billData = {
        patient: { id: billFormData.patientId },
        consultationCharges: parseFloat(billFormData.consultationCharges) || 0,
        labCharges: parseFloat(billFormData.labCharges) || 0,
        medicationCharges: parseFloat(billFormData.medicationCharges) || 0,
        roomCharges: parseFloat(billFormData.roomCharges) || 0,
        procedureCharges: parseFloat(billFormData.procedureCharges) || 0,
        otherCharges: parseFloat(billFormData.otherCharges) || 0,
      };
      await billAPI.create(billData);
      setSuccess('Bill created successfully');
      setOpenBillDialog(false);
      loadBills();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create bill');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID': return 'success';
      case 'PARTIALLY_PAID': return 'warning';
      case 'PENDING': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Billing Dashboard
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenBillDialog}>
          Create Bill
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bill Number</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Bill Date</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Paid Amount</TableCell>
              <TableCell>Due Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">Loading...</TableCell>
              </TableRow>
            ) : bills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">No bills found</TableCell>
              </TableRow>
            ) : (
              bills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell>{bill.billNumber}</TableCell>
                  <TableCell>
                    {bill.patient ? `${bill.patient.firstName} ${bill.patient.lastName}` : 'N/A'}
                  </TableCell>
                  <TableCell>{new Date(bill.billDate).toLocaleDateString()}</TableCell>
                  <TableCell>₹{bill.totalAmount?.toFixed(2)}</TableCell>
                  <TableCell>₹{bill.paidAmount?.toFixed(2)}</TableCell>
                  <TableCell>₹{bill.dueAmount?.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip label={bill.status} color={getStatusColor(bill.status)} size="small" />
                  </TableCell>
                  <TableCell>
                    {bill.status !== 'PAID' && (
                      <Button
                        size="small"
                        onClick={() => {
                          setSelectedBill(bill);
                          setOpenPaymentDialog(true);
                        }}
                      >
                        Add Payment
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Bill Dialog */}
      <Dialog open={openBillDialog} onClose={() => setOpenBillDialog(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleBillSubmit}>
          <DialogTitle>Create New Bill</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Patient"
                  name="patientId"
                  value={billFormData.patientId}
                  onChange={handleBillChange}
                  required
                >
                  {patients.map((patient) => (
                    <MenuItem key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName} ({patient.patientId})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bill Date"
                  name="billDate"
                  type="date"
                  value={billFormData.billDate}
                  onChange={handleBillChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Consultation Charges"
                  name="consultationCharges"
                  type="number"
                  value={billFormData.consultationCharges}
                  onChange={handleBillChange}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Lab Charges"
                  name="labCharges"
                  type="number"
                  value={billFormData.labCharges}
                  onChange={handleBillChange}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Medication Charges"
                  name="medicationCharges"
                  type="number"
                  value={billFormData.medicationCharges}
                  onChange={handleBillChange}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Room Charges"
                  name="roomCharges"
                  type="number"
                  value={billFormData.roomCharges}
                  onChange={handleBillChange}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Procedure Charges"
                  name="procedureCharges"
                  type="number"
                  value={billFormData.procedureCharges}
                  onChange={handleBillChange}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Other Charges"
                  name="otherCharges"
                  type="number"
                  value={billFormData.otherCharges}
                  onChange={handleBillChange}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenBillDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Create Bill
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Add Payment Dialog */}
      <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)}>
        <DialogTitle>Add Payment for {selectedBill?.billNumber}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Payment Amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                inputProps={{ max: selectedBill?.dueAmount }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Payment Method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                SelectProps={{ native: true }}
              >
                <option value="CASH">Cash</option>
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="DEBIT_CARD">Debit Card</option>
                <option value="UPI">UPI</option>
                <option value="NET_BANKING">Net Banking</option>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPaymentDialog(false)}>Cancel</Button>
          <Button onClick={handleAddPayment} variant="contained">
            Add Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
