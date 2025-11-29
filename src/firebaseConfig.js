// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your Firebase config
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
export const app = initializeApp(firebaseConfig);

// Initialize Analytics only in browser environment
let analytics;
isSupported().then(supported => {
  if (supported) analytics = getAnalytics(app);
});

// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Log Firestore initialization
console.log('Firebase initialized with settings:', {
  type: 'Firebase',
  app: app.name,
  projectId: firebaseConfig.projectId
});

// Export Firebase services
export { auth, db, analytics };
// Note: app is already exported above
