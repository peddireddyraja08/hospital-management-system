import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  alpha
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '../../components/PageHeader';

export default function UserRoles() {
  // Mock data - replace with API call
  const users = [
    {
      id: 1,
      username: 'admin',
      fullName: 'System Administrator',
      email: 'admin@hospital.com',
      role: 'ADMIN',
      status: 'ACTIVE',
      lastLogin: '2024-12-05 10:30 AM'
    },
    {
      id: 2,
      username: 'dr.smith',
      fullName: 'Dr. John Smith',
      email: 'john.smith@hospital.com',
      role: 'DOCTOR',
      status: 'ACTIVE',
      lastLogin: '2024-12-05 09:15 AM'
    },
    {
      id: 3,
      username: 'nurse.mary',
      fullName: 'Mary Johnson',
      email: 'mary.j@hospital.com',
      role: 'NURSE',
      status: 'ACTIVE',
      lastLogin: '2024-12-05 08:00 AM'
    },
    {
      id: 4,
      username: 'lab.tech1',
      fullName: 'Robert Williams',
      email: 'robert.w@hospital.com',
      role: 'LAB_TECHNICIAN',
      status: 'ACTIVE',
      lastLogin: '2024-12-04 04:30 PM'
    },
    {
      id: 5,
      username: 'pharmacist1',
      fullName: 'Emily Davis',
      email: 'emily.d@hospital.com',
      role: 'PHARMACIST',
      status: 'INACTIVE',
      lastLogin: '2024-11-28 02:00 PM'
    }
  ];

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return '#EF4444';
      case 'DOCTOR': return '#1565C0';
      case 'NURSE': return '#10B981';
      case 'LAB_TECHNICIAN': return '#8B5CF6';
      case 'PHARMACIST': return '#F59E0B';
      case 'RECEPTIONIST': return '#06B6D4';
      case 'ACCOUNTANT': return '#EC4899';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status) => {
    return status === 'ACTIVE' ? 'success' : 'default';
  };

  return (
    <Box>
      <PageHeader
        title="User Roles & Permissions"
        subtitle="Manage user accounts and role assignments"
        action={() => {}}
        actionLabel="Add User"
        actionIcon={<AddIcon />}
      />

      <Paper sx={{ p: 2.5, border: '1px solid #E5E7EB', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', bgcolor: '#F9FAFB' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>Full Name</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>Last Login</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{
                    '&:hover': { bgcolor: alpha('#1565C0', 0.04) },
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <TableCell sx={{ fontSize: '0.875rem', color: '#1F2937', fontWeight: 500 }}>
                    {user.username}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: '#1F2937' }}>
                    {user.fullName}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: '#6B7280' }}>
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.role.replace('_', ' ')}
                      size="small"
                      sx={{
                        bgcolor: alpha(getRoleColor(user.role), 0.1),
                        color: getRoleColor(user.role),
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status}
                      color={getStatusColor(user.status)}
                      size="small"
                      sx={{ fontWeight: 500, fontSize: '0.75rem' }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: '#6B7280' }}>
                    {user.lastLogin}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      sx={{ color: '#FB8C00', mr: 1 }}
                      title="Edit User"
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{ color: '#EF4444' }}
                      title="Delete User"
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
