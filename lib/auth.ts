import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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

export const signInWithGoogle = async () => {
  const { auth, googleProvider } = getFirebase()
  try {
    // Try popup first (works on desktop)
    return await signInWithPopup(auth, googleProvider)
  } catch (err: any) {
    // Fall back to redirect for mobile/popup-blocked environments
    if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
      await signInWithRedirect(auth, googleProvider)
      return null
    }
    throw err
  }
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
