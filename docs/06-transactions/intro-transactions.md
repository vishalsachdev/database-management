# Introduction to Transactions

A transaction is a sequence of database operations treated as a single unit of work.

## What is a Transaction?

**Transaction**: Group of SQL statements that execute together as one logical unit.

```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;
UPDATE accounts SET balance = balance + 100 WHERE account_id = 2;
COMMIT;
```

## All-or-Nothing Execution

Either all operations succeed (COMMIT) or all fail (ROLLBACK).

```sql
START TRANSACTION;
INSERT INTO orders (customer_id, total) VALUES (1, 100.00);
INSERT INTO order_items (order_id, product_id, quantity) VALUES (LAST_INSERT_ID(), 1, 2);
-- If any fails, rollback
COMMIT;
```

## Why Use Transactions?

- **Data Integrity**: Maintain consistency
- **Error Recovery**: Undo incomplete operations
- **Concurrent Access**: Isolate from other users
- **Business Logic**: Enforce multi-step operations

## Summary

Transactions ensure database operations execute reliably as atomic units.

---

**Next**: [ACID Properties](acid-properties.md)
