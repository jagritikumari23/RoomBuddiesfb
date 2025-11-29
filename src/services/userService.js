import { db } from '../firebaseConfig';
import { doc, setDoc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';

/**
 * Saves or updates a user profile in Firestore
 * @param {string} userId - The user's UID from Firebase Auth
 * @param {Object} userData - The user profile data
 * @param {string} userData.name - User's full name
 * @param {number} userData.age - User's age
 * @param {string} userData.gender - User's gender
 * @param {number} userData.budget - User's budget for rent
 * @param {string} userData.locationPreference - Preferred location
 * @param {'private'|'shared'} userData.roomType - Preferred room type
 * @param {number} userData.cleanlinessScore - Cleanliness score (1-5)
 * @param {'smoker'|'non-smoker'} userData.lifestyle - Smoking preference
 * @param {string} userData.sleepSchedule - Sleep schedule (e.g., 'Early bird', 'Night owl')
 * @param {string[]} userData.hobbies - Array of hobbies/interests
 * @param {string} userData.profilePictureUrl - URL to the user's profile picture
 * @returns {Promise<void>}
 */
export const saveUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    console.log('User profile saved/updated successfully');
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

/**
 * Fetches a user's profile from Firestore
 * @param {string} userId - The user's UID from Firebase Auth
 * @returns {Promise<Object|null>} The user's profile data or null if not found
 */
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

/**
 * Updates specific fields of a user's profile
 * @param {string} userId - The user's UID from Firebase Auth
 * @param {Object} updates - The fields to update
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    console.log('User profile updated successfully');
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};
