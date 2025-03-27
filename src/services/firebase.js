import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

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
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, auth, db, analytics };
