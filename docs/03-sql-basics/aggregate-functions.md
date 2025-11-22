# Aggregate Functions

Aggregate functions perform calculations on multiple rows and return a single result.

## Common Aggregate Functions

### COUNT

```sql
-- Count all rows
SELECT COUNT(*) FROM employees;

-- Count non-NULL values
SELECT COUNT(phone) FROM employees;

-- Count distinct values
SELECT COUNT(DISTINCT department_id) FROM employees;
```

### SUM

```sql
-- Total salary
SELECT SUM(salary) FROM employees;

-- Sum by department
SELECT department_id, SUM(salary) AS total_salary
FROM employees
GROUP BY department_id;
```

### AVG

```sql
-- Average salary
SELECT AVG(salary) FROM employees;

-- Average by department
SELECT department_id, AVG(salary) AS avg_salary
FROM employees
GROUP BY department_id;
```

### MIN and MAX

```sql
-- Lowest and highest salary
SELECT MIN(salary), MAX(salary) FROM employees;

-- By department
SELECT
    department_id,
    MIN(salary) AS min_salary,
    MAX(salary) AS max_salary
FROM employees
GROUP BY department_id;
```

## GROUP BY

Group rows for aggregate calculations.

```sql
-- Count employees by department
SELECT department_id, COUNT(*) AS employee_count
FROM employees
GROUP BY department_id;

-- Multiple grouping columns
SELECT
    department_id,
    job_title,
    COUNT(*) AS count,
    AVG(salary) AS avg_salary
FROM employees
GROUP BY department_id, job_title;
```

## HAVING

Filter groups (WHERE filters rows before grouping, HAVING filters after).

```sql
-- Departments with more than 5 employees
SELECT department_id, COUNT(*) AS employee_count
FROM employees
GROUP BY department_id
HAVING COUNT(*) > 5;

-- Departments with average salary > 60000
SELECT
    department_id,
    AVG(salary) AS avg_salary
FROM employees
GROUP BY department_id
HAVING AVG(salary) > 60000;
```

## Complete Example

```sql
-- Sales summary by product category
SELECT
    c.category_name,
    COUNT(DISTINCT o.order_id) AS total_orders,
    SUM(oi.quantity) AS total_units_sold,
    SUM(oi.quantity * oi.price) AS total_revenue,
    AVG(oi.price) AS avg_price
FROM categories c
JOIN products p ON c.category_id = p.category_id
JOIN order_items oi ON p.product_id = oi.product_id
JOIN orders o ON oi.order_id = o.order_id
WHERE o.order_date >= '2025-01-01'
GROUP BY c.category_id, c.category_name
HAVING total_revenue > 10000
ORDER BY total_revenue DESC;
```

## Common Patterns

### Find duplicates

```sql
SELECT email, COUNT(*) AS count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;
```

### Top N per group

```sql
-- Highest paid employee in each department
SELECT department_id, MAX(salary) AS max_salary
FROM employees
GROUP BY department_id;
```

### Percentage calculations

```sql
SELECT
    department_id,
    COUNT(*) AS count,
    COUNT(*) * 100.0 / (SELECT COUNT(*) FROM employees) AS percentage
FROM employees
GROUP BY department_id;
```

## Practice Questions

!!! question "Check Your Understanding"
    1. What's the difference between WHERE and HAVING?
    2. Why use COUNT(*) vs COUNT(column_name)?
    3. Can you use aggregate functions in WHERE clause?

??? example "Answers"
    1. WHERE filters rows before grouping; HAVING filters groups after aggregation
    2. COUNT(*) counts all rows including NULLs; COUNT(column) counts only non-NULL values
    3. No, use HAVING instead. Aggregates must be used after GROUP BY

## Summary

Aggregate functions:
- **COUNT**: Number of rows
- **SUM**: Total of values
- **AVG**: Average of values
- **MIN/MAX**: Minimum/maximum values

Use with **GROUP BY** to aggregate by category and **HAVING** to filter groups.

---

**Next Chapter**: [Database Design](../04-database-design/index.md)
