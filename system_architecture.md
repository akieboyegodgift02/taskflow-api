# 🏗️ TaskFlow API - System Architecture

This document outlines the architectural pattern, layer responsibilities, and folder structure for the **TaskFlow API**.

---

## 🏛️ Architectural Pattern: Layered Architecture (Separation of Concerns)

The application follows a strict **Layered (N-Tier) Architecture** to ensure maintainability, testability, and a clean separation of concerns. Requests flow downward through clearly defined boundaries:

```text
[ HTTP Request ] 
       │
       ▼
[ Routes / Routers ] ──► Map endpoints to controllers
       │
       ▼
[ Middleware ] ─────► Validate inputs, verify JWT, check RBAC roles
       │
       ▼
[ Controllers ] ────► Extract payload, call services, send HTTP responses
       │
       ▼
[ Services ] ───────► Contain core business logic & data access queries
       │
       ▼
[ Database ] ───────► PostgreSQL (via ORM/Query Builder)
```

---

## 📁 Project Directory Structure

```text
src/
├── @types/          # Custom TypeScript declarations (e.g., extending Express Request)
├── config/          # Environment configuration, database connection pools
├── controllers/     # HTTP request handlers (HTTP status codes, response formatting)
├── errors/          # Custom error classes (AppError, UnauthorizedError, etc.)
├── middleware/      # Express middleware (authentication, role-based access, validation)
├── routes/          # Express route registration and path mounting
├── schemas/         # Data validation schemas (e.g., Zod schemas for request payloads)
├── services/        # Business logic layer (interacts with the database)
├── app.ts           # Express application setup, global middleware, error handlers
└── server.ts        # Application entry point (starts HTTP server, handles graceful shutdown)
```

---

## 🧩 Layer Responsibilities

1. **Routes (`/routes`)**: 
   * Responsible solely for mapping URL paths and HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`) to the appropriate controller functions.
2. **Middleware (`/middleware`)**: 
   * Intercepts requests before they hit controllers. Handles cross-cutting concerns such as checking authentication tokens, enforcing role-based permissions, validating request bodies against schemas, and catching unhandled errors.
3. **Controllers (`/controllers`)**: 
   * Acts as the bridge between HTTP and business logic. Extracts request parameters, query strings, and body data, invokes service methods, and sends back formatted JSON responses. They do **not** contain direct database queries.
4. **Services (`/services`)**: 
   * Encapsulates all business rules, calculations, and database operations. This keeps business logic completely decoupled from Express.js, making it easy to unit test.
5. **Errors (`/errors`)**: 
   * Provides centralized, predictable error handling using custom operational errors mapped to appropriate HTTP status codes (e.g., `400 Bad Request`, `401 Unauthorized`, `404 Not Found`).