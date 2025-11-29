// src/services/matchingService.ts
import { doc, setDoc, getDocs, collection, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { UserProfile, Match } from './matchingService.types';

// Re-export types for convenience
export type { UserProfile, Match };

// Calculate compatibility score between two users (0-100)
export function calculateCompatibility(user1: UserProfile, user2: UserProfile): number {
  let score = 50; // Base score
  
  // Example compatibility calculation
  if (user1.preferences?.smoking === user2.preferences?.smoking) score += 10;
  if (user1.preferences?.pets === user2.preferences?.pets) score += 10;
  
  return Math.min(100, Math.max(0, score));
}

// Save a new match to Firestore
export async function saveMatch(user1Id: string, user2Id: string, score: number): Promise<void> {
  const matchesRef = collection(db, 'matches');
  const matchId = [user1Id, user2Id].sort().join('_');
  
  await setDoc(doc(matchesRef, matchId), {
    user1: user1Id,
    user2: user2Id,
    score,
    timestamp: serverTimestamp()
  });
}

// Find and save matches for a new user
export async function findMatchesForNewUser(newUserId: string, userProfile: UserProfile): Promise<void> {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('uid', '!=', newUserId));
  const querySnapshot = await getDocs(q);
  
  const matchPromises = querySnapshot.docs.map(doc => {
    const otherUser = doc.data() as UserProfile;
    const score = calculateCompatibility(userProfile, otherUser);
    return score >= 50 ? saveMatch(newUserId, otherUser.uid, score) : Promise.resolve();
  });
  
  await Promise.all(matchPromises);
}

// Fetch matches from the Express API
export const fetchMatches = async (userId: string): Promise<Match[]> => {
  try {
    const response = await fetch(`http://localhost:3001/api/matches?userId=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch matches');
    return await response.json();
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
};

// Get all matches for a user
export async function getUserMatches(userId: string): Promise<Match[]> {
  const matchesRef = collection(db, 'matches');
  const [user1Matches, user2Matches] = await Promise.all([
    getDocs(query(matchesRef, where('user1', '==', userId))),
    getDocs(query(matchesRef, where('user2', '==', userId)))
  ]);

  const matches = [
    ...user1Matches.docs.map(doc => doc.data() as Match),
    ...user2Matches.docs.map(doc => doc.data() as Match)
  ];

  return matches.sort((a, b) => b.score - a.score);
}
