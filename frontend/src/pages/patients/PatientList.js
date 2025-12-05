import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  alpha,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import { patientAPI } from '../../services/api';
import PageHeader from '../../components/PageHeader';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await patientAPI.getAll();
      setPatients(response.data.data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <PageHeader
        title="Patients"
        subtitle="Manage patient records and information"
        action={() => navigate('/patients/new')}
        actionLabel="ADD PATIENT"
        actionIcon={<AddIcon />}
      />

      <Paper 
        sx={{ 
          p: 2.5, 
          mb: 3,
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <TextField
          fullWidth
          placeholder="Search patients by name, ID, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#6B7280' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: '#F9FAFB',
              '& fieldset': {
                borderColor: '#E5E7EB',
              },
              '&:hover fieldset': {
                borderColor: '#1565C0',
              },
            },
          }}
        />
      </Paper>

      <TableContainer 
        component={Paper}
        sx={{
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#F9FAFB' }}>
              <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Patient ID</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Blood Group</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#6B7280' }}>Loading...</TableCell>
              </TableRow>
            ) : filteredPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#6B7280' }}>No patients found</TableCell>
              </TableRow>
            ) : (
              filteredPatients.map((patient) => (
                <TableRow 
                  key={patient.id}
                  sx={{
                    '&:hover': {
                      bgcolor: alpha('#1565C0', 0.04),
                    },
                  }}
                >
                  <TableCell sx={{ fontSize: '0.875rem', color: '#1F2937' }}>{patient.patientId}</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: '#1F2937', fontWeight: 500 }}>{`${patient.firstName} ${patient.lastName}`}</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: '#6B7280' }}>{patient.email}</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: '#6B7280' }}>{patient.phoneNumber}</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: '#6B7280' }}>{patient.bloodGroup}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      sx={{
                        color: '#1565C0',
                        '&:hover': { bgcolor: alpha('#1565C0', 0.08) }
                      }}
                      onClick={() => navigate(`/patients/${patient.id}`)}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{
                        color: '#FB8C00',
                        ml: 0.5,
                        '&:hover': { bgcolor: alpha('#FB8C00', 0.08) }
                      }}
                      onClick={() => navigate(`/patients/${patient.id}/edit`)}
                    >
                      <EditIcon fontSize="small" />
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
