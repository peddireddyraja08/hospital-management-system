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
  IconButton,
  Chip,
  Alert,
  TextField,
  MenuItem,
} from '@mui/material';
import { Edit, Delete, Add, ToggleOff, ToggleOn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { doctorAPI } from '../../services/api';

export default function DoctorList() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');

  useEffect(() => {
    loadDoctors();
  }, [specializationFilter]);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const response = specializationFilter
        ? await doctorAPI.getBySpecialization(specializationFilter)
        : await doctorAPI.getAll();
      setDoctors(response.data.data);
    } catch (err) {
      setError('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this doctor from the system? This action cannot be undone.')) {
      try {
        await doctorAPI.delete(id);
        setSuccess('Doctor removed successfully from the system');
        loadDoctors();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete doctor');
      }
    }
  };

  const handleToggleStatus = async (doctor) => {
    const action = doctor.isActive ? 'deactivate' : 'activate';
    if (window.confirm(`Are you sure you want to ${action} this doctor?`)) {
      try {
        const updatedDoctor = { ...doctor, isActive: !doctor.isActive };
        await doctorAPI.update(doctor.id, updatedDoctor);
        setSuccess(`Doctor ${action}d successfully`);
        loadDoctors();
      } catch (err) {
        setError(err.response?.data?.message || `Failed to ${action} doctor`);
        console.error('Toggle status error:', err);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Doctors</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/doctors/new')}
        >
          Add Doctor
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      <Box sx={{ mb: 3 }}>
        <TextField
          select
          label="Filter by Specialization"
          value={specializationFilter}
          onChange={(e) => setSpecializationFilter(e.target.value)}
          sx={{ minWidth: 250 }}
        >
          <MenuItem value="">All Specializations</MenuItem>
          <MenuItem value="Cardiology">Cardiology</MenuItem>
          <MenuItem value="Neurology">Neurology</MenuItem>
          <MenuItem value="Pediatrics">Pediatrics</MenuItem>
          <MenuItem value="Orthopedics">Orthopedics</MenuItem>
          <MenuItem value="General Medicine">General Medicine</MenuItem>
          <MenuItem value="Dermatology">Dermatology</MenuItem>
          <MenuItem value="Gynecology">Gynecology</MenuItem>
          <MenuItem value="Psychiatry">Psychiatry</MenuItem>
          <MenuItem value="Radiology">Radiology</MenuItem>
          <MenuItem value="Anesthesiology">Anesthesiology</MenuItem>
        </TextField>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Doctor ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>License Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Consultation Fee</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">Loading...</TableCell>
              </TableRow>
            ) : doctors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">No doctors found</TableCell>
              </TableRow>
            ) : (
              doctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell>{doctor.doctorId}</TableCell>
                  <TableCell>{`${doctor.firstName} ${doctor.lastName}`}</TableCell>
                  <TableCell>{doctor.specialization}</TableCell>
                  <TableCell>{doctor.licenseNumber}</TableCell>
                  <TableCell>{doctor.email}</TableCell>
                  <TableCell>{doctor.phoneNumber}</TableCell>
                  <TableCell>₹{doctor.consultationFee}</TableCell>
                  <TableCell>
                    <Chip
                      label={doctor.isActive ? 'Active' : 'Inactive'}
                      color={doctor.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/doctors/edit/${doctor.id}`)}
                      title="Edit Doctor"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color={doctor.isActive ? 'warning' : 'success'}
                      onClick={() => handleToggleStatus(doctor)}
                      title={doctor.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {doctor.isActive ? <ToggleOff /> : <ToggleOn />}
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(doctor.id)}
                      title="Delete Doctor"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
