# Habit Challenge – Full Stack Application

This repository contains a full-stack application developed using **NestJS (Node.js)** for the backend and **Next.js** for the frontend.  
The project is designed with a **modular, scalable, and production-ready architecture**, following industry best practices.

---

## 🧱 Tech Stack

### Backend

- Node.js
- NestJS
- MongoDB (Mongoose)
- JWT Authentication
- Role-Based Access Control (Guards)
- Class Validator & Pipes
- Database Seeders

### Frontend

- Next.js
- React
- JavaScript / TypeScript
- API integration with backend services

---

## 📂 Project Structure

```
root
│
├── backend
│   ├── src
│   │   ├── modules
│   │   ├── auth
│   │   ├── database
│   │   │   └── seeders
│   │   └── main.ts
│   └── package.json
│
├── frontend
│   ├── app / pages
│   ├── components
│   └── package.json
│
└── README.md
```

---

## 🚀 Backend Setup (NestJS)

### 1. Navigate to Backend

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Backend (Development Mode)

```bash
npm run start:dev
```

Backend will start in watch mode.

---

## 🌱 Database Seeder

A user seeder is implemented to populate initial users into the database.

### Run User Seeder

```bash
npm run seed:users
```

Seeder Command:

```json
"seed:users": "ts-node -r tsconfig-paths/register src/database/seeders/user.seeder.ts"
```

---

## 🎨 Frontend Setup (Next.js)

### 1. Navigate to Frontend

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Frontend

```bash
npm run dev
```

Frontend will be available at:

```
http://localhost:3000
```

---

## 🔐 Authentication & Authorization

- JWT-based authentication
- Guards for protected routes
- Role-based access control
- Secure password hashing using bcrypt

---

## 🧩 Architecture Highlights

- Modular NestJS structure
- Clear separation of concerns
- Scalable and maintainable codebase
- Backend-first API design with frontend integration
- Suitable for production and real-world applications

---

## 📝 Notes

- Some assumptions were made due to generic task requirements.
- Missing frontend references were handled logically.
- Focus was on clean architecture, scalability, and best practices.

---

## 👤 Author

**Afzaal Ahmad**  
Full Stack JavaScript Developer  
(Node.js | NestJS | Next.js)
