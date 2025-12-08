import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Receipt as BillIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';

const BillingClearanceStep = ({ admission, bill, onBillingCleared }) => {
  const [cleared, setCleared] = useState(false);

  const patient = admission?.patient;

  const handleClearBilling = () => {
    setCleared(true);
    onBillingCleared(true);
  };

  // Calculate billing status
  const isBillPaid = bill?.status === 'PAID';
  const isPendingPayment = bill && (bill.status === 'PENDING' || bill.status === 'PARTIALLY_PAID');
  const noBillGenerated = !bill;

  const getBillStatusColor = () => {
    if (isBillPaid) return 'success';
    if (isPendingPayment) return 'warning';
    return 'default';
  };

  const getPaymentPercentage = () => {
    if (!bill || bill.totalAmount === 0) return 0;
    return ((bill.paidAmount || 0) / bill.totalAmount) * 100;
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Billing Clearance
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Verify billing status before discharge
      </Typography>

      {/* Billing Status Card */}
      <Card sx={{ mb: 3, border: 2, borderColor: isBillPaid ? 'success.main' : 'warning.main' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <BillIcon sx={{ fontSize: 40, color: isBillPaid ? 'success.main' : 'warning.main' }} />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Billing Status
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {patient?.firstName} {patient?.lastName} - {admission?.admissionNumber}
                </Typography>
              </Box>
            </Box>
            <Chip
              label={bill?.status || 'NO BILL'}
              color={getBillStatusColor()}
              icon={isBillPaid ? <CheckIcon /> : <WarningIcon />}
              sx={{ fontSize: '1rem', py: 2 }}
            />
          </Box>

          {bill && (
            <>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Total Amount
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    ₹{bill.totalAmount?.toLocaleString() || 0}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Paid Amount
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="success.main">
                    ₹{bill.paidAmount?.toLocaleString() || 0}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Due Amount
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="error.main">
                    ₹{bill.dueAmount?.toLocaleString() || 0}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Payment Status
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <LinearProgress
                      variant="determinate"
                      value={getPaymentPercentage()}
                      sx={{ flex: 1, height: 8, borderRadius: 1 }}
                      color={isBillPaid ? 'success' : 'warning'}
                    />
                    <Typography variant="body2" fontWeight="bold">
                      {getPaymentPercentage().toFixed(0)}%
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Charge Breakdown */}
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                Charge Breakdown:
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Category</strong></TableCell>
                      <TableCell align="right"><strong>Amount</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bill.consultationCharges > 0 && (
                      <TableRow>
                        <TableCell>Consultation Charges</TableCell>
                        <TableCell align="right">₹{bill.consultationCharges?.toLocaleString()}</TableCell>
                      </TableRow>
                    )}
                    {bill.roomCharges > 0 && (
                      <TableRow>
                        <TableCell>Room Charges</TableCell>
                        <TableCell align="right">₹{bill.roomCharges?.toLocaleString()}</TableCell>
                      </TableRow>
                    )}
                    {bill.labCharges > 0 && (
                      <TableRow>
                        <TableCell>Lab Charges</TableCell>
                        <TableCell align="right">₹{bill.labCharges?.toLocaleString()}</TableCell>
                      </TableRow>
                    )}
                    {bill.medicationCharges > 0 && (
                      <TableRow>
                        <TableCell>Medication Charges</TableCell>
                        <TableCell align="right">₹{bill.medicationCharges?.toLocaleString()}</TableCell>
                      </TableRow>
                    )}
                    {bill.procedureCharges > 0 && (
                      <TableRow>
                        <TableCell>Procedure Charges</TableCell>
                        <TableCell align="right">₹{bill.procedureCharges?.toLocaleString()}</TableCell>
                      </TableRow>
                    )}
                    {bill.otherCharges > 0 && (
                      <TableRow>
                        <TableCell>Other Charges</TableCell>
                        <TableCell align="right">₹{bill.otherCharges?.toLocaleString()}</TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell><strong>Total</strong></TableCell>
                      <TableCell align="right">
                        <strong>₹{bill.totalAmount?.toLocaleString()}</strong>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </CardContent>
      </Card>

      {/* Clearance Alerts */}
      {isBillPaid && (
        <Alert severity="success" icon={<CheckIcon />} sx={{ mb: 2 }}>
          <Typography variant="body1" fontWeight="bold">
            Bill Fully Paid - Clearance Approved
          </Typography>
          <Typography variant="body2">
            All outstanding payments have been settled. Patient can be discharged.
          </Typography>
        </Alert>
      )}

      {isPendingPayment && (
        <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 2 }}>
          <Typography variant="body1" fontWeight="bold">
            Outstanding Payment - ₹{bill.dueAmount?.toLocaleString()}
          </Typography>
          <Typography variant="body2">
            There is a pending balance. Please ensure payment is collected before discharge, or obtain management approval for deferred payment.
          </Typography>
        </Alert>
      )}

      {noBillGenerated && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body1" fontWeight="bold">
            No Bill Generated
          </Typography>
          <Typography variant="body2">
            A bill has not been generated for this admission. If charges apply, please create a bill in the Billing module before discharge.
          </Typography>
        </Alert>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
        {!isBillPaid && bill && (
          <Button
            variant="outlined"
            startIcon={<PaymentIcon />}
            onClick={() => window.open(`/billing?patientId=${patient?.id}`, '_blank')}
          >
            Process Payment
          </Button>
        )}
        
        {(isBillPaid || cleared) ? (
          <Alert severity="success" sx={{ flex: 1 }}>
            <Typography variant="body2" fontWeight="bold">
              ✓ Billing Cleared - Ready for Discharge
            </Typography>
          </Alert>
        ) : (
          <Button
            variant="contained"
            color="primary"
            startIcon={<CheckIcon />}
            onClick={handleClearBilling}
            disabled={isPendingPayment && !cleared}
          >
            {noBillGenerated ? 'No Bill Required - Clear' : 'Override & Clear Billing'}
          </Button>
        )}
      </Box>

      {!isBillPaid && !noBillGenerated && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Note:</strong> If management approval has been obtained for discharge with pending payment, click "Override & Clear Billing" to proceed.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default BillingClearanceStep;
