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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  alpha,
} from '@mui/material';
import { Add, Science, CheckCircle, Visibility } from '@mui/icons-material';
import { labTestRequestAPI, labTestAPI, patientAPI, doctorAPI } from '../../services/api';
import PageHeader from '../../components/PageHeader';

export default function LabTestsList() {
  const [requests, setRequests] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [openTestDialog, setOpenTestDialog] = useState(false);
  const [openResultDialog, setOpenResultDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [resultFormData, setResultFormData] = useState({});
  const [testFields, setTestFields] = useState([]);

  // Define test-specific fields
  const getTestFields = (testName) => {
    const testFieldsMap = {
      'CBC': [
        { name: 'hemoglobin', label: 'Hemoglobin', unit: 'g/dL', normalRange: 'M:13-17, F:12-15' },
        { name: 'rbcCount', label: 'RBC Count', unit: 'mill/μL', normalRange: '4.5-5.9' },
        { name: 'wbcCount', label: 'WBC Count', unit: '/μL', normalRange: '4000-11000' },
        { name: 'platelets', label: 'Platelets', unit: '/μL', normalRange: '150k-450k' },
        { name: 'hematocrit', label: 'Hematocrit', unit: '%', normalRange: 'M:40-50, F:36-44' },
        { name: 'mcv', label: 'MCV', unit: 'fL', normalRange: '80-96' },
        { name: 'mch', label: 'MCH', unit: 'pg', normalRange: '27-33' },
        { name: 'mchc', label: 'MCHC', unit: 'g/dL', normalRange: '32-36' },
        { name: 'rdw', label: 'RDW', unit: '%', normalRange: '11-15' },
        { name: 'neutrophils', label: 'Neutrophils', unit: '%', normalRange: '40-75' },
        { name: 'lymphocytes', label: 'Lymphocytes', unit: '%', normalRange: '20-40' },
        { name: 'monocytes', label: 'Monocytes', unit: '%', normalRange: '2-8' },
        { name: 'eosinophils', label: 'Eosinophils', unit: '%', normalRange: '1-4' },
        { name: 'basophils', label: 'Basophils', unit: '%', normalRange: '0-1' },
      ],
      'LFT': [
        { name: 'bilirubinTotal', label: 'Bilirubin Total', unit: 'mg/dL', normalRange: '0.3-1.2' },
        { name: 'bilirubinDirect', label: 'Bilirubin Direct', unit: 'mg/dL', normalRange: '0-0.3' },
        { name: 'sgot', label: 'AST/SGOT', unit: 'U/L', normalRange: '<40' },
        { name: 'sgpt', label: 'ALT/SGPT', unit: 'U/L', normalRange: '<40' },
        { name: 'alp', label: 'ALP', unit: 'U/L', normalRange: '44-147' },
        { name: 'totalProtein', label: 'Total Protein', unit: 'g/dL', normalRange: '6-8' },
        { name: 'albumin', label: 'Albumin', unit: 'g/dL', normalRange: '3.4-5.4' },
      ],
      'KFT': [
        { name: 'urea', label: 'Urea', unit: 'mg/dL', normalRange: '15-40' },
        { name: 'creatinine', label: 'Creatinine', unit: 'mg/dL', normalRange: '0.6-1.2' },
        { name: 'uricAcid', label: 'Uric Acid', unit: 'mg/dL', normalRange: '3-7' },
        { name: 'sodium', label: 'Sodium', unit: 'mEq/L', normalRange: '135-145' },
        { name: 'potassium', label: 'Potassium', unit: 'mEq/L', normalRange: '3.5-5.0' },
      ],
      'Lipid Profile': [
        { name: 'totalCholesterol', label: 'Total Cholesterol', unit: 'mg/dL', normalRange: '<200' },
        { name: 'ldl', label: 'LDL', unit: 'mg/dL', normalRange: '<100' },
        { name: 'hdl', label: 'HDL', unit: 'mg/dL', normalRange: '>40' },
        { name: 'triglycerides', label: 'Triglycerides', unit: 'mg/dL', normalRange: '<150' },
      ],
      'Thyroid Profile': [
        { name: 't3', label: 'T3', unit: 'ng/dL', normalRange: '80-200' },
        { name: 't4', label: 'T4', unit: 'μg/dL', normalRange: '5-12' },
        { name: 'tsh', label: 'TSH', unit: 'μIU/mL', normalRange: '0.4-4.5' },
      ],
      'Blood Sugar': [
        { name: 'fbs', label: 'FBS (Fasting)', unit: 'mg/dL', normalRange: '70-99' },
        { name: 'ppbs', label: 'PPBS (Post Prandial)', unit: 'mg/dL', normalRange: '<140' },
      ],
      'ESR': [
        { name: 'esr', label: 'ESR', unit: 'mm/hr', normalRange: 'M:0-15, F:0-20' },
      ],
    };
    return testFieldsMap[testName] || [];
  };
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    labTestId: '',
    priority: 'ROUTINE',
    requestDate: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [testFormData, setTestFormData] = useState({
    testName: '',
    testCode: '',
    description: '',
    price: '',
    normalRange: '',
    unit: '',
    category: '',
    turnaroundTime: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Loading lab test data...');
      
      const [requestsRes, testsRes, patientsRes, doctorsRes] = await Promise.all([
        labTestRequestAPI.getAll().catch(err => {
          console.error('Failed to load requests:', err);
          return { data: { data: [] } };
        }),
        labTestAPI.getAll().catch(err => {
          console.error('Failed to load lab tests:', err);
          return { data: { data: [] } };
        }),
        patientAPI.getAll().catch(err => {
          console.error('Failed to load patients:', err);
          return { data: { data: [] } };
        }),
        doctorAPI.getAll().catch(err => {
          console.error('Failed to load doctors:', err);
          return { data: { data: [] } };
        }),
      ]);
      
      const requestsData = requestsRes.data.data || [];
      const testsData = testsRes.data.data || [];
      const patientsData = patientsRes.data.data || [];
      const doctorsData = doctorsRes.data.data || [];
      
      console.log('Loaded data:', {
        requests: requestsData.length,
        tests: testsData.length,
        patients: patientsData.length,
        doctors: doctorsData.length
      });
      
      setRequests(requestsData);
      setLabTests(testsData);
      setPatients(patientsData);
      setDoctors(doctorsData);
      setError(''); // Clear any previous errors
      
      // Show warning if no data
      if (patientsData.length === 0) {
        console.warn('No patients loaded! Check API endpoint and authentication.');
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load data');
      // Set empty arrays even on error to prevent undefined issues
      setRequests([]);
      setLabTests([]);
      setPatients([]);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      await labTestRequestAPI.verifyResult(id);
      setSuccess('Test result verified successfully');
      loadData();
    } catch (err) {
      setError('Failed to verify result');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await labTestRequestAPI.updateStatus(id, newStatus);
      setSuccess(`Status updated to ${newStatus}`);
      loadData();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleOpenResultDialog = (request) => {
    setSelectedRequest(request);
    const fields = getTestFields(request.labTest?.testName);
    setTestFields(fields);
    
    // Initialize form data with empty values for each field
    const initialData = {
      remarks: '',
      technician: '',
    };
    fields.forEach(field => {
      initialData[field.name] = '';
    });
    setResultFormData(initialData);
    setOpenResultDialog(true);
  };

  const handleResultSubmit = async (e) => {
    e.preventDefault();
    try {
      await labTestRequestAPI.addResult(selectedRequest.id, resultFormData);
      setSuccess('Test result added successfully');
      setOpenResultDialog(false);
      loadData();
    } catch (err) {
      setError('Failed to add result');
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setFormData({
      patientId: '',
      doctorId: '',
      labTestId: '',
      priority: 'ROUTINE',
      requestDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        patient: { id: formData.patientId },
        doctor: formData.doctorId ? { id: formData.doctorId } : null,
        labTest: { id: formData.labTestId },
        priority: formData.priority,
        requestDate: formData.requestDate + 'T00:00:00',
        clinicalNotes: formData.notes,
      };
      await labTestRequestAPI.create(requestData);
      setSuccess('Lab test request created successfully');
      setOpenDialog(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create request');
      console.error('Lab test request error:', err);
    }
  };

  const handleOpenTestDialog = () => {
    setOpenTestDialog(true);
    setTestFormData({
      testName: '',
      testCode: '',
      description: '',
      price: '',
      normalRange: '',
      unit: '',
      category: '',
      turnaroundTime: '',
    });
  };

  const handleTestChange = (e) => {
    setTestFormData({
      ...testFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTestSubmit = async (e) => {
    e.preventDefault();
    try {
      await labTestAPI.create(testFormData);
      setSuccess('Lab test created successfully');
      setOpenTestDialog(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create lab test');
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#1F2937',
              fontSize: '1.5rem',
              mb: 0.5
            }}
          >
            Lab Tests & Requests
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.875rem' }}>
            Manage laboratory test orders and requests
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<Add />} 
            onClick={handleOpenTestDialog}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderColor: '#1565C0',
              color: '#1565C0',
              '&:hover': {
                borderColor: '#0D47A1',
                bgcolor: alpha('#1565C0', 0.04),
              },
            }}
          >
            ADD LAB TEST
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Add />} 
            onClick={handleOpenDialog}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              bgcolor: '#1565C0',
              '&:hover': {
                bgcolor: '#0D47A1',
              },
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            }}
          >
            NEW REQUEST
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      <Paper 
        sx={{ 
          mb: 3,
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <Tabs 
          value={tabValue} 
          onChange={(e, v) => setTabValue(v)}
          sx={{
            borderBottom: '1px solid #E5E7EB',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              color: '#6B7280',
              '&.Mui-selected': {
                color: '#1565C0',
                fontWeight: 600,
              },
            },
          }}
        >
          <Tab label="ALL" />
          <Tab label="REQUESTED" />
          <Tab label="IN PROGRESS" />
          <Tab label="COMPLETED" />
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
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Loading...</TableCell>
              </TableRow>
            ) : filterRequests().length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No test requests found</TableCell>
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Request Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Create Lab Test Request</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Patient"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  required
                  helperText={patients.length === 0 ? "No patients available. Please create a patient first." : ""}
                  error={patients.length === 0}
                >
                  {patients.length === 0 ? (
                    <MenuItem value="" disabled>
                      No patients available
                    </MenuItem>
                  ) : (
                    patients.map((patient) => (
                      <MenuItem key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName} ({patient.patientId})
                      </MenuItem>
                    ))
                  )}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Doctor (Optional)"
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  helperText="Leave empty for walk-in patients without assigned doctor"
                >
                  <MenuItem value="">None</MenuItem>
                  {doctors.map((doctor) => (
                    <MenuItem key={doctor.id} value={doctor.id}>
                      Dr. {doctor.firstName} {doctor.lastName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Lab Test"
                  name="labTestId"
                  value={formData.labTestId}
                  onChange={handleChange}
                  required
                  helperText={labTests.length === 0 ? "No lab tests available. Please add lab tests first." : ""}
                  error={labTests.length === 0}
                >
                  {labTests.length === 0 ? (
                    <MenuItem value="" disabled>
                      No lab tests available
                    </MenuItem>
                  ) : (
                    labTests.map((test) => (
                      <MenuItem key={test.id} value={test.id}>
                        {test.testName} (${test.price})
                      </MenuItem>
                    ))
                  )}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="ROUTINE">Routine</MenuItem>
                  <MenuItem value="URGENT">Urgent</MenuItem>
                  <MenuItem value="STAT">STAT</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Request Date"
                  name="requestDate"
                  type="date"
                  value={formData.requestDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Create Request
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Create Lab Test Dialog */}
      <Dialog open={openTestDialog} onClose={() => setOpenTestDialog(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleTestSubmit}>
          <DialogTitle>Add New Lab Test</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Test Name"
                  name="testName"
                  value={testFormData.testName}
                  onChange={handleTestChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Test Code"
                  name="testCode"
                  value={testFormData.testCode}
                  onChange={handleTestChange}
                  helperText="Leave empty for auto-generation"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={testFormData.description}
                  onChange={handleTestChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Category"
                  name="category"
                  value={testFormData.category}
                  onChange={handleTestChange}
                  helperText="e.g., Blood, Urine, Imaging"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={testFormData.price}
                  onChange={handleTestChange}
                  inputProps={{ min: 0, step: 0.01 }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Normal Range"
                  name="normalRange"
                  value={testFormData.normalRange}
                  onChange={handleTestChange}
                  helperText="e.g., 70-100 mg/dL"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Unit"
                  name="unit"
                  value={testFormData.unit}
                  onChange={handleTestChange}
                  helperText="e.g., mg/dL, mmol/L"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Turnaround Time"
                  name="turnaroundTime"
                  value={testFormData.turnaroundTime}
                  onChange={handleTestChange}
                  helperText="e.g., 24 hours, 2-3 days"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenTestDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Create Lab Test
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Add Test Result Dialog - Dynamic Fields */}
      <Dialog open={openResultDialog} onClose={() => setOpenResultDialog(false)} maxWidth="lg" fullWidth>
        <form onSubmit={handleResultSubmit}>
          <DialogTitle>
            Add Test Result - {selectedRequest?.labTest?.testName}
            <Typography variant="caption" display="block" color="text.secondary">
              Test Code: {selectedRequest?.labTest?.testCode}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: 'primary.50', borderLeft: 4, borderColor: 'primary.main' }}>
                  <Typography variant="subtitle2" gutterBottom>Patient Information</Typography>
                  <Typography variant="body2">
                    <strong>Name:</strong> {selectedRequest?.patient?.firstName} {selectedRequest?.patient?.lastName} | 
                    <strong> ID:</strong> {selectedRequest?.patient?.patientId} | 
                    <strong> Request Date:</strong> {selectedRequest?.requestDate ? new Date(selectedRequest.requestDate).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Paper>
              </Grid>

              {testFields.length > 0 ? (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                      Test Parameters
                    </Typography>
                  </Grid>
                  {testFields.map((field) => (
                    <Grid item xs={12} sm={6} md={4} key={field.name}>
                      <TextField
                        fullWidth
                        label={field.label}
                        name={field.name}
                        value={resultFormData[field.name] || ''}
                        onChange={(e) => setResultFormData({ ...resultFormData, [field.name]: e.target.value })}
                        required
                        type="number"
                        inputProps={{ step: '0.01' }}
                        helperText={`${field.unit} | Normal: ${field.normalRange}`}
                      />
                    </Grid>
                  ))}
                </>
              ) : (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                      Single Value Test
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Test Value"
                      name="testValue"
                      value={resultFormData.testValue || ''}
                      onChange={(e) => setResultFormData({ ...resultFormData, testValue: e.target.value })}
                      required
                      placeholder="Enter test result"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Unit"
                      name="unit"
                      value={resultFormData.unit || ''}
                      onChange={(e) => setResultFormData({ ...resultFormData, unit: e.target.value })}
                      placeholder="e.g., mg/dL, %"
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Additional Information
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Clinical Remarks / Observations"
                  name="remarks"
                  value={resultFormData.remarks || ''}
                  onChange={(e) => setResultFormData({ ...resultFormData, remarks: e.target.value })}
                  multiline
                  rows={3}
                  placeholder="Enter any clinical observations, abnormal findings, or notes"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Lab Technician Name"
                  name="technician"
                  value={resultFormData.technician || ''}
                  onChange={(e) => setResultFormData({ ...resultFormData, technician: e.target.value })}
                  required
                  placeholder="Enter technician name"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Test Date & Time"
                  name="testDateTime"
                  type="datetime-local"
                  value={resultFormData.testDateTime || ''}
                  onChange={(e) => setResultFormData({ ...resultFormData, testDateTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  defaultValue={new Date().toISOString().slice(0, 16)}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenResultDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" size="large">
              Submit Results & Mark Completed
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
