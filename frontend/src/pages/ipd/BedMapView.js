import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { bedAPI } from '../../services/api';
import BedMapGrid from './components/BedMapGrid';
import BedDetailsDialog from './components/BedDetailsDialog';

const BedMapView = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [beds, setBeds] = useState([]);
  const [selectedBed, setSelectedBed] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  // Filters
  const [filters, setFilters] = useState({
    ward: 'ALL',
    status: 'ALL',
    bedType: 'ALL',
    searchQuery: '',
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    occupied: 0,
    maintenance: 0,
    cleaning: 0,
    blocked: 0,
    occupancyRate: 0,
  });

  useEffect(() => {
    fetchBeds();
    const interval = setInterval(fetchBeds, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchBeds = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bedAPI.getRealtimeBedMap();
      const data = response.data.data || {};
      
      // Extract beds from bedsByWard map or use empty array
      let bedsData = [];
      if (data.bedsByWard) {
        // Flatten bedsByWard object into array
        bedsData = Object.values(data.bedsByWard).flat();
      } else if (Array.isArray(data)) {
        bedsData = data;
      }
      
      // Map backend field names to frontend (status -> bedStatus)
      bedsData = bedsData.map(bed => ({
        ...bed,
        bedStatus: bed.status || bed.bedStatus,
      }));
      
      setBeds(bedsData);
      calculateStats(bedsData);
    } catch (err) {
      console.error('Error fetching beds:', err);
      setError(err.response?.data?.message || 'Failed to load bed map');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (bedsData) => {
    const total = bedsData.length;
    const available = bedsData.filter(b => b.bedStatus === 'AVAILABLE').length;
    const occupied = bedsData.filter(b => b.bedStatus === 'OCCUPIED').length;
    const maintenance = bedsData.filter(b => b.bedStatus === 'UNDER_MAINTENANCE').length;
    const cleaning = bedsData.filter(b => b.bedStatus === 'CLEANING').length;
    const blocked = bedsData.filter(b => b.bedStatus === 'BLOCKED').length;
    const occupancyRate = total > 0 ? ((occupied / total) * 100).toFixed(1) : 0;

    setStats({
      total,
      available,
      occupied,
      maintenance,
      cleaning,
      blocked,
      occupancyRate,
    });
  };

  const handleBedClick = (bed) => {
    setSelectedBed(bed);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedBed(null);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const getFilteredBeds = () => {
    let filtered = beds;

    // Ward filter
    if (filters.ward !== 'ALL') {
      filtered = filtered.filter(bed => bed.wardName === filters.ward);
    }

    // Status filter
    if (filters.status !== 'ALL') {
      filtered = filtered.filter(bed => bed.bedStatus === filters.status);
    }

    // Bed type filter
    if (filters.bedType !== 'ALL') {
      filtered = filtered.filter(bed => bed.bedType === filters.bedType);
    }

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(bed =>
        bed.bedNumber?.toLowerCase().includes(query) ||
        bed.wardName?.toLowerCase().includes(query) ||
        bed.currentPatient?.firstName?.toLowerCase().includes(query) ||
        bed.currentPatient?.lastName?.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const getUniqueWards = () => {
    const wards = [...new Set(beds.map(bed => bed.wardName))];
    return wards.sort();
  };

  const filteredBeds = getFilteredBeds();

  if (loading && beds.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Bed Map
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Real-time bed availability and occupancy
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => newMode && setViewMode(newMode)}
              size="small"
            >
              <ToggleButton value="grid">
                <GridViewIcon />
              </ToggleButton>
              <ToggleButton value="list">
                <ListViewIcon />
              </ToggleButton>
            </ToggleButtonGroup>
            <IconButton onClick={fetchBeds} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Stats Bar */}
        <Grid container spacing={2}>
          <Grid item xs={6} sm={4} md={2}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light' }}>
              <Typography variant="h5" fontWeight="bold">{stats.total}</Typography>
              <Typography variant="caption">Total Beds</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
              <Typography variant="h5" fontWeight="bold">{stats.available}</Typography>
              <Typography variant="caption">Available</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light' }}>
              <Typography variant="h5" fontWeight="bold">{stats.occupied}</Typography>
              <Typography variant="caption">Occupied</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light' }}>
              <Typography variant="h5" fontWeight="bold">{stats.cleaning}</Typography>
              <Typography variant="caption">Cleaning</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.300' }}>
              <Typography variant="h5" fontWeight="bold">{stats.maintenance}</Typography>
              <Typography variant="caption">Maintenance</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light' }}>
              <Typography variant="h5" fontWeight="bold">{stats.occupancyRate}%</Typography>
              <Typography variant="caption">Occupancy</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <FilterIcon />
          <Typography variant="subtitle1" fontWeight="bold">
            Filters
          </Typography>
          <Chip 
            label={`${filteredBeds.length} beds`} 
            size="small" 
            color="primary" 
            sx={{ ml: 1 }}
          />
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search bed or patient..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Ward</InputLabel>
              <Select
                value={filters.ward}
                label="Ward"
                onChange={(e) => handleFilterChange('ward', e.target.value)}
              >
                <MenuItem value="ALL">All Wards</MenuItem>
                {getUniqueWards().map(ward => (
                  <MenuItem key={ward} value={ward}>{ward}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="ALL">All Status</MenuItem>
                <MenuItem value="AVAILABLE">Available</MenuItem>
                <MenuItem value="OCCUPIED">Occupied</MenuItem>
                <MenuItem value="CLEANING">Cleaning</MenuItem>
                <MenuItem value="UNDER_MAINTENANCE">Maintenance</MenuItem>
                <MenuItem value="RESERVED">Reserved</MenuItem>
                <MenuItem value="BLOCKED">Blocked</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Bed Type</InputLabel>
              <Select
                value={filters.bedType}
                label="Bed Type"
                onChange={(e) => handleFilterChange('bedType', e.target.value)}
              >
                <MenuItem value="ALL">All Types</MenuItem>
                <MenuItem value="ICU">ICU</MenuItem>
                <MenuItem value="GENERAL">General</MenuItem>
                <MenuItem value="PRIVATE">Private</MenuItem>
                <MenuItem value="SEMI_PRIVATE">Semi-Private</MenuItem>
                <MenuItem value="ISOLATION">Isolation</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Bed Grid/List */}
      {filteredBeds.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No beds found matching the filters
          </Typography>
        </Paper>
      ) : (
        <BedMapGrid
          beds={filteredBeds}
          viewMode={viewMode}
          onBedClick={handleBedClick}
          onRefresh={fetchBeds}
        />
      )}

      {/* Bed Details Dialog */}
      {selectedBed && (
        <BedDetailsDialog
          bed={selectedBed}
          open={dialogOpen}
          onClose={handleDialogClose}
          onRefresh={fetchBeds}
        />
      )}
    </Box>
  );
};

export default BedMapView;
