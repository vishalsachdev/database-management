# Query Optimization

Writing efficient queries improves database performance.

## Optimization Techniques

- Select only needed columns
- Use WHERE to filter early
- Avoid SELECT *
- Use JOINs instead of subqueries when possible
- Use LIMIT for large result sets

## Example

```sql
-- Bad
SELECT * FROM orders;

-- Good
SELECT order_id, total, order_date 
FROM orders 
WHERE order_date >= '2025-01-01'
LIMIT 100;
```

---

**Next**: [Index Strategies](index-strategies.md)
