# Isolation Levels

Isolation levels balance consistency with performance.

## Levels (least to most isolated)

1. **READ UNCOMMITTED**: Can read uncommitted changes (dirty reads)
2. **READ COMMITTED**: Only read committed data
3. **REPEATABLE READ**: Same read results within transaction
4. **SERIALIZABLE**: Complete isolation

```sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
```

---

**Next**: [Deadlocks](deadlocks.md)
