// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzBMOAO9aPNZzrSyuTt9928IWtiNRXPuY",
  authDomain: "rnmailauth.firebaseapp.com",
  projectId: "rnmailauth",
  storageBucket: "rnmailauth.firebasestorage.app",
  messagingSenderId: "373416577377",
  appId: "1:373416577377:web:a098faecdbeeaf23a6dd20",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);

export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
