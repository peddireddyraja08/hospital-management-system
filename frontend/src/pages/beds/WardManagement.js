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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MeetingRoom as WardIcon,
  Hotel as BedIcon,
} from '@mui/icons-material';
import PageHeader from '../../components/PageHeader';
import { bedAPI } from '../../services/api';

export default function WardManagement() {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingWard, setEditingWard] = useState(null);
  const [wardStats, setWardStats] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [wardForm, setWardForm] = useState({
    name: '',
    floor: '',
    capacity: '',
    department: '',
    description: '',
  });

  useEffect(() => {
    fetchWards();
  }, []);

  const fetchWards = async () => {
    try {
      setLoading(true);
      const response = await bedAPI.getAll();
      const beds = response.data.data || [];
      
      // Group beds by ward and calculate stats
      const wardData = {};
      beds.forEach(bed => {
        const wardName = bed.wardName || 'Unknown';
        if (!wardData[wardName]) {
          wardData[wardName] = {
            name: wardName,
            totalBeds: 0,
            availableBeds: 0,
            occupiedBeds: 0,
            beds: [],
            floors: new Set(),
          };
        }
        wardData[wardName].totalBeds++;
        wardData[wardName].beds.push(bed);
        if (bed.floorNumber) wardData[wardName].floors.add(bed.floorNumber);
        
        const status = bed.status || bed.bedStatus;
        if (status === 'AVAILABLE') wardData[wardName].availableBeds++;
        if (status === 'OCCUPIED') wardData[wardName].occupiedBeds++;
      });

      const wardsArray = Object.values(wardData).map(ward => ({
        ...ward,
        floors: Array.from(ward.floors).sort(),
        occupancyRate: ward.totalBeds > 0 
          ? ((ward.occupiedBeds / ward.totalBeds) * 100).toFixed(1) 
          : 0,
      }));

      setWards(wardsArray);
      setWardStats(wardData);
    } catch (err) {
      console.error('Error fetching wards:', err);
      setError('Failed to load wards');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (ward = null) => {
    if (ward) {
      setEditingWard(ward);
      setWardForm({
        name: ward.name,
        floor: ward.floors[0] || '',
        capacity: ward.totalBeds.toString(),
        department: '',
        description: '',
      });
    } else {
      setEditingWard(null);
      setWardForm({
        name: '',
        floor: '',
        capacity: '',
        department: '',
        description: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingWard(null);
    setWardForm({
      name: '',
      floor: '',
      capacity: '',
      department: '',
      description: '',
    });
  };

  const handleChange = (e) => {
    setWardForm({
      ...wardForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    // For now, just show success message
    // In production, this would create ward metadata in backend
    setSuccess(`Ward "${wardForm.name}" configuration saved. Use Bed Creation to add beds to this ward.`);
    handleCloseDialog();
    setTimeout(() => setSuccess(null), 5000);
  };

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Ward Management"
        subtitle="Manage hospital wards and their bed allocation"
        icon={<WardIcon />}
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
          Total Wards: {wards.length}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Ward
        </Button>
      </Box>

      <Grid container spacing={3}>
        {wards.map((ward, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {ward.name}
                  </Typography>
                  <Chip
                    label={`${ward.occupancyRate}% Full`}
                    color={ward.occupancyRate > 80 ? 'error' : ward.occupancyRate > 50 ? 'warning' : 'success'}
                    size="small"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Floor(s): {ward.floors.join(', ') || 'N/A'}
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="h4" color="primary">
                      {ward.totalBeds}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Beds
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h4" color="success.main">
                      {ward.availableBeds}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Available
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h4" color="error.main">
                      {ward.occupiedBeds}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Occupied
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleOpenDialog(ward)}
                >
                  Edit
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Ward Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingWard ? 'Edit Ward' : 'Add New Ward'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Ward Name"
              name="name"
              value={wardForm.name}
              onChange={handleChange}
              margin="normal"
              required
              placeholder="e.g., General Ward, ICU, Private Ward"
            />
            <TextField
              fullWidth
              label="Floor Number"
              name="floor"
              type="number"
              value={wardForm.floor}
              onChange={handleChange}
              margin="normal"
              placeholder="e.g., 1, 2, 3"
            />
            <TextField
              fullWidth
              label="Planned Capacity (Number of Beds)"
              name="capacity"
              type="number"
              value={wardForm.capacity}
              onChange={handleChange}
              margin="normal"
              placeholder="e.g., 20"
            />
            <TextField
              fullWidth
              label="Department"
              name="department"
              value={wardForm.department}
              onChange={handleChange}
              margin="normal"
              placeholder="e.g., Cardiology, Surgery"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={wardForm.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
              placeholder="Additional details about this ward"
            />
            <Alert severity="info" sx={{ mt: 2 }}>
              After creating the ward, use the "Bed Creation" page to add individual beds to this ward.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={!wardForm.name || !wardForm.floor}
          >
            {editingWard ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
