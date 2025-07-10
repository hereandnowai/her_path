import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// The database URL was provided by the user.
// In a real production app, other configuration values like apiKey, authDomain, etc.,
// would be required and should be stored securely as environment variables.
const firebaseConfig = {
  // Using placeholder keys to ensure robust initialization. 
  // This is a common practice to avoid "Service not available" errors 
  // when only a databaseURL is provided.
  apiKey: "placeholder-api-key",
  authDomain: "myaiapp-data-default-rtdb.firebaseapp.com",
  databaseURL: "https://myaiapp-data-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "myaiapp-data-default-rtdb",
  storageBucket: "myaiapp-data-default-rtdb.appspot.com",
  messagingSenderId: "placeholder-sender-id",
  appId: "placeholder-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
export const db = getDatabase(app);
