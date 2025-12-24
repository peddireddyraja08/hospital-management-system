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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  IconButton,
  Autocomplete,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { Warning, Add, Edit } from '@mui/icons-material';
import { medicationAPI, prescriptionAPI, pharmacyBillingAPI, admissionAPI, appointmentAPI, pharmacyDispenseAPI } from '../../services/api';

export default function PharmacyDashboard() {
  const [lowStockMeds, setLowStockMeds] = useState([]);
  const [allMeds, setAllMeds] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [openMedDialog, setOpenMedDialog] = useState(false);
  const [openStockDialog, setOpenStockDialog] = useState(false);
  const [openDispenseDialog, setOpenDispenseDialog] = useState(false);
  const [dispenseContext, setDispenseContext] = useState({ prescriptionId: null, patientType: 'OPD', admissionId: '', visitId: '', selectedAdmission: null, selectedVisit: null });
  const [admissionOptions, setAdmissionOptions] = useState([]);
  const [visitOptions, setVisitOptions] = useState([]);
  const [loadingAdmissions, setLoadingAdmissions] = useState(false);
  const [loadingVisits, setLoadingVisits] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [partialMode, setPartialMode] = useState(false);
  const [partialQty, setPartialQty] = useState('');
  const [selectedMed, setSelectedMed] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [medFormData, setMedFormData] = useState({
    medicationName: '',
    description: '',
    manufacturer: '',
    unitPrice: '',
    stockQuantity: '',
    reorderLevel: '',
  });
  const [stockFormData, setStockFormData] = useState({
    quantity: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [lowStockRes, allMedsRes, prescRes] = await Promise.all([
        medicationAPI.getLowStock(),
        medicationAPI.getAll(),
        prescriptionAPI.getAll(),
      ]);
      setLowStockMeds(lowStockRes.data.data);
      setAllMeds(allMedsRes.data.data);
      setPrescriptions(prescRes.data.data.filter(p => p.status === 'PENDING'));
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load pharmacy data';
      setError(msg);
    }
  };

  const handleDispense = (id, presc) => {
    // Open dialog to choose OPD/IPD context before dispensing
    setDispenseContext({ prescriptionId: id, patientType: presc?.patient?.patientType || 'OPD', admissionId: '', visitId: '', selectedAdmission: null, selectedVisit: null });
    setOpenDispenseDialog(true);
    // load admissions/visits for patient if available
    const patientId = presc?.patient?.id;
    if (patientId) loadPatientContext(patientId);
  };

  const handleOpenPartial = (id, presc) => {
    setPartialMode(true);
    setPartialQty('');
    setDispenseContext({ prescriptionId: id, patientType: presc?.patient?.patientType || 'OPD', admissionId: '', visitId: '', selectedAdmission: null, selectedVisit: null });
    setOpenDispenseDialog(true);
    const patientId = presc?.patient?.id;
    if (patientId) loadPatientContext(patientId);
  };

  const loadPatientContext = async (patientId) => {
    setAdmissionOptions([]);
    setVisitOptions([]);
    setLoadingAdmissions(true);
    setLoadingVisits(true);
    try {
      const [admRes, visitRes] = await Promise.all([
        admissionAPI.getByPatientId(patientId).catch(() => ({ data: { data: [] } })),
        appointmentAPI.getByPatient(patientId).catch(() => ({ data: { data: [] } })),
      ]);
      setAdmissionOptions(admRes.data.data || []);
      setVisitOptions(visitRes.data.data || []);
    } catch (e) {
      // ignore - options will remain empty
    } finally {
      setLoadingAdmissions(false);
      setLoadingVisits(false);
    }
  };

  const confirmDispense = async () => {
    const { prescriptionId, selectedAdmission, selectedVisit } = dispenseContext;
    const admissionId = selectedAdmission ? selectedAdmission.id : null;
    const visitId = selectedVisit ? selectedVisit.id : null;
    try {
      if (partialMode && partialQty) {
        await pharmacyDispenseAPI.partialDispenseSimple(prescriptionId, parseInt(partialQty, 10), 'pharmacist');
      } else {
        await pharmacyDispenseAPI.dispensePrescriptionSimple(prescriptionId, 'pharmacist');
      }
      setSuccess('Prescription dispensed successfully');
      setSnackbar({ open: true, message: 'Prescription dispensed successfully', severity: 'success' });
      setOpenDispenseDialog(false);
      setPartialMode(false);
      setPartialQty('');
      loadData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to dispense prescription';
      setError(msg);
      setSnackbar({ open: true, message: msg, severity: 'error' });
    }
  };

  const handleOpenMedDialog = () => {
    setOpenMedDialog(true);
    setEditMode(false);
    setMedFormData({
      medicationName: '',
      description: '',
      manufacturer: '',
      unitPrice: '',
      stockQuantity: '',
      reorderLevel: '',
    });
  };

  const handleEditMed = (med) => {
    setMedFormData({
      medicationName: med.medicationName,
      description: med.description,
      manufacturer: med.manufacturer,
      unitPrice: med.unitPrice,
      stockQuantity: med.stockQuantity,
      reorderLevel: med.reorderLevel,
    });
    setSelectedMed(med);
    setEditMode(true);
    setOpenMedDialog(true);
  };

  const handleOpenStockDialog = (med) => {
    setSelectedMed(med);
    setStockFormData({ quantity: '' });
    setOpenStockDialog(true);
  };

  const handleMedChange = (e) => {
    setMedFormData({
      ...medFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMedSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await medicationAPI.update(selectedMed.id, medFormData);
        setSuccess('Medication updated successfully');
      } else {
        await medicationAPI.create(medFormData);
        setSuccess('Medication created successfully');
      }
      setOpenMedDialog(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save medication');
    }
  };

  const handleStockSubmit = async (e) => {
    e.preventDefault();
    try {
      await medicationAPI.updateStock(selectedMed.id, parseInt(stockFormData.quantity));
      setSuccess('Stock updated successfully');
      setOpenStockDialog(false);
      loadData();
    } catch (err) {
      setError('Failed to update stock');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Pharmacy Dashboard
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenMedDialog}>
          Add Medication
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      <Paper sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Low Stock" />
          <Tab label="All Medications" />
          <Tab label="Pending Prescriptions" />
        </Tabs>
      </Paper>

      {tabValue === 0 && (
        <Grid container spacing={2}>
          {lowStockMeds.length === 0 ? (
            <Grid item xs={12}>
              <Typography color="text.secondary">No low stock items</Typography>
            </Grid>
          ) : (
            lowStockMeds.map((med) => (
              <Grid item xs={12} sm={6} md={4} key={med.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Warning color="warning" sx={{ mr: 1 }} />
                      <Typography variant="h6">{med.medicationName}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Code: {med.medicationCode}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Stock: {med.stockQuantity} | Reorder: {med.reorderLevel}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: ₹{med.unitPrice}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Button size="small" onClick={() => handleOpenStockDialog(med)}>
                        Update Stock
                      </Button>
                      <IconButton size="small" onClick={() => handleEditMed(med)}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {tabValue === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Manufacturer</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allMeds.map((med) => (
                <TableRow key={med.id}>
                  <TableCell>{med.medicationCode}</TableCell>
                  <TableCell>{med.medicationName}</TableCell>
                  <TableCell>{med.manufacturer}</TableCell>
                  <TableCell>{med.stockQuantity}</TableCell>
                  <TableCell>₹{med.unitPrice}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleOpenStockDialog(med)}>
                      Stock
                    </Button>
                    <IconButton size="small" onClick={() => handleEditMed(med)}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tabValue === 2 && (
        <TableContainer component={Paper}>
          <Table>
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
                        <Button size="small" onClick={() => handleDispense(presc.id, presc)}>
                          Full Dispense
                        </Button>
                        <Button size="small" sx={{ ml: 1 }} onClick={() => handleOpenPartial(presc.id, presc)}>
                          Partial
                        </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create/Edit Medication Dialog */}
      <Dialog open={openMedDialog} onClose={() => setOpenMedDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleMedSubmit}>
          <DialogTitle>{editMode ? 'Edit Medication' : 'Add Medication'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Medication Name"
                  name="medicationName"
                  value={medFormData.medicationName}
                  onChange={handleMedChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={medFormData.description}
                  onChange={handleMedChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Manufacturer"
                  name="manufacturer"
                  value={medFormData.manufacturer}
                  onChange={handleMedChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Unit Price"
                  name="unitPrice"
                  type="number"
                  value={medFormData.unitPrice}
                  onChange={handleMedChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Stock Quantity"
                  name="stockQuantity"
                  type="number"
                  value={medFormData.stockQuantity}
                  onChange={handleMedChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Reorder Level"
                  name="reorderLevel"
                  type="number"
                  value={medFormData.reorderLevel}
                  onChange={handleMedChange}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenMedDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editMode ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dispense Context Dialog */}
      <Dialog open={openDispenseDialog} onClose={() => setOpenDispenseDialog(false)}>
        <DialogTitle>Dispense Prescription</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>Select patient context and provide Admission or Visit ID if applicable.</Typography>
          <Autocomplete
            options={admissionOptions}
            getOptionLabel={(opt) => opt.admissionNumber ? `${opt.admissionNumber} — ${opt.bed?.wardName || ''}` : `#${opt.id}`}
            loading={loadingAdmissions}
            onChange={(e, val) => setDispenseContext({ ...dispenseContext, selectedAdmission: val })}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Admission (IPD)"
                size="small"
                sx={{ mb: 2 }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingAdmissions ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          <Autocomplete
            options={visitOptions}
            getOptionLabel={(opt) => opt.appointmentDate ? `Visit #${opt.id} — ${new Date(opt.appointmentDate).toLocaleString()}` : `#${opt.id}`}
            loading={loadingVisits}
            onChange={(e, val) => setDispenseContext({ ...dispenseContext, selectedVisit: val })}
            renderInput={(params) => (
              <TextField
                {...params}
                label="OPD Visit"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingVisits ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDispenseDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={confirmDispense}>Confirm Dispense</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Update Stock Dialog */}
      <Dialog open={openStockDialog} onClose={() => setOpenStockDialog(false)} maxWidth="xs" fullWidth>
        <form onSubmit={handleStockSubmit}>
          <DialogTitle>Update Stock - {selectedMed?.medicationName}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Quantity to Add/Remove"
              name="quantity"
              type="number"
              value={stockFormData.quantity}
              onChange={(e) => setStockFormData({ quantity: e.target.value })}
              helperText="Use positive to add, negative to remove"
              sx={{ mt: 2 }}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenStockDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Update
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
