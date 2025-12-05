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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  Chip,
  Alert,
  Tabs,
  Tab,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Visibility,
  Cancel,
  PlayArrow,
  Done,
  LocalShipping,
  Print,
} from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';
const token = localStorage.getItem('token');

const sampleAPI = {
  getAll: () => axios.get(`${API_BASE_URL}/samples`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  create: (data) => axios.post(`${API_BASE_URL}/samples`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  update: (id, data) => axios.put(`${API_BASE_URL}/samples/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getByAccession: (accessionNumber) => axios.get(`${API_BASE_URL}/samples/accession/${accessionNumber}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getByStatus: (status) => axios.get(`${API_BASE_URL}/samples/status/${status}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  receiveSample: (id, data) => axios.put(`${API_BASE_URL}/samples/${id}/receive`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  rejectSample: (id, data) => axios.put(`${API_BASE_URL}/samples/${id}/reject`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  startProcessing: (id) => axios.put(`${API_BASE_URL}/samples/${id}/start-processing`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  completeSample: (id, data) => axios.put(`${API_BASE_URL}/samples/${id}/complete`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  generateAccessionNumber: () => axios.get(`${API_BASE_URL}/samples/generate-accession-number`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
};

const labTestRequestAPI = {
  getAll: () => axios.get(`${API_BASE_URL}/lab-test-requests`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getByStatus: (status) => axios.get(`${API_BASE_URL}/lab-test-requests/status/${status}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
};

const SAMPLE_TYPES = [
  'BLOOD',
  'SERUM',
  'PLASMA',
  'URINE',
  'STOOL',
  'SPUTUM',
  'TISSUE',
  'SWAB',
  'CSF',
  'BODY_FLUID',
  'BONE_MARROW',
  'SALIVA',
];

const STATUS_COLORS = {
  COLLECTED: 'info',
  RECEIVED: 'primary',
  PROCESSING: 'warning',
  STORED: 'success',
  DISPOSED: 'default',
  REJECTED: 'error',
  INSUFFICIENT: 'error',
};

export default function SampleManagement() {
  const [samples, setSamples] = useState([]);
  const [labTestRequests, setLabTestRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openReceiveDialog, setOpenReceiveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [selectedSample, setSelectedSample] = useState(null);
  const [searchAccession, setSearchAccession] = useState('');
  const [formData, setFormData] = useState({
    accessionNumber: '',
    patient: { id: '' },
    labTestRequest: { id: '' },
    sampleType: '',
    volume: '',
    containerType: '',
    collectedBy: '',
    remarks: '',
  });
  const [receiveData, setReceiveData] = useState({
    receivedBy: '',
    condition: 'Good',
    storageLocation: '',
  });
  const [rejectData, setRejectData] = useState({
    rejectionReason: '',
    rejectedBy: '',
  });

  useEffect(() => {
    loadSamples();
    loadPendingRequests();
  }, []);

  const loadSamples = async () => {
    try {
      const response = await sampleAPI.getAll();
      setSamples(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load samples');
      console.error(err);
    }
  };

  const loadPendingRequests = async () => {
    try {
      // Load REQUESTED status test requests
      const response = await labTestRequestAPI.getByStatus('REQUESTED');
      const allRequests = response.data.data;
      
      // Get all samples to check which requests already have samples
      const samplesResponse = await sampleAPI.getAll();
      const existingSamples = samplesResponse.data.data;
      
      // Filter out requests that already have samples collected
      const collectedRequestIds = existingSamples.map(s => s.labTestRequestId);
      const pendingRequests = allRequests.filter(req => !collectedRequestIds.includes(req.id));
      
      setLabTestRequests(pendingRequests);
    } catch (err) {
      console.error('Failed to load lab test requests:', err);
    }
  };

  const handleRequestSelect = (requestId) => {
    const request = labTestRequests.find(r => r.id === requestId);
    if (request) {
      setSelectedRequest(request);
      setFormData({
        ...formData,
        patient: { id: request.patient?.id || '' },
        labTestRequest: { id: request.id },
        sampleType: request.labTest?.sampleType || '',
        volume: request.labTest?.sampleVolume || '',
        containerType: request.labTest?.sampleContainer || '',
      });
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      accessionNumber: '',
      patient: { id: '' },
      labTestRequest: { id: '' },
      sampleType: '',
      volume: '',
      containerType: '',
      collectedBy: '',
      remarks: '',
    });
    setSelectedRequest(null);
    setOpenDialog(true);
    loadPendingRequests(); // Refresh pending requests when opening dialog
  };

  const handleGenerateAccession = async () => {
    try {
      const response = await sampleAPI.generateAccessionNumber();
      setFormData({ ...formData, accessionNumber: response.data.data });
      setSuccess('Accession number generated');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to generate accession number');
    }
  };

  const handleSubmit = async () => {
    try {
      await sampleAPI.create(formData);
      setSuccess('Sample created successfully');
      setOpenDialog(false);
      loadSamples();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create sample');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleViewSample = (sample) => {
    setSelectedSample(sample);
    setOpenViewDialog(true);
  };

  const handleReceiveSample = (sample) => {
    setSelectedSample(sample);
    setReceiveData({
      receivedBy: '',
      condition: 'Good',
      storageLocation: '',
    });
    setOpenReceiveDialog(true);
  };

  const handleReceiveSubmit = async () => {
    try {
      await sampleAPI.receiveSample(selectedSample.id, receiveData);
      setSuccess('Sample received successfully');
      setOpenReceiveDialog(false);
      loadSamples();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to receive sample');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleRejectSample = (sample) => {
    setSelectedSample(sample);
    setRejectData({
      rejectionReason: '',
      rejectedBy: '',
    });
    setOpenRejectDialog(true);
  };

  const handleRejectSubmit = async () => {
    try {
      await sampleAPI.rejectSample(selectedSample.id, rejectData);
      setSuccess('Sample rejected');
      setOpenRejectDialog(false);
      loadSamples();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject sample');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleStartProcessing = async (id) => {
    try {
      await sampleAPI.startProcessing(id);
      setSuccess('Sample processing started');
      loadSamples();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start processing');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleCompleteSample = async (id) => {
    const storageLocation = prompt('Enter storage location:');
    if (storageLocation) {
      try {
        await sampleAPI.completeSample(id, { storageLocation });
        setSuccess('Sample processing completed');
        loadSamples();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to complete sample');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleSearchByAccession = async () => {
    if (searchAccession.trim()) {
      try {
        const response = await sampleAPI.getByAccession(searchAccession);
        setSamples([response.data.data]);
        setError('');
      } catch (err) {
        setError('Sample not found');
        setTimeout(() => setError(''), 3000);
      }
    } else {
      loadSamples();
    }
  };

  const handlePrintBarcode = (accessionNumber) => {
    // This would integrate with a barcode printer
    alert(`Print barcode for: ${accessionNumber}`);
    // In production, this would send to barcode printer or generate PDF
  };

  const filterSamplesByTab = () => {
    switch (tabValue) {
      case 0: return samples; // All
      case 1: return samples.filter(s => s.status === 'COLLECTED');
      case 2: return samples.filter(s => s.status === 'RECEIVED');
      case 3: return samples.filter(s => s.status === 'PROCESSING');
      case 4: return samples.filter(s => s.status === 'STORED');
      default: return samples;
    }
  };

  const filteredSamples = filterSamplesByTab();

  const getActionButtons = (sample) => {
    const buttons = [];
    
    if (sample.status === 'COLLECTED') {
      buttons.push(
        <Tooltip title="Receive Sample" key="receive">
          <IconButton size="small" onClick={() => handleReceiveSample(sample)} color="primary">
            <LocalShipping />
          </IconButton>
        </Tooltip>
      );
      buttons.push(
        <Tooltip title="Reject Sample" key="reject">
          <IconButton size="small" onClick={() => handleRejectSample(sample)} color="error">
            <Cancel />
          </IconButton>
        </Tooltip>
      );
    }
    
    if (sample.status === 'RECEIVED') {
      buttons.push(
        <Tooltip title="Start Processing" key="start">
          <IconButton size="small" onClick={() => handleStartProcessing(sample.id)} color="warning">
            <PlayArrow />
          </IconButton>
        </Tooltip>
      );
    }
    
    if (sample.status === 'PROCESSING') {
      buttons.push(
        <Tooltip title="Complete Processing" key="complete">
          <IconButton size="small" onClick={() => handleCompleteSample(sample.id)} color="success">
            <Done />
          </IconButton>
        </Tooltip>
      );
    }
    
    buttons.push(
      <Tooltip title="Print Barcode" key="print">
        <IconButton size="small" onClick={() => handlePrintBarcode(sample.accessionNumber)}>
          <Print />
        </IconButton>
      </Tooltip>
    );
    
    buttons.push(
      <Tooltip title="View Details" key="view">
        <IconButton size="small" onClick={() => handleViewSample(sample)} color="info">
          <Visibility />
        </IconButton>
      </Tooltip>
    );
    
    return buttons;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Sample Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpenDialog}
        >
          Collect Sample
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Search by Accession Number */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Search by Accession Number"
              value={searchAccession}
              onChange={(e) => setSearchAccession(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchByAccession()}
              placeholder="e.g., 20251203-0001"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button variant="contained" onClick={handleSearchByAccession} fullWidth>
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Status Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} variant="scrollable">
          <Tab label="All Samples" />
          <Tab label="Collected" />
          <Tab label="Received" />
          <Tab label="Processing" />
          <Tab label="Stored" />
        </Tabs>
      </Paper>

      {/* Samples Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Accession Number</TableCell>
              <TableCell>Patient ID</TableCell>
              <TableCell>Sample Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Collected By</TableCell>
              <TableCell>Collection Date</TableCell>
              <TableCell>Condition</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSamples.map((sample) => (
              <TableRow key={sample.id}>
                <TableCell>
                  <strong>{sample.accessionNumber}</strong>
                </TableCell>
                <TableCell>{sample.patientPatientId || sample.patientId}</TableCell>
                <TableCell>{sample.sampleType}</TableCell>
                <TableCell>
                  <Chip 
                    label={sample.status} 
                    size="small" 
                    color={STATUS_COLORS[sample.status]}
                  />
                </TableCell>
                <TableCell>{sample.collectedBy}</TableCell>
                <TableCell>
                  {sample.collectionDateTime 
                    ? new Date(sample.collectionDateTime).toLocaleString()
                    : 'N/A'}
                </TableCell>
                <TableCell>{sample.condition || '-'}</TableCell>
                <TableCell>
                  {getActionButtons(sample)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Sample Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Collect New Sample</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Lab Test Request Selection */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Select Lab Test Request"
                value={formData.labTestRequest.id}
                onChange={(e) => handleRequestSelect(e.target.value)}
                required
                helperText="Select from pending test requests"
              >
                <MenuItem value="">
                  <em>-- Select Test Request --</em>
                </MenuItem>
                {labTestRequests.map((request) => (
                  <MenuItem key={request.id} value={request.id}>
                    {request.patient?.firstName} {request.patient?.lastName} ({request.patient?.patientId}) - {request.labTest?.testName} - Priority: {request.priority}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Selected Request Details */}
            {selectedRequest && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
                  <Typography variant="body2">
                    <strong>Patient:</strong> {selectedRequest.patient?.firstName} {selectedRequest.patient?.lastName} ({selectedRequest.patient?.patientId})
                  </Typography>
                  <Typography variant="body2">
                    <strong>Test:</strong> {selectedRequest.labTest?.testName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Doctor:</strong> {selectedRequest.doctor?.firstName} {selectedRequest.doctor?.lastName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Priority:</strong> {selectedRequest.priority}
                  </Typography>
                </Paper>
              </Grid>
            )}

            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Accession Number (Barcode)"
                value={formData.accessionNumber}
                onChange={(e) => setFormData({ ...formData, accessionNumber: e.target.value })}
                disabled
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button 
                variant="outlined" 
                onClick={handleGenerateAccession}
                fullWidth
                sx={{ height: '56px' }}
              >
                Generate Barcode
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Sample Type"
                value={formData.sampleType}
                onChange={(e) => setFormData({ ...formData, sampleType: e.target.value })}
                required
                helperText="Auto-filled from test catalog"
              >
                {SAMPLE_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Volume"
                value={formData.volume}
                onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                placeholder="e.g., 5 ml"
                helperText="Auto-filled from test catalog"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Container Type"
                value={formData.containerType}
                onChange={(e) => setFormData({ ...formData, containerType: e.target.value })}
                placeholder="e.g., EDTA tube"
                helperText="Auto-filled from test catalog"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Collected By"
                value={formData.collectedBy}
                onChange={(e) => setFormData({ ...formData, collectedBy: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Remarks"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Collect Sample</Button>
        </DialogActions>
      </Dialog>

      {/* Receive Sample Dialog */}
      <Dialog open={openReceiveDialog} onClose={() => setOpenReceiveDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Receive Sample</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Received By"
                value={receiveData.receivedBy}
                onChange={(e) => setReceiveData({ ...receiveData, receivedBy: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Condition"
                value={receiveData.condition}
                onChange={(e) => setReceiveData({ ...receiveData, condition: e.target.value })}
                required
              >
                <MenuItem value="Good">Good</MenuItem>
                <MenuItem value="Hemolyzed">Hemolyzed</MenuItem>
                <MenuItem value="Clotted">Clotted</MenuItem>
                <MenuItem value="Lipemic">Lipemic</MenuItem>
                <MenuItem value="Insufficient">Insufficient</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Storage Location"
                value={receiveData.storageLocation}
                onChange={(e) => setReceiveData({ ...receiveData, storageLocation: e.target.value })}
                placeholder="e.g., Rack A1, Freezer 2"
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReceiveDialog(false)}>Cancel</Button>
          <Button onClick={handleReceiveSubmit} variant="contained">Receive</Button>
        </DialogActions>
      </Dialog>

      {/* Reject Sample Dialog */}
      <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Sample</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Rejection Reason"
                value={rejectData.rejectionReason}
                onChange={(e) => setRejectData({ ...rejectData, rejectionReason: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Rejected By"
                value={rejectData.rejectedBy}
                onChange={(e) => setRejectData({ ...rejectData, rejectedBy: e.target.value })}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)}>Cancel</Button>
          <Button onClick={handleRejectSubmit} variant="contained" color="error">Reject</Button>
        </DialogActions>
      </Dialog>

      {/* View Sample Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Sample Details</DialogTitle>
        <DialogContent>
          {selectedSample && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Accession Number</Typography>
                <Typography variant="h6">{selectedSample.accessionNumber}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Chip 
                  label={selectedSample.status} 
                  color={STATUS_COLORS[selectedSample.status]}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Sample Type</Typography>
                <Typography variant="body1">{selectedSample.sampleType}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Volume</Typography>
                <Typography variant="body1">{selectedSample.volume || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Container Type</Typography>
                <Typography variant="body1">{selectedSample.containerType || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Condition</Typography>
                <Typography variant="body1">{selectedSample.condition || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Collected By</Typography>
                <Typography variant="body1">{selectedSample.collectedBy}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Collection Date/Time</Typography>
                <Typography variant="body1">
                  {selectedSample.collectionDateTime 
                    ? new Date(selectedSample.collectionDateTime).toLocaleString()
                    : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Received By</Typography>
                <Typography variant="body1">{selectedSample.receivedBy || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Received Date/Time</Typography>
                <Typography variant="body1">
                  {selectedSample.receivedDateTime 
                    ? new Date(selectedSample.receivedDateTime).toLocaleString()
                    : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Storage Location</Typography>
                <Typography variant="body1">{selectedSample.storageLocation || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Processing Started</Typography>
                <Typography variant="body1">
                  {selectedSample.processingStartedAt 
                    ? new Date(selectedSample.processingStartedAt).toLocaleString()
                    : 'N/A'}
                </Typography>
              </Grid>
              {selectedSample.rejectionReason && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="error">Rejection Reason</Typography>
                  <Typography variant="body1">{selectedSample.rejectionReason}</Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Remarks</Typography>
                <Typography variant="body1">{selectedSample.remarks || 'None'}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
