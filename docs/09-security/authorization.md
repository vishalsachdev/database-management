# Authorization and Access Control

Managing user permissions.

## GRANT and REVOKE

```sql
GRANT SELECT, INSERT ON database.* TO 'user'@'localhost';
REVOKE INSERT ON database.* FROM 'user'@'localhost';
```

## Role-Based Access Control

```sql
CREATE ROLE analyst;
GRANT SELECT ON sales.* TO analyst;
GRANT analyst TO 'john'@'localhost';
```

---

**Next**: [Encryption](encryption.md)
