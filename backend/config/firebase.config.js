const admin = require('firebase-admin');

// Initialize Firebase Admin with environment variables
const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length > 0) {
      console.log('✅ Firebase already initialized');
      return admin.app();
    }

    // Get credentials from environment variables
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKeyId = process.env.FIREBASE_PRIVATE_KEY_ID;

    // Validate required environment variables
    if (!projectId || !privateKey || !clientEmail) {
      console.warn('⚠️  Firebase environment variables missing');
      
      // For development, use mock or try to load from file
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Trying to load firebase-admin.json');
        try {
          const serviceAccount = require('../firebase-admin.json');
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
          });
          console.log('✅ Firebase initialized from JSON file (development)');
          return admin.app();
        } catch (fileError) {
          console.log('⚠️  Could not load JSON file, using mock admin');
          // Return mock admin for development
          return createMockAdmin();
        }
      }
      
      throw new Error('Firebase credentials not configured');
    }

    // Initialize with environment variables
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        privateKey,
        clientEmail,
        privateKeyId
      })
    });

    console.log('✅ Firebase Admin initialized from environment variables');
    return admin.app();
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    
    // For development, return mock
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️  Using mock Firebase Admin for development');
      return createMockAdmin();
    }
    
    throw error;
  }
};

// Mock admin for development (when no Firebase available)
const createMockAdmin = () => {
  return {
    auth: () => ({
      verifyIdToken: async (token) => {
        console.log('Mock: Verifying token', token.substring(0, 20) + '...');
        return {
          uid: 'mock-user-' + Date.now(),
          email: 'mock@example.com',
          name: 'Mock User'
        };
      }
    }),
    apps: [{}]
  };
};

// Export initialized Firebase admin
const firebaseAdmin = initializeFirebase();

// Authentication middleware
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      if (process.env.NODE_ENV === 'development') {
        // Allow development without token
        req.user = {
          uid: 'dev-user-' + Date.now(),
          email: 'dev@example.com',
          name: 'Development User'
        };
        console.log('Development mode: Using mock user');
        return next();
      }
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    
    if (process.env.NODE_ENV === 'development') {
      // Allow development even with invalid token
      req.user = {
        uid: 'dev-user-' + Date.now(),
        email: 'dev@example.com',
        name: 'Development User'
      };
      console.log('Development mode: Bypassing token error');
      return next();
    }
    
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = {
  admin: firebaseAdmin,
  verifyFirebaseToken,
  initializeFirebase
};