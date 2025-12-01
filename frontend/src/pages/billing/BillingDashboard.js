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
} from '@mui/material';
import { billAPI } from '../../services/api';

export default function BillingDashboard() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    try {
      setLoading(true);
      const response = await billAPI.getAll();
      setBills(response.data.data);
    } catch (err) {
      setError('Failed to load bills');
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
      setOpenPaymentDialog(false);
      setPaymentAmount('');
      loadBills();
    } catch (err) {
      setError('Failed to add payment');
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
      <Typography variant="h4" gutterBottom>
        Billing Dashboard
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
