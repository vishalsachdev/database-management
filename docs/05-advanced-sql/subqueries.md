# Subqueries

A subquery is a query nested within another query, providing powerful ways to filter and manipulate data.

## Types of Subqueries

### Scalar Subquery
Returns a single value.

```sql
-- Find employees earning more than average
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```

### Column Subquery
Returns a single column of values.

```sql
-- Find customers who have placed orders
SELECT name
FROM customers
WHERE customer_id IN (SELECT DISTINCT customer_id FROM orders);
```

### Row Subquery
Returns multiple columns.

```sql
-- Find employees with same department and salary as employee 100
SELECT *
FROM employees
WHERE (department_id, salary) =
    (SELECT department_id, salary FROM employees WHERE emp_id = 100);
```

### Table Subquery
Returns a complete table.

```sql
-- Use subquery as a table
SELECT dept, avg_sal
FROM (
    SELECT department_id AS dept, AVG(salary) AS avg_sal
    FROM employees
    GROUP BY department_id
) AS dept_salaries
WHERE avg_sal > 50000;
```

## Subquery Locations

### WHERE Clause

```sql
SELECT name
FROM employees
WHERE department_id IN (
    SELECT dept_id FROM departments WHERE location = 'New York'
);
```

### FROM Clause (Derived Table)

```sql
SELECT AVG(dept_avg) AS company_avg
FROM (
    SELECT department_id, AVG(salary) AS dept_avg
    FROM employees
    GROUP BY department_id
) AS department_averages;
```

### SELECT Clause

```sql
SELECT
    name,
    salary,
    (SELECT AVG(salary) FROM employees) AS company_avg
FROM employees;
```

### HAVING Clause

```sql
SELECT department_id, AVG(salary) AS avg_salary
FROM employees
GROUP BY department_id
HAVING AVG(salary) > (SELECT AVG(salary) FROM employees);
```

## Correlated Subqueries

Subquery references column from outer query (executes for each row).

```sql
-- Find employees earning more than their department average
SELECT e1.name, e1.salary, e1.department_id
FROM employees e1
WHERE e1.salary > (
    SELECT AVG(e2.salary)
    FROM employees e2
    WHERE e2.department_id = e1.department_id
);
```

## EXISTS and NOT EXISTS

Test for existence of rows.

```sql
-- Find customers with at least one order
SELECT name
FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id
);

-- Find customers with no orders
SELECT name
FROM customers c
WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id
);
```

## IN vs EXISTS

```sql
-- IN: Returns list
SELECT * FROM customers
WHERE customer_id IN (SELECT customer_id FROM orders);

-- EXISTS: Tests existence (often faster for large datasets)
SELECT * FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);
```

## Practical Examples

### Find Second Highest Salary

```sql
SELECT MAX(salary)
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);
```

### Find Employees with No Subordinates

```sql
SELECT name
FROM employees e1
WHERE NOT EXISTS (
    SELECT 1 FROM employees e2 WHERE e2.manager_id = e1.emp_id
);
```

### Products Never Ordered

```sql
SELECT product_name
FROM products p
WHERE NOT EXISTS (
    SELECT 1 FROM order_items oi WHERE oi.product_id = p.product_id
);
```

## Performance Considerations

### 1. Correlated Subqueries Can Be Slow
```sql
-- Slow: correlated subquery
SELECT * FROM employees e1
WHERE salary > (SELECT AVG(salary) FROM employees e2 WHERE e2.dept_id = e1.dept_id);

-- Faster: JOIN with derived table
SELECT e.*
FROM employees e
JOIN (
    SELECT dept_id, AVG(salary) AS avg_sal FROM employees GROUP BY dept_id
) d ON e.dept_id = d.dept_id
WHERE e.salary > d.avg_sal;
```

### 2. Use EXISTS Instead of IN for Large Datasets
```sql
-- Can be slower
WHERE customer_id IN (SELECT customer_id FROM large_table)

-- Often faster
WHERE EXISTS (SELECT 1 FROM large_table WHERE ...)
```

## Summary

Subqueries provide powerful filtering and data manipulation:
- **Scalar**: Single value
- **Column**: List of values
- **Table**: Complete result set
- **Correlated**: References outer query
- **EXISTS**: Tests for existence

Choose the right type based on your needs and consider performance implications.

---

**Next**: [Views](views.md)
