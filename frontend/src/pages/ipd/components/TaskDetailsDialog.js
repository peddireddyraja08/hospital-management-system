import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  TextField,
  Grid,
  Avatar,
  IconButton,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CompleteIcon,
  Schedule as DeferIcon,
  Cancel as CancelIcon,
  PlayArrow as StartIcon,
  Block as RefusedIcon,
  EventBusy as MissedIcon,
  Person as PersonIcon,
  LocalHospital as BedIcon,
  Assignment as TaskIcon,
  Notes as NotesIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const TaskDetailsDialog = ({ task, open, onClose, onStart, onComplete, onMissed, onRefused, onDefer, onSkip, onRefresh }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [completionNotes, setCompletionNotes] = useState('');
  const [deferDate, setDeferDate] = useState(null);
  const [deferReason, setDeferReason] = useState('');
  const [skipReason, setSkipReason] = useState('');
  const [missedReason, setMissedReason] = useState('');
  const [refusedReason, setRefusedReason] = useState('');
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [showDeferForm, setShowDeferForm] = useState(false);
  const [showSkipForm, setShowSkipForm] = useState(false);
  const [showMissedForm, setShowMissedForm] = useState(false);
  const [showRefusedForm, setShowRefusedForm] = useState(false);

  if (!task) return null;

  const patient = task.admission?.patient;
  const bed = task.admission?.bed;
  const doctor = task.admission?.doctor;

  const priorityColors = {
    STAT: '#d32f2f',
    URGENT: '#e65100',
    HIGH: '#f57c00',
    MEDIUM: '#fbc02d',
    ROUTINE: '#7cb342',
    LOW: '#388e3c',
    PRN: '#0288d1',
  };

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

  const handleComplete = () => {
    if (onComplete) {
      onComplete(task.id, completionNotes);
    }
  };

  const handleDefer = () => {
    if (onDefer && deferDate) {
      onDefer(task.id, deferDate.toISOString(), deferReason);
    }
  };

  const handleStart = () => {
    if (onStart) {
      onStart(task.id);
      onClose();
    }
  };

  const handleMissed = () => {
    if (onMissed && missedReason) {
      onMissed(task.id, missedReason);
    }
  };

  const handleRefused = () => {
    if (onRefused && refusedReason) {
      onRefused(task.id, refusedReason);
    }
  };

  const handleSkip = () => {
    if (onSkip && skipReason) {
      onSkip(task.id, skipReason);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <TaskIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">Task Details</Typography>
              <Typography variant="caption" color="text.secondary">
                ID: {task.id}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 2 }}>
          <Tab label="Details" icon={<TaskIcon />} iconPosition="start" />
          <Tab label="Actions" icon={<NotesIcon />} iconPosition="start" />
        </Tabs>

        {/* Details Tab */}
        {activeTab === 0 && (
          <Box>
            {/* Task Info */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip
                  label={task.priority}
                  sx={{
                    bgcolor: priorityColors[task.priority] || '#9e9e9e',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
                <Chip
                  label={taskTypeLabels[task.taskType] || task.taskType}
                  variant="outlined"
                />
                <Chip
                  label={task.status}
                  color={task.status === 'COMPLETED' ? 'success' : 'default'}
                />
              </Box>

              <Typography variant="h6" gutterBottom>
                {task.taskDescription}
              </Typography>

              {task.notes && (
                <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1, mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Notes:</strong> {task.notes}
                  </Typography>
                </Box>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Assigned To:</strong>
                  </Typography>
                  <Typography variant="body1">{task.assignedToNurse || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Due Date:</strong>
                  </Typography>
                  <Typography variant="body1">
                    {task.dueTime ? new Date(task.dueTime).toLocaleString('en-US', { 
                      month: 'short', 
                      day: '2-digit', 
                      year: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) : 'N/A'}
                  </Typography>
                </Grid>
                {task.completedAt && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Completed At:</strong>
                      </Typography>
                      <Typography variant="body1">
                        {new Date(task.completedAt).toLocaleString('en-US', { 
                          month: 'short', 
                          day: '2-digit', 
                          year: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Completed By:</strong>
                      </Typography>
                      <Typography variant="body1">{task.completedBy || 'N/A'}</Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Patient Info */}
            {patient && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon /> Patient Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Name:</strong>
                    </Typography>
                    <Typography variant="body1">
                      {patient.firstName} {patient.lastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Patient ID:</strong>
                    </Typography>
                    <Typography variant="body1">{patient.patientId}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Age:</strong>
                    </Typography>
                    <Typography variant="body1">
                      {patient.dateOfBirth
                        ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
                        : 'N/A'}{' '}
                      years
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Gender:</strong>
                    </Typography>
                    <Typography variant="body1">{patient.gender || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Admission Info */}
            {task.admission && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BedIcon /> Admission Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Admission Number:</strong>
                    </Typography>
                    <Typography variant="body1">{task.admission.admissionNumber}</Typography>
                  </Grid>
                  {bed && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Bed Location:</strong>
                      </Typography>
                      <Typography variant="body1">
                        {bed.wardName} - {bed.bedNumber} ({bed.bedType})
                      </Typography>
                    </Grid>
                  )}
                  {doctor && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Attending Doctor:</strong>
                      </Typography>
                      <Typography variant="body1">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Priority:</strong>
                    </Typography>
                    <Chip
                      label={task.admission.priority}
                      size="small"
                      color={task.admission.priority === 'EMERGENCY' ? 'error' : 'default'}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        )}

        {/* Actions Tab */}
        {activeTab === 1 && (
          <Box>
            {task.status === 'COMPLETED' ? (
              <Box>
                <Alert severity="success" sx={{ mb: 2 }}>
                  ✓ This task has been completed.
                </Alert>
                {task.completedTime && (
                  <Box sx={{ p: 2, bgcolor: 'success.lighter', borderRadius: 1, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Completed At:</strong> {new Date(task.completedTime).toLocaleString()}
                    </Typography>
                    {task.completedBy && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Completed By:</strong> {task.completedBy}
                      </Typography>
                    )}
                    {task.completionNotes && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Notes:</strong> {task.completionNotes}
                      </Typography>
                    )}
                  </Box>
                )}
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                  No actions available for completed tasks.
                </Typography>
              </Box>
            ) : task.status === 'MISSED' ? (
              <Box>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  ⚠ This task was missed.
                </Alert>
                {task.missedReason && (
                  <Box sx={{ p: 2, bgcolor: 'warning.lighter', borderRadius: 1, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Reason:</strong> {task.missedReason}
                    </Typography>
                  </Box>
                )}
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                  No actions available for missed tasks.
                </Typography>
              </Box>
            ) : task.status === 'REFUSED' ? (
              <Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  ⓘ This task was refused by the patient.
                </Alert>
                {task.refusedReason && (
                  <Box sx={{ p: 2, bgcolor: 'info.lighter', borderRadius: 1, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Patient's Reason:</strong> {task.refusedReason}
                    </Typography>
                  </Box>
                )}
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                  No actions available for refused tasks.
                </Typography>
              </Box>
            ) : task.status === 'CANCELLED' ? (
              <Box>
                <Alert severity="error" sx={{ mb: 2 }}>
                  ✕ This task has been cancelled.
                </Alert>
                {task.skipReason && (
                  <Box sx={{ p: 2, bgcolor: 'error.lighter', borderRadius: 1, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Reason:</strong> {task.skipReason}
                    </Typography>
                  </Box>
                )}
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                  No actions available for cancelled tasks.
                </Typography>
              </Box>
            ) : task.status === 'DEFERRED' ? (
              <Box>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  🕐 This task has been deferred.
                </Alert>
                {task.dueTime && (
                  <Box sx={{ p: 2, bgcolor: 'warning.lighter', borderRadius: 1, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>New Due Time:</strong> {new Date(task.dueTime).toLocaleString()}
                    </Typography>
                  </Box>
                )}
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                  Task will return to PENDING when the new time arrives.
                </Typography>
              </Box>
            ) : (
              <>
                {/* Start Task Button (for PENDING/DUE tasks) */}
                {(task.status === 'PENDING' || task.status === 'DUE') && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<StartIcon />}
                    onClick={handleStart}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    Start Task (Move to In Progress)
                  </Button>
                )}

                {/* Complete Task Form */}
                {showCompleteForm ? (
                  <Box sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Mark Task as Complete
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Completion Notes (Optional)"
                      placeholder="Add any notes about completing this task..."
                      value={completionNotes}
                      onChange={(e) => setCompletionNotes(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CompleteIcon />}
                        onClick={handleComplete}
                      >
                        Complete Task
                      </Button>
                      <Button variant="outlined" onClick={() => setShowCompleteForm(false)}>
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CompleteIcon />}
                    onClick={() => setShowCompleteForm(true)}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    Mark as Complete
                  </Button>
                )}

                {/* Defer Task Form */}
                {showDeferForm ? (
                  <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Defer Task
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        label="New Due Date"
                        value={deferDate}
                        onChange={setDeferDate}
                        renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
                        minDateTime={new Date()}
                      />
                    </LocalizationProvider>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Reason for Deferral"
                      placeholder="Explain why this task needs to be deferred..."
                      value={deferReason}
                      onChange={(e) => setDeferReason(e.target.value)}
                      required
                      sx={{ mb: 2, mt: 2 }}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        color="warning"
                        startIcon={<DeferIcon />}
                        onClick={handleDefer}
                        disabled={!deferDate || !deferReason}
                      >
                        Defer Task
                      </Button>
                      <Button variant="outlined" onClick={() => setShowDeferForm(false)}>
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<DeferIcon />}
                    onClick={() => setShowDeferForm(true)}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    Defer Task
                  </Button>
                )}

                {/* Missed Task Form */}
                {showMissedForm ? (
                  <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1, mb: 2 }}>
                    <Typography variant="h6" gutterBottom color="warning.main">
                      Mark Task as Missed
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Reason for Missing Task"
                      placeholder="Explain why this task was missed..."
                      value={missedReason}
                      onChange={(e) => setMissedReason(e.target.value)}
                      required
                      sx={{ mb: 2 }}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        color="warning"
                        startIcon={<MissedIcon />}
                        onClick={handleMissed}
                        disabled={!missedReason}
                      >
                        Mark as Missed
                      </Button>
                      <Button variant="outlined" onClick={() => setShowMissedForm(false)}>
                        Close
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<MissedIcon />}
                    onClick={() => setShowMissedForm(true)}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    Mark as Missed
                  </Button>
                )}

                {/* Refused Task Form */}
                {showRefusedForm ? (
                  <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1, mb: 2 }}>
                    <Typography variant="h6" gutterBottom color="info.main">
                      Mark Task as Refused
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Reason for Patient Refusal"
                      placeholder="Document why the patient refused..."
                      value={refusedReason}
                      onChange={(e) => setRefusedReason(e.target.value)}
                      required
                      sx={{ mb: 2 }}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        color="info"
                        startIcon={<RefusedIcon />}
                        onClick={handleRefused}
                        disabled={!refusedReason}
                      >
                        Mark as Refused
                      </Button>
                      <Button variant="outlined" onClick={() => setShowRefusedForm(false)}>
                        Close
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    color="info"
                    startIcon={<RefusedIcon />}
                    onClick={() => setShowRefusedForm(true)}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    Patient Refused
                  </Button>
                )}

                {/* Skip/Cancel Task Form */}
                {showSkipForm ? (
                  <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Cancel Task
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Reason for Cancellation"
                      placeholder="Explain why this task is being cancelled..."
                      value={skipReason}
                      onChange={(e) => setSkipReason(e.target.value)}
                      required
                      sx={{ mb: 2 }}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={handleSkip}
                        disabled={!skipReason}
                      >
                        Cancel Task
                      </Button>
                      <Button variant="outlined" onClick={() => setShowSkipForm(false)}>
                        Close
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => setShowSkipForm(true)}
                    fullWidth
                  >
                    Cancel Task
                  </Button>
                )}
              </>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDetailsDialog;
