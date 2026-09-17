# WealthPilot AI — Production Deployment Guide

This app is a single Node/Express server that serves both the API and the built
React app. It is designed to run as one container on **Google Cloud Run**.

There are three things to set up: (1) a Firebase project for auth + data,
(2) a Gemini API key, and (3) the Cloud Run service.

---

## 1. Firebase project (Authentication + Firestore)

The app now uses **real Firebase Authentication** — no passwords are stored by
the app. Create a dedicated project (do not reuse an old one).

1. Go to the [Firebase console](https://console.firebase.google.com/) → **Add project**.
2. **Authentication → Sign-in method**, enable:
   - **Email/Password**
   - **Google** (set a support email)
3. **Authentication → Settings → Authorized domains**: add your Cloud Run domain
   (e.g. `wealthpilot-ai-xxxx.a.run.app`) and any custom domain. `localhost` is
   already allowed for local dev.
4. **Firestore Database → Create database** (Production mode). Note the database
   id — if it is not `(default)`, set it in `firebase-applet-config.json`.
5. **Project settings → General → Your apps → Web app**: register a web app and
   copy the config values into `firebase-applet-config.json`:
   - `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`
   - `oAuthClientId`: from **APIs & Services → Credentials** (the Web OAuth 2.0
     client Firebase created), if you need it for advanced flows.

   > The Firebase **web** API key is public by design — security is enforced by
   > Auth + Firestore rules, not by hiding this key.

6. **Deploy the Firestore security rules** in `firestore.rules` (a user can only
   read/write `users/{uid}` where `uid == request.auth.uid`). With the Firebase CLI:
   ```bash
   npm i -g firebase-tools
   firebase login
   firebase deploy --only firestore:rules --project YOUR_PROJECT_ID
   ```
   (Or paste them in **Firestore → Rules** in the console.)

---

## 2. Gemini API key

Create a key in [Google AI Studio](https://aistudio.google.com/apikey). It is
used **server-side only** for the AI copilot and the per-company stock analysis.
Never expose it to the client. Set it as the `GEMINI_API_KEY` env var (below).

If the key is missing the app still runs: the copilot returns a notice and stock
analysis falls back to a clearly-labelled "unavailable" state (it never
fabricates company-specific numbers).

---

## 3. Deploy to Cloud Run

The `Dockerfile` is production-ready (multi-stage, non-root, serves `dist/`).

```bash
# From the repo root, with gcloud configured for your project:
gcloud run deploy wealthpilot-ai \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,GEMINI_API_KEY=YOUR_KEY,GEMINI_MODEL=gemini-3.8-flash,GEMINI_FALLBACK_MODEL=gemini-3.6-flash
```

Notes:
- Cloud Run injects `PORT`; the server already reads it.
- Prefer storing `GEMINI_API_KEY` in **Secret Manager** and referencing it with
  `--set-secrets GEMINI_API_KEY=gemini-api-key:latest` instead of `--set-env-vars`.
- After first deploy, add the resulting `*.run.app` domain to Firebase
  **Authorized domains** (step 1.3) or Google sign-in will be rejected.

---

## 4. Local development

```bash
npm install
cp .env.example .env      # fill GEMINI_API_KEY
# fill firebase-applet-config.json with your web app config
npm run dev               # http://localhost:3000
```

`npm run lint` runs `tsc --noEmit` for a type check. `npm run build` produces the
Vite client bundle and `dist/server.cjs`.

---

## Production checklist

- [ ] Firebase project created; Email/Password + Google providers enabled
- [ ] Cloud Run domain added to Firebase Authorized domains
- [ ] `firebase-applet-config.json` filled with the new project's web config
- [ ] `firestore.rules` deployed (per-user access only)
- [ ] `GEMINI_API_KEY` set (ideally via Secret Manager)
- [ ] Service deployed and reachable; `/api/health` returns `hasGeminiKey: true`
- [ ] Sign up, sign in, Google sign-in, and password reset all work
- [ ] A stock lookup shows a live price with an "AI estimate" analysis chip
