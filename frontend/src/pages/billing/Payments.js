import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Typography,
  alpha
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import PageHeader from '../../components/PageHeader';

export default function Payments() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with API call
  const payments = [
    {
      id: 1,
      receiptNo: 'RCP001',
      patientName: 'John Doe',
      billNumber: 'BILL001',
      amount: 5000,
      paymentMethod: 'CASH',
      paymentDate: '2024-12-01',
      status: 'COMPLETED'
    },
    {
      id: 2,
      receiptNo: 'RCP002',
      patientName: 'Jane Smith',
      billNumber: 'BILL002',
      amount: 15000,
      paymentMethod: 'CREDIT_CARD',
      paymentDate: '2024-12-02',
      status: 'COMPLETED'
    },
    {
      id: 3,
      receiptNo: 'RCP003',
      patientName: 'Robert Johnson',
      billNumber: 'BILL003',
      amount: 3500,
      paymentMethod: 'UPI',
      paymentDate: '2024-12-03',
      status: 'PENDING'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      case 'FAILED': return 'error';
      default: return 'default';
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'CASH': return '#10B981';
      case 'CREDIT_CARD': return '#3B82F6';
      case 'UPI': return '#8B5CF6';
      case 'NET_BANKING': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const filteredPayments = payments.filter(payment =>
    payment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.billNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <PageHeader
        title="Payments"
        subtitle="View and manage payment records"
      />

      <Paper sx={{ p: 2.5, border: '1px solid #E5E7EB', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', bgcolor: '#F9FAFB' }}>
        <TextField
          fullWidth
          placeholder="Search by receipt number, bill number, or patient name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#6B7280' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              bgcolor: 'white',
              '& fieldset': { borderColor: '#E5E7EB' },
              '&:hover fieldset': { borderColor: '#1565C0' },
            }
          }}
        />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>Receipt No</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>Patient Name</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>Bill Number</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>Payment Method</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>Payment Date</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow
                  key={payment.id}
                  sx={{
                    '&:hover': { bgcolor: alpha('#1565C0', 0.04) },
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <TableCell sx={{ fontSize: '0.875rem', color: '#1F2937', fontWeight: 500 }}>
                    {payment.receiptNo}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: '#1F2937' }}>
                    {payment.patientName}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: '#6B7280' }}>
                    {payment.billNumber}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: '#1F2937', fontWeight: 600 }}>
                    ₹{payment.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={payment.paymentMethod.replace('_', ' ')}
                      size="small"
                      sx={{
                        bgcolor: alpha(getMethodColor(payment.paymentMethod), 0.1),
                        color: getMethodColor(payment.paymentMethod),
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: '#6B7280' }}>
                    {new Date(payment.paymentDate).toLocaleDateString('en-GB')}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={payment.status}
                      color={getStatusColor(payment.status)}
                      size="small"
                      sx={{ fontWeight: 500, fontSize: '0.75rem' }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      sx={{ color: '#1565C0', mr: 1 }}
                      title="View Details"
                    >
                      <VisibilityOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{ color: '#10B981' }}
                      title="Print Receipt"
                    >
                      <PrintOutlinedIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredPayments.length === 0 && (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No payments found
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
