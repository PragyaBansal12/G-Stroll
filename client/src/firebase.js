import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyATdfVoEcoo1sr5I7mbyFX-d2doFcQZvx8",
  authDomain: "g-stroll.firebaseapp.com",
  projectId: "g-stroll",
  storageBucket: "g-stroll.firebasestorage.app",
  messagingSenderId: "857914026248",
  appId: "1:857914026248:web:4bbd855bb51d664f9ee4bd",
  measurementId: "G-Z6J2Z34QEK"
};

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);