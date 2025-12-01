import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CardActions,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { staffAPI } from '../../services/api';

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    department: '',
    designation: '',
    joiningDate: '',
    salary: '',
  });

  useEffect(() => {
    loadStaff();
  }, [departmentFilter]);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const response = departmentFilter
        ? await staffAPI.getByDepartment(departmentFilter)
        : await staffAPI.getAll();
      setStaff(response.data.data);
    } catch (err) {
      setError('Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setEditMode(false);
    setError('');
    setSuccess('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      department: '',
      designation: '',
      joiningDate: '',
      salary: '',
    });
  };

  const handleViewStaff = (member) => {
    setSelectedStaff(member);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedStaff(null);
  };

  const handleEditStaff = (member) => {
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phoneNumber: member.phoneNumber,
      department: member.department,
      designation: member.designation,
      joiningDate: member.joiningDate,
      salary: member.salary,
    });
    setSelectedStaff(member);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await staffAPI.delete(id);
        setSuccess('Staff member deleted successfully');
        loadStaff();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete staff member');
      }
    }
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
      if (editMode) {
        await staffAPI.update(selectedStaff.id, formData);
        setSuccess('Staff member updated successfully');
      } else {
        await staffAPI.create(formData);
        setSuccess('Staff member created successfully');
      }
      handleCloseDialog();
      loadStaff();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${editMode ? 'update' : 'create'} staff member`);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Staff Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Staff
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      <Box sx={{ mb: 3 }}>
        <TextField
          select
          label="Filter by Department"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          sx={{ minWidth: 250 }}
        >
          <MenuItem value="">All Departments</MenuItem>
          <MenuItem value="Administration">Administration</MenuItem>
          <MenuItem value="Nursing">Nursing</MenuItem>
          <MenuItem value="Laboratory">Laboratory</MenuItem>
          <MenuItem value="Pharmacy">Pharmacy</MenuItem>
          <MenuItem value="Radiology">Radiology</MenuItem>
          <MenuItem value="Housekeeping">Housekeeping</MenuItem>
        </TextField>
      </Box>

      <Grid container spacing={3}>
        {loading ? (
          <Grid item xs={12}>
            <Typography>Loading...</Typography>
          </Grid>
        ) : staff.length === 0 ? (
          <Grid item xs={12}>
            <Typography>No staff members found</Typography>
          </Grid>
        ) : (
          staff.map((member) => (
            <Grid item xs={12} sm={6} md={4} key={member.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    {member.firstName} {member.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Staff ID: {member.staffId}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Department: {member.department}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Designation: {member.designation}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Email: {member.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Phone: {member.phoneNumber}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton size="small" color="primary" onClick={() => handleViewStaff(member)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton size="small" color="primary" onClick={() => handleEditStaff(member)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDeleteStaff(member.id)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Create/Edit Staff Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editMode ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Administration">Administration</MenuItem>
                  <MenuItem value="Nursing">Nursing</MenuItem>
                  <MenuItem value="Laboratory">Laboratory</MenuItem>
                  <MenuItem value="Pharmacy">Pharmacy</MenuItem>
                  <MenuItem value="Radiology">Radiology</MenuItem>
                  <MenuItem value="Housekeeping">Housekeeping</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Joining Date"
                  name="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Salary"
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editMode ? 'Update Staff' : 'Create Staff'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Staff Dialog */}
      <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Staff Details</DialogTitle>
        <DialogContent>
          {selectedStaff && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Staff ID</Typography>
                  <Typography variant="body1">{selectedStaff.staffId}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                  <Typography variant="body1">{selectedStaff.firstName} {selectedStaff.lastName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{selectedStaff.email}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                  <Typography variant="body1">{selectedStaff.phoneNumber}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Department</Typography>
                  <Typography variant="body1">{selectedStaff.department}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Designation</Typography>
                  <Typography variant="body1">{selectedStaff.designation}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Joining Date</Typography>
                  <Typography variant="body1">{selectedStaff.joiningDate}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Salary</Typography>
                  <Typography variant="body1">₹{selectedStaff.salary}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
