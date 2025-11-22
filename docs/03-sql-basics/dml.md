# Data Manipulation Language (DML)

DML statements insert, update, delete, and query data in tables.

## INSERT

### Insert Single Row

```sql
INSERT INTO employees (emp_id, first_name, last_name, salary)
VALUES (1, 'John', 'Doe', 50000);
```

### Insert Multiple Rows

```sql
INSERT INTO employees (emp_id, first_name, last_name, salary)
VALUES
    (2, 'Jane', 'Smith', 60000),
    (3, 'Bob', 'Johnson', 55000),
    (4, 'Alice', 'Williams', 65000);
```

### Insert with Default Values

```sql
-- Omit columns with defaults
INSERT INTO employees (emp_id, first_name, last_name)
VALUES (5, 'Charlie', 'Brown');
-- hire_date gets DEFAULT value

-- Explicitly use DEFAULT
INSERT INTO employees (emp_id, first_name, last_name, hire_date)
VALUES (6, 'Diana', 'Prince', DEFAULT);
```

### Insert from SELECT

```sql
INSERT INTO archived_orders
SELECT * FROM orders
WHERE order_date < '2024-01-01';
```

## UPDATE

### Update Single Row

```sql
UPDATE employees
SET salary = 55000
WHERE emp_id = 1;
```

### Update Multiple Columns

```sql
UPDATE employees
SET
    salary = 60000,
    department_id = 2,
    updated_at = CURRENT_TIMESTAMP
WHERE emp_id = 1;
```

### Update Multiple Rows

```sql
-- Give 10% raise to Engineering department
UPDATE employees
SET salary = salary * 1.10
WHERE department_id = (SELECT dept_id FROM departments WHERE name = 'Engineering');
```

### Update All Rows

```sql
-- Be careful! Updates all rows
UPDATE employees
SET status = 'active';
```

### Update with Calculations

```sql
-- Increase price by 5%
UPDATE products
SET price = price * 1.05
WHERE category_id = 3;

-- Calculate bonus as 10% of salary
UPDATE employees
SET bonus = salary * 0.10
WHERE performance_rating >= 4;
```

## DELETE

### Delete Specific Rows

```sql
DELETE FROM employees
WHERE emp_id = 1;
```

### Delete Multiple Rows

```sql
DELETE FROM orders
WHERE order_date < '2024-01-01';
```

### Delete All Rows

```sql
-- Be careful! Deletes everything
DELETE FROM temp_table;

-- Better: Use TRUNCATE for deleting all rows
TRUNCATE TABLE temp_table;
```

### Delete with Subquery

```sql
-- Delete inactive customers with no orders
DELETE FROM customers
WHERE status = 'inactive'
  AND customer_id NOT IN (SELECT DISTINCT customer_id FROM orders);
```

## SELECT (Basic)

**Note**: Advanced SELECT covered in [Basic Queries](basic-queries.md)

### Select All Columns

```sql
SELECT * FROM employees;
```

### Select Specific Columns

```sql
SELECT first_name, last_name, salary
FROM employees;
```

### Select with WHERE

```sql
SELECT first_name, last_name, salary
FROM employees
WHERE department_id = 1;
```

## Common Patterns

### Conditional Insert

```sql
-- Insert if not exists
INSERT INTO customers (email, name)
SELECT 'john@email.com', 'John Doe'
WHERE NOT EXISTS (
    SELECT 1 FROM customers WHERE email = 'john@email.com'
);
```

### Update with JOIN

```sql
-- Update employees based on department location
UPDATE employees e
JOIN departments d ON e.department_id = d.dept_id
SET e.location = d.location
WHERE d.dept_id = 1;
```

### Safe Delete Pattern

```sql
-- First, check what will be deleted
SELECT * FROM orders WHERE order_date < '2020-01-01';

-- If looks good, delete
DELETE FROM orders WHERE order_date < '2020-01-01';
```

## Transaction Safety

```sql
-- Use transactions for important changes
START TRANSACTION;

UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;
UPDATE accounts SET balance = balance + 100 WHERE account_id = 2;

-- Check if everything looks good
SELECT * FROM accounts WHERE account_id IN (1, 2);

-- If good, commit. If not, rollback
COMMIT;
-- or
ROLLBACK;
```

## Best Practices

### 1. Always Use WHERE with UPDATE/DELETE

```sql
-- Dangerous! Updates everything
UPDATE employees SET salary = 50000;

-- Safe: Updates specific rows
UPDATE employees SET salary = 50000 WHERE emp_id = 1;
```

### 2. Test with SELECT First

```sql
-- Test which rows will be affected
SELECT * FROM employees WHERE department_id = 1;

-- Then update
UPDATE employees SET salary = salary * 1.10 WHERE department_id = 1;
```

### 3. Use Transactions for Critical Operations

```sql
START TRANSACTION;
-- Multiple related operations
COMMIT;
```

### 4. Validate Before Insert

```sql
INSERT INTO orders (customer_id, amount)
VALUES (
    (SELECT customer_id FROM customers WHERE email = 'john@email.com'),
    100.00
);
```

## Practice Questions

!!! question "Check Your Understanding"
    1. What's the difference between DELETE and TRUNCATE?
    2. Why should you always use WHERE with UPDATE and DELETE?
    3. How can you insert data from one table into another?

??? example "Answers"
    1. DELETE removes specific rows and can be rolled back. TRUNCATE removes all rows, is faster, resets AUTO_INCREMENT, but cannot always be rolled back
    2. Without WHERE, UPDATE and DELETE affect ALL rows in the table, which is rarely what you want and can cause data loss
    3. Use INSERT INTO ... SELECT: `INSERT INTO archive SELECT * FROM orders WHERE year = 2023`

## Summary

DML operations:
- **INSERT**: Add new rows
- **UPDATE**: Modify existing rows
- **DELETE**: Remove rows
- **SELECT**: Query data

Always use WHERE clauses carefully and test with SELECT before UPDATE/DELETE.

---

**Next**: Master querying data: [Basic Queries](basic-queries.md)
