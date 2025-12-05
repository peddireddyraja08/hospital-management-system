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
  MenuItem,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Add, Edit, Delete, Warning, Science } from '@mui/icons-material';
import { qcMaterialAPI, labTestAPI } from '../../services/api';

const QC_LEVELS = ['LEVEL_1', 'LEVEL_2', 'LEVEL_3'];

export default function QCMaterialsList() {
  const [materials, setMaterials] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [formData, setFormData] = useState({
    labTestId: '',
    materialName: '',
    lotNumber: '',
    level: 'LEVEL_1',
    manufacturer: '',
    expiryDate: '',
    targetValue: '',
    meanValue: '',
    stdDeviation: '',
    unit: '',
    description: '',
    storageConditions: '',
    preparationInstructions: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [materialsRes, labTestsRes] = await Promise.all([
        qcMaterialAPI.getAll(),
        labTestAPI.getAll(),
      ]);
      setMaterials(materialsRes.data.data || []);
      setLabTests(labTestsRes.data.data || []);
      setError('');
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load QC materials');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (material = null) => {
    if (material) {
      setEditingMaterial(material);
      setFormData({
        labTestId: material.labTest?.id || '',
        materialName: material.materialName || '',
        lotNumber: material.lotNumber || '',
        level: material.level || 'LEVEL_1',
        manufacturer: material.manufacturer || '',
        expiryDate: material.expiryDate || '',
        targetValue: material.targetValue || '',
        meanValue: material.meanValue || '',
        stdDeviation: material.stdDeviation || '',
        unit: material.unit || '',
        description: material.description || '',
        storageConditions: material.storageConditions || '',
        preparationInstructions: material.preparationInstructions || '',
      });
    } else {
      setEditingMaterial(null);
      setFormData({
        labTestId: '',
        materialName: '',
        lotNumber: '',
        level: 'LEVEL_1',
        manufacturer: '',
        expiryDate: '',
        targetValue: '',
        meanValue: '',
        stdDeviation: '',
        unit: '',
        description: '',
        storageConditions: '',
        preparationInstructions: '',
      });
    }
    setOpenDialog(true);
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
      const materialData = {
        labTest: { id: formData.labTestId },
        materialName: formData.materialName,
        lotNumber: formData.lotNumber,
        level: formData.level,
        manufacturer: formData.manufacturer,
        expiryDate: formData.expiryDate,
        targetValue: formData.targetValue ? parseFloat(formData.targetValue) : null,
        meanValue: formData.meanValue ? parseFloat(formData.meanValue) : null,
        stdDeviation: formData.stdDeviation ? parseFloat(formData.stdDeviation) : null,
        unit: formData.unit,
        description: formData.description,
        storageConditions: formData.storageConditions,
        preparationInstructions: formData.preparationInstructions,
      };

      if (editingMaterial) {
        await qcMaterialAPI.update(editingMaterial.id, materialData);
        setSuccess('QC Material updated successfully');
      } else {
        await qcMaterialAPI.create(materialData);
        setSuccess('QC Material created successfully');
      }
      
      setOpenDialog(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save QC material');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this QC material?')) {
      return;
    }
    try {
      await qcMaterialAPI.delete(id);
      setSuccess('QC Material deleted successfully');
      loadData();
    } catch (err) {
      setError('Failed to delete QC material');
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'LEVEL_1': return 'info';
      case 'LEVEL_2': return 'success';
      case 'LEVEL_3': return 'warning';
      default: return 'default';
    }
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const isExpiringSoon = (expiryDate, days = 30) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= days;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          <Science sx={{ mr: 1, verticalAlign: 'middle' }} />
          QC Materials Catalog
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
          Add QC Material
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Test Name</TableCell>
              <TableCell>Material Name</TableCell>
              <TableCell>Lot Number</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Manufacturer</TableCell>
              <TableCell>Expiry Date</TableCell>
              <TableCell>Mean ± SD</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">Loading...</TableCell>
              </TableRow>
            ) : materials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">No QC materials found</TableCell>
              </TableRow>
            ) : (
              materials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell>{material.labTest?.testName || 'N/A'}</TableCell>
                  <TableCell>{material.materialName}</TableCell>
                  <TableCell>{material.lotNumber}</TableCell>
                  <TableCell>
                    <Chip 
                      label={material.level?.replace('_', ' ')} 
                      color={getLevelColor(material.level)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{material.manufacturer}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {material.expiryDate ? new Date(material.expiryDate).toLocaleDateString() : 'N/A'}
                      {isExpired(material.expiryDate) && (
                        <Tooltip title="Expired">
                          <Warning color="error" fontSize="small" />
                        </Tooltip>
                      )}
                      {isExpiringSoon(material.expiryDate) && !isExpired(material.expiryDate) && (
                        <Tooltip title="Expiring soon">
                          <Warning color="warning" fontSize="small" />
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {material.meanValue && material.stdDeviation
                      ? `${material.meanValue} ± ${material.stdDeviation}`
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{material.unit || 'N/A'}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton size="small" color="primary" onClick={() => handleOpenDialog(material)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => handleDelete(material.id)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingMaterial ? 'Edit QC Material' : 'Add New QC Material'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Lab Test"
                  name="labTestId"
                  value={formData.labTestId}
                  onChange={handleChange}
                  required
                >
                  {labTests.map((test) => (
                    <MenuItem key={test.id} value={test.id}>
                      {test.testName} ({test.testCode})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Material Name"
                  name="materialName"
                  value={formData.materialName}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Normal Control"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Lot Number"
                  name="lotNumber"
                  value={formData.lotNumber}
                  onChange={handleChange}
                  required
                  placeholder="e.g., LOT123456"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Control Level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  required
                >
                  {QC_LEVELS.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Manufacturer"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  placeholder="e.g., Bio-Rad"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Expiry Date"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Target Value"
                  name="targetValue"
                  type="number"
                  value={formData.targetValue}
                  onChange={handleChange}
                  inputProps={{ step: '0.0001' }}
                  placeholder="Expected value"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  placeholder="e.g., mg/dL, g/dL"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mean Value"
                  name="meanValue"
                  type="number"
                  value={formData.meanValue}
                  onChange={handleChange}
                  required
                  inputProps={{ step: '0.0001' }}
                  helperText="Established mean for this control"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Standard Deviation (SD)"
                  name="stdDeviation"
                  type="number"
                  value={formData.stdDeviation}
                  onChange={handleChange}
                  required
                  inputProps={{ step: '0.0001' }}
                  helperText="±1SD, ±2SD, ±3SD will be calculated"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  placeholder="Additional information about this control material"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Storage Conditions"
                  name="storageConditions"
                  value={formData.storageConditions}
                  onChange={handleChange}
                  placeholder="e.g., Store at 2-8°C"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Preparation Instructions"
                  name="preparationInstructions"
                  value={formData.preparationInstructions}
                  onChange={handleChange}
                  placeholder="e.g., Mix gently before use"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingMaterial ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
