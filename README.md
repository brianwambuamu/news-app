# Newsroom Desk — News Portal MVP

A full-stack news publishing app with two portals:

- **Admin**: create/terminate/delete reporter accounts, upload news, view all news.
- **Reporter**: view/update own profile (change password), upload news.

Stack: React + TypeScript + Tailwind (frontend), Node + Express + TypeScript (backend), PostgreSQL (database), JWT cookies for auth, Nodemailer for credential emails, Multer for image uploads.

```
news-app/
├── server/   # Express + TypeScript API
└── client/   # React + TypeScript + Tailwind frontend
```

## 1. Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ running locally (or a connection string to a hosted instance)
- An SMTP-capable email account (Gmail works — see below) if you want real emails sent to new reporters

## 2. Database setup

Create a database:

```bash
createdb news_app
```

(Or open `psql` and run `CREATE DATABASE news_app;`)

## 3. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Open `.env` and fill in:

- `DATABASE_URL` — your Postgres connection string, e.g. `postgresql://postgres:postgres@localhost:5432/news_app`
- `JWT_SECRET` — any long random string
- `INITIAL_ADMIN_EMAIL` / `INITIAL_ADMIN_PASSWORD` / `INITIAL_ADMIN_NAME` — the first admin account
- `SMTP_*` and `EMAIL_FROM` — see "Email setup" below

Then run the migration and seed the first admin:

```bash
npm run db:migrate
npm run db:seed
```

Start the API:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

## 4. Frontend setup

In a separate terminal:

```bash
cd client
npm install
npm run dev
```

The app runs at `http://localhost:5173` and proxies `/api` and `/uploads` requests to the backend automatically (see `vite.config.ts`), so no extra `.env` is needed on the frontend for local dev.

## 5. Log in

Go to `http://localhost:5173`, and log in with the `INITIAL_ADMIN_EMAIL` / `INITIAL_ADMIN_PASSWORD` you set in `server/.env`. From the admin dashboard you can create reporter accounts, which will receive a temporary password by email.

## Email setup (Gmail example)

1. Enable 2-Step Verification on the Gmail account.
2. Create an App Password at https://myaccount.google.com/apppasswords.
3. In `server/.env`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=the_16_character_app_password
   EMAIL_FROM="News Portal <your_email@gmail.com>"
   ```

If SMTP isn't configured, the backend logs the generated credentials to the server console instead of failing, so you can still test account creation without email set up.

Any standard SMTP provider (SendGrid, Mailgun, Postmark, Outlook, etc.) works the same way — just change `SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/`SMTP_PASS` accordingly.

## How auth works

- On login, the API sets an `httpOnly` JWT cookie (`token`), valid for 8 hours.
- Every authenticated request re-checks that the user still exists and `is_active = true` in the database — so terminating a reporter takes effect immediately, even if their token hasn't expired yet.
- Passwords are hashed with bcrypt; plaintext passwords are never stored.

## Key API endpoints

| Method | Path                          | Who           | Purpose                          |
|--------|-------------------------------|---------------|-----------------------------------|
| POST   | /api/auth/login               | Public        | Log in                            |
| POST   | /api/auth/logout              | Authenticated | Log out                           |
| GET    | /api/auth/me                  | Authenticated | Get current user                  |
| PUT    | /api/auth/change-password     | Authenticated | Change own password               |
| POST   | /api/users                    | Admin         | Create reporter (emails creds)    |
| GET    | /api/users                    | Admin         | List reporters                    |
| PATCH  | /api/users/:id/terminate      | Admin         | Deactivate a reporter             |
| DELETE | /api/users/:id                | Admin         | Permanently delete a reporter     |
| GET    | /api/news                     | Authenticated | List news (filter by `?category=` or `?mine=true`) |
| POST   | /api/news                     | Admin/Reporter| Create news (multipart, field `image`) |
| DELETE | /api/news/:id                 | Admin/Reporter| Delete news (own articles only for reporters) |

## Notes on scope and possible next steps

- "Terminate" deactivates the account (`is_active = false`, login blocked) without deleting their history; "Delete" permanently removes the user. Both are exposed in the admin dashboard, since the brief mentions terminate (login) and delete (dashboard) separately.
- Reporters can delete their own articles; admins can delete any article. Add an "edit article" flow later if needed — it's not in the current MVP scope.
- Uploaded images are stored on disk under `server/uploads/news` and served statically; for production, consider moving to S3 or similar object storage.
- For production deployment, set `NODE_ENV=production` (this makes auth cookies `secure`, so the app must be served over HTTPS), and update `CLIENT_URL`/CORS accordingly.
