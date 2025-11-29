import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from "@/firebaseConfig"; // Import Firebase auth
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, getFirestore } from 'firebase/firestore';
import { findMatchesForNewUser } from '@/services/matchingService';
import type { UserProfile } from '@/services/matchingService.types';

interface AuthContextType {
  user: any | null;
  session: any | null;
  loading: boolean;
  isGuest: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInAsGuest: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Check for guest mode in localStorage
    const guestMode = localStorage.getItem('roomBuddiesGuest');
    if (guestMode) {
      setIsGuest(true);
      setLoading(false);
      return;
    }

    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log('User is signed in:', user);
      } else {
        setUser(null);
        console.log('User is signed out');
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        fullName,
        preferences: {
          smoking: false, // Default values, can be updated later
          pets: false,
        },
      };
      
      // Save user profile to Firestore
      const db = getFirestore();
      await setDoc(doc(db, 'users', user.uid), userProfile);
      
      // Find matches for the new user
      await findMatchesForNewUser(user.uid, userProfile);
      
      setUser(user);
      return { error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Starting Google sign-in...');
      const provider = new GoogleAuthProvider();
      
      // Add scopes if needed
      provider.addScope('profile');
      provider.addScope('email');
      
      console.log('Opening Google sign-in popup...');
      const result = await signInWithPopup(auth, provider).catch(error => {
        console.error('Google sign-in popup error:', {
          code: error.code,
          message: error.message,
          email: error.email,
          credential: error.credential
        });
        throw error;
      });
      
      const user = result.user;
      console.log('Google authentication successful, user:', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      });
      
      // Check if user document exists
      const db = getFirestore();
      console.log('Checking for existing user document...');
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        console.log('Creating new user document...');
        const userProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          fullName: user.displayName || 'New User',
          preferences: {
            smoking: false,
            pets: false,
          },
        };
        
        await setDoc(doc(db, 'users', user.uid), userProfile);
        console.log('User document created');
        await findMatchesForNewUser(user.uid, userProfile);
      } else {
        console.log('User document already exists');
      }
      
      setUser(user);
      return { error: null };
    } catch (error) {
      console.error('Google sign-in error:', {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      return { error };
    }
  };

  const signInAsGuest = () => {
    localStorage.setItem('roomBuddiesGuest', 'true');
    setIsGuest(true);
    setLoading(false);
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Sign out error", error);
    }
  };

  const value = {
    user,
    session,
    loading,
    isGuest,
    signUp,
    signIn,
    signInWithGoogle,
    signInAsGuest,
    signOut: signOutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};