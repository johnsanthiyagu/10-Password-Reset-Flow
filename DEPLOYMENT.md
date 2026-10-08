# Deploying to Vercel

This repository contains two separate apps, so deploy it as two Vercel projects.
Do not commit either local `.env` file. The `.env.example` files are templates;
configure production values in Vercel's Environment Variables settings.

1. **Backend project:** set the Vercel Root Directory to `Backend` and use the **Express** Framework Preset (or let Vercel detect it).
2. **Frontend project:** set the Vercel Root Directory to `Frontend`.

Connect both projects to the same Git repository. Vercel serves the Express
application from `Backend/app.js` as a function. Deploy the backend first, then
use its deployment URL when configuring the frontend. Vercel detects the
frontend Vite app from its package file and `vercel.json`.

Push the deployment changes to GitHub before importing or redeploying the
projects so Vercel builds the latest commit.

## Backend environment variables

Add these under the backend Vercel project's **Settings → Environment Variables**:

| Variable | Value |
| --- | --- |
| `CONNECTION_STRING` | MongoDB connection string for the production database |
| `EMAIL_USER` | Gmail address used to send password reset emails |
| `EMAIL_PASS` | Google App Password for that Gmail account |
| `JWT_SECRET_CODE` | Long, unique random secret |
| `FRONTEND_URL` | Production frontend URL, for example `https://your-frontend.vercel.app` |

Do not add quotes around values. Keep all secrets in Vercel environment settings,
not in source files. Redeploy the backend after changing environment variables.

In MongoDB Atlas, create a database user with only the access required by this app
and allow connections from your deployment. Avoid committing the production
connection string or password.

## Frontend environment variable

Add this under the frontend Vercel project's **Settings → Environment Variables**:

| Variable | Value |
| --- | --- |
| `VITE_API_URL` | Backend URL plus `/api/users`, for example `https://your-backend.vercel.app/api/users` |

`VITE_API_URL` is embedded in the built frontend, so redeploy the frontend whenever
it changes. The frontend defaults to `http://localhost:4000/api/users` for local
development. For local development, set `VITE_API_URL` in `Frontend/.env` to that
same local URL.

The backend allows the local Vite origin and the origin(s) in `FRONTEND_URL`.
For multiple origins, supply a comma-separated list with the production frontend
origin first; reset emails use the first origin in that list.

## After deployment

- Open `https://your-backend.vercel.app/api/health`; it should return `{"status":"ok"}`.
- Test registration and login from the frontend deployment.
- Test a reset email and confirm its link uses the frontend deployment URL.
- Confirm MongoDB Atlas network access permits the Vercel function to connect.
- Check each Vercel project's deployment logs if startup, database, or email setup fails.
