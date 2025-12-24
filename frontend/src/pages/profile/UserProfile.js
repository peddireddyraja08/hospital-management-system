import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Typography,
  Divider,
  IconButton,
  InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { useEffect } from 'react';

export default function UserProfile() {
  const { user, updateLocalUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || 'John',
    lastName: user?.lastName || 'Doe',
    username: user?.username || 'johndoe',
    email: user?.email || 'john.doe@hospital.com',
    phone: user?.phone || '+1 234 567 8900',
    role: user?.role || 'ADMIN',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    let mounted = true;
    authAPI.getProfile().then((res) => {
      if (!mounted) return;
      const p = res.data.data;
      setFormData((f) => ({
        ...f,
        firstName: p.firstName || f.firstName,
        lastName: p.lastName || f.lastName,
        username: p.username || f.username,
        email: p.email || f.email,
        phone: p.phoneNumber || f.phone
      }));
      updateLocalUser({ username: p.username, email: p.email });
      
    }).catch(() => {
    });
    return () => { mounted = false; };
  }, [updateLocalUser]);

  const handleSave = () => {
    setSaving(true);
    authAPI.updateProfile({
      username: formData.username,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phone
    }).then((res) => {
      const updated = res.data.data;
      updateLocalUser({ username: updated.username, email: updated.email });
      setFormData((f) => ({ ...f, firstName: updated.firstName || f.firstName, lastName: updated.lastName || f.lastName, email: updated.email || f.email }));
      setEditMode(false);
      setSaving(false);
      alert('Profile updated successfully');
    }).catch((err) => {
      setSaving(false);
      alert(err.response?.data?.message || 'Failed to update profile');
    });
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setEditMode(false);
  };

  return (
    <Box>
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal information and security settings"
      />

      <Grid container spacing={3}>
        {/* Profile Picture & Basic Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, border: '1px solid #E5E7EB', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                margin: '0 auto 16px',
                bgcolor: '#1565C0',
                fontSize: '3rem'
              }}
            >
              {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1F2937', mb: 0.5 }}>
              {formData.firstName} {formData.lastName}
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
              {formData.role.replace('_', ' ')}
            </Typography>
            <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
              {formData.email}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setEditMode(!editMode)}
              fullWidth
              sx={{
                borderColor: '#E5E7EB',
                color: '#1565C0',
                '&:hover': {
                  borderColor: '#1565C0',
                  bgcolor: 'rgba(21, 101, 192, 0.04)'
                }
              }}
            >
              {editMode ? 'Cancel Edit' : 'Edit Profile'}
            </Button>
          </Paper>
        </Grid>

        {/* Personal Information */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, border: '1px solid #E5E7EB', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1F2937' }}>
              Personal Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!editMode}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!editMode}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={!editMode}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!editMode}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editMode}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Role"
                  name="role"
                  value={formData.role.replace('_', ' ')}
                  disabled
                  size="small"
                />
              </Grid>
            </Grid>

            {editMode && (
              <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  sx={{ color: '#6B7280', borderColor: '#E5E7EB' }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={saving}
                  sx={{ bgcolor: '#1565C0' }}
                >
                  Save Changes
                </Button>
              </Box>
            )}
          </Paper>

          {/* Change Password */}
          <Paper sx={{ p: 3, border: '1px solid #E5E7EB', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1F2937' }}>
              Change Password
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  name="currentPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={handleChange}
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                sx={{ bgcolor: '#1565C0' }}
                disabled={saving}
                onClick={() => {
                  if (!formData.currentPassword || !formData.newPassword) {
                    alert('Please provide current and new passwords');
                    return;
                  }
                  if (formData.newPassword !== formData.confirmPassword) {
                    alert('New password and confirmation do not match');
                    return;
                  }
                  setSaving(true);
                  authAPI.changePassword({ currentPassword: formData.currentPassword, newPassword: formData.newPassword })
                    .then(() => {
                      setSaving(false);
                      setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
                      alert('Password updated successfully');
                    })
                    .catch((err) => {
                      setSaving(false);
                      alert(err.response?.data?.message || 'Failed to change password');
                    });
                }}
              >
                Update Password
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
