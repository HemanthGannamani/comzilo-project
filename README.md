# Comzilo — Enterprise Multi-Tenant E-Commerce & ERP Platform

Comzilo is a high-performance, enterprise-grade multi-tenant e-commerce ERP platform designed to manage super admin operations, multi-seller storefronts, inventory, order processing, and automated email marketing.

---

## Prerequisites

- **Node.js**: v18.x or v20.x (Recommended: Node.js 20 LTS)
- **Database**: WampServer / XAMPP / Native MySQL (v8.0+)
- **Package Manager**: `npm` (v9.x or v10.x)
- **Browser**: Chromium-based browser for testing

---

## Technical Stack

- **Backend**: Node.js, Express.js, TypeScript, Sequelize ORM, MySQL, Nodemailer
- **Seller Panel**: React.js, Vite, TypeScript, Redux Toolkit, MUI (Material-UI)
- **Automated Testing**: Playwright E2E Test Suite

---

## Project Structure

```
comzilo-project/
├── backend/                  # Node.js Express REST API & Database Models
│   ├── src/
│   │   ├── controllers/      # REST API Controllers (60+ endpoints)
│   │   ├── database/         # Sequelize Models, Migrations & Seeders
│   │   ├── middleware/       # Auth & Tenant Isolation Guards
│   │   ├── routes/           # Express Router Endpoints
│   │   └── services/         # Business Logic, Email Queue & AI Engine
│   ├── .env.example          # Environment Template
│   └── package.json
├── seller-panel/             # React Vite Seller & Super Admin Management Portal
│   ├── src/
│   │   ├── features/         # Marketing, Catalog, Inventory & Store Modules
│   │   ├── pages/            # Dashboard, Login, Forced Password Update Pages
│   │   └── store/            # Redux Toolkit Global State
│   ├── tests/                # Playwright E2E Specs
│   └── package.json
└── README.md
```

---

## Quick Start & Installation Guide

### Step 1: Clone Repository
```bash
git clone https://github.com/HemanthGannamani/comzilo-project.git
cd comzilo-project
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env` in the `backend` directory:
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your WampServer MySQL credentials:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=comzilo_db
DB_USER=root
DB_PASSWORD=

JWT_ACCESS_SECRET=supersecret_access_token_key_comzilo_2026
JWT_REFRESH_SECRET=supersecret_refresh_token_key_comzilo_2026

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=pedapolukarthikroy7@gmail.com
SMTP_PASSWORD=vwfuutblabnngtmc
SMTP_FROM_EMAIL=pedapolukarthikroy7@gmail.com
SMTP_FROM_NAME=Comzilo Store
```

---

### Step 3: Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Seller Panel
```bash
cd seller-panel
npm install
```

---

### Step 4: Database Setup (WampServer / MySQL)

1. Start **WampServer** and ensure MySQL is active.
2. Open phpMyAdmin or MySQL CLI and create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS comzilo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Run Database Migrations:
   ```bash
   cd backend
   npm run db:migrate
   ```
4. Run Database Seeders (Creates Super Admin & Default Tenant):
   ```bash
   npm run db:seed
   ```

---

### Step 5: Start Development Servers

#### 1. Start Backend API Server
```bash
cd backend
npm run dev
```
*(Backend runs on `http://localhost:5000`)*

#### 2. Start Seller Panel UI
```bash
cd seller-panel
npm run dev
```
*(Seller Panel runs on `http://localhost:5173`)*

---

## Default Administrative Credentials

- **Super Admin Email**: `admin@comzilo.com`
- **Super Admin Password**: `SuperAdminSecurePassword2026!`
- **Panel Access URL**: `http://localhost:5173/login`

---

## Running Playwright End-to-End Tests

Execute the complete automated test suite verifying Gmail SMTP connection, event automation, and seller password enforcement:
```bash
cd seller-panel
npx playwright test tests/email-automation.spec.ts
```

---

## Troubleshooting

- **Database Connection Failed**: Ensure WampServer MySQL is running on port 3306 and `.env` credentials (`DB_USER`, `DB_PASSWORD`) match your local environment.
- **Gmail SMTP Credentials Error**: Standard Gmail account passwords will be rejected by Google. Ensure you generate a 16-character **App Password** from Google Security Settings.
