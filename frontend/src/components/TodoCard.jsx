import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Menu,
  MenuItem,
  Checkbox
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const TodoCard = ({ todo, onEdit, onDelete, onStatusChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [checked, setChecked] = useState(todo.status === 'done');

  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981'
  };

  const statusColors = {
    todo: '#6b7280',
    'in-progress': '#3b82f6',
    done: '#10b981'
  };

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCheckboxChange = (event) => {
    event.stopPropagation();
    const newStatus = event.target.checked ? 'done' : 'todo';
    setChecked(event.target.checked);
    onStatusChange(todo._id, newStatus);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit(todo);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(todo._id);
  };

  return (
    <Card
      sx={{
        mb: 2,
        borderLeft: `4px solid ${priorityColors[todo.priority] || '#6b7280'}`,
        opacity: todo.status === 'done' ? 0.8 : 1,
        transition: 'all 0.2s'
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="flex-start" gap={2}>
          <Checkbox
            checked={checked}
            onChange={handleCheckboxChange}
            sx={{ 
              mt: -1,
              '&.Mui-checked': {
                color: statusColors.done,
              },
            }}
          />
          <Box flexGrow={1}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 500,
                textDecoration: todo.status === 'done' ? 'line-through' : 'none',
                color: todo.status === 'done' ? '#6b7280' : 'inherit'
              }}
            >
              {todo.title}
            </Typography>
            {todo.description && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mt: 0.5 }}
              >
                {todo.description}
              </Typography>
            )}
            <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={todo.status.replace('-', ' ')}
                size="small"
                sx={{
                  backgroundColor: `${statusColors[todo.status]}20`,
                  color: statusColors[todo.status],
                  fontWeight: 500,
                  textTransform: 'capitalize'
                }}
              />
              <Chip
                icon={<FlagIcon />}
                label={todo.priority}
                size="small"
                sx={{
                  backgroundColor: `${priorityColors[todo.priority]}20`,
                  color: priorityColors[todo.priority],
                  fontWeight: 500,
                  textTransform: 'capitalize'
                }}
              />
              {todo.dueDate && (
                <Chip
                  icon={<CalendarIcon />}
                  label={format(new Date(todo.dueDate), 'MMM dd')}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
          <IconButton 
            size="small" 
            onClick={handleMenuClick}
            sx={{ mt: -1 }}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>
      </CardContent>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: '#ef4444' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default TodoCard;