import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
} from 'firebase/auth'
import { getFirebase } from './firebase'

export const signUpWithEmail = (email: string, password: string) => {
  const { auth } = getFirebase()
  return createUserWithEmailAndPassword(auth, email, password)
}

export const sendVerificationEmail = (user?: import('firebase/auth').User | null) => {
  const { auth } = getFirebase()
  const target = user || auth.currentUser
  if (!target) throw new Error('No user')
  return sendEmailVerification(target)
}

export const signInWithEmail = (email: string, password: string) => {
  const { auth } = getFirebase()
  return signInWithEmailAndPassword(auth, email, password)
}

export const signInWithGoogle = async () => {
  const { auth, googleProvider } = getFirebase()
  await signInWithRedirect(auth, googleProvider)
}

export const getGoogleRedirectResult = () => {
  const { auth } = getFirebase()
  return getRedirectResult(auth)
}

export const logOut = () => {
  const { auth } = getFirebase()
  return signOut(auth)
}

export const resetPassword = (email: string) => {
  const { auth } = getFirebase()
  return sendPasswordResetEmail(auth, email)
}
