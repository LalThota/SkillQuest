# SkillQuest

A full-stack gamified interview preparation web platform designed for college students and fresh graduates.

## Tech Stack
- Frontend: React 18 + Vite + TypeScript + Tailwind CSS + Framer Motion + Zustand
- Backend: Node.js + Express + TypeScript + MongoDB
- Auth: JWT + bcrypt

## Features
- Complete Authentication System
- Gamified Learning with XP, Levels, and Streaks
- Badge unlocking per user progression
- Weak Area Analytics Algorithm
- Animated Quiz module with Timer and immediate feedback

## Setup Instructions

### 1. Prerequisite
- Node.js (v18+)
- MongoDB running locally or on Atlas (`mongodb://127.0.0.1:27017/skillquest`)

### 2. Backend Setup
1. Open terminal and navigate to the backend directory:
   ```bash
   cd server
   ```
2. Install variables (already provided in `.env`):
   ```bash
   npm install
   ```
3. Seed the Database with the 150 questions:
   ```bash
   npm run seed
   ```
4. Start the server (runs on port 5000):
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server (runs on port 5173):
   ```bash
   npm run dev
   ```

### 4. Visit App
1. Navigate to `http://localhost:5173`
2. Sign Up as a new user
3. Enjoy your quest!
