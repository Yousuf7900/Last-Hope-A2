
# DevPulse API

Live Link: https://l2-a2-eta.vercel.app/

## Project Overview

DevPulse API is a simple issue tracking backend system built with Express.js, TypeScript, PostgreSQL, and JWT authentication.

This project allows users to:
- Register and login
- Create issues
- View all issues
- View single issue details
- Update issues
- Delete issues
- Filter and sort issues
- Manage issue workflow status

The project was built following a modular backend architecture.

---

# Technologies Used

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- NeonDB
- JWT Authentication
- bcrypt
- Vercel

---

# Project Structure

```txt
src/
│
├── config/
│   ├── db.ts
│   └── initDB.ts
│
├── db/
│   └── schema.sql
│
├── middleware/
│   └── auth.middleware.ts
│
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   └── auth.routes.ts
│   │
│   └── issues/
│       ├── issue.controller.ts
│       ├── issue.routes.ts
│
├── utils/
│   └── sendResponse.ts
│
├── app.ts
└── server.ts
```

---

# Features

## Authentication
- User registration
- User login
- JWT token generation
- Protected routes

## Issue Management
- Create issue
- Get all issues
- Get single issue
- Update issue
- Delete issue

## Filtering & Sorting
- Filter by issue type
- Filter by issue status
- Sort by newest or oldest

## Role Based Access

### Contributor
- Can create issue
- Can update own issue if status is open
- Cannot change issue status

### Maintainer
- Can update any issue
- Can change issue status
- Can delete any issue

---

# Database Schema

## Users Table

```sql
CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'contributor',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## Issues Table

```sql
CREATE TABLE IF NOT EXISTS issues(
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'open',
    reporter_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

# Installation & Setup

## Clone Repository

```bash
git clone https://github.com/Yousuf7900/Last-Hope-A2.git
```

## Move to Project Folder

```bash
cd your-project-folder
```

## Install Dependencies

```bash
npm install
```

## Create `.env` File

```env
PORT=5000 or your personal choice
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

## Run Development Server

```bash
npm run dev
```

---

# Build Project

```bash
npm run build
```

---

# Run Production Server

```bash
npm start
```

---

# API Endpoints

## Auth Routes

### Register User

```http
POST /api/auth/signup
```

### Login User

```http
POST /api/auth/login
```

---

## Issue Routes

### Create Issue

```http
POST /api/issues
```

### Get All Issues

```http
GET /api/issues
```

### Get Single Issue

```http
GET /api/issues/:id
```

### Update Issue

```http
PATCH /api/issues/:id
```

### Delete Issue

```http
DELETE /api/issues/:id
```

---

# Query Parameters

## Filter by Type

```http
/api/issues?type=bug
```

## Filter by Status

```http
/api/issues?status=open
```

## Sort by Oldest

```http
/api/issues?sort=oldest
```

---

# Response Format

## Success Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": {}
}
```

## Error Response

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Something went wrong",
  "errors": {}
}
```

---

# Deployment

The project is deployed on Vercel.

Live Server:
https://l2-a2-eta.vercel.app/

---

# Author

Yousuf Islam