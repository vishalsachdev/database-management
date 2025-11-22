# Window Functions

Window functions perform calculations across sets of rows related to the current row.

## Basic Window Function

```sql
SELECT
    name,
    salary,
    department_id,
    AVG(salary) OVER (PARTITION BY department_id) AS dept_avg_salary
FROM employees;
```

## Common Window Functions

### ROW_NUMBER
```sql
SELECT
    name,
    salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) AS rank
FROM employees;
```

### RANK and DENSE_RANK
```sql
SELECT
    name,
    salary,
    RANK() OVER (ORDER BY salary DESC) AS rank,
    DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rank
FROM employees;
```

### LAG and LEAD
```sql
SELECT
    name,
    salary,
    LAG(salary) OVER (ORDER BY hire_date) AS previous_hire_salary,
    LEAD(salary) OVER (ORDER BY hire_date) AS next_hire_salary
FROM employees;
```

## PARTITION BY

```sql
-- Rank within each department
SELECT
    name,
    department_id,
    salary,
    RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS dept_rank
FROM employees;
```

## Use Cases

- Running totals
- Moving averages
- Ranking
- Compare to previous/next row
- Top N per group

## Example: Top 3 Salaries per Department

```sql
WITH ranked_employees AS (
    SELECT
        emp_id,
        name,
        department_id,
        salary,
        ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rn
    FROM employees
)
SELECT emp_id, name, department_id, salary
FROM ranked_employees
WHERE rn <= 3;
```

## Summary

Window functions enable advanced analytics without grouping:
- **ROW_NUMBER**, **RANK**, **DENSE_RANK**: Ranking
- **LAG**, **LEAD**: Access adjacent rows
- **SUM**, **AVG**, **COUNT**: Aggregates over windows
- **PARTITION BY**: Define windows

---

**Next Chapter**: [Transaction Management](../06-transactions/index.md)
