# Filtering and Sorting

Advanced techniques for filtering and sorting query results.

## Advanced WHERE Clauses

### Complex Conditions

```sql
SELECT * FROM employees
WHERE (department_id = 1 OR department_id = 2)
  AND salary > 50000
  AND status = 'active';
```

### Case-Insensitive Search

```sql
-- MySQL/PostgreSQL
SELECT * FROM employees
WHERE LOWER(first_name) = 'john';

-- SQL Server
SELECT * FROM employees
WHERE first_name COLLATE SQL_Latin1_General_CP1_CI_AS = 'john';
```

### Date Filtering

```sql
-- Specific date
SELECT * FROM orders WHERE order_date = '2025-01-15';

-- Date range
SELECT * FROM orders
WHERE order_date BETWEEN '2025-01-01' AND '2025-01-31';

-- This year
SELECT * FROM orders
WHERE YEAR(order_date) = 2025;

-- Last 30 days
SELECT * FROM orders
WHERE order_date >= CURRENT_DATE - INTERVAL 30 DAY;
```

## Advanced Sorting

### NULL Handling

```sql
-- NULLs first
SELECT * FROM employees ORDER BY bonus NULLS FIRST;

-- NULLs last
SELECT * FROM employees ORDER BY bonus NULLS LAST;

-- MySQL workaround
SELECT * FROM employees ORDER BY bonus IS NULL, bonus;
```

### Conditional Sorting

```sql
-- Sort by different column based on condition
SELECT * FROM products
ORDER BY
    CASE
        WHEN category = 'electronics' THEN price DESC
        ELSE name ASC
    END;
```

## Summary

Advanced filtering and sorting enable precise data retrieval and presentation.

---

**Next**: [Joins](joins.md)
