// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNcSL1MBr1kKwgUeWRerZqSX06paWhJbI",
  authDomain: "financeiro1975-89982.firebaseapp.com",
  projectId: "financeiro1975-89982",
  storageBucket: "financeiro1975-89982.firebasestorage.app",
  messagingSenderId: "1023010416966",
  appId: "1:1023010416966:web:8d13aa414e0a1cd9605d47",
  measurementId: "G-WG511YYNYF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
