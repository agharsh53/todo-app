import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    const success = await login(email, password);
    if (success) {
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left Side - Gradient Background with Content */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 4
        }}
      >
        <Box sx={{ maxWidth: 420, width: '100%' }}>
          <Typography 
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: '2.5rem',
              mb: 1,
              lineHeight: 1.2
            }}
          >
            Todo-App
          </Typography>
          
          <Typography 
            variant="h5"
            sx={{
              fontWeight: 400,
              fontSize: '1.25rem',
              mb: 4,
              opacity: 0.9
            }}
          >
            Your productivity companion
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h4"
              sx={{
                fontWeight: 600,
                fontSize: '1.5rem',
                mb: 2
              }}
            >
              Manage your tasks with ease
            </Typography>
            
            <Typography 
              variant="body1"
              sx={{
                fontSize: '1rem',
                mb: 3,
                opacity: 0.9,
                lineHeight: 1.5
              }}
            >
              Create boards, organize todos, and boost your productivity with our intuitive task management app.
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                'Create unlimited boards',
                'Organize tasks with priorities',
                'Track progress effortlessly',
                'Beautiful, intuitive interface'
              ].map((feature, index) => (
                <Box key={index} display="flex" alignItems="center" gap={1.5}>
                  <CheckCircleIcon 
                    sx={{ 
                      fontSize: 20,
                      color: 'white',
                      opacity: 0.9
                    }} 
                  />
                  <Typography 
                    variant="body1"
                    sx={{
                      fontSize: '1rem',
                      opacity: 0.9
                    }}
                  >
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
          
          <Typography 
            variant="body2"
            sx={{
              opacity: 0.7,
              mt: 4
            }}
          >
            © 2026 Todo-App. All rights reserved.
          </Typography>
        </Box>
      </Box>

      {/* Right Side - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          p: { xs: 2, md: 4 }
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ maxWidth: 380, width: '100%', mx: 'auto' }}>
            <Box textAlign="center" mb={3}>
              <Typography 
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: '#1e293b',
                  mb: 0.5
                }}
              >
                Welcome back
              </Typography>
              <Typography variant="body1" color="#64748b" sx={{ fontSize: '0.9rem' }}>
                Enter your credentials to access your boards
              </Typography>
            </Box>

            {user && (
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2, fontSize: '0.875rem' }}>
                You are already logged in. Redirecting to dashboard...
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 2 }}>
                <Typography 
                  variant="subtitle1"
                  sx={{ 
                    color: '#475569',
                    mb: 0.5,
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}
                >
                  Email
                </Typography>
                <TextField
                  fullWidth
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  size="small"
                  InputProps={{
                    sx: {
                      borderRadius: 1.5,
                      fontSize: '0.9rem',
                      backgroundColor: '#f8fafc',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e5e7eb'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#cbd5e1'
                      }
                    }
                  }}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography 
                  variant="subtitle1"
                  sx={{ 
                    color: '#475569',
                    mb: 0.5,
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}
                >
                  Password
                </Typography>
                <TextField
                  fullWidth
                  placeholder="********"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                          sx={{ color: '#94a3b8' }}
                          disabled={loading}
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 1.5,
                      fontSize: '0.9rem',
                      backgroundColor: '#f8fafc',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e5e7eb'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#cbd5e1'
                      }
                    }
                  }}
                />
              </Box>

              <Box sx={{ 
                mb: 3, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      size="small"
                      sx={{ 
                        color: '#6366f1',
                        '&.Mui-checked': {
                          color: '#6366f1',
                        }
                      }}
                      disabled={loading}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                      Remember me
                    </Typography>
                  }
                />
                <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#6366f1',
                      fontWeight: 500,
                      fontSize: '0.85rem',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Forgot password?
                  </Typography>
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || user}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  py: 1,
                  borderRadius: 1.5,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  backgroundColor: '#6366f1',
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
                  '&:hover': {
                    backgroundColor: '#4f46e5',
                    boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)'
                  }
                }}
              >
                {loading ? 'Signing In...' : 'Sign in →'}
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography color="#94a3b8" variant="body2" sx={{ fontSize: '0.85rem' }}>
                  OR
                </Typography>
              </Divider>

              <Box textAlign="center">
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.9rem' }}>
                  Don't have an account?{' '}
                  <Link to="/register" style={{ textDecoration: 'none' }}>
                    <Typography 
                      component="span" 
                      sx={{ 
                        fontWeight: 600,
                        color: '#6366f1',
                        fontSize: '0.9rem',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Sign up
                    </Typography>
                  </Link>
                </Typography>
              </Box>
            </form>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;