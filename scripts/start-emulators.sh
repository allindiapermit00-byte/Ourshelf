#!/usr/bin/env bash
# Starts the Firebase Emulator Suite (Auth + Firestore) with the Emulator UI.
# Equivalent to running: pnpm emulators
set -euo pipefail

echo "Starting Firebase Emulators..."
echo "  Auth      → http://localhost:9099"
echo "  Firestore → http://localhost:8080"
echo "  UI        → http://localhost:4000"
echo ""

firebase emulators:start --only auth,firestore
