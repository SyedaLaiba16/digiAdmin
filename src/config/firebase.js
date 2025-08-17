// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCBHG0vGAVFJfY1d6hGT6I3ghIwF5nZBOE",
  authDomain: "digilex-website-1a689.firebaseapp.com",
  projectId: "digilex-website-1a689",
  storageBucket: "digilex-website-1a689.appspot.com",
  messagingSenderId: "971153506528",
  appId: "1:971153506528:web:c535a9dac87b4d33391085",
  measurementId: "G-R5HGWP5KXE",
  databaseURL: "https://digilex-website-1a689-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);
const analytics = getAnalytics(app);

// Exports
export { auth, db, database, analytics };