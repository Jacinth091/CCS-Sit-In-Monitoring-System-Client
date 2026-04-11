## CCS Sit-In Monitoring — Frontend Documentation

Status: current snapshot of the React + Vite client in this repo.

### Overview

This is a Vite + React client (JSX) that communicates with the PHP backend API in the `sitIn` folder. It provides UIs for students and administrators and uses Axios for HTTP requests.

### Prerequisites

- Node.js (18+ recommended)
- npm (or yarn)
- A working backend API reachable via an environment variable (see below)

### Install & Run (Windows PowerShell)

1. Install dependencies

```powershell
cd "c:\Users\PCC\Desktop\My Projects\Sysarch\CCS-Sit-In-Monitoring-System-Client"
npm install
```

2. Start dev server

```powershell
npm run dev
```

Build for production

```powershell
npm run build
```

### Environment variables

The app reads the API base URL from Vite env var `VITE_API_URL` (used by `src/services/backendConnection.js`). Set this in a `.env` file at the frontend root or in your shell. Example:

VITE_API_URL should point to your backend, for example:

```
VITE_API_URL=http://localhost/sitIn/api/
```

Note: The API paths used in services are relative to this base URL (e.g. `auth/login.php`). The client expects the base URL to end with a trailing slash for readability.

### Project structure (important files)

- `src/main.jsx` — app entry and router
- `src/App.jsx`, `src/pages/` — pages/components
- `src/layout/` — layout components (Admin/Student/Auth)
- `src/context/AuthContext.jsx` — authentication context
- `src/services/backendConnection.js` — Axios instance and interceptors
- `src/services/*.js` — service wrappers for API calls (auth, student, sitin, lab, announcement, admin)

### How authentication is handled

- When a user logs in, the backend returns a JSON response (the client code stores a token or session data in `sessionStorage` in the app flows). The `backendConnection.js` Axios instance will look for `sessionStorage.getItem('token')` and, if present, attach the header `Authorization: Bearer <token>` to all requests.
- The Axios instance also normalizes error messages and maps some network/server errors to friendlier messages.

### Available frontend service calls (mapping to backend endpoints)

Auth
- POST auth/login.php — login (payload: { student_id, password })
- POST auth/register.php — register (payload: { student_id, first_name, last_name, email, password, ... })

Students
- GET student/read.php — get all students
- GET student/read_single.php?id=<id> — single student
- PUT student/update.php — update student (PUT body)
- DELETE student/delete.php — delete student (DELETE body)
- POST student/reset_sessions.php — reset sessions
- POST student/upload_profile.php — multipart/form-data file upload

Sit-in / Sessions
- POST sitin/create.php — create a sit-in session (payload example: { student_id, lab_id, purpose })
- GET sitin/read.php — get all sit-in records
- GET sitin/read_active.php — get active sessions
- GET sitin/read_by_student.php?student_id=<id> — get student history
- POST sitin/end_session.php — end session (payload: { log_id })

Labs
- GET lab/read.php — list of labs

Announcements
- GET announcement/read.php — list announcements
- POST announcement/create.php — create announcement

Admin
- GET admin/dashboard_stats.php — admin dashboard statistics

These mappings correspond to the small service wrappers in `src/services/*.js`.

### Notes & tips

- Keep `VITE_API_URL` pointed to the `sitIn/api/` folder on the server hosting the PHP backend.
- The Axios instance includes a response interceptor that converts many common PHP/HTTP errors into a predictable `error.customMessage` on failures — service callers usually display `error.customMessage`.
- Static assets (logos) are in `src/assets/images` and `public/`.

### Next steps & improvements

- Add E2E tests for main flows (login, start/end sitin, upload profile).
- Add TypeScript types (currently JS + JSDoc) for stronger safety.

---
Generated documentation for the current frontend snapshot.
