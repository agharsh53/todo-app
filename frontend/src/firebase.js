import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration - ALWAYS use environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app;
let auth;
let analytics;

try {
  // Check if all required config values are present
  const requiredConfig = ['apiKey', 'authDomain', 'projectId', 'appId'];
  const isValidConfig = requiredConfig.every(key => firebaseConfig[key]);
  
  if (!isValidConfig) {
    throw new Error('Firebase configuration is incomplete. Check your .env file.');
  }
  
  // Initialize Firebase app
  app = initializeApp(firebaseConfig);
  
  // Initialize Firebase Authentication
  auth = getAuth(app);
  
  // Initialize Analytics (only if measurementId exists and environment supports it)
  if (firebaseConfig.measurementId) {
    isSupported().then(supported => {
      if (supported) {
        analytics = getAnalytics(app);
        console.log('✅ Firebase Analytics initialized');
      }
    });
  }
  
  console.log('✅ Firebase initialized successfully');
  console.log('Project:', firebaseConfig.projectId);
  
} catch (error) {
  console.error('❌ Firebase initialization error:', error.message);
  
  // Provide fallback for development
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️  Using development fallback for Firebase');
    
    // Create mock auth object
    auth = {
      currentUser: null,
      signInWithEmailAndPassword: (email, password) => {
        console.log('Mock: Signing in', email);
        return Promise.resolve({ 
          user: { 
            uid: 'mock-user-' + Date.now(),
            email: email,
            displayName: 'Mock User',
            getIdToken: () => Promise.resolve('mock-token-' + Date.now()),
            emailVerified: true
          } 
        });
      },
      createUserWithEmailAndPassword: (email, password) => {
        console.log('Mock: Creating user', email);
        return Promise.resolve({ 
          user: { 
            uid: 'mock-user-' + Date.now(),
            email: email,
            displayName: 'Mock User',
            getIdToken: () => Promise.resolve('mock-token-' + Date.now()),
            emailVerified: false
          } 
        });
      },
      signOut: () => Promise.resolve(),
      onAuthStateChanged: (callback) => {
        // Call immediately with null (no user)
        callback(null);
        return () => {}; // Return unsubscribe function
      }
    };
  } else {
    // In production, re-throw the error
    throw error;
  }
}

export { auth, analytics };
export default app;