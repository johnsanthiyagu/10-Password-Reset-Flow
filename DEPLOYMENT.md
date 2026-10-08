# Deploying to Vercel

This repository contains two separate apps, so deploy it as two Vercel projects:

1. **Backend project:** set the Vercel Root Directory to `Backend` and the Framework Preset to **Other** so Vercel deploys the `api` function rather than running the local Express start script.
2. **Frontend project:** set the Vercel Root Directory to `Frontend`.

Connect both projects to the same Git repository. Deploy the backend first, then
use its deployment URL when configuring the frontend. Vercel should detect the
frontend Vite app from its package file and `vercel.json`.

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
Multiple frontend origins can be supplied as a comma-separated list.

## After deployment

- Open `https://your-backend.vercel.app/api/health`; it should return `{"status":"ok"}`.
- Test registration and login from the frontend deployment.
- Test a reset email and confirm its link uses the frontend deployment URL.
- Confirm MongoDB Atlas network access permits the Vercel function to connect.
- Check each Vercel project's deployment logs if startup, database, or email setup fails.
