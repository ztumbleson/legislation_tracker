# Legislation Tracker

A web app for tracking legislation and bill sponsors.

## Live Demo

**https://legislationtracker.up.railway.app**

No setup required — the deployed app is connected to a live database and ready to use.

---

## Local Installation

**Requirements:** Node.js 18+, Git

```bash
git clone https://github.com/ztumbleson/legislation_tracker.git
cd legislation_tracker/src/backend
npm install
npm start
```

Then open **http://localhost:3000** in your browser.

That's it. Without any configuration the app creates a `local.db.json` file in the backend directory and uses it as the data store — no database setup needed.

### Optional: Connect to Supabase

If you'd like to run against a Supabase database instead, copy the example env file and fill in your project credentials:

```bash
cp .env.example .env
# edit .env with your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
npm start
```

When both Supabase variables are present the app uses Supabase; otherwise it falls back to the local JSON file.
