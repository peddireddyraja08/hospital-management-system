import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Chip,
  TextField,
} from '@mui/material';
import {
  BarChart,
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  Hotel as BedIcon,
  CalendarToday as CalendarIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  LineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { admissionAPI, bedAPI } from '../../services/api';

const COLORS = ['#2196f3', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#00bcd4', '#ffc107', '#e91e63'];

const IPDAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('30days');
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  });
  const [endDate, setEndDate] = useState(new Date());
  const [selectedWard, setSelectedWard] = useState('all');

  // Analytics data
  const [occupancyData, setOccupancyData] = useState([]);
  const [alosData, setAlosData] = useState([]);
  const [admissionSourcesData, setAdmissionSourcesData] = useState([]);
  const [dischargeDispositionData, setDischargeDispositionData] = useState([]);
  const [kpiData, setKpiData] = useState({
    totalAdmissions: 0,
    totalDischarges: 0,
    avgLOS: 0,
    currentOccupancy: 0,
    bedTurnoverRate: 0,
    avgDailyAdmissions: 0,
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [startDate, endDate, selectedWard]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all admissions
      const admissionsResponse = await admissionAPI.getAll();
      const allAdmissions = admissionsResponse.data.data || [];

      // Filter by date range
      const filteredAdmissions = allAdmissions.filter(admission => {
        const admissionDate = new Date(admission.admissionDate);
        return admissionDate >= startDate && admissionDate <= endDate;
      });

      // Filter by ward if selected
      const wardFilteredAdmissions = selectedWard === 'all'
        ? filteredAdmissions
        : filteredAdmissions.filter(a => a.bed?.wardName === selectedWard);

      // Calculate occupancy trends
      calculateOccupancyTrends(wardFilteredAdmissions);

      // Calculate ALOS by ward
      calculateALOSByWard(filteredAdmissions);

      // Calculate admission sources
      calculateAdmissionSources(wardFilteredAdmissions);

      // Calculate discharge disposition
      calculateDischargeDisposition(wardFilteredAdmissions);

      // Calculate KPIs
      calculateKPIs(wardFilteredAdmissions, allAdmissions);

    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const calculateOccupancyTrends = (admissions) => {
    // Group admissions by date
    const dateMap = {};
    
    admissions.forEach(admission => {
      const date = new Date(admission.admissionDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
      });
      dateMap[date] = (dateMap[date] || 0) + 1;
    });

    const data = Object.entries(dateMap)
      .map(([date, count]) => ({ date, admissions: count }))
      .slice(-14); // Last 14 days

    setOccupancyData(data);
  };

  const calculateALOSByWard = (admissions) => {
    const wardMap = {};

    admissions.forEach(admission => {
      if (admission.status === 'DISCHARGED' && admission.dischargeDate) {
        const ward = admission.bed?.wardName || 'Unknown';
        const admissionDate = new Date(admission.admissionDate);
        const dischargeDate = new Date(admission.dischargeDate);
        const los = Math.ceil((dischargeDate - admissionDate) / (1000 * 60 * 60 * 24));

        if (!wardMap[ward]) {
          wardMap[ward] = { totalLOS: 0, count: 0 };
        }
        wardMap[ward].totalLOS += los;
        wardMap[ward].count += 1;
      }
    });

    const data = Object.entries(wardMap).map(([ward, stats]) => ({
      ward,
      alos: (stats.totalLOS / stats.count).toFixed(1),
    }));

    setAlosData(data);
  };

  const calculateAdmissionSources = (admissions) => {
    const sourceMap = {};

    admissions.forEach(admission => {
      const source = admission.admissionSource || 'Unknown';
      sourceMap[source] = (sourceMap[source] || 0) + 1;
    });

    const data = Object.entries(sourceMap).map(([name, value]) => ({
      name,
      value,
    }));

    setAdmissionSourcesData(data);
  };

  const calculateDischargeDisposition = (admissions) => {
    const dispositionMap = {};

    admissions.forEach(admission => {
      if (admission.status === 'DISCHARGED') {
        const disposition = admission.dischargeType || 'Unknown';
        dispositionMap[disposition] = (dispositionMap[disposition] || 0) + 1;
      }
    });

    const data = Object.entries(dispositionMap).map(([name, value]) => ({
      name: name.replace(/_/g, ' '),
      value,
    }));

    setDischargeDispositionData(data);
  };

  const calculateKPIs = (filteredAdmissions, allAdmissions) => {
    const totalAdmissions = filteredAdmissions.length;
    const totalDischarges = filteredAdmissions.filter(a => a.status === 'DISCHARGED').length;

    // Calculate average LOS
    let totalLOS = 0;
    let losCount = 0;
    filteredAdmissions.forEach(admission => {
      if (admission.status === 'DISCHARGED' && admission.dischargeDate) {
        const admissionDate = new Date(admission.admissionDate);
        const dischargeDate = new Date(admission.dischargeDate);
        const los = Math.ceil((dischargeDate - admissionDate) / (1000 * 60 * 60 * 24));
        totalLOS += los;
        losCount += 1;
      }
    });
    const avgLOS = losCount > 0 ? (totalLOS / losCount).toFixed(1) : 0;

    // Current occupancy (all active admissions)
    const currentOccupancy = allAdmissions.filter(a => a.status === 'ACTIVE').length;

    // Bed turnover rate
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 1;
    const bedTurnoverRate = (totalDischarges / daysDiff).toFixed(2);

    // Average daily admissions
    const avgDailyAdmissions = (totalAdmissions / daysDiff).toFixed(1);

    setKpiData({
      totalAdmissions,
      totalDischarges,
      avgLOS,
      currentOccupancy,
      bedTurnoverRate,
      avgDailyAdmissions,
    });
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    const end = new Date();
    let start = new Date();

    switch (range) {
      case '7days':
        start.setDate(end.getDate() - 7);
        break;
      case '30days':
        start.setDate(end.getDate() - 30);
        break;
      case '90days':
        start.setDate(end.getDate() - 90);
        break;
      case '1year':
        start.setFullYear(end.getFullYear() - 1);
        break;
      default:
        return;
    }

    setStartDate(start);
    setEndDate(end);
  };

  const handleExport = () => {
    alert('Export functionality would generate CSV/Excel with all analytics data');
  };

  // Get unique wards
  const [wards, setWards] = useState([]);
  useEffect(() => {
    const fetchWards = async () => {
      try {
        const response = await bedAPI.getAll();
        let beds = response.data.data || [];
        
        // Handle if response is an object with bedsByWard
        if (!Array.isArray(beds) && beds.bedsByWard) {
          beds = Object.values(beds.bedsByWard).flat();
        } else if (!Array.isArray(beds)) {
          beds = [];
        }
        
        const uniqueWards = [...new Set(beds.map(b => b.wardName).filter(Boolean))];
        setWards(uniqueWards);
      } catch (err) {
        console.error('Error fetching wards:', err);
      }
    };
    fetchWards();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AnalyticsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              IPD Analytics Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Insights and trends for inpatient department
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<DownloadIcon />} onClick={handleExport}>
            Export Data
          </Button>
          <Button startIcon={<RefreshIcon />} onClick={fetchAnalyticsData} disabled={loading}>
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Date Range</InputLabel>
              <Select value={dateRange} label="Date Range" onChange={(e) => handleDateRangeChange(e.target.value)}>
                <MenuItem value="7days">Last 7 Days</MenuItem>
                <MenuItem value="30days">Last 30 Days</MenuItem>
                <MenuItem value="90days">Last 90 Days</MenuItem>
                <MenuItem value="1year">Last Year</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {dateRange === 'custom' && (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                    renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={setEndDate}
                    renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                  />
                </LocalizationProvider>
              </Grid>
            </>
          )}

          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Ward</InputLabel>
              <Select value={selectedWard} label="Ward" onChange={(e) => setSelectedWard(e.target.value)}>
                <MenuItem value="all">All Wards</MenuItem>
                {wards.map(ward => (
                  <MenuItem key={ward} value={ward}>{ward}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* KPI Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Admissions
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    {kpiData.totalAdmissions}
                  </Typography>
                  <Chip label={`${kpiData.avgDailyAdmissions}/day`} size="small" sx={{ mt: 1 }} />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Discharges
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {kpiData.totalDischarges}
                  </Typography>
                  <Chip label={`${((kpiData.totalDischarges / kpiData.totalAdmissions) * 100 || 0).toFixed(0)}%`} size="small" sx={{ mt: 1 }} />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Avg Length of Stay
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {kpiData.avgLOS}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    days
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Current Occupancy
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {kpiData.currentOccupancy}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    active patients
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Bed Turnover
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {kpiData.bedTurnoverRate}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    per day
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Occupancy Rate
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    {((kpiData.currentOccupancy / 50) * 100).toFixed(0)}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    of capacity
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3}>
            {/* Occupancy Trends */}
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Daily Admission Trends
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Number of admissions per day (Last 14 days)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={occupancyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="admissions" stroke="#2196f3" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* ALOS by Ward */}
            <Grid item xs={12} lg={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Average Length of Stay by Ward
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Average days patients stay in each ward
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={alosData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ward" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="alos" fill="#4caf50" name="Avg LOS (days)" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Admission Sources */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Admission Sources
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Distribution of patient admission sources
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={admissionSourcesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {admissionSourcesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Discharge Disposition */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Discharge Disposition
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Types of discharge outcomes
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dischargeDispositionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dischargeDispositionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default IPDAnalytics;
