import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Container,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Paper,
  Breadcrumbs,
  Link,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Home as HomeIcon,
  Folder as FolderIcon,
  Menu as MenuIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import TodoCard from '../components/TodoCard';

const BoardDetail = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { getAuthHeader, user, logout } = useAuth();
  const queryClient = useQueryClient();
  
  const [openTodoDialog, setOpenTodoDialog] = useState(false);
  const [openEditBoardDialog, setOpenEditBoardDialog] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: ''
  });
  const [editingTodo, setEditingTodo] = useState(null);
  const [editBoardData, setEditBoardData] = useState({
    title: '',
    description: '',
    color: '#6366f1'
  });

  // Fetch board details
  const { data: board, isLoading: boardLoading } = useQuery({
    queryKey: ['board', boardId],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:5000/api/boards/${boardId}`, {
        headers: getAuthHeader()
      });
      return response.data;
    }
  });

  // Fetch todos for this board
  const { data: todos, isLoading: todosLoading, error } = useQuery({
    queryKey: ['todos', boardId],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:5000/api/todos/board/${boardId}`, {
        headers: getAuthHeader()
      });
      return response.data;
    }
  });

  // Create todo mutation
  const createTodoMutation = useMutation({
    mutationFn: (todoData) =>
      axios.post('http://localhost:5000/api/todos', {
        ...todoData,
        boardId
      }, {
        headers: getAuthHeader()
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['todos', boardId]);
      toast.success('Todo created successfully!');
      setOpenTodoDialog(false);
      setNewTodo({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: ''
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create todo');
    }
  });

  // Update todo mutation
  const updateTodoMutation = useMutation({
    mutationFn: ({ id, ...data }) =>
      axios.put(`http://localhost:5000/api/todos/${id}`, data, {
        headers: getAuthHeader()
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['todos', boardId]);
      toast.success('Todo updated successfully!');
      setOpenTodoDialog(false);
      setEditingTodo(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update todo');
    }
  });

  // Update todo status mutation
  const updateTodoStatusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      axios.patch(`http://localhost:5000/api/todos/${id}/status`, { status }, {
        headers: getAuthHeader()
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['todos', boardId]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update status');
    }
  });

  // Delete todo mutation
  const deleteTodoMutation = useMutation({
    mutationFn: (id) =>
      axios.delete(`http://localhost:5000/api/todos/${id}`, {
        headers: getAuthHeader()
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['todos', boardId]);
      toast.success('Todo deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete todo');
    }
  });

  // Update board mutation
  const updateBoardMutation = useMutation({
    mutationFn: (data) =>
      axios.put(`http://localhost:5000/api/boards/${boardId}`, data, {
        headers: getAuthHeader()
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['board', boardId]);
      queryClient.invalidateQueries(['boards']);
      toast.success('Board updated successfully!');
      setOpenEditBoardDialog(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update board');
    }
  });

  // Delete board mutation
  const deleteBoardMutation = useMutation({
    mutationFn: () =>
      axios.delete(`http://localhost:5000/api/boards/${boardId}`, {
        headers: getAuthHeader()
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['boards']);
      toast.success('Board deleted successfully!');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete board');
    }
  });

  const handleCreateTodo = () => {
    if (!newTodo.title.trim()) {
      toast.error('Please enter a todo title');
      return;
    }
    createTodoMutation.mutate(newTodo);
  };

  const handleUpdateTodo = () => {
    if (!newTodo.title.trim()) {
      toast.error('Please enter a todo title');
      return;
    }
    updateTodoMutation.mutate({
      id: editingTodo._id,
      ...newTodo
    });
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setNewTodo({
      title: todo.title,
      description: todo.description || '',
      status: todo.status,
      priority: todo.priority,
      dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : ''
    });
    setOpenTodoDialog(true);
  };

  const handleDeleteTodo = (id) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      deleteTodoMutation.mutate(id);
    }
  };

  const handleStatusChange = (todoId, newStatus) => {
    updateTodoStatusMutation.mutate({ id: todoId, status: newStatus });
  };

  const handleEditBoard = () => {
    setEditBoardData({
      title: board.title,
      description: board.description || '',
      color: board.color
    });
    setOpenEditBoardDialog(true);
  };

  const handleUpdateBoard = () => {
    if (!editBoardData.title.trim()) {
      toast.error('Please enter a board title');
      return;
    }
    updateBoardMutation.mutate(editBoardData);
  };

  const handleDeleteBoard = () => {
    if (window.confirm('Are you sure you want to delete this board and all its todos?')) {
      deleteBoardMutation.mutate();
    }
  };

  const handleCloseTodoDialog = () => {
    setOpenTodoDialog(false);
    setEditingTodo(null);
    setNewTodo({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: ''
    });
  };

  const handleCloseEditBoardDialog = () => {
    setOpenEditBoardDialog(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const statusCounts = {
    todo: todos?.filter(todo => todo.status === 'todo').length || 0,
    'in-progress': todos?.filter(todo => todo.status === 'in-progress').length || 0,
    done: todos?.filter(todo => todo.status === 'done').length || 0
  };

  if (boardLoading || todosLoading) {
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
              <IconButton
                onClick={() => navigate('/dashboard')}
                sx={{
                  backgroundColor: '#f1f5f9',
                  '&:hover': { backgroundColor: '#e2e8f0' }
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 20, color: '#64748b' }} />
              </IconButton>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1rem'
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
                startIcon={<DeleteIcon />}
                onClick={handleLogout}
                size="small"
                sx={{
                  borderColor: '#e5e7eb',
                  color: '#64748b',
                  '&:hover': {
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.04)'
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
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Board Header */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
                {board?.title}
              </Typography>
              {board?.description && (
                <Typography variant="body1" color="#64748b" sx={{ maxWidth: 600 }}>
                  {board.description}
                </Typography>
              )}
            </Box>
            
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEditBoard}
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
                Edit Board
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenTodoDialog(true)}
                size="small"
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
                Add Todo
              </Button>
            </Box>
          </Box>

          {/* Status Overview Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={4}>
              <Card sx={{ 
                borderRadius: 2, 
                border: '1px solid #e5e7eb', 
                boxShadow: 'none',
                backgroundColor: '#f8fafc'
              }}>
                <CardContent sx={{ p: 2 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        {statusCounts.todo}
                      </Typography>
                      <Typography variant="body2" color="#64748b">
                        To Do
                      </Typography>
                    </Box>
                    <RadioButtonUncheckedIcon sx={{ color: '#6b7280', fontSize: 28 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={4}>
              <Card sx={{ 
                borderRadius: 2, 
                border: '1px solid #3b82f630', 
                boxShadow: 'none',
                backgroundColor: '#eff6ff'
              }}>
                <CardContent sx={{ p: 2 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        {statusCounts['in-progress']}
                      </Typography>
                      <Typography variant="body2" color="#64748b">
                        In Progress
                      </Typography>
                    </Box>
                    <PendingIcon sx={{ color: '#3b82f6', fontSize: 28 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={4}>
              <Card sx={{ 
                borderRadius: 2, 
                border: '1px solid #10b98130', 
                boxShadow: 'none',
                backgroundColor: '#f0fdf4'
              }}>
                <CardContent sx={{ p: 2 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        {statusCounts.done}
                      </Typography>
                      <Typography variant="body2" color="#64748b">
                        Done
                      </Typography>
                    </Box>
                    <CheckCircleIcon sx={{ color: '#10b981', fontSize: 28 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error.response?.data?.error || 'Failed to load todos'}
          </Alert>
        )}

        {/* Todos Section */}
        <Box sx={{ mb: 6 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: '#1e293b' }}>
              Todos ({todos?.length || 0})
            </Typography>
            <Button
              color="error"
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteBoard}
              size="small"
              sx={{
                borderColor: '#fecaca',
                color: '#dc2626',
                '&:hover': {
                  borderColor: '#fca5a5',
                  backgroundColor: 'rgba(239, 68, 68, 0.04)'
                }
              }}
            >
              Delete Board
            </Button>
          </Box>

          {!todosLoading && (!todos || todos.length === 0) ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                border: '2px dashed #e5e7eb',
                borderRadius: 3,
                backgroundColor: 'white'
              }}
            >
              <AddIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
                No todos yet
              </Typography>
              <Typography variant="body2" color="#64748b" sx={{ mb: 3, maxWidth: 300, mx: 'auto' }}>
                Add your first todo to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenTodoDialog(true)}
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
                Create First Todo
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {todos?.map((todo) => (
                <Grid item xs={12} key={todo._id}>
                  <TodoCard
                    todo={todo}
                    onEdit={handleEditTodo}
                    onDelete={handleDeleteTodo}
                    onStatusChange={handleStatusChange}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Create/Edit Todo Dialog */}
        <Dialog
          open={openTodoDialog}
          onClose={handleCloseTodoDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, color: '#1e293b', pb: 1 }}>
            {editingTodo ? 'Edit Todo' : 'Create New Todo'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <TextField
                autoFocus
                margin="dense"
                label="Todo Title"
                type="text"
                fullWidth
                variant="outlined"
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
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
                value={newTodo.description}
                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                sx={{ mb: 2 }}
              />
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={newTodo.status}
                      label="Status"
                      onChange={(e) => setNewTodo({ ...newTodo, status: e.target.value })}
                    >
                      <MenuItem value="todo">To Do</MenuItem>
                      <MenuItem value="in-progress">In Progress</MenuItem>
                      <MenuItem value="done">Done</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={newTodo.priority}
                      label="Priority"
                      onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value })}
                      startAdornment={
                        <FlagIcon 
                          sx={{ 
                            mr: 1, 
                            color: newTodo.priority === 'high' ? '#ef4444' : 
                                   newTodo.priority === 'medium' ? '#f59e0b' : '#10b981',
                            fontSize: 18 
                          }} 
                        />
                      }
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              <TextField
                margin="dense"
                label="Due Date (Optional)"
                type="date"
                fullWidth
                variant="outlined"
                size="small"
                value={newTodo.dueDate}
                onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <CalendarIcon sx={{ mr: 1, color: '#94a3b8', fontSize: 18 }} />
                  ),
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button 
              onClick={handleCloseTodoDialog} 
              color="inherit"
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={editingTodo ? handleUpdateTodo : handleCreateTodo}
              variant="contained"
              disabled={createTodoMutation.isLoading || updateTodoMutation.isLoading}
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
              {createTodoMutation.isLoading || updateTodoMutation.isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : editingTodo ? 'Update Todo' : 'Create Todo'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Board Dialog */}
        <Dialog
          open={openEditBoardDialog}
          onClose={handleCloseEditBoardDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, color: '#1e293b', pb: 1 }}>
            Edit Board
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
                value={editBoardData.title}
                onChange={(e) => setEditBoardData({ ...editBoardData, title: e.target.value })}
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
                value={editBoardData.description}
                onChange={(e) => setEditBoardData({ ...editBoardData, description: e.target.value })}
                sx={{ mb: 2 }}
              />
              
              <FormControl fullWidth sx={{ mb: 2 }} size="small">
                <InputLabel>Color Theme</InputLabel>
                <Select
                  value={editBoardData.color}
                  label="Color Theme"
                  onChange={(e) => setEditBoardData({ ...editBoardData, color: e.target.value })}
                >
                  <MenuItem value="#6366f1">Indigo</MenuItem>
                  <MenuItem value="#8b5cf6">Violet</MenuItem>
                  <MenuItem value="#10b981">Emerald</MenuItem>
                  <MenuItem value="#f59e0b">Amber</MenuItem>
                  <MenuItem value="#ef4444">Red</MenuItem>
                  <MenuItem value="#3b82f6">Blue</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button 
              onClick={handleCloseEditBoardDialog} 
              color="inherit"
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateBoard}
              variant="contained"
              disabled={updateBoardMutation.isLoading}
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
              {updateBoardMutation.isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : 'Update Board'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default BoardDetail;