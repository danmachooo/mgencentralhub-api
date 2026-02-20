# Microgenesis Central Hub API

## Project Overview

**Microgenesis Central Hub API** is the backend service for the Microgenesis mobile application — a centralized hub where multiple internal and personal systems meet.

It serves as the **single source of truth** for authentication, system access, and user-specific state across the platform.

### Who This Is For

- Backend engineers working on Microgenesis services
- Mobile and frontend developers consuming the API
- DevOps engineers deploying and operating the service

### Key Responsibilities

- User authentication and session management
- OAuth-based login via Azure Active Directory
- System catalog and access control
- User-specific preferences (favorites, ownership, metadata)
- Secure REST API for mobile and web clients

---

## Tech Stack

| Technology      | Why It’s Used                               |
| --------------- | ------------------------------------------- |
| **ExpressJS**   | Lightweight and explicit REST API framework |
| **TypeScript**  | Type safety and long-term maintainability   |
| **Prisma**      | Type-safe ORM and schema management         |
| **PostgreSQL**  | Primary relational datastore                |
| **Neon**        | Managed, serverless PostgreSQL              |
| **Better Auth** | Session-based authentication and OAuth      |

---

## Getting Started

### Prerequisites

- Node.js `>= 18`
- npm
- PostgreSQL database (Neon or local)
- Azure AD credentials (for OAuth)
- Git

---

### Installation

```bash
git clone https://github.com/your-org/microgenesis-central-hub-api.git
cd microgenesis-central-hub-api
npm install
```

---

### Environment Variables

Environment variables are **not committed** to the repository.

👉 Ask the **main developer via Viber** for the `.env` file.

Once received, place it at the project root:

```text
.env
```

> 🔧 **Environment Variable Rules**
>
> - Any new environment variable must be declared in:
>     - `src/config/env.ts`
>     - `src/config/appConfig.ts`
> - Do **not** read directly from `process.env` outside config files

---

### Database Setup

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

---

### Run Locally

```bash
npm run dev
```

#### Server will start at:

```text
http://localhost:8000
```

---

## Project Structure

> Feature-based architecture. All new functionality must live inside a feature module.

```txt
src/
├── app.ts                # Express app setup
├── server.ts             # HTTP server entry point
├── config/               # Environment + app config
│   ├── env.ts            # Centralized env parsing/validation
│   └── appConfig.ts      # Typed app config consumed by the app
├── lib/                  # Shared utilities (logger, prisma, etc.)
├── helpers/              # Shared helper functions
├── middlewares/          # Express middlewares
├── errors/               # Custom error classes
├── schema/               # Zod schemas (request validation)
├── types/                # Internal-only types
└── features/             # Feature modules
    └── <feature>/
        ├── controllers/  # HTTP handlers
        ├── services/     # Business logic
        └── repos/        # Data access layer (Prisma queries)
```

### Structure Rules

- **All features live in `src/features/`**
    - One folder per feature
    - Each feature must include:
        - `controllers/`
        - `services/`
        - `repos/`

- **File naming convention**
    - Use the pattern: `<name>.<type>.ts`
    - Examples:
        - `system.controller.ts`
        - `system.service.ts`
        - `system.repo.ts`
        - `help.helper.ts`
        - `auth.middleware.ts`

- **Centralized exports via `index.ts`**
    - `middlewares/index.ts` must export all middlewares
    - Apply the same pattern to:
        - `lib/`
        - `helpers/`
        - `errors/`
        - `schema/`

---

## API

> ⚠️ API endpoints are intentionally **not documented here yet**.
> This section will be expanded once endpoints stabilize.

- Base URL: `/api`
- Auth: Session-based (HTTP-only cookies)
- OAuth Provider: Azure Active Directory

---

## Validation & Types

- **All client input must be validated using Zod**
    - Write Zod schemas for request body, params, and query
    - Controllers must validate input before calling services

- **TypeScript types are for internal use only**
    - Use TS types/interfaces for internal contracts
    - Do not rely on TS types for runtime validation

---

## Collaboration

### Branching

Create a new branch before starting work.

Use **either**:

- your name, or
- the feature you are working on

```bash
git checkout -b your-branch
```

---

### Quality Checks (Required)

Before pushing code, always run:

```bash
npm run format
npm run lint
npm run typecheck
```

---

### Committing Changes

Stage your changes:

```bash
git add .
```

Commit with a clear message:

```bash
git commit -m "Describe what you changed"
```

Push your branch:

```bash
git push origin your-branch
```

---

### Pull Requests

1. Go to the GitHub repository
2. Create a **Pull Request** from your branch
3. Add a short description of:
    - What you changed
    - Why it was needed

4. Request review from the main developer

⚠️ **Do not merge your own PR unless explicitly approved.**

---

## Testing

- No testing framework is set up yet
- Tests will be introduced once core features are stable

---

## Deployment

- Hosting: **Render**
- Database: **Neon (PostgreSQL)**
- Environment variables are managed via Render dashboard
- Prisma migrations must be applied before startup

---

## Notes

- REST-only architecture
- Session-based authentication (DB-backed)
- No API versioning yet
- Azure AD is the only OAuth provider
