import { Request, Response } from 'express';
import { getDocs, collection, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export async function getMatches(req: Request, res: Response) {
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
      
      // Get the matched user's details
      const userDoc = await getDoc(doc(db, 'users', otherUserId));
      if (userDoc.exists()) {
        matches.push({
          id: matchDoc.id,
          ...matchData,
          userDetails: userDoc.data()
        });
      }
    }

    // Also check for matches where user is user2
    const userMatchesQuery2 = query(
      matchesRef,
      where('user2', '==', userId)
    );
    
    const snapshot2 = await getDocs(userMatchesQuery2);
    for (const matchDoc of snapshot2.docs) {
      const matchData = matchDoc.data();
      const otherUserId = matchData.user1;
      
      // Get the matched user's details
      const userDoc = await getDoc(doc(db, 'users', otherUserId));
      if (userDoc.exists()) {
        matches.push({
          id: matchDoc.id,
          ...matchData,
          userDetails: userDoc.data()
        });
      }
    }

    return res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
