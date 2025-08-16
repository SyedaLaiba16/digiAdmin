// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqz8YzmsOaJ1aByOME5JlxMKKrjk24UzU",
  authDomain: "signup-79eaa.firebaseapp.com",
  projectId: "signup-79eaa",
  storageBucket: "signup-79eaa.firebasestorage.app",
  messagingSenderId: "163324961873",
  appId: "1:163324961873:web:846220c695f327f1f30470",
  measurementId: "G-2Q8MBG0Y6Z"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const firestore = getFirestore(app); // Add this export