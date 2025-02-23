import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyABKyomvEBn0LMxoYr3KF6UrDMzMvZdBOw",
  authDomain: "directory-d0dca.firebaseapp.com",
  projectId: "directory-d0dca",
  storageBucket: "directory-d0dca.firebasestorage.app",
  messagingSenderId: "455948340862",
  appId: "1:455948340862:web:dc89150a510b71569f922f"
}

// Initialize Firebase only if it hasn't been initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0]

// Initialize Firestore
const db = getFirestore(app)

// Initialize Auth
const auth = getAuth(app)

// Initialize Storage
const storage = getStorage(app)

// Enable better error logging
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase initialized in development mode')
}

export { db, auth, storage, app }
