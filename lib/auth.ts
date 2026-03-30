import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { getFirebase } from './firebase'

export const signUpWithEmail = (email: string, password: string) => {
  const { auth } = getFirebase()
  return createUserWithEmailAndPassword(auth, email, password)
}

export const signInWithEmail = (email: string, password: string) => {
  const { auth } = getFirebase()
  return signInWithEmailAndPassword(auth, email, password)
}

export const signInWithGoogle = () => {
  const { auth, googleProvider } = getFirebase()
  return signInWithPopup(auth, googleProvider)
}

export const logOut = () => {
  const { auth } = getFirebase()
  return signOut(auth)
}

export const resetPassword = (email: string) => {
  const { auth } = getFirebase()
  return sendPasswordResetEmail(auth, email)
}
