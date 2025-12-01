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
  Tabs,
  Tab,
} from '@mui/material';
import { labTestRequestAPI } from '../../services/api';

export default function LabTestsList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await labTestRequestAPI.getAll();
      setRequests(response.data.data);
    } catch (err) {
      setError('Failed to load lab test requests');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      await labTestRequestAPI.verifyResult(id);
      loadRequests();
    } catch (err) {
      setError('Failed to verify result');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'IN_PROGRESS': return 'primary';
      case 'VERIFIED': return 'success';
      case 'REQUESTED': return 'warning';
      default: return 'default';
    }
  };

  const filterRequests = (status) => {
    if (tabValue === 0) return requests;
    const statuses = ['REQUESTED', 'IN_PROGRESS', 'COMPLETED'];
    return requests.filter(r => r.status === statuses[tabValue - 1]);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Lab Tests & Requests
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="All" />
          <Tab label="Requested" />
          <Tab label="In Progress" />
          <Tab label="Completed" />
        </Tabs>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Test Name</TableCell>
              <TableCell>Requested By</TableCell>
              <TableCell>Request Date</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Loading...</TableCell>
              </TableRow>
            ) : filterRequests().length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No test requests found</TableCell>
              </TableRow>
            ) : (
              filterRequests().map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    {request.patient ? `${request.patient.firstName} ${request.patient.lastName}` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {request.labTest ? request.labTest.testName : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {request.doctor ? `Dr. ${request.doctor.firstName} ${request.doctor.lastName}` : 'N/A'}
                  </TableCell>
                  <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip label={request.priority} size="small" color={request.priority === 'STAT' ? 'error' : 'default'} />
                  </TableCell>
                  <TableCell>
                    <Chip label={request.status} color={getStatusColor(request.status)} size="small" />
                  </TableCell>
                  <TableCell>
                    {request.status === 'COMPLETED' && (
                      <Button size="small" onClick={() => handleVerify(request.id)}>
                        Verify
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
