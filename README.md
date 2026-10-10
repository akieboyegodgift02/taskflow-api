# TaskFlow Backend API

A production-ready, enterprise-grade task and project management backend API built with Node.js, Express (v5), TypeScript, PostgreSQL, and Zod.

## Tech Stack
* **Runtime:** Node.js (ESM modules with `.js` extensions under NodeNext)
* **Framework:** Express.js
* **Language:** TypeScript
* **Database:** PostgreSQL (Neon Cloud)
* **Validation:** Zod
* **Security:** JWT (JSON Web Tokens), bcrypt (Password Hashing)

## Architecture
The application strictly follows a **Layered Architecture (Controller-Service-Route)**:
* **Routes (`src/routes/`)**: Define endpoints and apply middleware (`protect`, RBAC).
* **Controllers (`src/controllers/`)**: Handle HTTP requests and responses, invoking validation and services.
* **Services (`src/services/`)**: Contain core business logic and direct database queries.
* **Schemas (`src/schemas/`)**: Zod schemas for runtime request validation.

## API Endpoints Summary

### Authentication (`/api/v1/auth`)
* `POST /register` - Register a new user
* `POST /login` - Authenticate and receive JWT token

### Teams & RBAC (`/api/v1/teams`)
* `GET /` - List user teams
* `POST /` - Create a new team
* `POST /:teamId/invite` - Invite member to team (Admin only)

### Projects (`/api/v1/teams/:teamId/projects`)
* `GET /` - List team projects (Member+)
* `POST /` - Create a project (Admin, Manager)

### Tasks (`/api/v1/teams/:teamId/projects/:projectId/tasks`)
* `GET /` - List project tasks with optional status filter
* `POST /` - Create a task (Admin, Manager)
* `PATCH /:taskId/status` - Update task status (`TODO`, `IN_PROGRESS`, `DONE`)

## Getting Started
1. Clone the repository.
2. Install dependencies: `npm install`
3. Configure your `.env` file with `PORT`, `DATABASE_URL`, and `JWT_SECRET`.
4. Run in development mode: `npm run dev`