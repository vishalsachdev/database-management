# ACID Properties

ACID defines four key properties that guarantee reliable transaction processing.

## Atomicity

**All or nothing**: Transaction either completes entirely or has no effect.

```sql
START TRANSACTION;
UPDATE account SET balance = balance - 100 WHERE id = 1;
UPDATE account SET balance = balance + 100 WHERE id = 2;
COMMIT;  -- Both succeed or both rolled back
```

## Consistency

**Valid state to valid state**: Database moves from one consistent state to another.

Constraints ensure consistency:
```sql
CHECK (balance >= 0)  -- Cannot go negative
```

## Isolation

**Concurrent transactions don't interfere**: Each transaction executes as if it's alone.

```sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
```

## Durability

**Committed changes persist**: Survive system failures.

Once COMMIT succeeds, changes are permanent (logged to disk).

## Summary

ACID properties ensure reliable, consistent database operations:
- **A**tomicity: All or nothing
- **C**onsistency: Valid states only
- **I**solation: No interference
- **D**urability: Changes persist

---

**Next**: [Concurrency Control](concurrency-control.md)
