import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Badge,
} from '@mui/material';
import TaskCard from './TaskCard';

const TaskColumn = ({ title, tasks, color, onTaskClick, onDragEnd, status, urgent, critical }) => {
  const [draggedOver, setDraggedOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggedOver(true);
  };

  const handleDragLeave = (e) => {
    setDraggedOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDraggedOver(false);
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId && onDragEnd) {
      onDragEnd(parseInt(taskId), status);
    }
  };

  return (
    <Paper
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: draggedOver ? 'action.hover' : 'background.paper',
        border: draggedOver ? 2 : 0,
        borderColor: draggedOver ? color : 'transparent',
        transition: 'all 0.2s',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: color,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
        <Badge
          badgeContent={tasks.length}
          color="default"
          sx={{
            '& .MuiBadge-badge': {
              bgcolor: 'white',
              color: color,
              fontWeight: 'bold',
            },
          }}
        />
      </Box>

      {/* Column Content */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          minHeight: 300,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'background.default',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'divider',
            borderRadius: '4px',
            '&:hover': {
              bgcolor: 'text.secondary',
            },
          },
        }}
      >
        {tasks.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'text.disabled',
            }}
          >
            <Typography variant="body2">No tasks</Typography>
          </Box>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={onTaskClick}
              onDragStart={() => {}}
              onDragEnd={() => {}}
            />
          ))
        )}
      </Box>
    </Paper>
  );
};

export default TaskColumn;
