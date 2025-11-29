// src/components/MatchesList.tsx
import React, { useEffect, useState } from 'react';
import { getUserMatches } from '@/services/matchingService';
import type { Match, UserProfile } from '@/services/matchingService.types';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

interface MatchWithUser extends Match {
  id: string;
  matchedUser: UserProfile;
}

export const MatchesList: React.FC = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!user?.uid) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Get matches where current user is involved
        const matches = await getUserMatches(user.uid);
        
        // Get user details for each match
        const matchesWithUsers = await Promise.all(
          matches.map(async (match) => {
            const otherUserId = match.user1 === user.uid ? match.user2 : match.user1;
            const userDoc = await getDoc(doc(db, 'users', otherUserId));
            
            if (!userDoc.exists()) {
              throw new Error(`User ${otherUserId} not found`);
            }
            
            return {
              ...match,
              id: match.user1 === user.uid ? match.user2 : match.user1,
              matchedUser: {
                uid: otherUserId,
                ...userDoc.data()
              } as UserProfile
            };
          })
        );
        
        // Sort by score (highest first)
        matchesWithUsers.sort((a, b) => b.score - a.score);
        
        setMatches(matchesWithUsers);
      } catch (error) {
        console.error('Error fetching matches:', error);
        setError('Failed to load matches. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMatches();
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full">
            <CardContent className="p-4 flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-8 w-16 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        {error}
        <button 
          onClick={() => window.location.reload()}
          className="ml-2 text-blue-500 hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        No matches found yet. Complete your profile to get better matches!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <Card key={match.id} className="w-full hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                {match.matchedUser.profilePictureUrl ? (
                  <AvatarImage 
                    src={match.matchedUser.profilePictureUrl} 
                    alt={match.matchedUser.fullName || 'User'}
                  />
                ) : (
                  <AvatarFallback>
                    {(match.matchedUser.fullName || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">
                  {match.matchedUser.fullName || 'Anonymous User'}
                </h3>
                {match.matchedUser.bio && (
                  <p className="text-sm text-gray-600 truncate">
                    {match.matchedUser.bio}
                  </p>
                )}
                {match.matchedUser.interests?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {match.matchedUser.interests.slice(0, 3).map((interest, i) => (
                      <span 
                        key={i}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-center">
                <div className={`text-lg font-bold ${
                  match.score >= 80 ? 'text-green-600' : 
                  match.score >= 50 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {match.score}%
                </div>
                <div className="text-xs text-gray-500">Match</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
