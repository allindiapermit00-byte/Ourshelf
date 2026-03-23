import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore'
import { app } from './config'

const db: Firestore = getFirestore(app)

// Module-level flag so HMR reloads don't call connectFirestoreEmulator twice
// (Firestore throws an error if you attempt to connect to the emulator more than once)
let firestoreEmulatorConnected = false

if (import.meta.env.VITE_USE_EMULATORS === 'true' && !firestoreEmulatorConnected) {
  connectFirestoreEmulator(db, 'localhost', 8080)
  firestoreEmulatorConnected = true
}

export { db }
