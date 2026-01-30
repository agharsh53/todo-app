import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

import {
  Container,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  CircularProgress,
  Fab,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Palette as PaletteIcon,
  Folder as FolderIcon,
  ViewModule as ViewModuleIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import BoardCard from '../components/BoardCard';

const colorOptions = [
  { value: '#6366f1', label: 'Indigo' },
  { value: '#8b5cf6', label: 'Violet' },
  { value: '#10b981', label: 'Emerald' },
  { value: '#f59e0b', label: 'Amber' },
  { value: '#ef4444', label: 'Red' },
  { value: '#3b82f6', label: 'Blue' },
];

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const Dashboard = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [newBoard, setNewBoard] = useState({ 
    title: '', 
    description: '', 
    color: '#6366f1' 
  });
  const [editingBoard, setEditingBoard] = useState(null);
  const { user, logout, getAuthHeader } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: boards, isLoading, error } = useQuery({
    queryKey: ['boards'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_URL}/boards`, {
          headers: getAuthHeader()
        });
        return response.data;
      } catch (err) {
        console.error('Error fetching boards:', err);
        throw err;
      }
    },
    retry: 1
  });

  const createBoardMutation = useMutation({
    mutationFn: (boardData) => 
      axios.post(`${API_URL}/boards`, boardData, {
        headers: getAuthHeader()
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['boards']);
      toast.success('Board created successfully!');
      setOpenDialog(false);
      setNewBoard({ title: '', description: '', color: '#6366f1' });
    },
    onError: (error) => {
      console.error('Create board error:', error);
      toast.error(error.response?.data?.error || 'Failed to create board');
    }
  });

  const updateBoardMutation = useMutation({
    mutationFn: ({ id, ...data }) => 
      axios.put(`${API_URL}/boards/${id}`, data, {
        headers: getAuthHeader()
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['boards']);
      toast.success('Board updated successfully!');
      setOpenDialog(false);
      setEditingBoard(null);
    },
    onError: (error) => {
      console.error('Update board error:', error);
      toast.error(error.response?.data?.error || 'Failed to update board');
    }
  });

  const deleteBoardMutation = useMutation({
    mutationFn: (id) => 
      axios.delete(`${API_URL}/boards/${id}`, {
        headers: getAuthHeader()
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['boards']);
      toast.success('Board deleted successfully!');
    },
    onError: (error) => {
      console.error('Delete board error:', error);
      toast.error(error.response?.data?.error || 'Failed to delete board');
    }
  });

  const handleCreateBoard = () => {
    if (!newBoard.title.trim()) {
      toast.error('Please enter a board title');
      return;
    }
    createBoardMutation.mutate(newBoard);
  };

  const handleUpdateBoard = () => {
    if (!newBoard.title.trim()) {
      toast.error('Please enter a board title');
      return;
    }
    updateBoardMutation.mutate({
      id: editingBoard._id,
      ...newBoard
    });
  };

  const handleDeleteBoard = (id) => {
    if (window.confirm('Are you sure you want to delete this board?')) {
      deleteBoardMutation.mutate(id);
    }
  };

  const handleEditBoard = (board) => {
    setEditingBoard(board);
    setNewBoard({
      title: board.title,
      description: board.description,
      color: board.color
    });
    setOpenDialog(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBoard(null);
    setNewBoard({ title: '', description: '', color: '#6366f1' });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <AppBar 
        position="sticky" 
        elevation={1}
        sx={{ 
          backgroundColor: 'white',
          color: '#334155',
          borderBottom: '1px solid #e5e7eb'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ py: 1 }}>
            <Box display="flex" alignItems="center" gap={2} sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.25rem'
                }}
              >
                T
              </Box>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Todo App
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <IconButton
                size="small"
                sx={{
                  backgroundColor: '#f1f5f9',
                  '&:hover': { backgroundColor: '#e2e8f0' }
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: '#6366f1',
                    fontSize: '0.875rem'
                  }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
              <Button
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                size="small"
                sx={{
                  borderColor: '#e5e7eb',
                  color: '#64748b',
                  '&:hover': {
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.04)'
                  }
                }}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Welcome Section - Smaller */}
        <Box 
          sx={{ 
            mb: 4,
            p: 3,
            borderRadius: 3,
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 600, color: '#1e293b' }}>
                Welcome back, {user?.name || 'User'}!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip 
                  label={`${boards?.length || 0} boards`} 
                  size="small" 
                  sx={{ 
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    fontWeight: 500,
                    fontSize: '0.75rem'
                  }}
                />
                • Ready to organize
              </Typography>
            </Box>
            <DashboardIcon sx={{ fontSize: 40, color: '#cbd5e1' }} />
          </Box>
        </Box>

        {/* Boards Section */}
        <Box mb={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: '#1e293b' }}>
                Your Boards
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create boards to organize your tasks by project, priority, or category
              </Typography>
            </Box>
            <Fab
              color="primary"
              size="medium"
              onClick={() => {
                setEditingBoard(null);
                setNewBoard({ title: '', description: '', color: '#6366f1' });
                setOpenDialog(true);
              }}
              sx={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(99, 102, 241, 0.3)'
                }
              }}
            >
              <AddIcon />
            </Fab>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error.response?.data?.error || 'Failed to load boards. Please try again.'}
            </Alert>
          )}

          {!isLoading && (!boards || boards.length === 0) ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                border: '2px dashed #e5e7eb',
                borderRadius: 3,
                backgroundColor: '#f8fafc'
              }}
            >
              <ViewModuleIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
                No boards yet
              </Typography>
              <Typography variant="body2" color="#64748b" sx={{ mb: 3, maxWidth: 300, mx: 'auto' }}>
                Create your first board to start organizing tasks
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)'
                  }
                }}
              >
                Create First Board
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {boards?.map((board) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={board._id}>
                  <BoardCard 
                    board={board} 
                    onEdit={handleEditBoard}
                    onDelete={handleDeleteBoard}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Stats Section - Reduced Size */}
        {boards && boards.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h3" gutterBottom sx={{ 
              fontWeight: 600, 
              color: '#1e293b', 
              mb: 2.5,
              fontSize: '1.25rem'
            }}>
              Overview
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Card sx={{ 
                  borderRadius: 2, 
                  border: '1px solid #e5e7eb', 
                  boxShadow: 'none',
                  height: '100%',
                  backgroundColor: 'white'
                }}>
                  <CardContent sx={{ p: 1.5 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="body2" color="#64748b" sx={{ 
                          fontWeight: 500, 
                          fontSize: '0.75rem',
                          mb: 0.5 
                        }}>
                          Total Boards
                        </Typography>
                        <Typography variant="h6" component="div" sx={{ 
                          fontWeight: 700, 
                          color: '#1e293b',
                          fontSize: '1.5rem'
                        }}>
                          {boards?.length || 0}
                        </Typography>
                      </Box>
                      <FolderIcon sx={{ 
                        fontSize: 24, 
                        color: '#6366f1', 
                        opacity: 0.8 
                      }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Card sx={{ 
                  borderRadius: 2, 
                  border: '1px solid #e5e7eb', 
                  boxShadow: 'none',
                  height: '100%',
                  backgroundColor: 'white'
                }}>
                  <CardContent sx={{ p: 1.5 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="body2" color="#64748b" sx={{ 
                          fontWeight: 500, 
                          fontSize: '0.75rem',
                          mb: 0.5 
                        }}>
                          Indigo Boards
                        </Typography>
                        <Typography variant="h6" component="div" sx={{ 
                          fontWeight: 700, 
                          color: '#1e293b',
                          fontSize: '1.5rem'
                        }}>
                          {boards?.filter(b => b.color === '#6366f1').length || 0}
                        </Typography>
                      </Box>
                      <DashboardIcon sx={{ 
                        fontSize: 24, 
                        color: '#8b5cf6', 
                        opacity: 0.8 
                      }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Card sx={{ 
                  borderRadius: 2, 
                  border: '1px solid #e5e7eb', 
                  boxShadow: 'none',
                  height: '100%',
                  backgroundColor: 'white'
                }}>
                  <CardContent sx={{ p: 1.5 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="body2" color="#64748b" sx={{ 
                          fontWeight: 500, 
                          fontSize: '0.75rem',
                          mb: 0.5 
                        }}>
                          Color Themes
                        </Typography>
                        <Typography variant="h6" component="div" sx={{ 
                          fontWeight: 700, 
                          color: '#1e293b',
                          fontSize: '1.5rem'
                        }}>
                          {colorOptions.filter(c => boards?.some(b => b.color === c.value)).length || 0}
                        </Typography>
                      </Box>
                      <PaletteIcon sx={{ 
                        fontSize: 24, 
                        color: '#10b981', 
                        opacity: 0.8 
                      }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Card sx={{ 
                  borderRadius: 2, 
                  border: '1px solid #e5e7eb', 
                  boxShadow: 'none',
                  height: '100%',
                  backgroundColor: 'white'
                }}>
                  <CardContent sx={{ p: 1.5 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="body2" color="#64748b" sx={{ 
                          fontWeight: 500, 
                          fontSize: '0.75rem',
                          mb: 0.5 
                        }}>
                          Today
                        </Typography>
                        <Typography variant="h6" component="div" sx={{ 
                          fontWeight: 700, 
                          color: '#1e293b',
                          fontSize: '1.5rem'
                        }}>
                          {new Date().getDate()}
                        </Typography>
                      </Box>
                      <CalendarIcon sx={{ 
                        fontSize: 24, 
                        color: '#f59e0b', 
                        opacity: 0.8 
                      }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Create/Edit Board Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, color: '#1e293b', pb: 1 }}>
            {editingBoard ? 'Edit Board' : 'Create New Board'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <TextField
                autoFocus
                margin="dense"
                label="Board Title"
                type="text"
                fullWidth
                variant="outlined"
                value={newBoard.title}
                onChange={(e) => setNewBoard({...newBoard, title: e.target.value})}
                sx={{ mb: 2 }}
                required
              />
              
              <TextField
                margin="dense"
                label="Description (Optional)"
                type="text"
                fullWidth
                variant="outlined"
                multiline
                rows={2}
                value={newBoard.description}
                onChange={(e) => setNewBoard({...newBoard, description: e.target.value})}
                sx={{ mb: 2 }}
              />
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Color Theme</InputLabel>
                <Select
                  value={newBoard.color}
                  label="Color Theme"
                  onChange={(e) => setNewBoard({...newBoard, color: e.target.value})}
                >
                  {colorOptions.map((color) => (
                    <MenuItem key={color.value} value={color.value}>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '4px',
                            backgroundColor: color.value
                          }}
                        />
                        <Typography variant="body2">{color.label}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Box
                sx={{
                  mt: 1,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: `${newBoard.color}08`,
                  border: `1px solid ${newBoard.color}30`
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Preview: This is how your board will look
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button 
              onClick={handleCloseDialog} 
              color="inherit"
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={editingBoard ? handleUpdateBoard : handleCreateBoard}
              variant="contained"
              disabled={createBoardMutation.isLoading || updateBoardMutation.isLoading}
              sx={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)'
                }
              }}
            >
              {createBoardMutation.isLoading || updateBoardMutation.isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : editingBoard ? 'Update Board' : 'Create Board'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Dashboard;