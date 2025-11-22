# Concurrency Control

Concurrency control manages simultaneous database access to prevent conflicts.

## The Problem

```
Transaction A: UPDATE accounts SET balance = balance - 100 WHERE id = 1
Transaction B: UPDATE accounts SET balance = balance - 50 WHERE id = 1
```

Without control, both read balance = 1000:
- A writes 900 (1000 - 100)
- B writes 950 (1000 - 50)

Result: Lost update! Should be 850.

## Solutions

### Locking
Prevent concurrent access

### Multi-Version Concurrency Control (MVCC)
Multiple versions of data

### Timestamp Ordering
Order by timestamps

---

**Next**: [Locking Mechanisms](locking.md)
