// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDXipCG5RCz6UaQVNGV-ZBdwAKk0hB9Z0",
  authDomain: "ticket-drafting.firebaseapp.com",
  projectId: "ticket-drafting",
  storageBucket: "ticket-drafting.firebasestorage.app",
  messagingSenderId: "127579363585",
  appId: "1:127579363585:web:0fb6b7c9745e21ef852300"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
export const auth = getAuth(app);
export const db = getFirestore(app);