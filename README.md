# Legislation Tracker

A web app for tracking legislation and bill sponsors.

##

## Live App

I was having fun and went a bit overboard here, but this is a live deployed version of the application (static HTML/CSS/JS serving from railway with NodeJS and postgres (via Supabase) underneath). If the instructions below don't work, feel free to observe the functionality here.

**https://legislationtracker.up.railway.app**

---

## Local Installation

### Prerequisities 
- Node.js 18+ | [Download](https://nodejs.org/en)
- npm (should come installed with node)
- git

### Steps

1. Clone or download the repository (either in the terminal via ssh/git, via a GUI tool like Github Desktop, or a direct download from Github)
2. Navigate to the project directory
3. Run `npm start` or, alternatively, manually navigate to `/{project-directory}/src/backend/` and run `npm start`
4. Open a web browser to **http://localhost:3000**

### Installation Notes/Troubleshooting
- When running locally without the required Supabase keys, the project will write to a local JSON file: `local.db.json`. To view/modify the data, this file can be viewed in any text editor. The file lives at `/src/backend/dataAccess`. If the file does not exist, the application will create it from scratch when you add the first legislator/legislation.
- If npm start fails, try to update/upgrade your npm packages via `npm update`/`npm upgrade` before continuing
- If the front end opens but says it cannot connect/find any data, make sure the backend service is running in the terminal before continuing

