import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { auth, googleProvider } from './firebase'

export const signUpWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password)

export const signInWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password)

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider)

export const logOut = () => signOut(auth)

export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email)
