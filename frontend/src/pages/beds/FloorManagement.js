import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Apartment as FloorIcon,
  MeetingRoom as WardIcon,
  Hotel as BedIcon,
  ArrowUpward as UpIcon,
  ArrowDownward as DownIcon,
  LocalHospital as HospitalIcon,
  KeyboardArrowRight as ArrowRightIcon,
} from '@mui/icons-material';
import PageHeader from '../../components/PageHeader';
import { bedAPI } from '../../services/api';

const floorTypes = [
  'General',
  'Critical Care',
  'Surgical',
  'Maternity',
  'Pediatric',
  'Outpatient',
  'Emergency',
  'Administrative',
  'Mixed',
];

export default function FloorManagement() {
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openWizard, setOpenWizard] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [editingFloor, setEditingFloor] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [floorForm, setFloorForm] = useState({
    floorNumber: '',
    floorName: '',
    floorType: 'General',
    totalCapacity: '',
    description: '',
  });

  const [wizardData, setWizardData] = useState({
    buildingName: 'Main Hospital',
    totalFloors: '',
    startFloor: '1',
    floors: [],
  });

  const steps = ['Building Info', 'Configure Floors', 'Review & Create'];

  useEffect(() => {
    fetchFloors();
  }, []);

  const fetchFloors = async () => {
    try {
      setLoading(true);
      const response = await bedAPI.getAll();
      console.log('API Response:', response.data);
      const beds = response.data.data || [];
      console.log('Total beds received:', beds.length);
      console.log('Sample bed data:', beds[0]);
      
      // Group beds by floor and extract floor information
      const floorData = {};
      beds.forEach(bed => {
        const floorNum = bed.floorNumber || 0;
        const wardName = bed.wardName || 'Unknown';
        
        if (!floorData[floorNum]) {
          floorData[floorNum] = {
            floorNumber: floorNum,
            wards: new Set(),
            totalBeds: 0,
            availableBeds: 0,
            occupiedBeds: 0,
            bedsByWard: {},
          };
        }
        
        floorData[floorNum].wards.add(wardName);
        floorData[floorNum].totalBeds++;
        
        if (!floorData[floorNum].bedsByWard[wardName]) {
          floorData[floorNum].bedsByWard[wardName] = 0;
        }
        floorData[floorNum].bedsByWard[wardName]++;
        
        const status = bed.status || bed.bedStatus;
        if (status === 'AVAILABLE') floorData[floorNum].availableBeds++;
        if (status === 'OCCUPIED') floorData[floorNum].occupiedBeds++;
      });

      const floorsArray = Object.values(floorData)
        .map(floor => ({
          ...floor,
          wards: Array.from(floor.wards),
          occupancyRate: floor.totalBeds > 0 
            ? ((floor.occupiedBeds / floor.totalBeds) * 100).toFixed(1) 
            : 0,
        }))
        .sort((a, b) => b.floorNumber - a.floorNumber);

      setFloors(floorsArray);
      console.log('Floors loaded:', floorsArray.length, 'floors');
    } catch (err) {
      console.error('Error fetching floors:', err);
      console.error('Error details:', err.response?.data || err.message);
      setError(`Failed to load floor data: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (floor = null) => {
    if (floor) {
      setEditingFloor(floor);
      setFloorForm({
        floorNumber: floor.floorNumber.toString(),
        floorName: `Floor ${floor.floorNumber}`,
        floorType: 'General',
        totalCapacity: floor.totalBeds.toString(),
        description: '',
      });
    } else {
      setEditingFloor(null);
      setFloorForm({
        floorNumber: '',
        floorName: '',
        floorType: 'General',
        totalCapacity: '',
        description: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingFloor(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFloorForm({
      ...floorForm,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    setSuccess(`Floor ${floorForm.floorNumber} configuration saved. Use Ward Management and Bed Creation to add beds.`);
    handleCloseDialog();
    setTimeout(() => setSuccess(null), 5000);
  };

  // Wizard functions
  const handleOpenWizard = () => {
    setWizardData({
      buildingName: 'Main Hospital',
      totalFloors: '',
      startFloor: '1',
      floors: [],
    });
    setActiveStep(0);
    setOpenWizard(true);
  };

  const handleCloseWizard = () => {
    setOpenWizard(false);
    setActiveStep(0);
  };

  const handleWizardChange = (e) => {
    const { name, value } = e.target;
    setWizardData({
      ...wizardData,
      [name]: value,
    });
  };

  const generateFloors = () => {
    const total = parseInt(wizardData.totalFloors);
    const start = parseInt(wizardData.startFloor);
    
    if (!total || !start || total < 1) {
      setError('Invalid floor range');
      return;
    }

    const generatedFloors = [];
    for (let i = 0; i < total; i++) {
      const floorNum = start + i;
      generatedFloors.push({
        floorNumber: floorNum,
        floorName: `Floor ${floorNum}`,
        floorType: 'General',
        totalCapacity: '',
        description: '',
      });
    }

    setWizardData({
      ...wizardData,
      floors: generatedFloors,
    });
  };

  const handleFloorDetailChange = (index, field, value) => {
    const updatedFloors = [...wizardData.floors];
    updatedFloors[index][field] = value;
    setWizardData({
      ...wizardData,
      floors: updatedFloors,
    });
  };

  const handleWizardNext = () => {
    if (activeStep === 0) {
      if (!wizardData.totalFloors || !wizardData.startFloor) {
        setError('Please fill in all required fields');
        return;
      }
      generateFloors();
    }
    setError(null);
    setActiveStep((prev) => prev + 1);
  };

  const handleWizardBack = () => {
    setActiveStep((prev) => prev - 1);
    setError(null);
  };

  const handleWizardSubmit = () => {
    setSuccess(`Floor plan for ${wizardData.buildingName} created successfully! Now use Ward Management and Bed Creation to populate floors.`);
    handleCloseWizard();
    setTimeout(() => setSuccess(null), 8000);
  };

  const renderWizardStep = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info">
                Create a complete floor plan for your hospital building. You can specify the number of floors and their basic configuration.
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Building Name"
                name="buildingName"
                value={wizardData.buildingName}
                onChange={handleWizardChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Number of Floors"
                name="totalFloors"
                type="number"
                value={wizardData.totalFloors}
                onChange={handleWizardChange}
                required
                placeholder="e.g., 5"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Starting Floor Number"
                name="startFloor"
                type="number"
                value={wizardData.startFloor}
                onChange={handleWizardChange}
                required
                helperText="Ground floor = 0, First floor = 1"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                {wizardData.totalFloors && wizardData.startFloor && 
                  `This will create floors ${wizardData.startFloor} to ${parseInt(wizardData.startFloor) + parseInt(wizardData.totalFloors) - 1}`
                }
              </Typography>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              Configure each floor's purpose and planned capacity. You can modify these details later.
            </Alert>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Floor #</TableCell>
                    <TableCell>Floor Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Planned Capacity</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {wizardData.floors.map((floor, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Chip label={floor.floorNumber} color="primary" />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          value={floor.floorName}
                          onChange={(e) => handleFloorDetailChange(index, 'floorName', e.target.value)}
                          placeholder={`Floor ${floor.floorNumber}`}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          select
                          size="small"
                          value={floor.floorType}
                          onChange={(e) => handleFloorDetailChange(index, 'floorType', e.target.value)}
                          sx={{ minWidth: 150 }}
                        >
                          {floorTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          type="number"
                          value={floor.totalCapacity}
                          onChange={(e) => handleFloorDetailChange(index, 'totalCapacity', e.target.value)}
                          placeholder="Beds"
                          sx={{ width: 100 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          value={floor.description}
                          onChange={(e) => handleFloorDetailChange(index, 'description', e.target.value)}
                          placeholder="Optional notes"
                          sx={{ minWidth: 200 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Alert severity="success" sx={{ mb: 2 }}>
              Review your floor plan before creating. This will serve as the blueprint for your hospital structure.
            </Alert>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                {wizardData.buildingName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Floors: {wizardData.floors.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Planned Capacity: {wizardData.floors.reduce((sum, f) => sum + (parseInt(f.totalCapacity) || 0), 0)} beds
              </Typography>
            </Paper>
            
            <Grid container spacing={2}>
              {wizardData.floors.slice().reverse().map((floor, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                          {floor.floorNumber}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {floor.floorName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {floor.floorType}
                          </Typography>
                        </Box>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2">
                        Capacity: {floor.totalCapacity || 'Not specified'} beds
                      </Typography>
                      {floor.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {floor.description}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Floor Management"
        subtitle="Design and manage your hospital's floor plan and architecture"
        icon={<FloorIcon />}
      />

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Total Floors: {floors.length}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<HospitalIcon />}
            onClick={handleOpenWizard}
          >
            Create Building Floor Plan
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Single Floor
          </Button>
        </Box>
      </Box>

      {/* Floor Cards - Stacked vertically like actual building */}
      <Grid container spacing={2}>
        {floors.map((floor, index) => (
          <Grid item xs={12} key={index}>
            <Card 
              sx={{ 
                border: '2px solid',
                borderColor: floor.occupancyRate > 80 ? 'error.main' : 'divider',
                position: 'relative',
              }}
            >
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  {/* Floor Number */}
                  <Grid item xs={12} md={1}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: 'primary.main', 
                          width: 56, 
                          height: 56,
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          mx: 'auto',
                        }}
                      >
                        {floor.floorNumber}
                      </Avatar>
                      <Typography variant="caption" color="text.secondary">
                        {floor.floorNumber === 0 ? 'Ground' : 
                         floor.floorNumber === 1 ? '1st' :
                         floor.floorNumber === 2 ? '2nd' :
                         floor.floorNumber === 3 ? '3rd' :
                         `${floor.floorNumber}th`}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Wards */}
                  <Grid item xs={12} md={5}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Wards on this floor:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {floor.wards.map((ward, i) => (
                        <Chip 
                          key={i}
                          icon={<WardIcon />}
                          label={`${ward} (${floor.bedsByWard[ward]} beds)`}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Grid>

                  {/* Stats */}
                  <Grid item xs={12} md={5}>
                    <Grid container spacing={2}>
                      <Grid item xs={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h5" color="primary">
                            {floor.totalBeds}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Total Beds
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h5" color="success.main">
                            {floor.availableBeds}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Available
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h5" color="error.main">
                            {floor.occupiedBeds}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Occupied
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Chip
                            label={`${floor.occupancyRate}%`}
                            color={
                              floor.occupancyRate > 80 ? 'error' : 
                              floor.occupancyRate > 50 ? 'warning' : 
                              'success'
                            }
                            size="small"
                          />
                          <Typography variant="caption" color="text.secondary" display="block">
                            Occupancy
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Actions */}
                  <Grid item xs={12} md={1}>
                    <IconButton onClick={() => handleOpenDialog(floor)} size="small">
                      <EditIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Single Floor Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingFloor ? 'Edit Floor' : 'Add New Floor'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Floor Number"
              name="floorNumber"
              type="number"
              value={floorForm.floorNumber}
              onChange={handleChange}
              margin="normal"
              required
              helperText="Ground floor = 0, First floor = 1, etc."
            />
            <TextField
              fullWidth
              label="Floor Name"
              name="floorName"
              value={floorForm.floorName}
              onChange={handleChange}
              margin="normal"
              placeholder="e.g., Critical Care Floor"
            />
            <TextField
              fullWidth
              select
              label="Floor Type"
              name="floorType"
              value={floorForm.floorType}
              onChange={handleChange}
              margin="normal"
            >
              {floorTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Planned Bed Capacity"
              name="totalCapacity"
              type="number"
              value={floorForm.totalCapacity}
              onChange={handleChange}
              margin="normal"
              placeholder="e.g., 40"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={floorForm.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
              placeholder="Additional details about this floor"
            />
            <Alert severity="info" sx={{ mt: 2 }}>
              After configuring the floor, use Ward Management to create wards and Bed Creation to add beds on this floor.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={!floorForm.floorNumber}
          >
            {editingFloor ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Building Wizard Dialog */}
      <Dialog 
        open={openWizard} 
        onClose={handleCloseWizard} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          Create Hospital Floor Plan
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ minHeight: 400 }}>
              {renderWizardStep(activeStep)}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWizard}>Cancel</Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button
            disabled={activeStep === 0}
            onClick={handleWizardBack}
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleWizardSubmit}
            >
              Create Floor Plan
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleWizardNext}
            >
              Next
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
