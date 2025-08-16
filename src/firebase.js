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
const firebaseConfig = {
  apiKey: "AIzaSyCTPBr1j95w_PeVkUDcqCt1yLWNzewyqR4",
  authDomain: "digilex-website.firebaseapp.com",
  databaseURL: "https://digilex-website-default-rtdb.firebaseio.com",
  projectId: "digilex-website",
  storageBucket: "digilex-website.firebasestorage.app",
  messagingSenderId: "280885401452",
  appId: "1:280885401452:web:0f1cd4403856422ebe4549",
  measurementId: "G-YN5TQFMXDR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const firestore = getFirestore(app); // Add this export