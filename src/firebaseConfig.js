// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { initializeFirestore, getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDKJYj3DN57Xuzt93MHxbThoOo_cEKGVhs",
  authDomain: "roombuddiesfb.firebaseapp.com",
  projectId: "roombuddiesfb",
  storageBucket: "roombuddiesfb.firebasestorage.app",
  messagingSenderId: "1057827462174",
  appId: "1:1057827462174:web:dc8e1141377c5c2b5fe20f",
  measurementId: "G-RWTML0MEE1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only in browser environment
let analytics;
isSupported().then(supported => {
  if (supported) analytics = getAnalytics(app);
});

// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore with explicit settings
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true, // Helps with some network issues
  useFetchStreams: false // Disable fetch streams for better compatibility
});

// Log Firestore initialization
console.log('Firestore initialized with settings:', {
  type: 'Firestore',
  app: app.name,
  projectId: firebaseConfig.projectId
});

// Export all Firebase services
export { app, auth, db, analytics };
