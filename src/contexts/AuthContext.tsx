import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from "@/firebaseConfig"; // Import Firebase auth
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

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
    }
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Additional user setup if needed
      setUser(userCredential.user);
      return { error: null };
    } catch (error) {
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
    // TODO: Implement Google sign in with Firebase
    return { error: 'Not implemented' };
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