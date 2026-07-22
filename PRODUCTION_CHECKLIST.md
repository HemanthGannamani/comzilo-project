# Comzilo SaaS ERP Production Readiness Checklist

This document details the environment specifications, deployment workflows, security considerations, backup strategies, and rollback plans for launching the Comzilo Platform.

---

## 1. Environment Variables Configuration

Ensure the following variables are configured securely on the production environment (e.g. AWS ECS Task Definition or Kubernetes Secrets):

```bash
# Server Port & Node Environment
PORT=8080
NODE_ENV=production

# MySQL Credentials
DB_HOST=comzilo-prod-db.xxxx.rds.amazonaws.com
DB_USER=comzilo_admin
DB_PASSWORD=RDS_PROD_PASSWORD_SECURE_2026
DB_NAME=comzilo_prod_db
DB_PORT=3306

# JWT Authentication
JWT_SECRET=PlatformSuperAdminSecureJwtSecretKey2026_ProductionOnly!

# CORS Configurations (Restrict to active domains)
CORS_ALLOWED_ORIGINS=https://admin.comzilo.com,https://seller.comzilo.com,https://comzilo.com
```

---

## 2. Database Migration & Seed Data

Ensure migrations are run automatically during the deployment pipeline:

1. **Run Migrations**:
   ```bash
   npx sequelize-cli db:migrate --env production
   ```
2. **Verify Seed Data**:
   Ensure basic tenant roles and platform settings are seeded:
   ```bash
   npx sequelize-cli db:seed:all --env production
   ```

---

## 3. SSL Configuration

- Deploy behind an Application Load Balancer (ALB) or Nginx reverse proxy with SSL certificate resolved via AWS ACM (Amazon Certificate Manager) or Let's Encrypt.
- Force redirect HTTP to HTTPS:
  - HTTPS Port: 443
  - HTTP Port: 80 (redirects to 443)

---

## 4. Backups and Disaster Recovery

- **Database Backups**: Configure AWS RDS automated daily snapshots (7-day retention).
- **Manual Archivals**: Trigger JSON snapshots using the built-in Admin panel backup command or direct cron-based backup script.

---

## 5. Deployment Steps (CI/CD Automated)

Our pipeline builds and pushes verified Docker images:

1. **CI validation checks**: Build, Lint, and QA test script execute on push.
2. **Docker Build**:
   ```bash
   docker build -t comzilo-backend ./backend
   docker build -t comzilo-admin ./admin-panel
   ```
3. **Deploy Container**: Push to AWS ECR and trigger a rolling update on ECS Fargate services.

---

## 6. Rollback Plan

If a production update fails or reports runtime issues:

1. **Traffic redirection**: Configure ALB target group to route back to the previous stable Docker image tag (e.g., `release-v1.2.0`).
2. **Database Rollback**:
   If migrations introduced breaking changes, execute migrations down step:
   ```bash
   npx sequelize-cli db:migrate:undo --env production
   ```
