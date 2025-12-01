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
} from '@mui/material';
import { Warning, Add, Edit } from '@mui/icons-material';
import { medicationAPI, prescriptionAPI } from '../../services/api';

export default function PharmacyDashboard() {
  const [lowStockMeds, setLowStockMeds] = useState([]);
  const [allMeds, setAllMeds] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [openMedDialog, setOpenMedDialog] = useState(false);
  const [openStockDialog, setOpenStockDialog] = useState(false);
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
      setError('Failed to load pharmacy data');
    }
  };

  const handleDispense = async (id) => {
    try {
      await prescriptionAPI.dispense(id);
      setSuccess('Prescription dispensed successfully');
      loadData();
    } catch (err) {
      setError('Failed to dispense prescription');
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
