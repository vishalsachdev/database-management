# Common Table Expressions (CTEs)

CTEs create temporary named result sets for improved query readability.

## Basic CTE

```sql
WITH high_earners AS (
    SELECT emp_id, first_name, last_name, salary
    FROM employees
    WHERE salary > 100000
)
SELECT * FROM high_earners
WHERE department_id = 10;
```

## Multiple CTEs

```sql
WITH
dept_avg AS (
    SELECT department_id, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department_id
),
high_depts AS (
    SELECT department_id
    FROM dept_avg
    WHERE avg_salary > 75000
)
SELECT e.*
FROM employees e
JOIN high_depts h ON e.department_id = h.department_id;
```

## Recursive CTEs

```sql
-- Employee hierarchy
WITH RECURSIVE employee_hierarchy AS (
    SELECT emp_id, name, manager_id, 1 AS level
    FROM employees
    WHERE manager_id IS NULL
    UNION ALL
    SELECT e.emp_id, e.name, e.manager_id, eh.level + 1
    FROM employees e
    JOIN employee_hierarchy eh ON e.manager_id = eh.emp_id
)
SELECT * FROM employee_hierarchy;
```

## Benefits

- Improved readability
- Reusable within query
- Alternative to subqueries or temp tables

---

**Next**: [Window Functions](window-functions.md)
