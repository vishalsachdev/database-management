# Introduction to SQL

SQL (Structured Query Language) is the standard language for managing and manipulating relational databases.

## What is SQL?

**SQL** is a declarative language for:
- Defining database structures
- Inserting, updating, and deleting data
- Querying and retrieving data
- Controlling access and transactions

**Key Feature**: You specify **what** you want, not **how** to get it

```sql
-- Declarative: what you want
SELECT name, email FROM students WHERE gpa > 3.5;

-- (Database determines how to execute efficiently)
```

## History

- **1970**: Edgar F. Codd publishes relational model
- **1974**: IBM develops SEQUEL (Structured English QUEry Language)
- **1976**: Renamed to SQL
- **1986**: ANSI standardizes SQL
- **1987**: ISO adopts SQL standard
- **Today**: SQL is universal for relational databases

## SQL Standards

| Year | Standard | Key Features |
|------|----------|--------------|
| SQL-86 | First standard | Basic queries, DDL, DML |
| SQL-92 | Major update | Joins, subqueries, new data types |
| SQL:1999 | SQL3 | Triggers, procedures, recursion |
| SQL:2003 | | Window functions, XML |
| SQL:2011 | | Temporal data |
| SQL:2016 | | JSON support |

## SQL Dialects

Different databases implement SQL with variations:

| Database | Dialect | Notable Features |
|----------|---------|------------------|
| MySQL | MySQL SQL | LIMIT, auto-increment |
| PostgreSQL | PL/pgSQL | Advanced features, standards-compliant |
| Oracle | PL/SQL | Powerful procedural language |
| SQL Server | T-SQL | Microsoft-specific features |
| SQLite | SQLite SQL | Minimal, embedded |

**Core SQL is portable**, but advanced features vary.

## SQL Components

### 1. Data Definition Language (DDL)
```sql
CREATE TABLE students (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

ALTER TABLE students ADD COLUMN email VARCHAR(100);

DROP TABLE old_table;
```

### 2. Data Manipulation Language (DML)
```sql
INSERT INTO students VALUES (1, 'Alice', 'alice@email.com');

UPDATE students SET email = 'newemail@email.com' WHERE id = 1;

DELETE FROM students WHERE id = 1;

SELECT * FROM students;
```

### 3. Data Control Language (DCL)
```sql
GRANT SELECT, INSERT ON students TO analyst;

REVOKE INSERT ON students FROM analyst;
```

### 4. Transaction Control Language (TCL)
```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

## SQL Syntax Rules

### Case Insensitivity
```sql
SELECT * FROM students;  -- Same as
select * from students;  -- Same as
SeLeCt * FrOm students;  -- (But don't do this!)
```

**Convention**: Keywords in UPPERCASE, identifiers in lowercase
```sql
SELECT name, email FROM students WHERE gpa > 3.5;
```

### Statement Terminator
```sql
SELECT * FROM students;  -- Semicolon terminates statement

SELECT * FROM students;
SELECT * FROM courses;   -- Multiple statements
```

### Comments
```sql
-- Single line comment
SELECT name FROM students;  -- Another comment

/* Multi-line
   comment */
SELECT * FROM students;
```

### String Literals
```sql
-- Single quotes for strings
SELECT * FROM students WHERE name = 'Alice';

-- Escape single quotes by doubling them
SELECT * FROM students WHERE name = 'O''Brien';
```

## Basic SQL Example

```sql
-- Create a table
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    salary DECIMAL(10,2),
    department VARCHAR(50)
);

-- Insert data
INSERT INTO employees VALUES
    (1, 'John', 'Doe', 50000, 'Engineering'),
    (2, 'Jane', 'Smith', 60000, 'Marketing'),
    (3, 'Bob', 'Johnson', 55000, 'Engineering');

-- Query data
SELECT first_name, last_name, salary
FROM employees
WHERE department = 'Engineering'
ORDER BY salary DESC;

-- Update data
UPDATE employees
SET salary = salary * 1.10
WHERE department = 'Engineering';

-- Delete data
DELETE FROM employees
WHERE emp_id = 3;
```

## Why Learn SQL?

1. **Universal**: Works with all major databases
2. **Powerful**: Complex queries in simple syntax
3. **In-Demand**: Essential skill for many careers
4. **Declarative**: Easy to learn and read
5. **Efficient**: Database optimizes execution

## Practice Questions

!!! question "Check Your Understanding"
    1. What does "declarative" mean in the context of SQL?
    2. Name the four main categories of SQL commands.
    3. Why are there different SQL dialects?

??? example "Answers"
    1. Declarative means you specify what results you want, not how to get them. The database figures out the execution plan
    2. DDL (Data Definition), DML (Data Manipulation), DCL (Data Control), TCL (Transaction Control)
    3. Different database vendors extend standard SQL with proprietary features for performance, convenience, or unique capabilities

## Summary

SQL is:
- The standard language for relational databases
- Declarative - specify what, not how
- Organized into DDL, DML, DCL, and TCL
- Portable across databases (with some dialect differences)
- Essential for working with data

---

**Next**: Learn how to define database structures: [Data Definition Language (DDL)](ddl.md)
