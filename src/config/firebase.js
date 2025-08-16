// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCTPBr1j95w_PeVkUDcqCt1yLWNzewyqR4",
  authDomain: "digilex-website.firebaseapp.com",
  projectId: "digilex-website",
  storageBucket: "digilex-website.appspot.com",
  messagingSenderId: "280885401452",
  appId: "1:280885401452:web:0f1cd4403856422ebe4549",
  measurementId: "G-YN5TQFMXDR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Exports
export const auth = getAuth(app);
export const db = getFirestore(app); // <-- Firestore ka reference, abhi sahi hai
export const firestore = getFirestore(app);
