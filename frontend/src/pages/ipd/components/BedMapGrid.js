import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Chip,
  Avatar,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Badge,
} from '@mui/material';
import {
  LocalHospital as HospitalIcon,
  Hotel as BedIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Build as MaintenanceIcon,
  CleaningServices as CleaningIcon,
  Block as BlockIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from '../../../utils/dateUtils';

const BedMapGrid = ({ beds, viewMode, onBedClick, onRefresh }) => {
  const [draggedBed, setDraggedBed] = useState(null);

  const getBedStatusColor = (status) => {
    const colors = {
      AVAILABLE: '#4caf50',      // Green
      OCCUPIED: '#f44336',       // Red
      CLEANING: '#ff9800',       // Orange
      UNDER_MAINTENANCE: '#9e9e9e', // Grey
      RESERVED: '#2196f3',       // Blue
      BLOCKED: '#424242',        // Dark Grey
    };
    return colors[status] || '#bdbdbd';
  };

  const getBedStatusIcon = (status) => {
    const icons = {
      AVAILABLE: <CheckIcon />,
      OCCUPIED: <PersonIcon />,
      CLEANING: <CleaningIcon />,
      UNDER_MAINTENANCE: <MaintenanceIcon />,
      RESERVED: <TimeIcon />,
      BLOCKED: <BlockIcon />,
    };
    return icons[status] || <BedIcon />;
  };

  const getAdmissionDuration = (admission) => {
    if (!admission?.admissionDate) return null;
    try {
      return formatDistanceToNow(new Date(admission.admissionDate), { addSuffix: false });
    } catch {
      return null;
    }
  };

  const handleDragStart = (e, bed) => {
    const status = bed.bedStatus || bed.status;
    if (status === 'OCCUPIED' && bed.currentPatient) {
      setDraggedBed(bed);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('bedId', bed.id.toString());
    }
  };

  const handleDragOver = (e, targetBed) => {
    const targetStatus = targetBed.bedStatus || targetBed.status;
    if (draggedBed && targetStatus === 'AVAILABLE' && targetBed.id !== draggedBed.id) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = (e, targetBed) => {
    e.preventDefault();
    const targetStatus = targetBed.bedStatus || targetBed.status;
    if (draggedBed && targetStatus === 'AVAILABLE') {
      // Trigger transfer confirmation
      if (window.confirm(
        `Transfer patient ${draggedBed.currentPatient?.firstName} ${draggedBed.currentPatient?.lastName}\n` +
        `FROM: ${draggedBed.wardName} - ${draggedBed.bedNumber}\n` +
        `TO: ${targetBed.wardName} - ${targetBed.bedNumber}?`
      )) {
        handleBedTransfer(draggedBed.id, targetBed.id);
      }
    }
    setDraggedBed(null);
  };

  const handleDragEnd = () => {
    setDraggedBed(null);
  };

  const handleBedTransfer = async (fromBedId, toBedId) => {
    try {
      // This would call the transfer API
      // await bedAPI.transferPatient(fromBedId, toBedId);
      alert(`Transfer initiated from bed ${fromBedId} to ${toBedId}`);
      onRefresh();
    } catch (err) {
      console.error('Transfer failed:', err);
      alert('Failed to transfer patient');
    }
  };

  // Group beds by ward
  const bedsByWard = beds.reduce((acc, bed) => {
    const ward = bed.wardName || 'Unknown';
    if (!acc[ward]) acc[ward] = [];
    acc[ward].push(bed);
    return acc;
  }, {});

  if (viewMode === 'list') {
    return (
      <Paper>
        <List>
          {beds.map((bed, index) => (
            <React.Fragment key={bed.id}>
              <ListItem
                button
                onClick={() => onBedClick(bed)}
                sx={{
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: getBedStatusColor(bed.bedStatus),
                      width: 48,
                      height: 48,
                    }}
                  >
                    {getBedStatusIcon(bed.bedStatus)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {bed.wardName} - {bed.bedNumber}
                      </Typography>
                      <Chip
                        label={(bed.bedStatus || bed.status || 'UNKNOWN').replace('_', ' ')}
                        size="small"
                        sx={{
                          bgcolor: getBedStatusColor(bed.bedStatus || bed.status),
                          color: 'white',
                          fontSize: '0.7rem',
                        }}
                      />
                      <Chip
                        label={bed.bedType}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                      {bed.isIsolation && (
                        <Chip
                          label="ISOLATION"
                          size="small"
                          color="warning"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    bed.currentPatient ? (
                      <Box>
                        <Typography variant="body2" component="span">
                          Patient: {bed.currentPatient.firstName} {bed.currentPatient.lastName}
                        </Typography>
                        {bed.currentAdmission && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            Admitted: {getAdmissionDuration(bed.currentAdmission)} ago
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No patient | Daily charge: ₹{bed.dailyCharge || 0}
                      </Typography>
                    )
                  }
                />
              </ListItem>
              {index < beds.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    );
  }

  // Grid view
  return (
    <Box>
      {Object.entries(bedsByWard).map(([ward, wardBeds]) => (
        <Box key={ward} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
            <HospitalIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            {ward}
            <Chip
              label={`${wardBeds.length} beds`}
              size="small"
              sx={{ ml: 2 }}
            />
          </Typography>
          <Grid container spacing={2}>
            {wardBeds.map((bed) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={bed.id}>
                <Card
                  draggable={bed.bedStatus === 'OCCUPIED'}
                  onDragStart={(e) => handleDragStart(e, bed)}
                  onDragOver={(e) => handleDragOver(e, bed)}
                  onDrop={(e) => handleDrop(e, bed)}
                  onDragEnd={handleDragEnd}
                  sx={{
                    height: '100%',
                    cursor: bed.bedStatus === 'OCCUPIED' ? 'grab' : 'pointer',
                    border: 3,
                    borderColor: getBedStatusColor(bed.bedStatus),
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                    opacity: draggedBed?.id === bed.id ? 0.5 : 1,
                  }}
                >
                  <CardActionArea onClick={() => onBedClick(bed)} sx={{ height: '100%' }}>
                    <CardContent>
                      {/* Bed Header */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar
                            sx={{
                              bgcolor: getBedStatusColor(bed.bedStatus),
                              width: 40,
                              height: 40,
                            }}
                          >
                            {getBedStatusIcon(bed.bedStatus)}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              {bed.bedNumber}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {bed.bedType}
                            </Typography>
                          </Box>
                        </Box>
                        {bed.isIsolation && (
                          <Tooltip title="Isolation Bed">
                            <WarningIcon color="warning" />
                          </Tooltip>
                        )}
                      </Box>

                      {/* Status Chip */}
                      <Chip
                        label={(bed.bedStatus || bed.status || 'UNKNOWN').replace('_', ' ')}
                        size="small"
                        sx={{
                          bgcolor: getBedStatusColor(bed.bedStatus || bed.status),
                          color: 'white',
                          fontWeight: 'bold',
                          mb: 2,
                          width: '100%',
                        }}
                      />

                      {/* Patient Info */}
                      {bed.currentPatient ? (
                        <Box>
                          <Typography variant="body2" fontWeight="medium" gutterBottom>
                            {bed.currentPatient.firstName} {bed.currentPatient.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {bed.currentPatient.gender} | Age: {bed.currentPatient.age || 'N/A'}
                          </Typography>
                          {bed.currentAdmission && (
                            <Box sx={{ mt: 1 }}>
                              <Chip
                                icon={<TimeIcon sx={{ fontSize: 16 }} />}
                                label={`${getAdmissionDuration(bed.currentAdmission)} in ward`}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            </Box>
                          )}
                        </Box>
                      ) : (
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Available for admission
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Daily charge: ₹{bed.dailyCharge || 0}
                          </Typography>
                        </Box>
                      )}

                      {/* Additional Info */}
                      {bed.bedStatus === 'UNDER_MAINTENANCE' && (
                        <Typography variant="caption" color="warning.main" display="block" sx={{ mt: 1 }}>
                          Under maintenance
                        </Typography>
                      )}
                      {bed.bedStatus === 'CLEANING' && (
                        <Typography variant="caption" color="info.main" display="block" sx={{ mt: 1 }}>
                          Being cleaned
                        </Typography>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default BedMapGrid;
