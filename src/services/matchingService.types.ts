// src/services/matchingService.types.ts
export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  profilePictureUrl?: string;
  bio?: string;
  phone?: string;
  occupation?: string;
  location?: string;
  interests?: string[];
  preferences?: {
    sleepSchedule?: string;
    cleanliness?: string;
    socialLevel?: string;
    smoking?: boolean;
    pets?: boolean;
  };
  updatedAt?: string;
}

export interface Match {
  user1: string;
  user2: string;
  score: number;
  timestamp: any; // Firestore timestamp
}
