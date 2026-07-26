# Deployment Guide

This app is a single Node/Express server that serves both the API and the static frontend, so you can deploy it as **one web service**. Below is the free path using **Render** (Railway works almost identically).

## Before you deploy — one-time cleanup

1. **Rotate your secrets.** Your old `.env` password/secret were stored in plaintext. Generate a new JWT secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   Pick a new strong `ADMIN_PASSWORD` too.

2. **Confirm `.env` is git-ignored.** It already is in `.gitignore`. Double-check it is NOT listed when you run `git status`.

## Step 1 — Push to GitHub

```bash
cd "portfolio final"
git init
git add .
git commit -m "Initial commit: portfolio"
git branch -M main
# create an empty repo on github.com first, then:
git remote add origin https://github.com/vaishnavigoyal/portfolio.git
git push -u origin main
```

Verify on GitHub that `.env` did **not** get uploaded.

## Step 2 — Deploy on Render

1. Go to https://render.com and sign up (free) with GitHub.
2. **New → Web Service** → connect your repo.
3. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance type:** Free
4. Add **Environment Variables** (Render dashboard → Environment). Copy each key from your `.env`:
   - `JWT_SECRET` (the new one)
   - `JWT_EXPIRES_IN` = `7d`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD` (the new one)
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = your Render URL (e.g. `https://vaishnavi-portfolio.onrender.com`)
   - `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` (from Step 2b below — persistent database)
   - `LINKEDIN_URL`, `GITHUB_URL`, `PORTFOLIO_EMAIL`
   - Do **not** set `PORT` — Render provides it automatically.
5. Deploy. After the first build, open the URL.

## Step 3 — Seed the admin user in production

The seed script needs to run once against the deployed database. Easiest option:

- In Render, open the **Shell** tab for your service and run:
  ```bash
  npm run seed
  ```

Then log in at `https://your-url.onrender.com/login`.

## Step 2b — Persistent database with Turso (free)

The app now uses **Turso** (a hosted, SQLite-compatible database) so your data survives restarts and redeploys. Locally you don't need any of this — with the Turso variables blank, it automatically uses a local SQLite file. For production, set it up once:

1. Create a free account at https://turso.tech.
2. Install the CLI and log in (see turso.tech docs), then create a database:
   ```bash
   turso db create vaishnavi-portfolio
   ```
3. Get the connection URL:
   ```bash
   turso db show vaishnavi-portfolio --url
   ```
   Copy this into Render as `TURSO_DATABASE_URL` (it looks like `libsql://...turso.io`).
4. Create an auth token:
   ```bash
   turso db tokens create vaishnavi-portfolio
   ```
   Copy this into Render as `TURSO_AUTH_TOKEN`.

That's it — no filesystem, no data loss on restart. The free tier is far more than a portfolio needs.

> Note: the old `sqlite3` dependency was removed and replaced with `@libsql/client`. Just make sure `npm install` runs (Render does this automatically) so the new package is installed.

## Step 4 — Add to LinkedIn

Once live:
- Add the URL to your LinkedIn profile under **Featured** or in your **Contact info → Website**.
- Post about it: what you built, the stack, and a screenshot. Link both the live site and the GitHub repo.

## Quick pre-launch checklist

- [ ] New JWT secret + admin password set (not the old leaked ones)
- [ ] `.env` confirmed NOT in the GitHub repo
- [ ] Turso database created; `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` set in Render
- [ ] `resume.pdf` added to `frontend/assets/resume/` (Download button links to it)
- [ ] Social links (Dribbble, GitHub) verified to exist
- [ ] Site loads and admin login works on the deployed URL
