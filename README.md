# Vaishnavi Goyal — UI/UX Designer Portfolio

A full-stack personal portfolio with a public site and a private admin dashboard for managing projects, ideas, and contact messages. Built to be production-ready with security middleware, JWT auth, and a SQLite datastore.

**Live site:** _add your deployed URL here after deploying_
**Author:** Vaishnavi Goyal — [LinkedIn](https://www.linkedin.com/in/vaishnavi-goyal/) · [GitHub](https://github.com/vaishnavigoyal)

## Features

- Responsive single-page portfolio (hero, about, process, work, ideas, testimonials, contact)
- Contact form that saves messages to the backend
- Admin dashboard (login-protected) to add/edit/delete projects and ideas and read messages
- JWT authentication with HTTP-only cookies, password hashing (bcrypt), rate limiting, and Helmet security headers

## Tech stack

- **Backend:** Node.js, Express, Turso / libSQL (SQLite-compatible, persistent), JWT, bcryptjs
- **Frontend:** Vanilla HTML/CSS/JS (no build step)
- **Security:** Helmet, CORS, express-rate-limit, express-validator

## Getting started (local)

Requires Node.js 18+.

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env
# then edit .env and set JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD

# 3. Seed the admin user
npm run seed

# 4. Run the server
npm run dev        # development (auto-reload)
# or
npm start          # production
```

Open http://localhost:5000. The admin login is at `/login`.

## Environment variables

See `.env.example` for the full list. Key ones:

| Variable | Purpose |
|----------|---------|
| `JWT_SECRET` | Secret used to sign auth tokens (use a long random string) |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Credentials seeded for the admin dashboard |
| `FRONTEND_URL` | Allowed CORS origin (your deployed URL in production) |
| `NODE_ENV` | `development` or `production` |

**Never commit your `.env` file.** It is git-ignored by default.

## Project structure

```
backend/
  config/        # database init
  controllers/   # request handlers
  services/      # business logic
  models/        # data access (projects, ideas, messages, user)
  routes/        # API route definitions
  middleware/    # auth middleware
  server.js      # app entry point
frontend/
  public/        # index.html, login.html, admin.html
  css/  js/       # styles and client scripts
  assets/        # icons, images, resume (add your files here)
```

## Screenshots

_Add a screenshot or two of the site here — it makes the repo much more appealing on GitHub/LinkedIn._

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for a step-by-step guide to putting this live for free.
