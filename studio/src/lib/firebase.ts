// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTQbrAKAzIUe0BnfN00UmKM0CnUYwuZfM",
  authDomain: "flect-69a07.firebaseapp.com",
  projectId: "flect-69a07",
  storageBucket: "flect-69a07.firebasestorage.app",
  messagingSenderId: "807680219169",
  appId: "1:807680219169:web:5fbcce1d0cec521c896b60",
  measurementId: "G-557KN7L8KZ",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { auth };
