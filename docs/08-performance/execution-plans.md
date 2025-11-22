# Query Execution Plans

Execution plans show how database executes queries.

## Using EXPLAIN

```sql
EXPLAIN SELECT * FROM employees WHERE department_id = 10;
```

Shows:
- Which indexes used
- Join order
- Estimated cost
- Rows scanned

---

**Next**: [Performance Tuning](performance-tuning.md)
