import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMS5krNGXH51C8Kpag8GGxQM6vHTgJfT0",
  authDomain: "feedback-d492a.firebaseapp.com",
  projectId: "feedback-d492a",
  storageBucket: "feedback-d492a.firebasestorage.app",
  messagingSenderId: "802888315824",
  appId: "1:802888315824:web:b23ff5dd6137aa5c6c5c75"
};

// Note: Firestore security rules are configured in the Firebase Console
// to allow read/write access only to the feedbacks collection

console.log("Initializing Firebase...");

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Connect to emulator in development mode only if explicitly enabled
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIRESTORE_EMULATOR === 'true') {
  try {
    console.log("Connecting to Firestore emulator...");
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log("Successfully connected to Firestore emulator");
  } catch (error) {
    console.warn("Failed to connect to Firestore emulator:", error);
    console.log("Falling back to production Firestore");
  }
} else {
  console.log("Using production Firestore");
}

console.log("Firebase and Firestore initialized successfully");

export { db }; 