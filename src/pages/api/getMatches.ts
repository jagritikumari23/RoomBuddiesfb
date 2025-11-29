import type { NextApiRequest, NextApiResponse } from 'next';
import { getDocs, collection, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // Get all matches for the current user
    const matchesRef = collection(db, 'matches');
    const userMatchesQuery = query(
      matchesRef,
      where('user1', '==', userId)
    );

    const snapshot = await getDocs(userMatchesQuery);
    const matches = [];

    // Process each match
    for (const matchDoc of snapshot.docs) {
      const matchData = matchDoc.data();
      const otherUserId = matchData.user2;
      
      // Get the matched user's profile
      const userDoc = await getDoc(doc(db, 'users', otherUserId));
      
      if (userDoc.exists()) {
        matches.push({
          id: matchDoc.id,
          score: matchData.score,
          userData: {
            id: otherUserId,
            ...userDoc.data()
          }
        });
      }
    }

    // Sort matches by score (highest first)
    matches.sort((a, b) => b.score - a.score);

    return res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    return res.status(500).json({ message: 'Error fetching matches', error: error.message });
  }
}
