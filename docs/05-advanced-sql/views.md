# Views

Views are virtual tables based on SQL queries that simplify complex queries and provide data abstraction.

## Creating Views

### Basic View

```sql
CREATE VIEW active_employees AS
SELECT emp_id, first_name, last_name, department_id
FROM employees
WHERE status = 'active';

-- Use like a regular table
SELECT * FROM active_employees;
```

### View with Joins

```sql
CREATE VIEW employee_details AS
SELECT
    e.emp_id,
    e.first_name,
    e.last_name,
    d.department_name,
    d.location
FROM employees e
JOIN departments d ON e.department_id = d.dept_id;
```

### View with Aggregation

```sql
CREATE VIEW department_stats AS
SELECT
    d.department_name,
    COUNT(e.emp_id) AS employee_count,
    AVG(e.salary) AS avg_salary,
    SUM(e.salary) AS total_payroll
FROM departments d
LEFT JOIN employees e ON d.dept_id = e.department_id
GROUP BY d.dept_id, d.department_name;
```

## Benefits of Views

### 1. Simplify Complex Queries

```sql
-- Without view: complex query
SELECT c.name, SUM(o.amount) AS total
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_date >= '2025-01-01'
GROUP BY c.customer_id, c.name;

-- Create view
CREATE VIEW customer_sales AS
SELECT
    c.customer_id,
    c.name,
    SUM(o.amount) AS total_sales
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_date >= '2025-01-01'
GROUP BY c.customer_id, c.name;

-- Simple query using view
SELECT * FROM customer_sales WHERE total_sales > 1000;
```

### 2. Security and Access Control

```sql
-- Hide sensitive columns
CREATE VIEW public_employee_info AS
SELECT emp_id, first_name, last_name, department_id
FROM employees;
-- Does not include salary, SSN, etc.

-- Grant access to view, not base table
GRANT SELECT ON public_employee_info TO public_users;
```

### 3. Logical Data Independence

```sql
-- If table structure changes, update view instead of all queries
CREATE VIEW current_products AS
SELECT product_id, name, price
FROM products
WHERE discontinued = 0;
```

## Modifying Views

### OR REPLACE

```sql
CREATE OR REPLACE VIEW active_employees AS
SELECT emp_id, first_name, last_name, email, department_id
FROM employees
WHERE status = 'active';
```

### ALTER VIEW

```sql
-- Some databases support ALTER VIEW
ALTER VIEW active_employees AS
SELECT emp_id, first_name, last_name, email
FROM employees
WHERE status = 'active';
```

## Dropping Views

```sql
DROP VIEW active_employees;

-- Drop if exists
DROP VIEW IF EXISTS old_view;
```

## Updatable Views

Some views can be used for INSERT, UPDATE, DELETE:

```sql
-- Simple updatable view
CREATE VIEW sales_employees AS
SELECT emp_id, first_name, last_name, salary
FROM employees
WHERE department_id = 3;

-- Can update through view
UPDATE sales_employees
SET salary = salary * 1.10
WHERE emp_id = 101;
```

**Requirements** for updatable views:
- No DISTINCT
- No GROUP BY or aggregate functions
- No UNION
- Single base table

## Materialized Views

Some databases support materialized views (pre-computed and stored):

```sql
-- PostgreSQL example
CREATE MATERIALIZED VIEW sales_summary AS
SELECT
    product_id,
    SUM(quantity) AS total_sold,
    SUM(quantity * price) AS total_revenue
FROM order_items
GROUP BY product_id;

-- Refresh when needed
REFRESH MATERIALIZED VIEW sales_summary;
```

## Best Practices

1. **Use descriptive names**: `employee_details` not `view1`
2. **Document purpose**: Add comments explaining the view
3. **Avoid nested views**: Can hurt performance
4. **Consider performance**: Complex views can be slow
5. **Use for security**: Hide sensitive data

## Summary

Views provide:
- Simplified access to complex queries
- Data abstraction and security
- Logical independence
- Reusable query logic

Use views to simplify application code and control data access.

---

**Next**: [Indexes](indexes.md)
