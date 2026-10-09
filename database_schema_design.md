# 🗄️ TaskFlow API - Database Schema Design

This document details the relational database schema designed for PostgreSQL. It enforces strict data integrity, foreign key constraints, and cascading rules.

---

## 📊 Entity Relationship Overview

* **Users** can belong to multiple **Teams** (via a join table with specific roles).
* **Teams** own multiple **Projects**.
* **Projects** contain multiple **Tasks**.
* **Tasks** can be assigned to a specific **User** within that team.

---

## 📋 Tables & Columns

### 1. `users` Table
Stores registered user credentials and profile metadata.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User login email |
| `password_hash` | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| `name` | VARCHAR(100) | NOT NULL | User display name |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |

---

### 2. `teams` Table
Represents organizations or workspaces where users collaborate.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique team identifier |
| `name` | VARCHAR(150) | NOT NULL | Team or organization name |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Team creation timestamp |

---

### 3. `team_members` Table (Join Table)
Manages the many-to-many relationship between users and teams, including role assignments.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | UUID | FOREIGN KEY (`users.id`), ON DELETE CASCADE | Reference to user |
| `team_id` | UUID | FOREIGN KEY (`teams.id`), ON DELETE CASCADE | Reference to team |
| `role` | ENUM | NOT NULL, DEFAULT 'MEMBER' (`ADMIN`, `MANAGER`, `MEMBER`) | User role in team |
| **Primary Key** | | (`user_id`, `team_id`) | Composite primary key |

---

### 4. `projects` Table
Represents projects grouped inside a specific team.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique project identifier |
| `title` | VARCHAR(200) | NOT NULL | Project title |
| `description` | TEXT | | Detailed project overview |
| `status` | ENUM | DEFAULT 'PLANNED' (`PLANNED`, `IN_PROGRESS`, `COMPLETED`) | Current project status |
| `team_id` | UUID | FOREIGN KEY (`teams.id`), ON DELETE CASCADE | Owning team |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

---

### 5. `tasks` Table
Represents actionable tasks belonging to a project, optionally assigned to a user.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique task identifier |
| `title` | VARCHAR(255) | NOT NULL | Task title |
| `description` | TEXT | | Task description |
| `priority` | ENUM | DEFAULT 'MEDIUM' (`LOW`, `MEDIUM`, `HIGH`, `URGENT`) | Task priority level |
| `status` | ENUM | DEFAULT 'TODO' (`TODO`, `IN_PROGRESS`, `REVIEW`, `DONE`) | Task workflow status |
| `project_id` | UUID | FOREIGN KEY (`projects.id`), ON DELETE CASCADE | Parent project |
| `assigned_to` | UUID | FOREIGN KEY (`users.id`), ON DELETE SET NULL | Assigned team member |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |