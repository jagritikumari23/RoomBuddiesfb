import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebaseConfig';

interface MatchParams {
  limit?: number;
  minScore?: number;
}

export interface MatchResult {
  id: string;
  name: string;
  compatibilityScore: number;
  matchingFactors: string[];
  profilePictureUrl?: string;
  locationPreference?: string;
  budget?: number;
  lifestyle?: string;
  // Add other user fields you want to display
}

/**
 * Find compatible matches using server-side filtering
 */
export const findMatches = async (params: MatchParams = {}): Promise<MatchResult[]> => {
  try {
    const findMatchesFunction = httpsCallable<MatchParams, MatchResult[]>(
      functions,
      'findMatches'
    );
    
    const result = await findMatchesFunction({
      limit: params.limit || 10,
      minScore: params.minScore || 40,
    });
    
    return result.data;
  } catch (error) {
    console.error('Error finding matches:', error);
    throw error;
  }
};

/**
 * Get match suggestions for the current user
 */
export const getMatchSuggestions = async (): Promise<MatchResult[]> => {
  try {
    return await findMatches({ limit: 5, minScore: 50 });
  } catch (error) {
    console.error('Error getting match suggestions:', error);
    return [];
  }
};
