import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import { staffAPI } from '../../services/api';

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Staff Management
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}
