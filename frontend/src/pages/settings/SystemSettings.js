import React from 'react';
import { Box, Paper, Typography, Grid, Switch, FormControlLabel, Divider } from '@mui/material';
import PageHeader from '../../components/PageHeader';

export default function SystemSettings() {
  return (
    <Box>
      <PageHeader
        title="System Settings"
        subtitle="Configure system preferences and settings"
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, border: '1px solid #E5E7EB', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1F2937' }}>
              General Settings
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Enable Email Notifications"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Enable SMS Notifications"
            />
            <FormControlLabel
              control={<Switch />}
              label="Maintenance Mode"
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, border: '1px solid #E5E7EB', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1F2937' }}>
              Security Settings
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Two-Factor Authentication"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Auto Logout After Inactivity"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Password Expiry (90 days)"
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, border: '1px solid #E5E7EB', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1F2937' }}>
              Hospital Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Hospital configuration settings will be displayed here.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
