# MedClap — User Management

A user management application built with Next.js (App Router, JavaScript). Covers registration, email/password and Google OAuth login, JWT sessions, protected routing, a dashboard fed by a server API, and full profile management backed by a JSON file database.

---

## Getting Started

**Node.js 20 or higher is required.**

```bash
npm install
cp .env.example .env.local
```

Open `.env.local` and set the values:

```env
JWT_SECRET=your-long-random-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Only needed for Google login
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

To generate a secure `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Email/password registration works with only `JWT_SECRET` set — Google credentials are optional.

---

## Google OAuth Setup

1. Open [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Create an OAuth 2.0 Client ID (Web application)
3. Add an authorised redirect URI: `http://localhost:3000/api/auth/google/callback`
4. Add the Client ID and Client Secret to `.env.local`

The login request uses `access_type=offline` and `prompt=consent` to ensure Google returns a refresh token, which is needed for the automatic logout feature described below.

---

## Authentication Flow

### Email / Password

1. On register, the password is hashed with bcrypt and the user is saved to `data/db.json`
2. On login, the submitted password is compared against the stored hash
3. On success a JWT is signed with `jose` (HS256, 7-day expiry) and written into an `httpOnly` `sameSite=lax` cookie named `um_session`
4. Every protected server component and API route reads that cookie, verifies the signature, and loads the user from the database

### Google OAuth

1. `/api/auth/google` generates a random `state` value (stored in a short-lived `httpOnly` cookie), then redirects the browser to Google's consent screen
2. Google calls back to `/api/auth/google/callback` with a `code` and the original `state`
3. The state is verified against the cookie to prevent CSRF
4. The code is exchanged for tokens, the user's profile is fetched from Google's userinfo endpoint
5. If the email already exists the record is updated; otherwise a new account is created
6. A JWT session cookie is issued and the user lands on the dashboard

### Route Protection

Protection is applied in two layers:

- **`proxy.js`** (Next.js middleware) verifies the JWT on every request. Unauthenticated users hitting `/dashboard`, `/profile`, or `/users` are sent to `/login`. Authenticated users hitting `/login` or `/register` are sent to `/dashboard`.
- **Protected layout** (`app/(protected)/layout.js`) re-checks the session server-side and redirects if missing — a safety net in case the middleware is bypassed.
- Every protected API route independently verifies the JWT before returning data.

---

## Google Session / Automatic Logout

When a Google user changes their Google account password, Google revokes all outstanding refresh tokens for that account.

How the app handles it:

1. The refresh token returned during login is stored on the user record in the database
2. `SessionProvider` calls `GET /api/auth/session` when the page loads and whenever the browser tab regains focus
3. For Google accounts, that endpoint calls `refreshGoogleSession` in `lib/google.js`, which attempts to get a new access token using the stored refresh token
4. If Google returns `invalid_grant` (which happens after a password change or manual session revocation), the server clears the session cookie and removes the stored refresh token
5. The client receives the signal, shows a toast explaining the logout, and redirects to `/login`

Email/password accounts skip the Google check entirely and are unaffected.

---

## API Routes

| Method | Route | Auth required |
|--------|-------|---------------|
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| POST | `/api/auth/logout` | No |
| GET | `/api/auth/session` | Session cookie |
| GET | `/api/auth/google` | No |
| GET | `/api/auth/google/callback` | No |
| GET | `/api/profile` | Session cookie |
| PUT | `/api/profile` | Session cookie |
| GET | `/api/dashboard` | Session cookie |
| GET | `/api/users` | Session cookie |

---

## Data Storage

User data is stored in a JSON file managed by `lowdb`.

- Development: `./data/db.json` (gitignored)
- Production / serverless: written to the OS temp directory. Override with the `DB_PATH` environment variable.

> On serverless hosts the temp filesystem is ephemeral — data may be lost between cold starts. The JSON file approach is used here per the assignment requirements.

---

## Project Structure

```
app/
  layout.js
  page.js                         # public home
  login/page.js
  register/page.js
  (protected)/
    layout.js                     # auth guard
    dashboard/page.js
    profile/page.js
    users/page.js
  api/
    auth/register/route.js
    auth/login/route.js
    auth/logout/route.js
    auth/session/route.js
    auth/google/route.js
    auth/google/callback/route.js
    profile/route.js
    dashboard/route.js
    users/route.js

components/
  ui/                             # Button, Input, Badge, Table, Card, ...
  layout/                         # AppShell, MainHeader, MainSidebar, ...
  auth/                           # AuthScaffold, GoogleButton
  dashboard/                      # DashboardContent, TrendChart, RoleDonut
  profile/                        # ProfileContent
  users/                          # UsersContent
  session-provider.jsx

lib/
  auth.js                         # JWT, bcrypt, cookie helpers
  db.js                           # lowdb JSON database
  google.js                       # OAuth and token refresh helpers
  session.js                      # getCurrentUser
  validation.js                   # zod schemas
  nav.js

proxy.js                          # Next.js middleware for route protection
```

---

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # serve production build
npm run lint     # eslint
```

---

## Assignment Checklist

- [x] Register and login pages with email/password
- [x] Google OAuth login
- [x] JWT authentication
- [x] Public and protected routes with redirect
- [x] Dashboard with user info and API data
- [x] Profile view, edit, and save to JSON database
- [x] Changes reflect immediately after update
- [x] API routes for register, login, profile (GET/PUT), dashboard, users
- [x] Protected APIs reject unauthenticated requests
- [x] Automatic logout when Google session is revoked
- [x] Responsive design — mobile, tablet, desktop
- [x] Loading skeletons, error states, form validation, toast notifications
