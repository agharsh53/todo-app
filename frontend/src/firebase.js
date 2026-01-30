import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDnX1-TF6WqEw1ahKCK7H-Nh_W8ei3EcpU",
  authDomain: "todo-app-5b506.firebaseapp.com",
  projectId: "todo-app-5b506",
  storageBucket: "todo-app-5b506.firebasestorage.app",
  messagingSenderId: "334410425673",
  appId: "1:334410425673:web:cf6a6a8f7e3f23ca63e698",
  measurementId: "G-RTEBY31BPR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;