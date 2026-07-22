# Comzilo Backend: Database Backup & Restore Procedures

This document outlines the standard operational procedures for database backups, restores, migration rollbacks, and disaster recovery for the Comzilo backend platform.

---

## 1. Daily & Automated Database Backups

### MySQL Dump Backup Command
Execute automated logical backups using `mysqldump`:

```bash
mysqldump -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD \
  --single-transaction \
  --routines \
  --triggers \
  --events \
  --quick \
  --lock-tables=false \
  comzilo_prod | gzip > /backups/comzilo_prod_$(date +%Y%m%d_%H%M%S).sql.gz
```

### AWS S3 Automated Cron Upload
```cron
0 2 * * * /usr/local/bin/backup_comzilo.sh && aws s3 cp /backups/ s3://comzilo-db-backups/ --recursive
```

---

## 2. Database Restore Procedure

To restore a database snapshot from backup:

```bash
# 1. Decompress backup archive
gunzip -k /backups/comzilo_prod_20260721_120000.sql.gz

# 2. Restore MySQL schema and data
mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD comzilo_prod < /backups/comzilo_prod_20260721_120000.sql
```

---

## 3. Migration Rollback & Recovery

If a migration fails or needs to be safely reverted:

```bash
# Rollback single migration step
npm run db:migrate:undo

# Verify status of active database migrations
npm run db:migrate:status

# Full rollback of all migrations (development / test env)
npm run db:test:migrate:undo:all
```

---

## 4. Disaster Recovery (DR) Plan

1. **RTO (Recovery Time Objective)**: < 15 Minutes
2. **RPO (Recovery Point Objective)**: < 5 Minutes (using MySQL Binary Logs)
3. **Failover**: Automated database failover via AWS RDS Multi-AZ or MySQL InnoDB Cluster replica promotion.
