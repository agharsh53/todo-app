import React, { useState } from 'react';
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

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long!');
      return;
    }
    
    setLoading(true);
    const success = await register(email, password, name);
    if (success) {
      toast.success('Registration successful! Logging you in...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
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

      {/* Right Side - Registration Form */}
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
                Create Account
              </Typography>
              <Typography variant="body1" color="#64748b" sx={{ fontSize: '0.9rem' }}>
                Start your productivity journey today
              </Typography>
            </Box>

            {user && (
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2, fontSize: '0.875rem' }}>
                You are already logged in. <Link to="/dashboard">Go to Dashboard</Link>
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
                  Full Name
                </Typography>
                <TextField
                  fullWidth
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading || user}
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
                  Email
                </Typography>
                <TextField
                  fullWidth
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading || user}
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
                  disabled={loading || user}
                  helperText="Minimum 6 characters"
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                          sx={{ color: '#94a3b8' }}
                          disabled={loading || user}
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
                  Confirm Password
                </Typography>
                <TextField
                  fullWidth
                  placeholder="********"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading || user}
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

              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      size="small"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      sx={{ 
                        color: '#6366f1',
                        '&.Mui-checked': {
                          color: '#6366f1',
                        }
                      }}
                      disabled={loading || user}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                      I agree to the{' '}
                      <Link to="/terms" style={{ textDecoration: 'none' }}>
                        <Typography 
                          component="span" 
                          sx={{ 
                            color: '#6366f1',
                            fontSize: '0.85rem',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          Terms & Conditions
                        </Typography>
                      </Link>
                      {' '}and{' '}
                      <Link to="/privacy" style={{ textDecoration: 'none' }}>
                        <Typography 
                          component="span" 
                          sx={{ 
                            color: '#6366f1',
                            fontSize: '0.85rem',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          Privacy Policy
                        </Typography>
                      </Link>
                    </Typography>
                  }
                />
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
                {loading ? 'Creating Account...' : 'Create Account →'}
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography color="#94a3b8" variant="body2" sx={{ fontSize: '0.85rem' }}>
                  OR
                </Typography>
              </Divider>

              <Box textAlign="center">
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.9rem' }}>
                  Already have an account?{' '}
                  <Link to="/login" style={{ textDecoration: 'none' }}>
                    <Typography 
                      component="span" 
                      sx={{ 
                        fontWeight: 600,
                        color: '#6366f1',
                        fontSize: '0.9rem',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Sign in
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

export default Register;