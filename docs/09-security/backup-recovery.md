# Backup and Recovery

Protecting against data loss.

## Backup Types

- **Full Backup**: Complete database
- **Incremental**: Changes since last backup
- **Differential**: Changes since last full backup

## Recovery

```sql
-- Restore from backup
RESTORE DATABASE mydb FROM DISK = '/backup/mydb.bak';
```

---

**Next Chapter**: [Modern Database Topics](../10-modern-topics/index.md)
