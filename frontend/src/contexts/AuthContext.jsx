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

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          localStorage.setItem('token', token);
          
          // Always allow login regardless of email verification status
          console.log('User logged in:', {
            email: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified,
            uid: firebaseUser.uid
          });
          
          // Sync with backend
          const response = await axios.post('http://localhost:5000/api/auth/register', {
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0]
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });

          setUser({
            ...firebaseUser,
            ...response.data.user
          });
        } catch (error) {
          console.error('Auth error:', error);
          // Don't show error toast here - let login function handle it
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
      
      console.log('Login successful:', {
        email: firebaseUser.email,
        emailVerified: firebaseUser.emailVerified,
        uid: firebaseUser.uid
      });
      
      // DON'T check email verification - allow login regardless
      // if (!firebaseUser.emailVerified) {
      //   toast.warning('Email not verified. Please check your inbox.');
      // }
      
      toast.success('Login successful!');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      
      // Show user-friendly error messages
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
      
      // Send email verification (but don't require it for login)
      try {
        await sendEmailVerification(firebaseUser);
        toast.success('Registration successful! Please check your email for verification link.');
      } catch (verificationError) {
        console.warn('Email verification failed:', verificationError);
        toast.success('Registration successful!');
      }
      
      // Immediately get new token with updated profile
      await firebaseUser.getIdToken(true);
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      
      // Show user-friendly error messages
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
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
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