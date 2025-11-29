import { createContext, useContext, useMemo, useState, ReactNode, useEffect } from "react";
import { collection, doc, setDoc, getDoc, getDocs, onSnapshot, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "./AuthContext";

export type QuizAnswers = Record<string, any>;

export type MatchSummary = {
  id: string;
  name: string;
  image: string;
  matchPercentage: number;
  preview?: string;
  time?: string;
  unread?: boolean;
};

interface MatchingState {
  quizAnswers: QuizAnswers;
  setQuizAnswer: (id: string, value: any) => void;
  setQuizAnswers: (answers: QuizAnswers) => void;
  quizComplete: boolean;
  setQuizComplete: (complete: boolean) => void;
  compatibilityScore: number | null;
  setCompatibilityScore: (score: number) => void;
  likedMatches: MatchSummary[];
  addLikedMatch: (match: MatchSummary) => void;
  clearMatches: () => void;
}

const MatchingContext = createContext<MatchingState | undefined>(undefined);

export const MatchingProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [quizAnswers, setQuizAnswersState] = useState<QuizAnswers>({});
  const [quizComplete, setQuizComplete] = useState(false);
  const [compatibilityScore, setCompatibilityScore] = useState<number | null>(null);
  const [likedMatches, setLikedMatches] = useState<MatchSummary[]>([]);
  const [potentialMatches, setPotentialMatches] = useState<MatchSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to find matching users based on preferences
  const findMatchingUsers = async (currentUserId: string) => {
    if (!user) return [];
    
    try {
      // Get current user's preferences
      const userDoc = await getDoc(doc(db, 'users', currentUserId));
      if (!userDoc.exists()) {
        console.log('User document not found');
        return [];
      }
      
      const userData = userDoc.data();
      const userPreferences = userData.preferences || {};
      
      // Get all other users
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      const potentialMatches = [];
      
      usersSnapshot.forEach((doc) => {
        // Skip current user
        if (doc.id === currentUserId) return;
        
        const otherUser = doc.data();
        const matchScore = calculateMatchScore(userPreferences, otherUser.preferences || {});
        
        if (matchScore > 0) { // Only include matches with score > 0
          potentialMatches.push({
            id: doc.id,
            ...otherUser,
            matchPercentage: Math.round(matchScore * 100)
          });
        }
      });
      
      // Sort by match percentage (highest first)
      return potentialMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);
      
    } catch (error) {
      console.error('Error finding matching users:', error);
      return [];
    }
  };
  
  // Calculate match score between two users (0-1)
  const calculateMatchScore = (prefs1: any, prefs2: any): number => {
    // Simple matching algorithm - adjust weights as needed
    let score = 0;
    let totalWeight = 0;
    
    // Example: Compare location preference
    if (prefs1.location && prefs2.location && prefs1.location === prefs2.location) {
      score += 0.3; // Location match is worth 30%
    }
    totalWeight += 0.3;
    
    // Example: Compare budget
    if (prefs1.budget && prefs2.budget) {
      const budgetDiff = Math.abs(prefs1.budget - prefs2.budget);
      const maxBudget = Math.max(prefs1.budget, prefs2.budget) || 1;
      score += 0.2 * (1 - Math.min(budgetDiff / maxBudget, 1));
    }
    totalWeight += 0.2;
    
    // Add more preference comparisons as needed
    // Example: lifestyle, habits, etc.
    
    // Normalize score to 0-1 range
    return totalWeight > 0 ? Math.min(score / totalWeight, 1) : 0;
  };

  // Load matches and find potential matches on component mount or when user changes
  useEffect(() => {
    if (!user) {
      setLikedMatches([]);
      setLoading(false);
      return;
    }
    
    const loadMatches = async () => {
      try {
        setLoading(true);
        // Load liked matches
        const matchesRef = collection(db, 'users', user.uid, 'likedMatches');
        const matchesSnapshot = await getDocs(matchesRef);
        const matches = matchesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Unknown User',
            image: data.image || '/default-avatar.png',
            matchPercentage: data.matchPercentage || 0,
            preview: data.preview,
            time: data.time,
            unread: data.unread || false
          } as MatchSummary;
        });
        setLikedMatches(matches);
        
        // Find and set potential matches
        const potentialMatches = await findMatchingUsers(user.uid);
        setPotentialMatches(potentialMatches);
        
      } catch (error) {
        console.error('Error loading matches:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadMatches();

    const matchesRef = collection(db, 'users', user.uid, 'likedMatches');
    const unsubscribe = onSnapshot(matchesRef, (snapshot) => {
      const matches: MatchSummary[] = [];
      snapshot.forEach((doc) => {
        matches.push({ id: doc.id, ...doc.data() } as MatchSummary);
      });
      setLikedMatches(matches);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const setQuizAnswer = (id: string, value: any) => {
    setQuizAnswersState(prev => ({ ...prev, [id]: value }));
  };

  const setQuizAnswers = (answers: QuizAnswers) => {
    setQuizAnswersState(answers);
  };

  const addLikedMatch = async (match: MatchSummary) => {
    if (!user) return;
    
    try {
      const matchRef = doc(db, 'users', user.uid, 'likedMatches', match.id);
      await setDoc(matchRef, {
        name: match.name,
        image: match.image,
        matchPercentage: match.matchPercentage,
        preview: match.preview || '',
        time: match.time || new Date().toISOString(),
        unread: match.unread || false
      });
    } catch (error) {
      console.error('Error adding match:', error);
    }
  };

  const clearMatches = async () => {
    if (!user) return;
    
    try {
      // In a real app, you might want to archive matches instead of deleting them
      const batch = [];
      for (const match of likedMatches) {
        const matchRef = doc(db, 'users', user.uid, 'likedMatches', match.id);
        batch.push(deleteDoc(matchRef));
      }
      await Promise.all(batch);
    } catch (error) {
      console.error('Error clearing matches:', error);
    }
  };

  const value = useMemo<MatchingState>(() => ({
    quizAnswers,
    setQuizAnswer,
    setQuizAnswers,
    quizComplete,
    setQuizComplete,
    compatibilityScore,
    setCompatibilityScore,
    likedMatches,
    potentialMatches,
    addLikedMatch,
    clearMatches,
    findMatchingUsers,
    loading,
  }), [quizAnswers, quizComplete, compatibilityScore, likedMatches, potentialMatches, loading, user]);

  return (
    <MatchingContext.Provider value={value}>{children}</MatchingContext.Provider>
  );
};

export const useMatching = () => {
  const ctx = useContext(MatchingContext);
  if (!ctx) throw new Error("useMatching must be used within a MatchingProvider");
  return ctx;
};
