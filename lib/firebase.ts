import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBa0VPlHRMjWTkvIEeP5n2SW4zQDSU1H_4",
  authDomain: "vestor001.firebaseapp.com",
  projectId: "vestor001",
  storageBucket: "vestor001.firebasestorage.app",
  messagingSenderId: "280790927733",
  appId: "1:280790927733:web:17a1c50254dd1ab7542b3c",
  measurementId: "G-HGE9YKFQFW"
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
