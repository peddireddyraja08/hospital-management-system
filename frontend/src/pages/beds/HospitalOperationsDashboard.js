import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  LinearProgress,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  CircularProgress,
} from '@mui/material';
import {
  Apartment as FloorIcon,
  MeetingRoom as WardIcon,
  Hotel as BedIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  PersonAdd as AdmitIcon,
  ExitToApp as DischargeIcon,
  SwapHoriz as TransferIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Build as MaintenanceIcon,
  CleaningServices as CleaningIcon,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import PageHeader from '../../components/PageHeader';
import { bedAPI, admissionAPI } from '../../services/api';

const COLORS = {
  available: '#4caf50',
  occupied: '#f44336',
  maintenance: '#9e9e9e',
  cleaning: '#ff9800',
  reserved: '#2196f3',
  blocked: '#424242',
};

export default function HospitalOperationsDashboard() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [dashboardData, setDashboardData] = useState({
    floors: [],
    wards: [],
    beds: [],
    admissions: [],
    summary: {
      totalFloors: 0,
      totalWards: 0,
      totalBeds: 0,
      availableBeds: 0,
      occupiedBeds: 0,
      maintenanceBeds: 0,
      cleaningBeds: 0,
      occupancyRate: 0,
      criticalOccupancy: [],
      recentAdmissions: 0,
      pendingDischarges: 0,
    }
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch beds (required)
      const bedsResponse = await bedAPI.getAll();
      const beds = bedsResponse.data.data || [];
      console.log('Dashboard: Loaded', beds.length, 'beds');

      // Fetch admissions (optional - handle failure gracefully)
      let admissions = [];
      try {
        const admissionsResponse = await admissionAPI.getActive();
        admissions = admissionsResponse.data.data || [];
        console.log('Dashboard: Loaded', admissions.length, 'active admissions');
      } catch (admErr) {
        console.warn('Dashboard: Could not load admissions, continuing without admission data', admErr);
        // Continue without admission data
      }

      // Process data into Floor-Ward-Bed hierarchy
      const floorMap = {};
      const wardMap = {};
      
      beds.forEach(bed => {
        const floorNum = bed.floorNumber || 0;
        const wardName = bed.wardName || 'Unknown';
        const status = bed.status || bed.bedStatus || 'UNKNOWN';

        // Floor level
        if (!floorMap[floorNum]) {
          floorMap[floorNum] = {
            floorNumber: floorNum,
            wards: new Set(),
            totalBeds: 0,
            available: 0,
            occupied: 0,
            maintenance: 0,
            cleaning: 0,
            reserved: 0,
          };
        }
        floorMap[floorNum].wards.add(wardName);
        floorMap[floorNum].totalBeds++;
        if (status === 'AVAILABLE') floorMap[floorNum].available++;
        if (status === 'OCCUPIED') floorMap[floorNum].occupied++;
        if (status === 'UNDER_MAINTENANCE') floorMap[floorNum].maintenance++;
        if (status === 'CLEANING') floorMap[floorNum].cleaning++;
        if (status === 'RESERVED') floorMap[floorNum].reserved++;

        // Ward level
        const wardKey = `${floorNum}-${wardName}`;
        if (!wardMap[wardKey]) {
          wardMap[wardKey] = {
            wardName,
            floorNumber: floorNum,
            totalBeds: 0,
            available: 0,
            occupied: 0,
            maintenance: 0,
            cleaning: 0,
            beds: [],
          };
        }
        wardMap[wardKey].totalBeds++;
        wardMap[wardKey].beds.push(bed);
        if (status === 'AVAILABLE') wardMap[wardKey].available++;
        if (status === 'OCCUPIED') wardMap[wardKey].occupied++;
        if (status === 'UNDER_MAINTENANCE') wardMap[wardKey].maintenance++;
        if (status === 'CLEANING') wardMap[wardKey].cleaning++;
      });

      const floors = Object.values(floorMap).map(floor => ({
        ...floor,
        wards: Array.from(floor.wards),
        occupancyRate: floor.totalBeds > 0 ? ((floor.occupied / floor.totalBeds) * 100).toFixed(1) : 0,
      })).sort((a, b) => b.floorNumber - a.floorNumber);

      const wards = Object.values(wardMap).map(ward => ({
        ...ward,
        occupancyRate: ward.totalBeds > 0 ? ((ward.occupied / ward.totalBeds) * 100).toFixed(1) : 0,
      })).sort((a, b) => parseFloat(b.occupancyRate) - parseFloat(a.occupancyRate));

      // Calculate summary statistics
      const totalBeds = beds.length;
      const availableBeds = beds.filter(b => (b.status || b.bedStatus) === 'AVAILABLE').length;
      const occupiedBeds = beds.filter(b => (b.status || b.bedStatus) === 'OCCUPIED').length;
      const maintenanceBeds = beds.filter(b => (b.status || b.bedStatus) === 'UNDER_MAINTENANCE').length;
      const cleaningBeds = beds.filter(b => (b.status || b.bedStatus) === 'CLEANING').length;
      const occupancyRate = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : 0;
      
      const criticalOccupancy = wards.filter(w => parseFloat(w.occupancyRate) > 85);
      
      const today = new Date().setHours(0, 0, 0, 0);
      const recentAdmissions = admissions.filter(a => 
        new Date(a.admissionDate).setHours(0, 0, 0, 0) === today
      ).length;

      setDashboardData({
        floors,
        wards,
        beds,
        admissions,
        summary: {
          totalFloors: floors.length,
          totalWards: wards.length,
          totalBeds,
          availableBeds,
          occupiedBeds,
          maintenanceBeds,
          cleaningBeds,
          occupancyRate,
          criticalOccupancy,
          recentAdmissions,
          pendingDischarges: admissions.filter(a => a.expectedDischargeDate && 
            new Date(a.expectedDischargeDate) <= new Date()
          ).length,
        }
      });

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getBedStatusData = () => {
    const { availableBeds, occupiedBeds, maintenanceBeds, cleaningBeds } = dashboardData.summary;
    return [
      { name: 'Available', value: availableBeds, color: COLORS.available },
      { name: 'Occupied', value: occupiedBeds, color: COLORS.occupied },
      { name: 'Maintenance', value: maintenanceBeds, color: COLORS.maintenance },
      { name: 'Cleaning', value: cleaningBeds, color: COLORS.cleaning },
    ].filter(item => item.value > 0);
  };

  const getFloorOccupancyData = () => {
    return dashboardData.floors.map(floor => ({
      name: `Floor ${floor.floorNumber}`,
      occupancy: parseFloat(floor.occupancyRate),
      available: floor.available,
      occupied: floor.occupied,
    }));
  };

  const getWardOccupancyData = () => {
    return dashboardData.wards.slice(0, 10).map(ward => ({
      name: ward.wardName,
      occupancy: parseFloat(ward.occupancyRate),
      total: ward.totalBeds,
    }));
  };

  const renderOverviewTab = () => (
    <Box>
      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" color="white" fontWeight="bold">
                    {dashboardData.summary.totalFloors}
                  </Typography>
                  <Typography variant="body2" color="white" sx={{ opacity: 0.9 }}>
                    Total Floors
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.3)', width: 56, height: 56 }}>
                  <FloorIcon sx={{ color: 'white', fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" color="white" fontWeight="bold">
                    {dashboardData.summary.totalWards}
                  </Typography>
                  <Typography variant="body2" color="white" sx={{ opacity: 0.9 }}>
                    Total Wards
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.3)', width: 56, height: 56 }}>
                  <WardIcon sx={{ color: 'white', fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" color="white" fontWeight="bold">
                    {dashboardData.summary.totalBeds}
                  </Typography>
                  <Typography variant="body2" color="white" sx={{ opacity: 0.9 }}>
                    Total Beds
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.3)', width: 56, height: 56 }}>
                  <BedIcon sx={{ color: 'white', fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: dashboardData.summary.occupancyRate > 80 ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' : 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" color="white" fontWeight="bold">
                    {dashboardData.summary.occupancyRate}%
                  </Typography>
                  <Typography variant="body2" color="white" sx={{ opacity: 0.9 }}>
                    Occupancy Rate
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.3)', width: 56, height: 56 }}>
                  <TrendingUpIcon sx={{ color: 'white', fontSize: 32 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts */}
      {dashboardData.summary.criticalOccupancy.length > 0 && (
        <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            High Occupancy Alert
          </Typography>
          <Typography variant="body2">
            {dashboardData.summary.criticalOccupancy.length} ward(s) exceeding 85% capacity: {' '}
            {dashboardData.summary.criticalOccupancy.map(w => w.wardName).join(', ')}
          </Typography>
        </Alert>
      )}

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Bed Status Distribution */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, height: 350 }}>
            <Typography variant="h6" gutterBottom>
              Bed Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={getBedStatusData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getBedStatusData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Floor Occupancy */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2, height: 350 }}>
            <Typography variant="h6" gutterBottom>
              Floor-wise Occupancy
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={getFloorOccupancyData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="occupied" fill={COLORS.occupied} name="Occupied" />
                <Bar dataKey="available" fill={COLORS.available} name="Available" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Ward Occupancy Ranking */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Ward Occupancy Ranking (Top 10)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getWardOccupancyData()} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={150} />
                <RechartsTooltip />
                <Bar dataKey="occupancy" fill="#8884d8">
                  {getWardOccupancyData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.occupancy > 85 ? COLORS.occupied : entry.occupancy > 60 ? COLORS.cleaning : COLORS.available} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Today's Activity */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <AdmitIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">{dashboardData.summary.recentAdmissions}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Admissions Today
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <DischargeIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">{dashboardData.summary.pendingDischarges}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Discharges
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <CheckIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">{dashboardData.summary.availableBeds}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Available Beds
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderFloorViewTab = () => (
    <Grid container spacing={2}>
      {dashboardData.floors.map((floor, index) => (
        <Grid item xs={12} key={index}>
          <Card>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={1}>
                  <Avatar 
                    sx={{ 
                      bgcolor: parseFloat(floor.occupancyRate) > 80 ? 'error.main' : 'primary.main',
                      width: 56, 
                      height: 56,
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      mx: 'auto',
                    }}
                  >
                    {floor.floorNumber}
                  </Avatar>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Typography variant="h6">Floor {floor.floorNumber}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {floor.wards.length} Ward(s)
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">Occupancy</Typography>
                      <Typography variant="body2" fontWeight="bold">{floor.occupancyRate}%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={parseFloat(floor.occupancyRate)} 
                      sx={{ height: 8, borderRadius: 5 }}
                      color={
                        parseFloat(floor.occupancyRate) > 85 ? 'error' :
                        parseFloat(floor.occupancyRate) > 60 ? 'warning' : 'success'
                      }
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <Chip label={`${floor.totalBeds} Total`} size="small" />
                    <Chip label={`${floor.occupied} Occupied`} size="small" color="error" />
                    <Chip label={`${floor.available} Available`} size="small" color="success" />
                    {floor.maintenance > 0 && <Chip label={`${floor.maintenance} Maintenance`} size="small" />}
                  </Box>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {floor.wards.slice(0, 3).map((ward, i) => (
                      <Chip key={i} label={ward} size="small" variant="outlined" />
                    ))}
                    {floor.wards.length > 3 && (
                      <Chip label={`+${floor.wards.length - 3} more`} size="small" />
                    )}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderWardViewTab = () => (
    <Grid container spacing={2}>
      {dashboardData.wards.map((ward, index) => (
        <Grid item xs={12} md={6} lg={4} key={index}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6">{ward.wardName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Floor {ward.floorNumber}
                  </Typography>
                </Box>
                <Chip 
                  label={`${ward.occupancyRate}%`}
                  color={
                    parseFloat(ward.occupancyRate) > 85 ? 'error' :
                    parseFloat(ward.occupancyRate) > 60 ? 'warning' : 'success'
                  }
                  size="small"
                />
              </Box>

              <Divider sx={{ my: 1 }} />

              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {ward.totalBeds}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Beds
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {ward.available}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Available
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="error.main">
                      {ward.occupied}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Occupied
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      {ward.cleaning}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Cleaning
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <LinearProgress 
                variant="determinate" 
                value={parseFloat(ward.occupancyRate)} 
                sx={{ mt: 2, height: 6, borderRadius: 3 }}
                color={
                  parseFloat(ward.occupancyRate) > 85 ? 'error' :
                  parseFloat(ward.occupancyRate) > 60 ? 'warning' : 'success'
                }
              />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1F2937', fontSize: '1.5rem', mb: 0.5 }}>
            Hospital Operations Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.875rem' }}>
            Real-time Floor-Ward-Bed Management and Monitoring
          </Typography>
        </Box>
        <Tooltip title="Refresh Data">
          <IconButton onClick={fetchDashboardData} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && dashboardData.floors.length === 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography>Loading dashboard data...</Typography>
        </Box>
      ) : dashboardData.beds.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No bed data available. Please create beds using the Bed Management page.
        </Alert>
      ) : (
        <>
          <Paper sx={{ mb: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="fullWidth"
            >
              <Tab icon={<TrendingUpIcon />} label="Overview & Analytics" />
              <Tab icon={<FloorIcon />} label="Floor View" />
              <Tab icon={<WardIcon />} label="Ward View" />
            </Tabs>
          </Paper>

          <Box sx={{ mt: 3 }}>
            {activeTab === 0 && renderOverviewTab()}
            {activeTab === 1 && renderFloorViewTab()}
            {activeTab === 2 && renderWardViewTab()}
          </Box>
        </>
      )}
    </Box>
  );
}
