import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Assignment as TaskIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { nurseTaskAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import TaskColumn from './components/TaskColumn';
import TaskDetailsDialog from './components/TaskDetailsDialog';
import NewTaskDialog from './components/NewTaskDialog';

const NursingTaskBoard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [wardFilter, setWardFilter] = useState('all');

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (user?.role === 'NURSE') {
        response = await nurseTaskAPI.getByAssignedNurse(user.id);
      } else {
        response = await nurseTaskAPI.getAll();
      }

      const taskData = response.data.data || [];
      setTasks(taskData);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setDetailsDialogOpen(true);
  };

  const handleStartTask = async (taskId) => {
    try {
      setError(null);
      await nurseTaskAPI.start(taskId);
      setSuccess('Task started - moved to In Progress');
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start task');
    }
  };

  const handleCompleteTask = async (taskId, notes) => {
    try {
      setError(null);
      const completedBy = user?.username || user?.email || 'Unknown';
      await nurseTaskAPI.complete(taskId, completedBy, notes);
      setSuccess('Task marked as completed');
      fetchTasks();
      setDetailsDialogOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete task');
    }
  };

  const handleMissedTask = async (taskId, reason) => {
    try {
      setError(null);
      const missedBy = user?.username || user?.email || 'Unknown';
      await nurseTaskAPI.markMissed(taskId, missedBy, reason);
      setSuccess('Task marked as missed');
      fetchTasks();
      setDetailsDialogOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark task as missed');
    }
  };

  const handleRefusedTask = async (taskId, reason) => {
    try {
      setError(null);
      await nurseTaskAPI.markRefused(taskId, reason);
      setSuccess('Task marked as refused by patient');
      fetchTasks();
      setDetailsDialogOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark task as refused');
    }
  };

  const handleDeferTask = async (taskId, newDueDate, reason) => {
    try {
      setError(null);
      await nurseTaskAPI.defer(taskId, newDueDate, reason);
      setSuccess('Task deferred successfully');
      fetchTasks();
      setDetailsDialogOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to defer task');
    }
  };

  const handleSkipTask = async (taskId, reason) => {
    try {
      setError(null);
      const skippedBy = user?.username || user?.email || 'Unknown';
      await nurseTaskAPI.skip(taskId, skippedBy, reason);
      setSuccess('Task cancelled successfully');
      fetchTasks();
      setDetailsDialogOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel task');
    }
  };

  const handleNewTask = async (taskData) => {
    try {
      setError(null);
      await nurseTaskAPI.create(taskData);
      setSuccess('Task created successfully');
      fetchTasks();
      setNewTaskDialogOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleDragEnd = async (taskId, newStatus) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      // Update task status
      await nurseTaskAPI.update(taskId, { ...task, status: newStatus });
      setSuccess(`Task moved to ${newStatus}`);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        task.taskDescription?.toLowerCase().includes(query) ||
        task.admission?.patient?.firstName?.toLowerCase().includes(query) ||
        task.admission?.patient?.lastName?.toLowerCase().includes(query) ||
        task.assignedToNurse?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Priority filter
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
      return false;
    }

    // Ward filter
    if (wardFilter !== 'all') {
      const taskWard = task.admission?.bed?.wardName;
      if (taskWard !== wardFilter) return false;
    }

    return true;
  });

  // Categorize tasks
  const now = new Date();
  
  // PENDING tasks (not yet due or due later)
  const pendingTasks = filteredTasks.filter(t => {
    if (t.status !== 'PENDING') return false;
    if (!t.dueTime) return true; // Include tasks without due time
    const dueDate = new Date(t.dueTime);
    const hoursUntilDue = (dueDate - now) / (1000 * 60 * 60);
    return hoursUntilDue > 2; // Due in more than 2 hours
  });

  // DUE tasks (ready to start)
  const dueTasks = filteredTasks.filter(t => {
    if (t.status === 'DUE') return true; // Explicitly DUE status
    if (t.status !== 'PENDING') return false;
    if (!t.dueTime) return false;
    const dueDate = new Date(t.dueTime);
    const hoursUntilDue = (dueDate - now) / (1000 * 60 * 60);
    return hoursUntilDue <= 2 && hoursUntilDue >= 0; // Due within 2 hours
  });

  // OVERDUE tasks (past due time)
  const overdueTasks = filteredTasks.filter(t => {
    if (t.status !== 'PENDING' && t.status !== 'DUE') return false;
    if (!t.dueTime) return false;
    const dueDate = new Date(t.dueTime);
    return dueDate < now; // Past due date
  });

  // IN_PROGRESS tasks (nurse actively working)
  const inProgressTasks = filteredTasks.filter(t => t.status === 'IN_PROGRESS');

  // COMPLETED tasks
  const completedTasks = filteredTasks.filter(t => t.status === 'COMPLETED');

  // Get unique wards for filter
  const wards = [...new Set(tasks.map(t => t.admission?.bed?.wardName).filter(Boolean))];

  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 100px)' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TaskIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Nursing Task Board
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage and track nursing tasks
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setNewTaskDialogOpen(true)}
            >
              New Task
            </Button>
            <IconButton onClick={fetchTasks} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search tasks or patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priorityFilter}
                  label="Priority"
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <MenuItem value="all">All Priorities</MenuItem>
                  <MenuItem value="STAT">STAT (Immediate)</MenuItem>
                  <MenuItem value="URGENT">Urgent</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="ROUTINE">Routine</MenuItem>
                  <MenuItem value="LOW">Low</MenuItem>
                  <MenuItem value="PRN">PRN (As Needed)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Ward</InputLabel>
                <Select
                  value={wardFilter}
                  label="Ward"
                  onChange={(e) => setWardFilter(e.target.value)}
                >
                  <MenuItem value="all">All Wards</MenuItem>
                  {wards.map(ward => (
                    <MenuItem key={ward} value={ward}>{ward}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Total: {filteredTasks.length} tasks
                </Typography>
                <Typography variant="caption" color="warning.main">
                  In Progress: {inProgressTasks.length}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Task Board */}
      {loading && tasks.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={8}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2} sx={{ height: 'calc(100% - 200px)' }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <TaskColumn
              title="Pending"
              tasks={pendingTasks}
              color="#2196f3"
              onTaskClick={handleTaskClick}
              onDragEnd={handleDragEnd}
              status="PENDING"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <TaskColumn
              title="Due Now"
              tasks={dueTasks}
              color="#ff9800"
              onTaskClick={handleTaskClick}
              onDragEnd={handleDragEnd}
              status="DUE"
              urgent
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <TaskColumn
              title="Overdue"
              tasks={overdueTasks}
              color="#f44336"
              onTaskClick={handleTaskClick}
              onDragEnd={handleDragEnd}
              status="OVERDUE"
              critical
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <TaskColumn
              title="In Progress"
              tasks={inProgressTasks}
              color="#fbc02d"
              onTaskClick={handleTaskClick}
              onDragEnd={handleDragEnd}
              status="IN_PROGRESS"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <TaskColumn
              title="Completed"
              tasks={completedTasks}
              color="#4caf50"
              onTaskClick={handleTaskClick}
              onDragEnd={handleDragEnd}
              status="COMPLETED"
            />
          </Grid>
        </Grid>
      )}

      {/* Task Details Dialog */}
      {selectedTask && (
        <TaskDetailsDialog
          task={selectedTask}
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          onStart={handleStartTask}
          onComplete={handleCompleteTask}
          onMissed={handleMissedTask}
          onRefused={handleRefusedTask}
          onDefer={handleDeferTask}
          onSkip={handleSkipTask}
          onRefresh={fetchTasks}
        />
      )}

      {/* New Task Dialog */}
      <NewTaskDialog
        open={newTaskDialogOpen}
        onClose={() => setNewTaskDialogOpen(false)}
        onCreate={handleNewTask}
      />

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NursingTaskBoard;
