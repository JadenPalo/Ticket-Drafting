import { getAuth } from "firebase/auth";


import app from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const auth = getAuth(app);

// ✅ Export auth
export default auth;

// Existing functions
export const signUp = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const logIn = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);