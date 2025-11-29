import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

interface UserProfile {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  budget?: number;
  locationPreference?: string;
  roomType?: 'private' | 'shared';
  lifestyle?: 'smoker' | 'non-smoker';
  sleepSchedule?: string;
  hobbies?: string[];
  profilePictureUrl?: string;
  cleanlinessScore?: number;
}

interface MatchResult extends UserProfile {
  compatibilityScore: number;
  matchingFactors: string[];
}

export const findMatches = functions.https.onCall(async (request: functions.https.CallableRequest<{ limit?: number; minScore?: number }>) => {
  const { auth, data } = request;
  // Verify authentication
  if (!auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to find matches.'
    );
  }

  const currentUserId = auth.uid;
  const { limit = 10, minScore = 40 } = data;

  try {
    // Get current user's profile
    const currentUserDoc = await db.collection('users').doc(currentUserId).get();
    if (!currentUserDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'User profile not found.'
      );
    }
    const currentUser = { id: currentUserDoc.id, ...currentUserDoc.data() } as UserProfile;

    // Build the query with server-side filtering
    let query = db.collection('users')
      .where(admin.firestore.FieldPath.documentId(), '!=', currentUserId);

    // Add basic filters
    if (currentUser.locationPreference) {
      query = query.where('locationPreference', '==', currentUser.locationPreference);
    }
    if (currentUser.roomType) {
      query = query.where('roomType', '==', currentUser.roomType);
    }
    if (currentUser.lifestyle) {
      query = query.where('lifestyle', '==', currentUser.lifestyle);
    }

    // Execute the query
    const snapshot = await query.get();
    
    // Process results and calculate compatibility
    const matches: MatchResult[] = [];
    
    snapshot.forEach(doc => {
      const user = { id: doc.id, ...doc.data() } as UserProfile;
      const { score, factors } = calculateCompatibility(currentUser, user);
      
      if (score >= minScore) {
        matches.push({
          ...user,
          compatibilityScore: score,
          matchingFactors: factors
        });
      }
    });

    // Sort by score and limit results
    return matches
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, limit);
      
  } catch (error) {
    console.error('Error in findMatches:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Error finding matches',
      error
    );
  }
});

// Simple and effective compatibility calculation
function calculateCompatibility(
  currentUser: UserProfile,
  otherUser: UserProfile
): { score: number; factors: string[] } {
  let score = 0;
  const factors: string[] = [];

  // Location match (20% weight)
  if (currentUser.locationPreference === otherUser.locationPreference) {
    score += 20;
    factors.push(`Same location (${currentUser.locationPreference})`);
  }

  // Lifestyle match (20% weight)
  if (currentUser.lifestyle === otherUser.lifestyle) {
    score += 20;
    factors.push(`Same lifestyle (${currentUser.lifestyle})`);
  }

  // Sleep schedule match (20% weight)
  if (currentUser.sleepSchedule === otherUser.sleepSchedule) {
    score += 20;
    factors.push(`Similar sleep schedule (${currentUser.sleepSchedule})`);
  }

  // Cleanliness difference (20% weight, smaller difference = higher score)
  if (currentUser.cleanlinessScore !== undefined && otherUser.cleanlinessScore !== undefined) {
    const cleanDiff = Math.abs(currentUser.cleanlinessScore - otherUser.cleanlinessScore);
    const cleanScore = 20 - (cleanDiff * 2); // Max 20 points, decrease by 2 for each point of difference
    score += Math.max(0, cleanScore);
    
    if (cleanDiff <= 1) {
      factors.push('Similar cleanliness level');
    }
  }

  // Budget difference (20% weight, within 1500 considered good)
  if (currentUser.budget !== undefined && otherUser.budget !== undefined) {
    const budgetDiff = Math.abs(currentUser.budget - otherUser.budget);
    if (budgetDiff <= 1500) {
      score += 20;
      factors.push('Similar budget');
    } else if (budgetDiff <= 3000) {
      score += 10; // Partial score for moderate budget difference
    }
  }
  
  return {
    score: Math.min(100, Math.round(score)),
    factors: factors.length > 0 ? factors : ['Basic compatibility']
  };
}
