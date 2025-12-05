import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  LinearProgress,
  Avatar,
  Chip,
  alpha,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PaymentIcon from '@mui/icons-material/Payment';
import HotelIcon from '@mui/icons-material/Hotel';
import ScienceIcon from '@mui/icons-material/Science';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useNavigate } from 'react-router-dom';
import { patientAPI, doctorAPI, appointmentAPI, billAPI, bedAPI, labTestRequestAPI } from '../services/api';

const StatCard = ({ title, value, subtitle, icon, color, trend, trendValue, onClick }) => (
  <Paper
    sx={{
      p: 2.5,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      border: '1px solid',
      borderColor: '#E5E7EB',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      '&:hover': onClick ? {
        transform: 'scale(1.02)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        borderColor: color,
      } : {},
    }}
    onClick={onClick}
  >
    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
      <Box>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#6B7280', 
            fontWeight: 500, 
            fontSize: '0.8125rem',
            mb: 0.5 
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            color: '#1F2937',
            fontSize: '1.875rem',
            lineHeight: 1.2
          }}
        >
          {value}
        </Typography>
      </Box>
      <Avatar
        sx={{
          bgcolor: alpha(color, 0.1),
          color: color,
          width: 48,
          height: 48,
        }}
      >
        {icon}
      </Avatar>
    </Box>
    
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="caption" sx={{ color: '#9CA3AF', fontSize: '0.75rem' }}>
        {subtitle}
      </Typography>
      {trend && (
        <Box display="flex" alignItems="center" gap={0.5}>
          {trend === 'up' ? (
            <TrendingUpIcon sx={{ fontSize: 16, color: '#10B981' }} />
          ) : (
            <TrendingDownIcon sx={{ fontSize: 16, color: '#EF4444' }} />
          )}
          <Typography 
            variant="caption" 
            sx={{ 
              color: trend === 'up' ? '#10B981' : '#EF4444',
              fontWeight: 600,
              fontSize: '0.75rem'
            }}
          >
            {trendValue}
          </Typography>
        </Box>
      )}
    </Box>
  </Paper>
);

const QuickStatCard = ({ title, current, total, color }) => {
  const percentage = Math.round((current / total) * 100);
  
  return (
    <Paper
      sx={{
        p: 2.5,
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>
          {title}
        </Typography>
        <Chip 
          label={`${percentage}%`} 
          size="small"
          sx={{ 
            bgcolor: alpha(color, 0.1),
            color: color,
            fontWeight: 600,
            fontSize: '0.75rem'
          }}
        />
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="baseline" mb={1}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1F2937' }}>
          {current}
        </Typography>
        <Typography variant="body2" sx={{ color: '#9CA3AF', fontSize: '0.8125rem' }}>
          / {total}
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={percentage} 
        sx={{ 
          height: 6, 
          borderRadius: 3,
          bgcolor: alpha(color, 0.1),
          '& .MuiLinearProgress-bar': {
            bgcolor: color,
            borderRadius: 3,
          }
        }}
      />
    </Paper>
  );
};

const RecentActivityCard = ({ title, items, icon, color }) => (
  <Paper
    sx={{
      p: 2.5,
      height: '100%',
      border: '1px solid #E5E7EB',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    }}
  >
    <Box display="flex" alignItems="center" gap={1.5} mb={2.5}>
      <Avatar
        sx={{
          bgcolor: alpha(color, 0.1),
          color: color,
          width: 36,
          height: 36,
        }}
      >
        {icon}
      </Avatar>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1F2937', fontSize: '1.125rem' }}>
        {title}
      </Typography>
    </Box>
    
    <Box>
      {items.length > 0 ? (
        items.map((item, index) => (
          <Box
            key={index}
            sx={{
              py: 1.5,
              borderBottom: index < items.length - 1 ? '1px solid #F3F4F6' : 'none',
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151', fontSize: '0.875rem' }}>
                  {item.title}
                </Typography>
                <Typography variant="caption" sx={{ color: '#9CA3AF', fontSize: '0.75rem' }}>
                  {item.subtitle}
                </Typography>
              </Box>
              <Chip
                label={item.status}
                size="small"
                sx={{
                  bgcolor: alpha(item.statusColor, 0.1),
                  color: item.statusColor,
                  fontWeight: 600,
                  fontSize: '0.7rem',
                }}
              />
            </Box>
          </Box>
        ))
      ) : (
        <Typography variant="body2" sx={{ color: '#9CA3AF', textAlign: 'center', py: 4 }}>
          No recent activity
        </Typography>
      )}
    </Box>
  </Paper>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    todayAppointments: 0,
    occupiedBeds: 0,
    totalBeds: 0,
    pendingLabTests: 0,
    totalRevenue: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [recentLabTests, setRecentLabTests] = useState([]);
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
      );

      // Calculate occupied beds
      const occupiedBedsCount = beds.filter(bed => bed.bedStatus === 'OCCUPIED').length;

      // Calculate pending lab tests
      const pendingTests = labTests.filter(test => 
        test.status === 'REQUESTED' || test.status === 'SAMPLE_COLLECTED' || test.status === 'IN_PROGRESS'
      );

      // Calculate total revenue (sum of all paid amounts)
      const totalRevenue = bills.reduce((sum, bill) => sum + (bill.paidAmount || 0), 0);

      setStats({
        totalPatients: patients.length,
        totalDoctors: doctors.length,
        todayAppointments: todayAppointments.length,
        occupiedBeds: occupiedBedsCount,
        totalBeds: beds.length,
        pendingLabTests: pendingTests.length,
        totalRevenue: totalRevenue,
      });

      // Recent appointments
      const recentApts = todayAppointments.slice(0, 5).map(apt => ({
        title: `${apt.patient?.firstName || 'Patient'} ${apt.patient?.lastName || ''}`,
        subtitle: `Dr. ${apt.doctor?.firstName || 'Doctor'} - ${new Date(apt.appointmentDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
        status: apt.status || 'SCHEDULED',
        statusColor: apt.status === 'COMPLETED' ? '#10B981' : apt.status === 'CANCELLED' ? '#EF4444' : '#3B82F6',
      }));
      setRecentAppointments(recentApts);

      // Recent lab tests
      const recentTests = pendingTests.slice(0, 5).map(test => ({
        title: `${test.labTest?.testName || 'Lab Test'}`,
        subtitle: `Patient: ${test.patient?.firstName || 'Unknown'} ${test.patient?.lastName || ''}`,
        status: test.status || 'REQUESTED',
        statusColor: test.status === 'COMPLETED' ? '#10B981' : test.status === 'IN_PROGRESS' ? '#FB8C00' : '#6B7280',
      }));
      setRecentLabTests(recentTests);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Page Header */}
      <Box mb={4}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            color: '#1F2937',
            fontSize: '1.5rem',
            mb: 0.5
          }}
        >
          Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.875rem' }}>
          Welcome back! Here's what's happening today.
        </Typography>
      </Box>

      {/* Main Stats */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            subtitle="Registered patients"
            icon={<PeopleIcon sx={{ fontSize: 28 }} />}
            color="#1E88E5"
            trend="up"
            trendValue="+12%"
            onClick={() => navigate('/patients')}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Doctors"
            value={stats.totalDoctors}
            subtitle="Available doctors"
            icon={<LocalHospitalIcon sx={{ fontSize: 28 }} />}
            color="#43A047"
            onClick={() => navigate('/doctors')}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Today's Appointments"
            value={stats.todayAppointments}
            subtitle="Scheduled for today"
            icon={<CalendarTodayIcon sx={{ fontSize: 28 }} />}
            color="#FB8C00"
            trend="down"
            trendValue="-3%"
            onClick={() => navigate('/appointments')}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Revenue"
            value={`₹${(stats.totalRevenue / 1000).toFixed(1)}k`}
            subtitle="This month"
            icon={<PaymentIcon sx={{ fontSize: 28 }} />}
            color="#8E24AA"
            trend="up"
            trendValue="+24%"
            onClick={() => navigate('/billing')}
          />
        </Grid>
      </Grid>

      {/* Secondary Stats */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={4}>
          <QuickStatCard
            title="Bed Occupancy"
            current={stats.occupiedBeds}
            total={stats.totalBeds || 1}
            color="#1E88E5"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <QuickStatCard
            title="Pending Lab Tests"
            current={stats.pendingLabTests}
            total={stats.pendingLabTests + 15}
            color="#FB8C00"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <QuickStatCard
            title="QC Tests Today"
            current={8}
            total={12}
            color="#43A047"
          />
        </Grid>
      </Grid>

      {/* Activity Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <RecentActivityCard
            title="Today's Appointments"
            items={recentAppointments}
            icon={<CalendarTodayIcon sx={{ fontSize: 20 }} />}
            color="#1E88E5"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RecentActivityCard
            title="Pending Lab Tests"
            items={recentLabTests}
            icon={<ScienceIcon sx={{ fontSize: 20 }} />}
            color="#FB8C00"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
