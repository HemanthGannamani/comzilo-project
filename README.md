# Comzilo — Enterprise Multi-Tenant E-Commerce & ERP Platform

Comzilo is a high-performance, enterprise-grade multi-tenant e-commerce ERP platform designed for managing super admin operations, multi-seller storefronts, customer account portals, inventory, order processing, Razorpay payment gateways, WhatsApp Cloud API automation, and business intelligence analytics.

---

## Technical Stack & Architecture

- **Backend API**: Node.js (v20+), Express.js, TypeScript, Sequelize ORM, MySQL (v8.0+)
- **Seller Panel**: React.js (Vite), TypeScript, Redux Toolkit, Material UI (MUI), Recharts
- **Customer Panel**: React.js (Vite), TypeScript, Redux Toolkit, Material UI (MUI)
- **Payment Gateways**: Razorpay, Cash on Delivery (COD), Extensible Gateway Architecture
- **Communication Engines**: Nodemailer (Gmail/Custom SMTP), Meta WhatsApp Cloud API
- **Automated QA**: Playwright E2E Test Suite

---

## Multi-Tenant Security & Scoping Rules

Comzilo enforces strict multi-tenant isolation across all data layers:
1. **Super Admin**: Access to platform-wide tenants, store management, revenue, and global configuration.
2. **Sellers**: Access scoped strictly to `tenant_id` and `store_id` for catalog, orders, inventory, payments, and marketing.
3. **Customers**: Self-scoped access restricted to `customer_id` and `user_id` for order tracking, saved addresses, invoices, and profile details.

---

## Comprehensive Module Map & Features

### 1. Customer Account Portal & Checkout
- **10 Core Account Modules**: Dashboard, My Profile, My Orders, Order Details, Saved Addresses CRUD, Wishlist, Notification Center, Download Invoices, Change Password, Privacy & Security.
- **Enterprise Checkout Journey**: Multi-step cart review, quantity controls, Save for Later, coupon validation (`SAVE10`), delivery address selection, shipping methods (Standard, Express, Store Pickup), payment gateway selection, and order placement engine.

### 2. Payment Gateway & Transaction Engine
- **Primary Gateways**: Razorpay (signature verification, order creation, capture, webhooks) and Cash on Delivery (COD).
- **Payment History & Refunds**: Transaction log tracking and refund request workflow (Full & Partial refunds).

### 3. WhatsApp Cloud API & Automated Communications
- **WhatsApp Settings**: Meta Cloud API configuration (`phoneNumberId`, `accessToken`, `verifyToken`, `webhookSecret`).
- **Templates & AI Generator**: Template management (`welcome_customer`, `order_confirmation`, `order_shipped`, `abandoned_cart_reminder`) and integrated AI message generator.
- **Unified Communication Center**: History logs across Email, WhatsApp, and In-App notification channels.

### 4. Business Intelligence & Reports
- **Reports Dashboard**: Sales trend, gross revenue, total orders, customer LTV, payment success rate, and inventory alerts.
- **Multi-Format Exports**: One-click exports in CSV, Excel (`.xlsx`), and Print/PDF.
- **Automated Scheduling**: Scheduled email delivery (Daily, Weekly, Monthly).

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

Edit `backend/.env` with your MySQL and API credentials:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=comzilo_db
DB_USER=root
DB_PASSWORD=

JWT_ACCESS_SECRET=supersecret_access_token_key_comzilo_2026
JWT_REFRESH_SECRET=supersecret_refresh_token_key_comzilo_2026

RAZORPAY_KEY_ID=rzp_test_mockkey123
RAZORPAY_KEY_SECRET=rzp_test_secret123

WHATSAPP_PHONE_NUMBER_ID=109283746501
WHATSAPP_ACCESS_TOKEN=eaag_mock_whatsapp_cloud_api_token_xyz987

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

#### Customer Panel
```bash
cd customer-panel
npm install
```

---

### Step 4: Database Setup (MySQL / WampServer)

1. Start **WampServer** / MySQL server.
2. Create Database:
   ```sql
   CREATE DATABASE IF NOT EXISTS comzilo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Run Database Migrations:
   ```bash
   cd backend
   npm run db:migrate
   ```
4. Run Database Seeders:
   ```bash
   npm run db:seed
   ```

---

### Step 5: Start Development Servers

#### 1. Backend API Server
```bash
cd backend
npm run dev
```
*(Runs on `http://localhost:5000`)*

#### 2. Seller & Admin Panel
```bash
cd seller-panel
npm run dev
```
*(Runs on `http://localhost:5173`)*

#### 3. Customer Storefront & Portal
```bash
cd customer-panel
npm run dev
```
*(Runs on `http://localhost:5174`)*

---

## Default Administrative Credentials

- **Super Admin Email**: `admin@comzilo.com`
- **Super Admin Password**: `SuperAdminSecurePassword2026!`
- **Customer Email**: `customer@example.com`
- **Customer Password**: `CustomerPassword123!`

---

## Running Playwright End-to-End Tests

```bash
# Customer Panel Tests (Account Portal, Checkout, Payment Gateway)
cd customer-panel
npx playwright test

# Seller Panel Tests (Email, WhatsApp, Reports & BI)
cd seller-panel
npx playwright test
```

---

## Production Deployment Guide

### 1. Build Production Bundles
```bash
# Customer Panel
cd customer-panel && npm run build

# Seller Panel
cd seller-panel && npm run build

# Backend API
cd backend && npm run build
```

### 2. Reverse Proxy (Nginx Config Sample)
```nginx
server {
    listen 80;
    server_name comzilo.com;

    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /var/www/customer-panel/dist;
        try_files $uri $uri/ /index.html;
    }

    location /seller/ {
        alias /var/www/seller-panel/dist/;
        try_files $uri $uri/ /index.html;
    }
}
```
