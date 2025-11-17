// Backup of Supabase configuration and related setup code
require('dotenv').config();
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://oxwgmgngnsjfmeuiaorn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94d2dtZ25nbnNqZm1ldWlhb3JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNTU0MTcsImV4cCI6MjA3MjgzMTQxN30.dRJvQq0qLU9e5pN7GeIY63PeNDyuSMWUdwhaKO1s0Rk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from './firebaseConfig';

const apiKey = process.env.REACT_APP_API_KEY;
const authDomain = process.env.REACT_APP_AUTH_DOMAIN;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export const auth = getAuth(app);

// Firebase user sign-up functionality using email and password
createUserWithEmailAndPassword(auth, 'user@example.com', 'password123')
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    console.log('User signed up:', user);
  })
  .catch((error) => {
    console.error('Error signing up:', error);
  });

// Firebase user sign-in functionality using email and password
signInWithEmailAndPassword(auth, 'user@example.com', 'password123')
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    console.log('User signed in:', user);
  })
  .catch((error) => {
    console.error('Error signing in:', error);
  });

// Google sign-in function
export const signInWithGoogle = () => {
  console.log('signInWithGoogle function called');
  
  try {
    const provider = new GoogleAuthProvider();
    console.log('GoogleAuthProvider created');
    
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log('Google sign-in successful:', result.user);
      })
      .catch((error) => {
        console.error('Google sign-in error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Full error object:', JSON.stringify(error, null, 2));
      });
  } catch (error) {
    console.error('Error in signInWithGoogle function:', error);
  }
};
