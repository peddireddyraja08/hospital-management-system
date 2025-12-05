import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const PageHeader = ({ title, subtitle, action, actionLabel, actionIcon }) => {
  return (
    <Box 
      sx={{ 
        mb: 4,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 2
      }}
    >
      <Box>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            color: '#1F2937',
            fontSize: '1.5rem',
            mb: 0.5
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.875rem' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && (
        <Button
          variant="contained"
          startIcon={actionIcon}
          onClick={action}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1,
            bgcolor: '#1565C0',
            '&:hover': {
              bgcolor: '#0D47A1',
            },
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default PageHeader;
