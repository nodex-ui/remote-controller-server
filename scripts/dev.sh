#!/usr/bin/env bash
# Starts the test server for app/ at http://localhost:8075/ (PORT, HOST, JANUS_UPSTREAM override).
cd "$(dirname "$0")/.." && exec npx --yes vite@6 --config vite.config.mjs "$@"
