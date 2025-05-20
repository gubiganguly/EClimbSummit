// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA0BJRs_WCm5WCwqlo1bs4nQJ421rfjKW8",
    authDomain: "eclimbsummit.firebaseapp.com",
    projectId: "eclimbsummit",
    storageBucket: "eclimbsummit.firebasestorage.app",
    messagingSenderId: "544756761795",
    appId: "1:544756761795:web:8614e4d8712514fd388e76",
    measurementId: "G-CEKSCB3X57"
  };

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);


// Conditionally initialize analytics only in browser environment
export const FIREBASE_ANALYTICS = typeof window !== 'undefined' 
  ? getAnalytics(FIREBASE_APP) 
  : null;