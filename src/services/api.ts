// API service for interacting with Firebase Firestore

import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  Timestamp, 
  FirestoreError 
} from 'firebase/firestore';

export interface Feedback {
  id: string;
  full_name: string;
  email: string;
  message: string;
  created_at: Date;
}

export interface FeedbackData {
  full_name: string;
  email: string;
  message: string;
}

// Check if Firestore is initialized
const isFirestoreInitialized = () => {
  if (!db) {
    throw new Error("Firestore is not initialized. Please check your Firebase configuration.");
  }
  return true;
};

// Get all feedbacks
export const getFeedbacks = async (): Promise<Feedback[]> => {
  try {
    isFirestoreInitialized();
    
    console.log("Fetching feedbacks from Firestore...");
    const feedbacksRef = collection(db, 'feedbacks');
    const snapshot = await getDocs(feedbacksRef);
    
    const feedbacks: Feedback[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      feedbacks.push({
        id: doc.id,
        full_name: data.full_name,
        email: data.email,
        message: data.message,
        created_at: data.created_at?.toDate() || new Date(),
      });
    });
    
    console.log(`Successfully fetched ${feedbacks.length} feedbacks`);
    return feedbacks;
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    throw new Error(`Failed to fetch feedbacks: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Submit new feedback
export const submitFeedback = async (data: FeedbackData): Promise<Feedback> => {
  try {
    isFirestoreInitialized();
    
    console.log("Submitting feedback to Firestore...");
    const feedbacksRef = collection(db, 'feedbacks');
    const docRef = await addDoc(feedbacksRef, {
      ...data,
      created_at: Timestamp.now(),
    });
    
    const newFeedback: Feedback = {
      id: docRef.id,
      ...data,
      created_at: new Date(),
    };
    
    console.log("Feedback submitted successfully:", newFeedback);
    return newFeedback;
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw new Error(`Failed to submit feedback: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Delete feedback by ID
export const deleteFeedback = async (id: string): Promise<void> => {
  try {
    console.log('Deleting feedback with ID:', id);
    
    // Check if Firestore is initialized
    isFirestoreInitialized();
    
    if (!id) {
      throw new Error('Feedback ID is required');
    }
    
    const feedbackRef = doc(db, 'feedbacks', id);
    console.log('Document reference created');
    
    await deleteDoc(feedbackRef);
    console.log('Document deleted successfully');
  } catch (error) {
    const errorMessage = error instanceof FirestoreError 
      ? `Firestore error (${error.code}): ${error.message}` 
      : `Error deleting feedback: ${error instanceof Error ? error.message : String(error)}`;
    
    console.error(errorMessage, error);
    throw new Error('Failed to delete feedback. Please try again later.');
  }
}; 