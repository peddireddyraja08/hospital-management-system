import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { 
  Hotel, 
  LocalHospital, 
  Build, 
  Add, 
  Edit, 
  Delete,
  ViewList,
  ViewModule,
  Sort,
  FilterList,
} from '@mui/icons-material';
import { bedAPI, patientAPI } from '../../services/api';

export default function BedManagement() {
  const [beds, setBeds] = useState([]);
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedBed, setSelectedBed] = useState(null);
  const [openAdmitDialog, setOpenAdmitDialog] = useState(false);
  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const [openBedDialog, setOpenBedDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [targetBedId, setTargetBedId] = useState('');
  
  // Sorting and filtering states
  const [sortBy, setSortBy] = useState('bed'); // 'bed', 'floor', 'ward'
  const [groupBy, setGroupBy] = useState('ward'); // 'ward', 'floor', 'none'
  const [filterWard, setFilterWard] = useState('');
  const [filterFloor, setFilterFloor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list'
  
  const [bedFormData, setBedFormData] = useState({
    bedNumber: '',
    wardName: '',
    roomNumber: '',
    floorNumber: '',
    bedType: '',
    dailyCharge: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bedResponse, patientResponse] = await Promise.all([
        bedAPI.getAll(),
        patientAPI.getAll(),
      ]);
      setBeds(bedResponse.data.data);
      setPatients(patientResponse.data.data);
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const handleAdmit = async () => {
    try {
      await bedAPI.admitPatient(selectedBed.id, selectedPatient);
      setOpenAdmitDialog(false);
      setSelectedBed(null);
      setSelectedPatient('');
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to admit patient');
    }
  };

  const handleDischarge = async (bedId) => {
    if (window.confirm('Are you sure you want to discharge this patient?')) {
      try {
        await bedAPI.dischargePatient(bedId);
        loadData();
      } catch (err) {
        setError('Failed to discharge patient');
      }
    }
  };

  const handleTransfer = async () => {
    try {
      await bedAPI.transferPatient(selectedBed.id, targetBedId);
      setOpenTransferDialog(false);
      setSelectedBed(null);
      setTargetBedId('');
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to transfer patient');
    }
  };

  const handleMaintenance = async (bedId) => {
    try {
      await bedAPI.markForMaintenance(bedId);
      loadData();
    } catch (err) {
      setError('Failed to mark bed for maintenance');
    }
  };

  const handleMarkAvailable = async (bedId) => {
    try {
      await bedAPI.markAsAvailable(bedId);
      loadData();
    } catch (err) {
      setError('Failed to mark bed as available');
    }
  };

  const handleOpenBedDialog = () => {
    setOpenBedDialog(true);
    setEditMode(false);
    setBedFormData({
      bedNumber: '',
      wardName: '',
      roomNumber: '',
      floorNumber: '',
      bedType: '',
      dailyCharge: '',
    });
    setError('');
    setSuccess('');
  };

  const handleEditBed = (bed) => {
    setBedFormData({
      bedNumber: bed.bedNumber,
      wardName: bed.wardName,
      roomNumber: bed.roomNumber,
      floorNumber: bed.floorNumber,
      bedType: bed.bedType,
      dailyCharge: bed.dailyCharge,
    });
    setSelectedBed(bed);
    setEditMode(true);
    setOpenBedDialog(true);
  };

  const handleDeleteBed = async (bedId) => {
    if (window.confirm('Are you sure you want to delete this bed?')) {
      try {
        await bedAPI.delete(bedId);
        setSuccess('Bed deleted successfully');
        loadData();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete bed');
      }
    }
  };

  const handleBedFormChange = (e) => {
    setBedFormData({
      ...bedFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBedSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await bedAPI.update(selectedBed.id, bedFormData);
        setSuccess('Bed updated successfully');
      } else {
        await bedAPI.create(bedFormData);
        setSuccess('Bed created successfully');
      }
      setOpenBedDialog(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${editMode ? 'update' : 'create'} bed`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'success';
      case 'OCCUPIED': return 'error';
      case 'UNDER_MAINTENANCE': return 'warning';
      case 'CLEANING': return 'info';
      case 'RESERVED': return 'primary';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'UNDER_MAINTENANCE': return <Build />;
      case 'OCCUPIED': return <LocalHospital />;
      default: return <Hotel />;
    }
  };

  // Get unique wards and floors for filters
  const uniqueWards = [...new Set(beds.map(bed => bed.wardName))].sort();
  const uniqueFloors = [...new Set(beds.map(bed => bed.floorNumber))].sort((a, b) => a - b);

  // Filter beds
  const filteredBeds = beds.filter(bed => {
    if (filterWard && bed.wardName !== filterWard) return false;
    if (filterFloor && bed.floorNumber !== parseInt(filterFloor)) return false;
    if (filterStatus && bed.status !== filterStatus) return false;
    return true;
  });

  // Sort beds
  const sortedBeds = [...filteredBeds].sort((a, b) => {
    if (sortBy === 'bed') {
      return a.bedNumber.localeCompare(b.bedNumber);
    } else if (sortBy === 'floor') {
      if (a.floorNumber !== b.floorNumber) {
        return a.floorNumber - b.floorNumber;
      }
      return a.bedNumber.localeCompare(b.bedNumber);
    } else if (sortBy === 'ward') {
      if (a.wardName !== b.wardName) {
        return a.wardName.localeCompare(b.wardName);
      }
      return a.bedNumber.localeCompare(b.bedNumber);
    }
    return 0;
  });

  // Group beds
  const groupBeds = (beds) => {
    if (groupBy === 'none') {
      return { 'All Beds': beds };
    } else if (groupBy === 'ward') {
      return beds.reduce((acc, bed) => {
        const key = bed.wardName || 'Unknown Ward';
        if (!acc[key]) acc[key] = [];
        acc[key].push(bed);
        return acc;
      }, {});
    } else if (groupBy === 'floor') {
      return beds.reduce((acc, bed) => {
        const key = `Floor ${bed.floorNumber || 'Unknown'}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(bed);
        return acc;
      }, {});
    }
    return {};
  };

  const groupedBeds = groupBeds(sortedBeds);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Bed Management (ADT)
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => window.location.href = '/floors'}
          >
            Floor Plan
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => window.location.href = '/wards'}
          >
            Wards
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => window.location.href = '/beds/create'}
          >
            Bulk Create
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={handleOpenBedDialog}>
            Add Bed
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Sorting and Filtering Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
                startAdornment={<Sort sx={{ mr: 1, color: 'action.active' }} />}
              >
                <MenuItem value="bed">Bed Number</MenuItem>
                <MenuItem value="floor">Floor</MenuItem>
                <MenuItem value="ward">Ward</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Group By</InputLabel>
              <Select
                value={groupBy}
                label="Group By"
                onChange={(e) => setGroupBy(e.target.value)}
              >
                <MenuItem value="ward">Ward</MenuItem>
                <MenuItem value="floor">Floor</MenuItem>
                <MenuItem value="none">None</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter Ward</InputLabel>
              <Select
                value={filterWard}
                label="Filter Ward"
                onChange={(e) => setFilterWard(e.target.value)}
              >
                <MenuItem value="">All Wards</MenuItem>
                {uniqueWards.map(ward => (
                  <MenuItem key={ward} value={ward}>{ward}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter Floor</InputLabel>
              <Select
                value={filterFloor}
                label="Filter Floor"
                onChange={(e) => setFilterFloor(e.target.value)}
              >
                <MenuItem value="">All Floors</MenuItem>
                {uniqueFloors.map(floor => (
                  <MenuItem key={floor} value={floor}>Floor {floor}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter Status</InputLabel>
              <Select
                value={filterStatus}
                label="Filter Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="AVAILABLE">Available</MenuItem>
                <MenuItem value="OCCUPIED">Occupied</MenuItem>
                <MenuItem value="UNDER_MAINTENANCE">Maintenance</MenuItem>
                <MenuItem value="CLEANING">Cleaning</MenuItem>
                <MenuItem value="RESERVED">Reserved</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, newMode) => newMode && setViewMode(newMode)}
                size="small"
              >
                <ToggleButton value="grid">
                  <ViewModule />
                </ToggleButton>
                <ToggleButton value="list">
                  <ViewList />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Showing {sortedBeds.length} of {beds.length} beds
          </Typography>
          {(filterWard || filterFloor || filterStatus) && (
            <Button 
              size="small" 
              onClick={() => {
                setFilterWard('');
                setFilterFloor('');
                setFilterStatus('');
              }}
            >
              Clear Filters
            </Button>
          )}
        </Box>
      </Paper>

      {/* Beds Display */}
      {Object.entries(groupedBeds).map(([groupName, groupBeds]) => (
        <Box key={groupName} sx={{ mb: 4 }}>
          {groupBy !== 'none' && (
            <Typography variant="h5" sx={{ mb: 2 }}>
              {groupName} ({groupBeds.length} beds)
            </Typography>
          )}
          <Grid container spacing={2}>
            {groupBeds.map((bed) => (
              <Grid item xs={12} sm={viewMode === 'list' ? 12 : 6} md={viewMode === 'list' ? 12 : 4} lg={viewMode === 'list' ? 12 : 3} key={bed.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStatusIcon(bed.status)}
                        <Typography variant="h6">{bed.bedNumber}</Typography>
                      </Box>
                      <Chip
                        label={bed.status}
                        color={getStatusColor(bed.status)}
                        size="small"
                      />
                    </Box>
                    
                    {viewMode === 'list' ? (
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                          <Typography variant="body2" color="text.secondary">Ward:</Typography>
                          <Typography variant="body2" fontWeight="medium">{bed.wardName}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body2" color="text.secondary">Floor:</Typography>
                          <Typography variant="body2" fontWeight="medium">{bed.floorNumber}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body2" color="text.secondary">Room:</Typography>
                          <Typography variant="body2" fontWeight="medium">{bed.roomNumber}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="body2" color="text.secondary">Type:</Typography>
                          <Typography variant="body2" fontWeight="medium">{bed.bedType}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Typography variant="body2" color="text.secondary">Charge:</Typography>
                          <Typography variant="body2" fontWeight="medium">₹{bed.dailyCharge}/day</Typography>
                        </Grid>
                        {bed.currentPatient && (
                          <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary">Patient:</Typography>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              {bed.currentPatient.firstName} {bed.currentPatient.lastName}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    ) : (
                      <>
                        <Typography variant="body2" color="text.secondary">
                          Ward: {bed.wardName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Type: {bed.bedType}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Room: {bed.roomNumber} | Floor: {bed.floorNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Charge: ₹{bed.dailyCharge}/day
                        </Typography>
                        {bed.currentPatient && (
                          <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }} color="primary">
                            Patient: {bed.currentPatient.firstName} {bed.currentPatient.lastName}
                          </Typography>
                        )}
                      </>
                    )}
                  </CardContent>
                  <CardActions>
                    {bed.status === 'AVAILABLE' && (
                      <>
                        <Button
                          size="small"
                          onClick={() => {
                            setSelectedBed(bed);
                            setOpenAdmitDialog(true);
                          }}
                        >
                          Admit
                        </Button>
                        <Button size="small" onClick={() => handleMaintenance(bed.id)}>
                          Maintenance
                        </Button>
                        <IconButton size="small" color="primary" onClick={() => handleEditBed(bed)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteBed(bed.id)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </>
                    )}
                    {bed.status === 'OCCUPIED' && (
                      <>
                        <Button size="small" color="error" onClick={() => handleDischarge(bed.id)}>
                          Discharge
                        </Button>
                        <Button
                          size="small"
                          onClick={() => {
                            setSelectedBed(bed);
                            setOpenTransferDialog(true);
                          }}
                        >
                          Transfer
                        </Button>
                      </>
                    )}
                    {bed.status === 'UNDER_MAINTENANCE' && (
                      <>
                        <Button size="small" color="success" onClick={() => handleMarkAvailable(bed.id)}>
                          Mark Available
                        </Button>
                        <IconButton size="small" color="primary" onClick={() => handleEditBed(bed)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteBed(bed.id)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {/* Admit Patient Dialog */}
      <Dialog open={openAdmitDialog} onClose={() => setOpenAdmitDialog(false)}>
        <DialogTitle>Admit Patient to {selectedBed?.bedNumber}</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Select Patient"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            sx={{ mt: 2, minWidth: 300 }}
          >
            {patients.map((patient) => (
              <MenuItem key={patient.id} value={patient.id}>
                {patient.firstName} {patient.lastName} ({patient.patientId})
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdmitDialog(false)}>Cancel</Button>
          <Button onClick={handleAdmit} variant="contained" disabled={!selectedPatient}>
            Admit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Transfer Patient Dialog */}
      <Dialog open={openTransferDialog} onClose={() => setOpenTransferDialog(false)}>
        <DialogTitle>Transfer Patient from {selectedBed?.bedNumber}</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Select Target Bed"
            value={targetBedId}
            onChange={(e) => setTargetBedId(e.target.value)}
            sx={{ mt: 2, minWidth: 300 }}
          >
            {beds
              .filter((bed) => bed.status === 'AVAILABLE')
              .map((bed) => (
                <MenuItem key={bed.id} value={bed.id}>
                  {bed.bedNumber} - {bed.wardName} ({bed.bedType})
                </MenuItem>
              ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTransferDialog(false)}>Cancel</Button>
          <Button onClick={handleTransfer} variant="contained" disabled={!targetBedId}>
            Transfer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create/Edit Bed Dialog */}
      <Dialog open={openBedDialog} onClose={() => setOpenBedDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleBedSubmit}>
          <DialogTitle>{editMode ? 'Edit Bed' : 'Add New Bed'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bed Number"
                  name="bedNumber"
                  value={bedFormData.bedNumber}
                  onChange={handleBedFormChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ward Name"
                  name="wardName"
                  value={bedFormData.wardName}
                  onChange={handleBedFormChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Room Number"
                  name="roomNumber"
                  value={bedFormData.roomNumber}
                  onChange={handleBedFormChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Floor Number"
                  name="floorNumber"
                  type="number"
                  value={bedFormData.floorNumber}
                  onChange={handleBedFormChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Bed Type"
                  name="bedType"
                  value={bedFormData.bedType}
                  onChange={handleBedFormChange}
                  required
                >
                  <MenuItem value="ICU">ICU</MenuItem>
                  <MenuItem value="General">General</MenuItem>
                  <MenuItem value="Private">Private</MenuItem>
                  <MenuItem value="Semi-Private">Semi-Private</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Daily Charge"
                  name="dailyCharge"
                  type="number"
                  value={bedFormData.dailyCharge}
                  onChange={handleBedFormChange}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenBedDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editMode ? 'Update Bed' : 'Create Bed'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
