import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth'
import { app } from './config'

const auth: Auth = getAuth(app)

if (import.meta.env.VITE_USE_EMULATORS === 'true') {
  // Guard against connecting twice during HMR — emulatorConfig is set after first connect
  if (!auth.emulatorConfig) {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
  }
}

export { auth }
