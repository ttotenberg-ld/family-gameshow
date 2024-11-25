import { initializeApp } from 'firebase/app';
import { getDatabase, ref, Database } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Debug logging for environment variables
Object.entries(firebaseConfig).forEach(([key, value]) => {
  console.log(`Firebase ${key}:`, value ? '[PRESENT]' : '[MISSING]');
});

let app;
let database: Database;
let teamsRef;

try {
  // Initialize Firebase
  console.log('Initializing Firebase...');
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');

  console.log('Connecting to Realtime Database...');
  database = getDatabase(app);
  console.log('Database connected successfully');

  // Reference to the teams data
  teamsRef = ref(database, 'teams');
  console.log('Teams reference created successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

export { app, database, teamsRef };
