/**
 * Utility helpers for Firestore emulator integration tests.
 * These functions are only imported by *.test.ts files.
 */

const PROJECT_ID = 'ourshelf-a0d40'
const EMULATOR_HOST = 'localhost:8080'

/**
 * Delete every document in the Firestore emulator database.
 * Call in `beforeEach` to guarantee test isolation.
 */
export async function clearFirestoreEmulator(): Promise<void> {
  const url = `http://${EMULATOR_HOST}/emulator/v1/projects/${PROJECT_ID}/databases/(default)/documents`
  const response = await fetch(url, { method: 'DELETE' })
  if (!response.ok) {
    throw new Error(`clearFirestoreEmulator failed: ${response.status} ${response.statusText}`)
  }
}
