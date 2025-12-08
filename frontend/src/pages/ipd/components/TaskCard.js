import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Avatar,
  Tooltip,
  Collapse,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircle as CheckIcon,
  Schedule as DeferIcon,
  Person as PersonIcon,
  LocalHospital as BedIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const TaskCard = ({ task, onClick, onDragStart, onDragEnd }) => {
  const [expanded, setExpanded] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('taskId', task.id);
    if (onDragStart) onDragStart(task.id);
  };

  const handleDragEnd = (e) => {
    if (onDragEnd) onDragEnd();
  };

  // Calculate urgency
  const dueDate = task.dueTime ? new Date(task.dueTime) : null;
  const now = new Date();
  const isOverdue = dueDate && dueDate < now;
  const hoursUntilDue = dueDate ? (dueDate - now) / (1000 * 60 * 60) : null;
  const isDueSoon = hoursUntilDue !== null && hoursUntilDue <= 2 && hoursUntilDue >= 0;

  // Priority colors
  const priorityColors = {
    STAT: '#d32f2f',
    URGENT: '#e65100',
    HIGH: '#f57c00',
    MEDIUM: '#fbc02d',
    ROUTINE: '#7cb342',
    LOW: '#388e3c',
    PRN: '#0288d1',
  };

  // Task type icons
  const taskTypeLabels = {
    MEDICATION_ADMINISTRATION: 'Medication Administration',
    VITAL_SIGNS: 'Vitals Monitoring',
    INTAKE_OUTPUT: 'Intake/Output Recording',
    WOUND_DRESSING: 'Wound Dressing',
    NEBULIZATION: 'Nebulization',
    TURNING_SCHEDULE: 'Turning Schedule (Bedridden)',
    PAIN_ASSESSMENT: 'Pain Assessment',
    NURSING_OBSERVATION: 'Nursing Observations',
    PROCEDURE_PREPARATION: 'Procedure Preparation',
    ASSESSMENT: 'General Assessment',
    HYGIENE: 'Hygiene Care',
    NUTRITION: 'Nutrition/Feeding',
    MOBILITY: 'Mobility Assistance',
    DOCUMENTATION: 'Documentation',
    OTHER: 'Other',
  };

  const patient = task.admission?.patient;
  const bed = task.admission?.bed;

  return (
    <Card
      draggable={task.status !== 'COMPLETED'}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sx={{
        cursor: task.status !== 'COMPLETED' ? 'grab' : 'default',
        '&:active': {
          cursor: task.status !== 'COMPLETED' ? 'grabbing' : 'default',
        },
        borderLeft: `4px solid ${task.status === 'IN_PROGRESS' ? '#fbc02d' : priorityColors[task.priority] || '#9e9e9e'}`,
        mb: 1.5,
        '&:hover': {
          boxShadow: 3,
        },
        opacity: task.status === 'COMPLETED' ? 0.7 : 1,
        bgcolor: task.status === 'IN_PROGRESS' ? 'rgba(251, 192, 45, 0.05)' : 'background.paper',
        transition: 'all 0.3s ease',
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        {/* Priority and Status Chips */}
        <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
          <Chip
            label={task.priority}
            size="small"
            sx={{
              bgcolor: priorityColors[task.priority] || '#9e9e9e',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.7rem',
            }}
          />
          {task.status === 'IN_PROGRESS' && (
            <Chip
              label="IN PROGRESS"
              size="small"
              sx={{ 
                bgcolor: '#fbc02d',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.7rem',
                animation: 'pulse 2s infinite'
              }}
            />
          )}
          {isOverdue && task.status !== 'IN_PROGRESS' && (
            <Chip
              label="OVERDUE"
              size="small"
              icon={<WarningIcon />}
              color="error"
              sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
            />
          )}
          {isDueSoon && !isOverdue && task.status !== 'IN_PROGRESS' && (
            <Chip
              label="DUE SOON"
              size="small"
              color="warning"
              sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
            />
          )}
          <Chip
            label={taskTypeLabels[task.taskType] || task.taskType}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.7rem' }}
          />
        </Box>

        {/* Task Description */}
        <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
          {task.taskDescription}
        </Typography>

        {/* Patient Info */}
        {patient && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
              <PersonIcon sx={{ fontSize: 16 }} />
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              {patient.firstName} {patient.lastName}
            </Typography>
          </Box>
        )}

        {/* Bed Info */}
        {bed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <BedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {bed.wardName} - {bed.bedNumber}
            </Typography>
          </Box>
        )}

        {/* Due Date */}
        {dueDate && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Due:
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: isOverdue ? 'error.main' : isDueSoon ? 'warning.main' : 'text.secondary',
                fontWeight: isOverdue || isDueSoon ? 'bold' : 'normal',
              }}
            >
              {dueDate.toLocaleString('en-US', { 
                month: 'short', 
                day: '2-digit', 
                year: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Typography>
          </Box>
        )}

        {/* Assigned Nurse */}
        {task.assignedNurse && (
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
            Assigned: {task.assignedNurse}
          </Typography>
        )}

        {/* Expanded Details */}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            {task.notes && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" fontWeight="bold" display="block">
                  Notes:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {task.notes}
                </Typography>
              </Box>
            )}
            {task.completedAt && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" fontWeight="bold" display="block">
                  Completed:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(task.completedAt).toLocaleString('en-US', { 
                    month: 'short', 
                    day: '2-digit', 
                    year: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Typography>
              </Box>
            )}
            {task.completedBy && (
              <Box>
                <Typography variant="caption" fontWeight="bold" display="block">
                  Completed By:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {task.completedBy}
                </Typography>
              </Box>
            )}
          </Box>
        </Collapse>
      </CardContent>

      <CardActions sx={{ pt: 0, pb: 1, px: 2, justifyContent: 'space-between' }}>
        <Box>
          <Tooltip title="View Details">
            <IconButton size="small" onClick={() => onClick(task)}>
              <CheckIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default TaskCard;
