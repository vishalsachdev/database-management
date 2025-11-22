# Encryption

Protecting data at rest and in transit.

## Encryption Types

- **At Rest**: Encrypt stored data
- **In Transit**: SSL/TLS for connections
- **Column-Level**: Encrypt specific columns

```sql
-- Column encryption
INSERT INTO users (name, ssn)
VALUES ('John', AES_ENCRYPT('123-45-6789', 'key'));
```

---

**Next**: [SQL Injection Prevention](sql-injection.md)
