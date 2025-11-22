# Basic Queries

The SELECT statement is the most commonly used SQL command for retrieving data from databases.

## SELECT Basics

### Select All

```sql
SELECT * FROM employees;
```

### Select Specific Columns

```sql
SELECT first_name, last_name, email FROM employees;
```

### Column Aliases

```sql
SELECT
    first_name AS fname,
    last_name AS lname,
    salary * 12 AS annual_salary
FROM employees;
```

## WHERE Clause

### Basic Filtering

```sql
SELECT * FROM employees WHERE department_id = 1;
SELECT * FROM employees WHERE salary > 50000;
SELECT * FROM employees WHERE first_name = 'John';
```

### Comparison Operators

```sql
=   -- Equal
<>  -- Not equal (also !=)
>   -- Greater than
<   -- Less than
>=  -- Greater than or equal
<=  -- Less than or equal
```

### Logical Operators

```sql
-- AND
SELECT * FROM employees
WHERE salary > 50000 AND department_id = 1;

-- OR
SELECT * FROM employees
WHERE department_id = 1 OR department_id = 2;

-- NOT
SELECT * FROM employees
WHERE NOT department_id = 1;
```

### BETWEEN

```sql
SELECT * FROM employees
WHERE salary BETWEEN 40000 AND 60000;
```

### IN

```sql
SELECT * FROM employees
WHERE department_id IN (1, 2, 3);
```

### LIKE (Pattern Matching)

```sql
-- Starts with 'J'
SELECT * FROM employees WHERE first_name LIKE 'J%';

-- Ends with 'son'
SELECT * FROM employees WHERE last_name LIKE '%son';

-- Contains 'oh'
SELECT * FROM employees WHERE first_name LIKE '%oh%';

-- Exactly 4 characters
SELECT * FROM products WHERE sku LIKE '____';
```

### IS NULL

```sql
SELECT * FROM employees WHERE phone IS NULL;
SELECT * FROM employees WHERE phone IS NOT NULL;
```

## ORDER BY

### Ascending (Default)

```sql
SELECT * FROM employees ORDER BY last_name;
SELECT * FROM employees ORDER BY last_name ASC;
```

### Descending

```sql
SELECT * FROM employees ORDER BY salary DESC;
```

### Multiple Columns

```sql
SELECT * FROM employees
ORDER BY department_id, salary DESC;
```

## LIMIT

```sql
-- First 10 rows
SELECT * FROM employees LIMIT 10;

-- Rows 11-20 (offset 10, limit 10)
SELECT * FROM employees LIMIT 10 OFFSET 10;
```

## DISTINCT

```sql
-- Unique department IDs
SELECT DISTINCT department_id FROM employees;

-- Unique combinations
SELECT DISTINCT department_id, job_title FROM employees;
```

## Complete Example

```sql
SELECT
    first_name,
    last_name,
    email,
    salary,
    salary * 12 AS annual_salary
FROM employees
WHERE
    department_id IN (1, 2, 3)
    AND salary > 50000
    AND status = 'active'
ORDER BY salary DESC
LIMIT 10;
```

## Summary

Key clauses:
- **SELECT**: Choose columns
- **FROM**: Specify table
- **WHERE**: Filter rows
- **ORDER BY**: Sort results
- **LIMIT**: Limit number of results

---

**Next**: [Filtering and Sorting](filtering-sorting.md)
