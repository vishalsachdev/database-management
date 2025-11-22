# SQL Basics

SQL (Structured Query Language) is the standard language for interacting with relational databases. This chapter teaches you the fundamental SQL commands for creating, reading, updating, and deleting data.

## Chapter Overview

This chapter covers:

- **Introduction to SQL** - History, purpose, and SQL standards
- **Data Definition Language (DDL)** - CREATE, ALTER, DROP
- **Data Manipulation Language (DML)** - INSERT, UPDATE, DELETE
- **Basic Queries** - SELECT statements
- **Filtering and Sorting** - WHERE and ORDER BY clauses
- **Joins** - Combining data from multiple tables
- **Aggregate Functions** - SUM, COUNT, AVG, etc.

## Learning Objectives

By the end of this chapter, you should be able to:

1. Write DDL statements to create and modify database schemas
2. Insert, update, and delete data using DML statements
3. Query data using SELECT with various clauses
4. Filter and sort query results
5. Join multiple tables to retrieve related data
6. Use aggregate functions for data analysis

## SQL Categories

### DDL (Data Definition Language)
Define database structure

```sql
CREATE TABLE students (...)
ALTER TABLE students ADD COLUMN email VARCHAR(100)
DROP TABLE old_table
```

### DML (Data Manipulation Language)
Manipulate data

```sql
INSERT INTO students VALUES (...)
UPDATE students SET name = '...'
DELETE FROM students WHERE ...
SELECT * FROM students
```

### DCL (Data Control Language)
Control access

```sql
GRANT SELECT ON students TO user1
REVOKE INSERT ON students FROM user1
```

### TCL (Transaction Control Language)
Manage transactions

```sql
START TRANSACTION
COMMIT
ROLLBACK
```

## Prerequisites

- Understanding of relational database concepts (Chapter 2)
- Knowledge of tables, keys, and relationships

## Chapter Contents

1. [Introduction to SQL](intro-sql.md)
2. [Data Definition Language (DDL)](ddl.md)
3. [Data Manipulation Language (DML)](dml.md)
4. [Basic Queries](basic-queries.md)
5. [Filtering and Sorting](filtering-sorting.md)
6. [Joins](joins.md)
7. [Aggregate Functions](aggregate-functions.md)

---

*Ready to learn SQL? Start with [Introduction to SQL](intro-sql.md)*
