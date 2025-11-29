import { db } from '../firebaseConfig';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  query, 
  where,
  addDoc,
  serverTimestamp,
  DocumentData
} from 'firebase/firestore';
import type { UserProfile } from './matchingService.types';

// Extend UserProfile to include all necessary fields for matching
type BasicUserData = UserProfile & {
  id?: string; // Add id as optional since it comes from the document
  name?: string; // Make name optional to match UserProfile
  preferences?: {
    smoking?: boolean;
    pets?: boolean;
    [key: string]: any;
  };
  interests?: string[];
  budget?: number;
  [key: string]: any;
};

/**
 * Saves or updates a user profile in Firestore
 * @param userId - The user's UID from Firebase Auth
 * @param userData - The user profile data
 * @returns Promise that resolves when the operation is complete
 */
export const saveUserProfile = async (userId: string, userData: Partial<UserProfile>): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    ...userData,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

/**
 * Fetches a user's profile from Firestore
 * @param userId - The user's UID from Firebase Auth
 * @returns The user's profile data or null if not found
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userRef);
  
  if (docSnap.exists()) {
    return { uid: userId, ...docSnap.data() } as UserProfile;
  }
  return null;
};

/**
 * Updates specific fields of a user's profile
 * @param userId - The user's UID from Firebase Auth
 * @param updates - The fields to update
 * @returns Promise that resolves when the update is complete
 */
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

/**
 * Saves a new user and generates matches with existing users
 * @param userData - The new user's data
 * @returns The ID of the newly created user
 */
export async function addNewUser(userData: UserProfile): Promise<string> {
  try {
    // 1. Save the new user
    const userRef = doc(collection(db, 'users'));
    await setDoc(userRef, {
      ...userData,
      uid: userRef.id, // Ensure UID is set in the document
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    const newUserId = userRef.id;

    // 2. Get all existing users (except the new one)
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(
      query(usersRef, where('__name__', '!=', newUserId))
    );
    
    const existingUsers: BasicUserData[] = [];
    usersSnapshot.forEach(doc => {
      if (doc.id !== newUserId) {
        const userData = doc.data() as Omit<BasicUserData, 'id'>;
        existingUsers.push({
          ...userData,
          id: doc.id,
          uid: doc.id, // Ensure uid is set for backward compatibility
          name: userData.name || 'Anonymous', // Provide a default name if not set
          email: userData.email || '', // Required by UserProfile
          fullName: userData.fullName || 'Anonymous User' // Required by UserProfile
        });
      }
    });

    // 3. Generate matches
    const matchesRef = collection(db, 'matches');
    const matchPromises = existingUsers.map(async (user: BasicUserData) => {
      const score = calculateMatchScore(userData, user);
      await addDoc(matchesRef, {
        user1: newUserId,
        user2: user.id,
        score,
        timestamp: serverTimestamp()
      });
    });

    await Promise.all(matchPromises);
    return newUserId;
  } catch (error) {
    console.error('Error adding new user and generating matches:', error);
    throw error;
  }
}

/**
 * Calculates a match score between two users (0-100)
 * @param user1 - First user's data
 * @param user2 - Second user's data
 * @returns A compatibility score (0-100)
 */
function calculateMatchScore(user1: BasicUserData, user2: BasicUserData): number {
  let score = 0; // Start from 0, we'll add points for each match

  // 1. Age compatibility (up to 20 points)
  if (user1.age && user2.age) {
    const ageDiff = Math.abs(user1.age - user2.age);
    if (ageDiff <= 3) score += 20;
    else if (ageDiff <= 5) score += 10;
    else if (ageDiff <= 10) score += 5;
  }

  // 2. Cleanliness level match (20 points)
  if (user1.cleanliness && user2.cleanliness && 
      user1.cleanliness === user2.cleanliness) {
    score += 20;
  }

  // 3. Smoking preference match (20 points)
  if (user1.preferences?.smoking === user2.preferences?.smoking) {
    score += 20;
  }

  // 4. Sleep schedule compatibility (20 points)
  if (user1.sleepSchedule && user2.sleepSchedule && 
      user1.sleepSchedule === user2.sleepSchedule) {
    score += 20;
  }

  // 5. Gender preference match (20 points)
  if (user1.preferences?.gender && user2.gender && 
      user1.preferences.gender === user2.gender) {
    score += 20;
  }

  // 6. Pet preference match (10 points)
  if (user1.preferences?.pets === user2.preferences?.pets) {
    score += 10;
  }
  
  // 7. Budget compatibility (10 points for similar budget ranges)
  if (user1.budget && user2.budget) {
    const budgetDiff = Math.abs(user1.budget - user2.budget);
    const avgBudget = (user1.budget + user2.budget) / 2;
    const budgetDiffPercent = (budgetDiff / avgBudget) * 100;
    
    if (budgetDiffPercent <= 10) score += 10;
    else if (budgetDiffPercent <= 25) score += 5;
  }

  // Add more scoring factors based on your requirements
  if (user1.budget && user2.budget) {
    const budgetDiff = Math.abs(user1.budget - user2.budget);
    score -= Math.min(20, budgetDiff / 1000); // Adjust divisor based on your budget scale
  }

  return Math.min(100, Math.max(0, score));
}
