# Indexes

Indexes improve query performance by creating fast lookup structures.

## Creating Indexes

```sql
-- Single column index
CREATE INDEX idx_last_name ON employees(last_name);

-- Composite index
CREATE INDEX idx_name ON employees(last_name, first_name);

-- Unique index
CREATE UNIQUE INDEX idx_email ON employees(email);
```

## When to Use Indexes

- Columns in WHERE clauses
- Foreign keys
- Columns used in JOIN conditions
- Columns in ORDER BY

## Index Types

- **B-Tree**: Default, good for most cases
- **Hash**: Exact match lookups
- **Full-text**: Text search

## Performance Impact

**Benefits**: Faster SELECT queries

**Costs**: Slower INSERT/UPDATE/DELETE, more storage

## Summary

Indexes speed up queries but have overhead. Index strategically based on query patterns.

---

**Next**: [Stored Procedures](stored-procedures.md)
