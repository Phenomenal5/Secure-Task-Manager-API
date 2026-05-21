# Secure Task Manager API

Educational REST API checkpoint with JWT auth, Google OAuth, protected task routes, input sanitizing, rate limiting, and centralized error handling.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB URI, JWT secret, and Google OAuth credentials.

4. Start the server:

```bash
npm run dev
```

## Main Routes

- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/google`
- `GET /auth/google/callback`
- `POST /tasks`
- `GET /tasks`
- `DELETE /tasks/:id`

JWTs are returned in the JSON response and stored in an HTTP-only cookie named `jwt`.
