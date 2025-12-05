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
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { labTestAPI } from '../../services/api';

const TEST_CATEGORIES = [
  'HEMATOLOGY',
  'BIOCHEMISTRY',
  'MICROBIOLOGY',
  'SEROLOGY',
  'CLINICAL_PATHOLOGY',
  'HISTOPATHOLOGY',
  'CYTOLOGY',
  'MOLECULAR_BIOLOGY',
  'ENDOCRINOLOGY',
  'TOXICOLOGY',
];

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

export default function LabTestCatalog() {
  const [tests, setTests] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    testName: '',
    testCode: '',
    description: '',
    testCategory: '',
    sampleType: '',
    sampleVolume: '',
    sampleContainer: '',
    price: '',
    normalRange: '',
    normalRangeMale: '',
    normalRangeFemale: '',
    normalRangeChild: '',
    unit: '',
    turnaroundTime: '',
    criticalLow: '',
    criticalHigh: '',
    preparationInstructions: '',
    requiresFasting: false,
    isProfile: false,
    profileTests: '',
    department: '',
    method: '',
  });

  useEffect(() => {
    loadLabTests();
  }, []);

  const loadLabTests = async () => {
    try {
      const response = await labTestAPI.getAll();
      setTests(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load lab tests');
      console.error(err);
    }
  };

  const handleOpenDialog = (test = null) => {
    if (test) {
      setFormData(test);
      setSelectedTest(test);
    } else {
      setFormData({
        testName: '',
        testCode: '',
        description: '',
        testCategory: '',
        sampleType: '',
        sampleVolume: '',
        sampleContainer: '',
        price: '',
        normalRange: '',
        normalRangeMale: '',
        normalRangeFemale: '',
        normalRangeChild: '',
        unit: '',
        turnaroundTime: '',
        criticalLow: '',
        criticalHigh: '',
        preparationInstructions: '',
        requiresFasting: false,
        isProfile: false,
        profileTests: '',
        department: '',
        method: '',
      });
      setSelectedTest(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTest(null);
  };

  const handleViewTest = (test) => {
    setSelectedTest(test);
    setOpenViewDialog(true);
  };

  const handleSubmit = async () => {
    try {
      // Convert string values to appropriate types
      const submitData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        turnaroundTime: parseInt(formData.turnaroundTime) || 0,
      };

      if (selectedTest) {
        await labTestAPI.update(selectedTest.id, submitData);
        setSuccess('Lab test updated successfully');
      } else {
        await labTestAPI.create(submitData);
        setSuccess('Lab test created successfully');
      }
      handleCloseDialog();
      loadLabTests();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save lab test');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lab test?')) {
      try {
        await labTestAPI.delete(id);
        setSuccess('Lab test deleted successfully');
        loadLabTests();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete lab test');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const response = await labTestAPI.search(searchTerm);
        setTests(response.data.data);
      } catch (err) {
        setError('Search failed');
      }
    } else {
      loadLabTests();
    }
  };

  const filterTests = () => {
    if (tabValue === 0) {
      // All Tests
      return filterCategory === 'ALL'
        ? tests
        : tests.filter((t) => t.testCategory === filterCategory);
    } else if (tabValue === 1) {
      // Profiles
      return tests.filter((t) => t.isProfile === true);
    } else {
      // Individual Tests
      return tests.filter((t) => t.isProfile === false);
    }
  };

  const filteredTests = filterTests();

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Lab Test Catalog</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Lab Test
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Search and Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Tests"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label="Filter by Category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <MenuItem value="ALL">All Categories</MenuItem>
              {TEST_CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button variant="contained" onClick={handleSearch} fullWidth>
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="All Tests" />
          <Tab label="Test Profiles" />
          <Tab label="Individual Tests" />
        </Tabs>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Test Code</TableCell>
              <TableCell>Test Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Sample Type</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>TAT (hrs)</TableCell>
              <TableCell>Profile</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTests.map((test) => (
              <TableRow key={test.id}>
                <TableCell>{test.testCode}</TableCell>
                <TableCell>{test.testName}</TableCell>
                <TableCell>
                  <Chip label={test.testCategory} size="small" color="primary" />
                </TableCell>
                <TableCell>{test.sampleType}</TableCell>
                <TableCell>₹{test.price}</TableCell>
                <TableCell>{test.turnaroundTime}</TableCell>
                <TableCell>
                  {test.isProfile ? (
                    <Chip label="Profile" size="small" color="secondary" />
                  ) : (
                    <Chip label="Individual" size="small" />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleViewTest(test)} color="info">
                    <Visibility />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleOpenDialog(test)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(test.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{selectedTest ? 'Edit Lab Test' : 'Add Lab Test'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Test Name"
                value={formData.testName}
                onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Test Code"
                value={formData.testCode}
                onChange={(e) => setFormData({ ...formData, testCode: e.target.value })}
                helperText="Leave empty for auto-generation"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Category"
                value={formData.testCategory}
                onChange={(e) => setFormData({ ...formData, testCategory: e.target.value })}
                required
              >
                {TEST_CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Sample Type"
                value={formData.sampleType}
                onChange={(e) => setFormData({ ...formData, sampleType: e.target.value })}
                required
              >
                {SAMPLE_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Sample Volume"
                value={formData.sampleVolume}
                onChange={(e) => setFormData({ ...formData, sampleVolume: e.target.value })}
                placeholder="e.g., 5 ml"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Sample Container"
                value={formData.sampleContainer}
                onChange={(e) => setFormData({ ...formData, sampleContainer: e.target.value })}
                placeholder="e.g., EDTA tube, Plain tube"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Price (₹)"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="e.g., g/dL, mg/dL"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Turnaround Time (hours)"
                type="number"
                value={formData.turnaroundTime}
                onChange={(e) => setFormData({ ...formData, turnaroundTime: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Normal Range (General)"
                value={formData.normalRange}
                onChange={(e) => setFormData({ ...formData, normalRange: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Normal Range (Male)"
                value={formData.normalRangeMale}
                onChange={(e) => setFormData({ ...formData, normalRangeMale: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Normal Range (Female)"
                value={formData.normalRangeFemale}
                onChange={(e) => setFormData({ ...formData, normalRangeFemale: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Normal Range (Child)"
                value={formData.normalRangeChild}
                onChange={(e) => setFormData({ ...formData, normalRangeChild: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Critical Low Value"
                value={formData.criticalLow}
                onChange={(e) => setFormData({ ...formData, criticalLow: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Critical High Value"
                value={formData.criticalHigh}
                onChange={(e) => setFormData({ ...formData, criticalHigh: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Method"
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                placeholder="e.g., Automated, Manual"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Preparation Instructions"
                value={formData.preparationInstructions}
                onChange={(e) => setFormData({ ...formData, preparationInstructions: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Requires Fasting"
                value={formData.requiresFasting}
                onChange={(e) => setFormData({ ...formData, requiresFasting: e.target.value === 'true' })}
              >
                <MenuItem value={false}>No</MenuItem>
                <MenuItem value={true}>Yes</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Is Profile/Panel"
                value={formData.isProfile}
                onChange={(e) => setFormData({ ...formData, isProfile: e.target.value === 'true' })}
              >
                <MenuItem value={false}>Individual Test</MenuItem>
                <MenuItem value={true}>Test Profile</MenuItem>
              </TextField>
            </Grid>
            {formData.isProfile && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Profile Tests"
                  value={formData.profileTests}
                  onChange={(e) => setFormData({ ...formData, profileTests: e.target.value })}
                  placeholder="Comma-separated test codes"
                  helperText="Enter test codes included in this profile, separated by commas"
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedTest ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Test Details</DialogTitle>
        <DialogContent>
          {selectedTest && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Test Code</Typography>
                <Typography variant="body1">{selectedTest.testCode}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Test Name</Typography>
                <Typography variant="body1">{selectedTest.testName}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                <Typography variant="body1">{selectedTest.description || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                <Chip label={selectedTest.testCategory} size="small" color="primary" />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Sample Type</Typography>
                <Typography variant="body1">{selectedTest.sampleType}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Sample Volume</Typography>
                <Typography variant="body1">{selectedTest.sampleVolume || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Sample Container</Typography>
                <Typography variant="body1">{selectedTest.sampleContainer || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Price</Typography>
                <Typography variant="body1">₹{selectedTest.price}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Unit</Typography>
                <Typography variant="body1">{selectedTest.unit || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">TAT (hours)</Typography>
                <Typography variant="body1">{selectedTest.turnaroundTime}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Normal Range</Typography>
                <Typography variant="body1">{selectedTest.normalRange || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Normal Range (Male)</Typography>
                <Typography variant="body1">{selectedTest.normalRangeMale || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Normal Range (Female)</Typography>
                <Typography variant="body1">{selectedTest.normalRangeFemale || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Normal Range (Child)</Typography>
                <Typography variant="body1">{selectedTest.normalRangeChild || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Critical Low</Typography>
                <Typography variant="body1" color="error">{selectedTest.criticalLow || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Critical High</Typography>
                <Typography variant="body1" color="error">{selectedTest.criticalHigh || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Department</Typography>
                <Typography variant="body1">{selectedTest.department || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Method</Typography>
                <Typography variant="body1">{selectedTest.method || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Preparation Instructions</Typography>
                <Typography variant="body1">{selectedTest.preparationInstructions || 'None'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Requires Fasting</Typography>
                <Chip label={selectedTest.requiresFasting ? 'Yes' : 'No'} size="small" 
                  color={selectedTest.requiresFasting ? 'warning' : 'default'} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Test Type</Typography>
                <Chip label={selectedTest.isProfile ? 'Profile' : 'Individual'} size="small" 
                  color={selectedTest.isProfile ? 'secondary' : 'default'} />
              </Grid>
              {selectedTest.isProfile && selectedTest.profileTests && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Included Tests</Typography>
                  <Typography variant="body1">{selectedTest.profileTests}</Typography>
                </Grid>
              )}
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
