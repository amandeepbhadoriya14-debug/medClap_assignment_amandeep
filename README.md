# MedClap — User Management

A small, production-minded **user management** application built with **Next.js 16 (App Router) in JavaScript**. It covers registration, email/password and Google authentication, JWT sessions, public/protected routing, a polished dashboard fed by a dummy API, and full profile management backed by a JSON-file "database".

> UI design language adapted from a teal, card-based admin system — modern, responsive, with light/dark themes, loading skeletons, and micro-interactions.

---

## ✨ Features

- **Authentication**
  - Register with Name, Email, Password
  - Login with Email + Password
  - **Login with Google** (OAuth 2.0)
  - Sessions implemented with **JWT** stored in an `httpOnly` cookie
  - Passwords hashed with **bcrypt**
- **Public & Protected routes**
  - Public: `/` (home), `/login`, `/register`
  - Protected: `/dashboard`, `/profile`
  - Unauthenticated users hitting a protected route are redirected to `/login`
- **Dashboard** — shows the logged-in user plus live stats, a signup-trend chart, role distribution, recent users, and an activity feed (data from a protected dummy API).
- **Profile management** — view and edit details; changes are persisted to the JSON database and reflected immediately across the app.
- **Google session invalidation** — if the user changes their Google password (which revokes Google's refresh tokens), the app detects it and logs the user out automatically. (See below.)
- **UX** — responsive (mobile / tablet / desktop), light & dark mode, loading skeletons, inline validation, toast notifications, smooth transitions.

---

## 🧱 Tech stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, JavaScript) |
| Styling | Tailwind CSS v4 + shadcn/radix UI components |
| Auth (sessions) | Custom JWT via [`jose`](https://github.com/panva/jose) in an httpOnly cookie |
| Passwords | `bcryptjs` |
| Google login | Hand-rolled OAuth 2.0 Authorization-Code flow (no auth SDK) |
| Database | JSON file via [`lowdb`](https://github.com/typicode/lowdb) |
| Forms / validation | `react-hook-form` + `zod` |
| Icons / toasts | `lucide-react`, `sonner` |

---

## 🚀 Getting started

### 1. Install

```bash
npm install
```

### 2. Configure environment

Copy the example file and fill it in:

```bash
cp .env.example .env.local
```

```dotenv
# Secret used to sign session JWTs (use a long random string)
JWT_SECRET=your-long-random-secret

# Base URL — used to build the Google OAuth redirect URI
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google OAuth credentials (optional — only needed for Google login)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

Generate a strong secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 3. Run

```bash
npm run dev
```

Open <http://localhost:3000>. Register an account, or click **Continue with Google** (after configuring Google credentials below).

Email/password sign-up works with **no extra configuration** — only `JWT_SECRET` is required.

---

## 🔑 Setting up Google login

1. Go to the [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth 2.0 Client ID** (type: *Web application*).
3. Add an **Authorized redirect URI**:
   ```
   http://localhost:3000/api/auth/google/callback
   ```
   (For production, use `https://your-domain/api/auth/google/callback`.)
4. Copy the Client ID and Client Secret into `.env.local`.

The consent screen is requested with `access_type=offline` and `prompt=consent` so Google returns a **refresh token** — the key to the logout-on-password-change behaviour.

---

## 🔐 Authentication flow

```
Register / Login                     Google Login
─────────────────                    ────────────
POST /api/auth/register      GET /api/auth/google ──► Google consent screen
POST /api/auth/login                         │
   │  validate (zod)                         ▼
   │  bcrypt hash / compare      GET /api/auth/google/callback
   ▼                               │  verify CSRF `state`
sign JWT (jose, HS256)             │  exchange code → tokens
   ▼                               │  fetch Google profile
Set-Cookie: um_session             │  upsert user + store refresh_token
(httpOnly, sameSite=lax)           ▼
   ▼                            sign JWT → Set-Cookie → /dashboard
redirect to /dashboard
```

- The JWT payload is intentionally tiny (`sub`, `email`, `name`, `provider`) and expires in 7 days.
- The cookie is `httpOnly`, `sameSite=lax`, and `secure` in production — it is never readable by client JS.
- **Route protection is layered:**
  1. **`proxy.js`** (Next.js 16 renamed `middleware` → `proxy`) verifies the JWT and redirects unauthenticated users away from `/dashboard` & `/profile`, and authenticated users away from `/login` & `/register`.
  2. The **protected layout** (`app/(protected)/layout.js`) re-checks the session on the server and redirects if absent.
  3. Every **protected API route** independently verifies the JWT before returning data — so the API is safe even if called directly.

### API routes

| Method | Route | Purpose | Auth |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Create account, set session | public |
| `POST` | `/api/auth/login` | Email/password login | public |
| `POST` | `/api/auth/logout` | Clear session cookie | — |
| `GET` | `/api/auth/session` | Current user + Google re-validation | session |
| `GET` | `/api/auth/google` | Start Google OAuth | public |
| `GET` | `/api/auth/google/callback` | OAuth callback | public |
| `GET` | `/api/profile` | Fetch profile | session |
| `PUT` | `/api/profile` | Update profile | session |
| `GET` | `/api/dashboard` | Dummy dashboard data | session |

---

## 🔁 Google session / auto-logout handling

**Requirement:** if a Google user later changes their Google account password, the app should log them out once the Google session becomes invalid.

**Approach used here:**

1. During Google login we request offline access, so Google returns a **refresh token**, which we store on the user record in the JSON database.
2. The client (`SessionProvider`) periodically calls **`GET /api/auth/session`** — on an interval and whenever the browser tab regains focus.
3. For Google accounts, that endpoint attempts to **mint a new access token from the stored refresh token** (`lib/google.js → refreshGoogleSession`).
   - **Still valid** → the session continues normally.
   - **Revoked** → Google responds `400 invalid_grant`. Changing the Google password (or "sign out of all sessions") revokes all refresh tokens, so this is exactly when it triggers. We then **clear the session cookie**, drop the stored refresh token, and the client redirects to `/login` with a toast explaining why.

This keeps our own JWT session tightly coupled to the validity of the upstream Google session without needing webhooks, while still working for plain email/password accounts (which simply skip the Google check).

---

## 🗄️ Data storage (JSON "database")

User data lives in a JSON file managed by `lowdb`:

- **Development:** `./data/db.json` (gitignored, easy to inspect).
- **Serverless/production (e.g. Vercel):** the repo filesystem is read-only, so the file is written to the OS temp directory. Override the location with `DB_PATH`.

> ⚠️ **Deployment note:** on serverless hosts the temp filesystem is **ephemeral** — data may reset between cold starts. For a permanent deployment, point `DB_PATH` at a persistent volume or swap `lib/db.js` for a hosted database. The JSON file approach is used here per the assignment requirements.

Each user record:

```jsonc
{
  "id": "uuid",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "passwordHash": "…",          // null for Google-only accounts
  "provider": "credentials",     // or "google"
  "avatar": null,
  "role": "Member",
  "jobTitle": "", "phone": "", "location": "", "bio": "",
  "googleRefreshToken": null,     // present for Google accounts
  "createdAt": "…", "updatedAt": "…"
}
```

---

## 📁 Project structure

```
app/
  layout.js                 # root: fonts, theme provider, toaster
  page.js                   # public landing page
  login/ register/          # public auth pages
  (protected)/
    layout.js               # server-side auth guard + app shell
    dashboard/page.js
    profile/page.js
  api/
    auth/{register,login,logout,session,google,google/callback}/route.js
    profile/route.js         # GET + PUT
    dashboard/route.js
components/
  ui/                        # shadcn primitives
  layout/                    # sidebar, header, app shell, nav
  auth/                      # auth scaffold + Google button
  dashboard/                 # stat cards, charts, tables, feed
  profile/                   # profile view + edit
  session-provider.jsx       # client session context + Google revalidation
lib/
  auth.js                    # JWT sign/verify, cookies, bcrypt
  db.js                      # lowdb JSON database
  google.js                  # OAuth helpers
  session.js                 # server-side current-user helper
  validation.js              # zod schemas
  nav.js
proxy.js                     # route protection (Next.js 16 middleware)
```

---

## 📜 Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # run production build
npm run lint     # eslint
```

---

## ✅ Evaluation checklist

- [x] Register / Login pages
- [x] Email + password auth, Google auth
- [x] JWT-based sessions
- [x] Public & protected routes with redirect
- [x] Dashboard with user info + dummy API data
- [x] Profile view / edit / save to JSON, instant reflection
- [x] API routes for register, login, profile (GET/PUT), dashboard, protected
- [x] Google logout-on-password-change
- [x] Responsive, modern UI with loading states, validation, animations
