# Joins

Joins combine data from multiple tables based on related columns.

## Types of Joins

### INNER JOIN

Returns rows where there's a match in both tables.

```sql
SELECT
    e.first_name,
    e.last_name,
    d.department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.dept_id;
```

**Result**: Only employees with matching departments

### LEFT JOIN (LEFT OUTER JOIN)

Returns all rows from left table, matching rows from right table (NULL if no match).

```sql
SELECT
    c.name,
    o.order_id,
    o.order_date
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id;
```

**Result**: All customers, even those without orders

### RIGHT JOIN (RIGHT OUTER JOIN)

Returns all rows from right table, matching rows from left table (NULL if no match).

```sql
SELECT
    e.first_name,
    d.department_name
FROM employees e
RIGHT JOIN departments d ON e.department_id = d.dept_id;
```

**Result**: All departments, even those without employees

### FULL OUTER JOIN

Returns all rows from both tables (NULL where no match).

```sql
SELECT
    e.first_name,
    d.department_name
FROM employees e
FULL OUTER JOIN departments d ON e.department_id = d.dept_id;
```

**Result**: All employees and all departments

### CROSS JOIN

Returns Cartesian product (all combinations).

```sql
SELECT * FROM colors CROSS JOIN sizes;
```

### SELF JOIN

Join table to itself.

```sql
-- Find employees and their managers
SELECT
    e.first_name AS employee,
    m.first_name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.emp_id;
```

## Multiple Joins

```sql
SELECT
    o.order_id,
    c.name AS customer_name,
    p.name AS product_name,
    oi.quantity
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
INNER JOIN order_items oi ON o.order_id = oi.order_id
INNER JOIN products p ON oi.product_id = p.product_id;
```

## Join Conditions

### Using ON

```sql
SELECT * FROM employees e
INNER JOIN departments d ON e.department_id = d.dept_id;
```

### Using USING (when column names match)

```sql
SELECT * FROM employees e
INNER JOIN departments d USING (department_id);
```

### Natural Join (automatically joins on same column names)

```sql
SELECT * FROM employees
NATURAL JOIN departments;
```

## Practice Example

```sql
-- Find customers with their orders and total spent
SELECT
    c.customer_id,
    c.name,
    COUNT(o.order_id) AS total_orders,
    SUM(o.amount) AS total_spent
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name
ORDER BY total_spent DESC;
```

## Summary

- **INNER JOIN**: Matching rows only
- **LEFT JOIN**: All from left, matching from right
- **RIGHT JOIN**: All from right, matching from left
- **FULL JOIN**: All from both tables
- **CROSS JOIN**: All combinations

---

**Next**: [Aggregate Functions](aggregate-functions.md)
