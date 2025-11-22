# Index Strategies

Effective indexing improves query performance.

## When to Index

- Primary keys (automatic)
- Foreign keys
- Columns in WHERE clauses
- Columns in JOIN conditions
- Columns in ORDER BY

## When NOT to Index

- Small tables
- Columns with few distinct values
- Frequently updated columns

---

**Next**: [Query Execution Plans](execution-plans.md)
