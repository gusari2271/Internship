# GRAHITA — Spatial Architecture Studio Portfolio

A full-stack web portfolio for an architecture studio, featuring an immersive **floating 3D cube field** hero built with Three.js inside Angular, backed by a NestJS REST API with SQLite storage.

---

## Stack

| Layer         | Technology                                        |
| ------------- | ------------------------------------------------- |
| **Frontend**  | Angular 18 (Standalone, Signals, SCSS)            |
| **3D Engine** | Three.js (native, via `@ViewChild canvas`)        |
| **Backend**   | Node.js + NestJS + TypeORM                        |
| **Database**  | SQLite via `better-sqlite3` (auto-created)        |
| **Security**  | JWT, HttpOnly Cookies, 2FA OTP, RBAC, Rate Limit  |
| **Monorepo**  | `/frontend` + `/backend` with root `concurrently` |

---

## Project Structure

```
Internship/
├── package.json              ← Root: npm run dev starts BOTH services
├── README.md
│
├── frontend/                 ← Angular 18 app
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   └── cube-field/       ← Three.js 3D scene component
│   │   │   ├── pages/
│   │   │   │   ├── home/             ← Homepage (mounts cube-field)
│   │   │   │   ├── manifestation/    ← Studio manifesto
│   │   │   │   ├── about-us/         ← Team & studio profile
│   │   │   │   ├── news/             ← News archive
│   │   │   │   ├── career/           ← Job openings
│   │   │   │   ├── contact-us/       ← Contact form → POST /contact
│   │   │   │   ├── project-detail/   ← Project detail page
│   │   │   │   ├── admin-login/      ← 2FA Login Gateway
│   │   │   │   ├── forgot-password/  ← Password reset request
│   │   │   │   ├── reset-password/   ← Set / Reset password flow
│   │   │   │   └── admin-dashboard/  ← Studio & Admin Control Center
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts   ← Auth state, 2FA, token refresh
│   │   │   │   ├── admin.service.ts  ← RBAC admin management & audit logs
│   │   │   │   ├── project.service.ts← Project CRUD client
│   │   │   │   └── language.service.ts← Language switcher
│   │   │   └── app.routes.ts         ← Protected routes & guards
│   │   └── styles.scss
│   └── package.json
│
└── backend/                  ← NestJS API
    ├── src/
    │   ├── auth/                 ← 2FA, OTP, JWT, HttpOnly cookies, RBAC
    │   ├── admin-management/     ← Superadmin member invitation & controls
    │   ├── audit-log/            ← Comprehensive audit logging system
    │   ├── mail/                 ← Nodemailer service (dev fallback)
    │   ├── projects/             ← Project catalog & 3D pane coordinates
    │   ├── contact/              ← Inquiries & contact form handling
    │   └── main.ts               ← Cookies, CORS credentials, rate limiting
    └── package.json
```

---

## Quick Start

### Prerequisites

- **Node.js** v18+ (tested on v24)
- **npm** v9+

### 1. Install all dependencies

```bash
npm install
```

### 2. Run both services simultaneously

```bash
npm run dev
```

- 🔵 **Frontend** at **http://localhost:4200**
- 🟢 **Backend** at **http://localhost:3000**

---

## Production-Ready Admin Authentication & Security

The application includes an enterprise-grade, hardened authentication and administration system:

### 1. Default Superadmin Account

On initial startup, the backend automatically seeds a default master administrator:

- **Email**: `superadmin@grahita.id` (customizable via `SUPERADMIN_EMAIL` in `.env`)
- **Initial Password**: `SuperAdminGrahita2026!` (customizable via `SUPERADMIN_PASSWORD` in `.env`)
- **Role**: `superadmin`
- **First-Time Password Change**: Marked with `mustChangePassword: true`. Upon logging in for the first time, an obligatory modal will enforce changing this temporary password to a personal secure password before unlocking dashboard controls.

### 2. Two-Factor Authentication (2FA Email OTP)

1. **Step 1 (Credentials)**:
   - Admin enters email and password on `/admin/login`.
   - Client validates input formatting (email format, non-empty fields).
   - Password input includes an eye toggle button to show or hide the password.
   - If credentials fail, a **generic error message** (`"Invalid email or password"`) is always returned to prevent username/email enumeration.
2. **Step 2 (6-Digit Email OTP)**:
   - When credentials match, a 6-digit numeric OTP code is generated, hashed with SHA-256, and sent via email (expires in 5 minutes).
   - In local development, the code is also clearly printed in the backend terminal logs.
   - Admin inputs the OTP on the verification screen.
   - Includes a 60-second cooldown timer on the "Resend Code" button.
   - Maximum 5 failed OTP attempts before the session resets.
   - Upon successful verification, an **Access Token** (short-lived, 2 hours) and a secure **Refresh Token** (7 days, delivered via `HttpOnly` cookie) are issued.

---

### 3. Rate Limiting & Brute-Force Protection

- Monitored on `POST /auth/login`.
- Maximum **5 failed login attempts** per email address within a 15-minute sliding window.
- After 5 consecutive failures, the endpoint returns **HTTP 429 (Too Many Requests)** with the remaining retry cooldown time.
- All failed attempts and IP addresses are recorded in the `login_attempts` table.

---

### 4. Forgot & Reset Password Flow

- **Request Page**: `/admin/forgot-password`
  - Submits to `POST /auth/forgot-password`.
  - **User Enumeration Safe**: Always returns the exact same generic message (`"If this email is registered, a password reset link has been sent to your inbox."`) whether the email exists in the database or not.
- **Reset Page**: `/admin/reset-password?token=...`
  - Validates cryptographically random 32-byte token (30-minute expiration).
  - Updates password (hashed with bcrypt).
  - Immediately **invalidates all active sessions and refresh tokens** for that administrator across all devices.

---

### 5. Multi-Tier Role-Based Access Control (RBAC)

#### Superadmin (`role: 'superadmin'`)

- Full access to Project Catalog and 3D Pane Selector.
- Access to **"Manage Admins"** tab:
  - **Invite New Admin**: sends an activation invitation link to the colleague's email with a 48-hour secure token (no plain passwords sent).
  - **Deactivate Admin**: soft-deactivates an admin account and instantly revokes all their active sessions.
  - **Reactivate Admin**: restores administrative privileges.
  - **Delete Admin**: permanently removes an account.
  - **Safeguards**: Superadmin cannot deactivate or delete their own account, and the last remaining superadmin cannot be removed.
- Access to **"Activity Log"** tab: view complete chronological audit trail.

#### Sub-admin (`role: 'admin'`)

- Dedicated to architecture content curation: create, update, and manage studio projects and 3D floating glass panes.
- Restricted from accessing Admin Management and Activity Log endpoints (`403 Forbidden`).

---

### 6. Session & Cookie Management

- **Access Token**: Short lifespan (2 hours) for API authorization.
- **Refresh Token**: Long lifespan (7 days) stored inside an `HttpOnly`, `SameSite=Lax` cookie to prevent cross-site scripting (XSS) extraction.
- **Sign Out**: Revokes the current session and clears the cookie.
- **Sign Out All Devices**: Revokes all refresh tokens belonging to the admin account.

---

### 7. Audit Logging

Every sensitive action is tracked in the `audit_logs` database table:

- Login success / failed attempts / OTP attempts
- Rate limit triggers
- Password resets & password changes
- Admin invitations, activations, deactivations, reactivations, and deletions
- Project CRUD actions

Superadmins can view and search this log directly inside the Admin Dashboard under the **Activity Log** tab.
