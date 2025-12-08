import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { admissionAPI } from '../../../services/api';

const NewTaskDialog = ({ open, onClose, onCreate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [admissions, setAdmissions] = useState([]);
  const [formData, setFormData] = useState({
    admissionId: '',
    taskType: '',
    taskDescription: '',
    priority: 'MEDIUM',
    assignedNurse: '',
    dueDate: new Date(),
    notes: '',
  });

  useEffect(() => {
    if (open) {
      fetchActiveAdmissions();
    }
  }, [open]);

  const fetchActiveAdmissions = async () => {
    try {
      const response = await admissionAPI.getActive();
      setAdmissions(response.data.data || []);
    } catch (err) {
      console.error('Error fetching admissions:', err);
      setError('Failed to load admissions');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.admissionId || !formData.taskType || !formData.taskDescription) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const taskData = {
        admission: { id: formData.admissionId },
        taskType: formData.taskType,
        taskDescription: formData.taskDescription,
        priority: formData.priority,
        assignedToNurse: formData.assignedNurse,
        scheduledTime: formData.dueDate.toISOString(),
        dueTime: formData.dueDate.toISOString(),
        notes: formData.notes,
        status: 'PENDING',
      };
      await onCreate(taskData);
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      admissionId: '',
      taskType: '',
      taskDescription: '',
      priority: 'MEDIUM',
      assignedNurse: '',
      dueDate: new Date(),
      notes: '',
    });
    setError(null);
    onClose();
  };

  const taskTypes = [
    { value: 'MEDICATION_ADMINISTRATION', label: 'Medication Administration' },
    { value: 'VITAL_SIGNS', label: 'Vitals Monitoring' },
    { value: 'INTAKE_OUTPUT', label: 'Intake/Output Recording' },
    { value: 'WOUND_DRESSING', label: 'Wound Dressing' },
    { value: 'NEBULIZATION', label: 'Nebulization' },
    { value: 'TURNING_SCHEDULE', label: 'Turning Schedule (Bedridden)' },
    { value: 'PAIN_ASSESSMENT', label: 'Pain Assessment' },
    { value: 'NURSING_OBSERVATION', label: 'Nursing Observations' },
    { value: 'PROCEDURE_PREPARATION', label: 'Procedure Preparation' },
    { value: 'ASSESSMENT', label: 'General Assessment' },
    { value: 'HYGIENE', label: 'Hygiene Care' },
    { value: 'NUTRITION', label: 'Nutrition/Feeding' },
    { value: 'MOBILITY', label: 'Mobility Assistance' },
    { value: 'DOCUMENTATION', label: 'Documentation' },
    { value: 'OTHER', label: 'Other' },
  ];

  const priorities = [
    { value: 'STAT', label: 'STAT (Immediate)' },
    { value: 'URGENT', label: 'Urgent' },
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'ROUTINE', label: 'Routine' },
    { value: 'LOW', label: 'Low' },
    { value: 'PRN', label: 'PRN (As Needed)' },
  ];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Create New Task</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Admission Selection */}
          <Grid item xs={12}>
            <Autocomplete
              options={admissions}
              getOptionLabel={(option) =>
                `${option.admissionNumber} - ${option.patient?.firstName} ${option.patient?.lastName} (${option.bed?.wardName} - ${option.bed?.bedNumber})`
              }
              value={admissions.find(a => a.id === formData.admissionId) || null}
              onChange={(e, value) => handleChange('admissionId', value?.id || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Patient / Admission *"
                  placeholder="Search by admission number or patient name"
                  required
                />
              )}
            />
          </Grid>

          {/* Task Type */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Task Type</InputLabel>
              <Select
                value={formData.taskType}
                label="Task Type"
                onChange={(e) => handleChange('taskType', e.target.value)}
              >
                {taskTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Priority */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                label="Priority"
                onChange={(e) => handleChange('priority', e.target.value)}
              >
                {priorities.map((priority) => (
                  <MenuItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Task Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Task Description"
              placeholder="Describe the task to be performed..."
              value={formData.taskDescription}
              onChange={(e) => handleChange('taskDescription', e.target.value)}
              multiline
              rows={3}
            />
          </Grid>

          {/* Assigned Nurse */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Assigned Nurse"
              placeholder="Enter nurse name or ID"
              value={formData.assignedNurse}
              onChange={(e) => handleChange('assignedNurse', e.target.value)}
            />
          </Grid>

          {/* Due Date */}
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Due Date *"
                value={formData.dueDate}
                onChange={(value) => handleChange('dueDate', value)}
                renderInput={(params) => <TextField {...params} fullWidth required />}
                minDateTime={new Date()}
              />
            </LocalizationProvider>
          </Grid>

          {/* Notes */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Additional Notes"
              placeholder="Add any additional notes or instructions..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              multiline
              rows={2}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleSubmit}
          disabled={loading}
        >
          Create Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewTaskDialog;
