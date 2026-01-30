import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';
import toast from 'react-hot-toast';

// Get API URL from environment
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get auth header for API requests
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Sync user with backend
  const syncUserWithBackend = async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken();
      localStorage.setItem('token', token);
      
      console.log('Syncing user with backend:', {
        email: firebaseUser.email,
        uid: firebaseUser.uid
      });
      
      const response = await axios.post(`${API_URL}/auth/register`, {
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return {
        ...firebaseUser,
        ...response.data.user
      };
    } catch (error) {
      console.error('Sync error:', error);
      // Return basic user info if backend sync fails
      return {
        ...firebaseUser,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'
      };
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const syncedUser = await syncUserWithBackend(firebaseUser);
          setUser(syncedUser);
        } catch (error) {
          console.error('Auth state change error:', error);
          // Still set user with basic info
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
        localStorage.removeItem('token');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      console.log('Login successful:', firebaseUser.email);
      
      toast.success('Login successful!');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      
      // User-friendly error messages
      let errorMessage = 'Login failed';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Account has been disabled';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later';
          break;
        default:
          errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      return false;
    }
  };

  const register = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update display name
      if (name) {
        await updateProfile(firebaseUser, {
          displayName: name
        });
      }
      
      // Send email verification (optional)
      try {
        await sendEmailVerification(firebaseUser);
        toast.success('Registration successful! Please check your email for verification link.');
      } catch (verificationError) {
        console.warn('Email verification failed:', verificationError);
        toast.success('Registration successful!');
      }
      
      // Force token refresh to include updated profile
      await firebaseUser.getIdToken(true);
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email already registered';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled';
          break;
        default:
          errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('token');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    getAuthHeader
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};