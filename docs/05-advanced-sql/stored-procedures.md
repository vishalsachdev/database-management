# Stored Procedures

Stored procedures are reusable SQL code blocks stored in the database.

## Creating Stored Procedures

```sql
DELIMITER //
CREATE PROCEDURE GetEmployeesByDept(IN dept_id INT)
BEGIN
    SELECT emp_id, first_name, last_name, salary
    FROM employees
    WHERE department_id = dept_id;
END //
DELIMITER ;
```

## Calling Procedures

```sql
CALL GetEmployeesByDept(10);
```

## Parameters

- **IN**: Input parameter
- **OUT**: Output parameter
- **INOUT**: Both input and output

## Benefits

- Reusable code
- Better performance (pre-compiled)
- Security (grant execute without table access)
- Encapsulate business logic

---

**Next**: [Triggers](triggers.md)
