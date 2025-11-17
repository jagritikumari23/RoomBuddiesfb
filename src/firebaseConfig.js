// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth } from "firebase/auth";
// Add other Firebase services as needed

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
const analytics = getAnalytics(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Export the app instance
export { app };

// Export other Firebase services as needed
