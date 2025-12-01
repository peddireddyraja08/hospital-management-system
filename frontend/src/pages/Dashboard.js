import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PaymentIcon from '@mui/icons-material/Payment';
import HotelIcon from '@mui/icons-material/Hotel';
import ScienceIcon from '@mui/icons-material/Science';
import { useNavigate } from 'react-router-dom';
import { patientAPI, doctorAPI, appointmentAPI, billAPI, bedAPI, labTestRequestAPI } from '../services/api';

const StatCard = ({ title, value, icon, color, onClick }) => (
  <Paper
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      height: 140,
      bgcolor: color,
      color: 'white',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': onClick ? {
        transform: 'translateY(-4px)',
        boxShadow: 6,
      } : {},
    }}
    onClick={onClick}
  >
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {icon}
    </Box>
    <Typography variant="h3" component="div">
      {value}
    </Typography>
  </Paper>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    occupiedBeds: 0,
    pendingLabTests: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [patientsRes, doctorsRes, appointmentsRes, billsRes, bedsRes, labTestsRes] = await Promise.all([
        patientAPI.getAll(),
        doctorAPI.getAll(),
        appointmentAPI.getAll(),
        billAPI.getAll(),
        bedAPI.getAll(),
        labTestRequestAPI.getAll(),
      ]);

      const patients = patientsRes.data.data || [];
      const doctors = doctorsRes.data.data || [];
      const appointments = appointmentsRes.data.data || [];
      const bills = billsRes.data.data || [];
      const beds = bedsRes.data.data || [];
      const labTests = labTestsRes.data.data || [];

      // Calculate today's appointments
      const today = new Date().toDateString();
      const todayAppointments = appointments.filter(apt => 
        new Date(apt.appointmentDate).toDateString() === today
      ).length;

      // Calculate occupied beds
      const occupiedBeds = beds.filter(bed => bed.bedStatus === 'OCCUPIED').length;

      // Calculate pending lab tests
      const pendingTests = labTests.filter(test => 
        test.status === 'REQUESTED' || test.status === 'SAMPLE_COLLECTED' || test.status === 'IN_PROGRESS'
      ).length;

      // Calculate total revenue (sum of all paid amounts)
      const totalRevenue = bills.reduce((sum, bill) => sum + (bill.paidAmount || 0), 0);

      setStats({
        totalPatients: patients.length,
        totalDoctors: doctors.length,
        totalAppointments: todayAppointments,
        occupiedBeds: occupiedBeds,
        pendingLabTests: pendingTests,
        totalRevenue: totalRevenue,
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<PeopleIcon fontSize="large" />}
            color="#1976d2"
            onClick={() => navigate('/patients')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Active Doctors"
            value={stats.totalDoctors}
            icon={<LocalHospitalIcon fontSize="large" />}
            color="#2e7d32"
            onClick={() => navigate('/doctors')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Appointments Today"
            value={stats.totalAppointments}
            icon={<CalendarTodayIcon fontSize="large" />}
            color="#ed6c02"
            onClick={() => navigate('/appointments')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Occupied Beds"
            value={stats.occupiedBeds}
            icon={<HotelIcon fontSize="large" />}
            color="#d32f2f"
            onClick={() => navigate('/beds')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Pending Lab Tests"
            value={stats.pendingLabTests}
            icon={<ScienceIcon fontSize="large" />}
            color="#0288d1"
            onClick={() => navigate('/lab-tests')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon={<PaymentIcon fontSize="large" />}
            color="#9c27b0"
            onClick={() => navigate('/billing')}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Activity feed will be displayed here
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Appointments
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Appointment list will be displayed here
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
