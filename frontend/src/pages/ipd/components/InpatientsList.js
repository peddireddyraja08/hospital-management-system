import React, { useState } from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  LocalHospital as HospitalIcon,
  Warning as WarningIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from '../../../utils/dateUtils';

const InpatientsList = ({ admissions, selectedAdmission, onSelectAdmission, onRefresh, loading }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (admission) => {
    if (admission.priority === 'CRITICAL' || admission.priority === 'EMERGENCY') return 'error';
    if (admission.status === 'PENDING_DISCHARGE') return 'warning';
    if (admission.status === 'ACTIVE') return 'success';
    return 'default';
  };

  const getStatusLabel = (admission) => {
    if (admission.priority === 'CRITICAL') return 'CRITICAL';
    if (admission.priority === 'EMERGENCY') return 'EMERGENCY';
    if (admission.status === 'PENDING_DISCHARGE') return 'Pending D/C';
    return admission.status || 'ACTIVE';
  };

  const filteredAdmissions = admissions.filter(admission => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      admission.patient?.firstName?.toLowerCase().includes(query) ||
      admission.patient?.lastName?.toLowerCase().includes(query) ||
      admission.admissionNumber?.toLowerCase().includes(query) ||
      admission.bed?.bedNumber?.toLowerCase().includes(query) ||
      admission.bed?.wardName?.toLowerCase().includes(query)
    );
  });

  const getAdmissionDuration = (admissionDate) => {
    try {
      return formatDistanceToNow(new Date(admissionDate), { addSuffix: false });
    } catch {
      return 'N/A';
    }
  };

  return (
    <Paper sx={{ height: 'calc(100vh - 350px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            My Inpatients
          </Typography>
          <IconButton size="small" onClick={onRefresh} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Box>
        <TextField
          fullWidth
          size="small"
          placeholder="Search patients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {filteredAdmissions.length} patient(s)
        </Typography>
      </Box>

      {/* Patient List */}
      <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
        {filteredAdmissions.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? 'No patients found' : 'No active admissions'}
            </Typography>
          </Box>
        ) : (
          filteredAdmissions.map((admission) => (
            <React.Fragment key={admission.id}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedAdmission?.id === admission.id}
                  onClick={() => onSelectAdmission(admission)}
                  sx={{
                    py: 1.5,
                    '&.Mui-selected': {
                      bgcolor: 'primary.light',
                      '&:hover': {
                        bgcolor: 'primary.light',
                      },
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        (admission.priority === 'CRITICAL' || admission.priority === 'EMERGENCY') ? (
                          <WarningIcon color="error" fontSize="small" />
                        ) : null
                      }
                    >
                      <Avatar sx={{ bgcolor: getStatusColor(admission) + '.main' }}>
                        {admission.patient?.firstName?.[0]}{admission.patient?.lastName?.[0]}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {admission.patient?.firstName} {admission.patient?.lastName}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                          <Chip
                            label={getStatusLabel(admission)}
                            size="small"
                            color={getStatusColor(admission)}
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                          {admission.bed?.bedNumber && (
                            <Chip
                              icon={<HospitalIcon sx={{ fontSize: 14 }} />}
                              label={`${admission.bed.wardName} - ${admission.bed.bedNumber}`}
                              size="small"
                              variant="outlined"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="caption" display="block" color="text.secondary">
                          <TimeIcon sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.5 }} />
                          {getAdmissionDuration(admission.admissionDate)} in ward
                        </Typography>
                        {admission.chiefComplaint && (
                          <Typography
                            variant="caption"
                            display="block"
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {admission.chiefComplaint}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))
        )}
      </List>
    </Paper>
  );
};

export default InpatientsList;
