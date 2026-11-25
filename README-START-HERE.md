# CampusGuard.AI — Final Build

This is the CampusGuard application with the visual direction adapted from the **AI Around Us** reference project. CampusGuard's research tools and existing TinyFish/Groq integrations are retained.

## Run locally (Windows)

1. Install Node.js 18 or newer.
2. Open this folder in VS Code.
3. Open Terminal → New Terminal.
4. Copy `.env.example` to a new file named `.env` (`Copy-Item .env.example .env` in PowerShell).
5. Add your API keys to `.env` (see the configuration list below).
6. Run `npm install` (skip if `node_modules` is already present).
7. Run `npm start`.
8. Open `http://localhost:8787` in your browser (or the port printed in the terminal).

## API configuration

The original archive contained a TinyFish credential hardcoded in server/deployment files. For safety, I removed the credential from the final ZIP and did not bundle `.env`. **Rotate/revoke that TinyFish key in your provider dashboard**, then put the new key in your local `.env`. The `.env` file is used by the server only. Do not put API keys in `public/` or frontend JavaScript, and do not commit `.env` to GitHub.

Required for live research:
- `TINYFISH_API_KEY`

Optional:
- `GROQ_API_KEY` and `GROQ_MODEL` for structured AI evidence analysis and Guardian AI.
- `GOOGLE_PLACES_API_KEY` for place autocomplete.

The hardcoded TinyFish fallback key from the original server has been removed. The backend now uses only `TINYFISH_API_KEY` from `.env`.

## What is included

- Existing CampusGuard dashboard and student protection tools.
- AI Around Us-inspired light editorial visual system (violet, pink, orange, teal, rounded cards and animated accents).
- Campus Notice Board using the existing TinyFish research workflow.
- Sentinel investigation desk: TinyFish Search → source retrieval → optional Groq evidence assessment, with risk level, confidence, findings, red flags, actions, limitations and source links.
- Sentinel recent investigation history saved in this browser's local storage.
- Dashboard protection status and latest-notice preview are derived from actual saved checks, not invented live metrics.

## Honest limitations

- The current app stores user history in browser local storage; it is not cross-device or multi-user cloud persistence.
- Watchtower-style scheduled monitoring is not implemented as a persistent background scheduler. Do not present it as automatic monitoring.
- Sentinel's risk assessment is an aid to review, not a guarantee of safety. Always open the cited sources and verify critical details independently.
