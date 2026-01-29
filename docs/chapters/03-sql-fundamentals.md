# Chapter 3: SQL Fundamentals

## Learning Objectives

After completing this chapter, you will be able to:

- Understand what SQL is and why it's important
- Create databases and tables using SQL
- Use appropriate data types for different kinds of data
- Write basic SELECT queries to retrieve data
- Filter data using WHERE clauses
- Sort and limit query results
- Use aggregate functions to summarize data

## 3.1 Introduction to SQL

### What is SQL?

**SQL (Structured Query Language)** is the standard language for interacting with relational databases. It's used by all major database systems including MySQL, PostgreSQL, Oracle, SQL Server, and SQLite.

### Why SQL Matters

SQL is one of the most valuable skills for business professionals because:

- **Universal**: Works across all relational databases with minor variations
- **Powerful**: Can retrieve and manipulate complex data with simple commands
- **In-demand**: One of the top skills employers look for
- **Accessible**: Easier to learn than most programming languages

### SQL Categories

SQL commands fall into several categories:

| Category | Purpose | Examples |
|----------|---------|----------|
| **DDL** (Data Definition Language) | Define database structure | CREATE, ALTER, DROP |
| **DML** (Data Manipulation Language) | Manipulate data | SELECT, INSERT, UPDATE, DELETE |
| **DCL** (Data Control Language) | Control access | GRANT, REVOKE |
| **TCL** (Transaction Control Language) | Manage transactions | COMMIT, ROLLBACK |

In this course, we'll focus primarily on DDL and DML.

## 3.2 Creating Databases and Tables

### Creating a Database

```sql
CREATE DATABASE company_db;
```

### Using a Database

```sql
USE company_db;
```

### Creating a Table

```sql
CREATE TABLE employee (
    employee_id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    hire_date DATE,
    salary DECIMAL(10, 2),
    department_id INT
);
```

## 3.3 Data Types

Choosing the right data type is crucial for data integrity and performance.

### Numeric Data Types

| Data Type | Description | Example Use |
|-----------|-------------|-------------|
| **INT** | Whole numbers | Employee ID, Age, Quantity |
| **DECIMAL(p,s)** | Fixed-point decimal | Salary (10,2), Price (8,2) |
| **FLOAT** / **DOUBLE** | Floating-point decimal | Scientific calculations |
| **TINYINT** | Small integers (0-255) | Age, Rating (1-5) |
| **BIGINT** | Large integers | Large transaction IDs |

**Examples:**
```sql
employee_id INT              -- -2,147,483,648 to 2,147,483,647
salary DECIMAL(10,2)         -- Up to 99,999,999.99
age TINYINT                  -- 0 to 255
product_views BIGINT         -- Very large numbers
```

### String Data Types

| Data Type | Description | Example Use |
|-----------|-------------|-------------|
| **CHAR(n)** | Fixed-length string | State codes (CHAR(2)) |
| **VARCHAR(n)** | Variable-length string | Names, emails, descriptions |
| **TEXT** | Large text | Articles, reviews, comments |
| **ENUM** | Predefined values | Status ('active', 'inactive') |

**Examples:**
```sql
state_code CHAR(2)           -- Always exactly 2 characters: 'IL', 'CA'
email VARCHAR(100)           -- Up to 100 characters
description TEXT             -- Large amounts of text
status ENUM('active', 'inactive', 'pending')
```

!!! tip "CHAR vs VARCHAR"
    - Use **CHAR** when length is always the same (state codes, country codes)
    - Use **VARCHAR** when length varies (names, emails, addresses)
    - VARCHAR saves space but CHAR can be slightly faster

### Date and Time Data Types

| Data Type | Format | Example |
|-----------|--------|---------|
| **DATE** | YYYY-MM-DD | 2025-11-22 |
| **TIME** | HH:MM:SS | 14:30:00 |
| **DATETIME** | YYYY-MM-DD HH:MM:SS | 2025-11-22 14:30:00 |
| **TIMESTAMP** | YYYY-MM-DD HH:MM:SS | 2025-11-22 14:30:00 |
| **YEAR** | YYYY | 2025 |

**Examples:**
```sql
birth_date DATE              -- 1990-05-15
hire_datetime DATETIME       -- 2023-01-15 09:00:00
last_updated TIMESTAMP       -- Automatically updated
```

### Boolean Data Type

```sql
is_active BOOLEAN           -- TRUE or FALSE (stored as 1 or 0)
-- Often implemented as TINYINT(1) in MySQL
```

### Choosing Data Types: Examples

```sql
CREATE TABLE customer (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone CHAR(10),                    -- US phone: 2175551234
    birth_date DATE,
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    loyalty_points INT DEFAULT 0,
    account_balance DECIMAL(10,2) DEFAULT 0.00,
    membership_level ENUM('bronze', 'silver', 'gold', 'platinum')
);
```

## 3.4 The SELECT Statement

The SELECT statement is used to retrieve data from databases.

### Basic Syntax

```sql
SELECT column1, column2, ...
FROM table_name;
```

### Selecting All Columns

```sql
SELECT * FROM employee;
```

!!! warning "Use SELECT * Carefully"
    While `SELECT *` is convenient, in production:
    - It's less efficient (retrieves unnecessary columns)
    - It's less clear what data you need
    - It can break code if table structure changes

    **Better:** Explicitly list the columns you need

### Selecting Specific Columns

```sql
SELECT first_name, last_name, salary
FROM employee;
```

### Column Aliases

Use aliases to rename columns in the output:

```sql
SELECT
    first_name AS "First Name",
    last_name AS "Last Name",
    salary AS "Annual Salary"
FROM employee;
```

### Calculated Columns

```sql
SELECT
    first_name,
    last_name,
    salary,
    salary * 12 AS annual_salary,
    salary * 0.15 AS annual_tax
FROM employee;
```

### DISTINCT - Remove Duplicates

```sql
SELECT DISTINCT department_id
FROM employee;
```

**Example:**
```sql
-- Find all unique cities where customers live
SELECT DISTINCT city
FROM customer;
```

## 3.5 Filtering with WHERE

The WHERE clause filters rows based on conditions.

### Basic WHERE Syntax

```sql
SELECT column1, column2
FROM table_name
WHERE condition;
```

### Comparison Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| = | Equal | `WHERE salary = 50000` |
| <> or != | Not equal | `WHERE department_id <> 5` |
| > | Greater than | `WHERE salary > 50000` |
| < | Less than | `WHERE age < 30` |
| >= | Greater than or equal | `WHERE hire_date >= '2020-01-01'` |
| <= | Less than or equal | `WHERE price <= 100` |

**Examples:**
```sql
-- Employees making more than $60,000
SELECT first_name, last_name, salary
FROM employee
WHERE salary > 60000;

-- Employees hired after January 1, 2020
SELECT first_name, last_name, hire_date
FROM employee
WHERE hire_date >= '2020-01-01';
```

### Logical Operators

#### AND - Both conditions must be true

```sql
SELECT first_name, last_name, salary, department_id
FROM employee
WHERE salary > 50000 AND department_id = 3;
```

#### OR - Either condition can be true

```sql
SELECT first_name, last_name, department_id
FROM employee
WHERE department_id = 1 OR department_id = 3;
```

#### NOT - Negates a condition

```sql
SELECT first_name, last_name, department_id
FROM employee
WHERE NOT department_id = 5;
```

#### Combining Logical Operators

```sql
-- Employees in dept 1 or 3, making more than $50k
SELECT first_name, last_name, salary, department_id
FROM employee
WHERE (department_id = 1 OR department_id = 3)
  AND salary > 50000;
```

!!! warning "Use Parentheses!"
    Always use parentheses to make the logic clear:
    ```sql
    -- Unclear (probably wrong):
    WHERE dept = 1 OR dept = 2 AND salary > 50000

    -- Clear (correct):
    WHERE (dept = 1 OR dept = 2) AND salary > 50000
    ```

### Pattern Matching with LIKE

LIKE is used for pattern matching in strings:

- `%` matches any sequence of characters
- `_` matches exactly one character

**Examples:**
```sql
-- Customers whose last name starts with 'S'
SELECT first_name, last_name
FROM customer
WHERE last_name LIKE 'S%';

-- Customers whose email is from gmail
SELECT first_name, last_name, email
FROM customer
WHERE email LIKE '%@gmail.com';

-- Customers whose first name is 4 letters starting with 'J'
SELECT first_name, last_name
FROM customer
WHERE first_name LIKE 'J___';  -- J + 3 underscores
```

### Range Conditions with BETWEEN

```sql
-- Employees with salary between $40,000 and $60,000
SELECT first_name, last_name, salary
FROM employee
WHERE salary BETWEEN 40000 AND 60000;
-- Equivalent to: WHERE salary >= 40000 AND salary <= 60000

-- Orders placed in January 2024
SELECT order_id, order_date, total_amount
FROM orders
WHERE order_date BETWEEN '2024-01-01' AND '2024-01-31';
```

### Membership with IN

```sql
-- Employees in departments 1, 3, or 5
SELECT first_name, last_name, department_id
FROM employee
WHERE department_id IN (1, 3, 5);
-- Equivalent to: WHERE department_id = 1 OR department_id = 3 OR department_id = 5

-- Customers from specific cities
SELECT first_name, last_name, city
FROM customer
WHERE city IN ('Chicago', 'Champaign', 'Urbana');
```

### NULL Values

```sql
-- Employees with no email
SELECT first_name, last_name
FROM employee
WHERE email IS NULL;

-- Employees with an email
SELECT first_name, last_name, email
FROM employee
WHERE email IS NOT NULL;
```

!!! warning "NULL is Special"
    You cannot use `= NULL` or `<> NULL`. Always use `IS NULL` or `IS NOT NULL`.

    ```sql
    -- WRONG:
    WHERE email = NULL

    -- CORRECT:
    WHERE email IS NULL
    ```

## 3.6 Sorting Results with ORDER BY

### Ascending Order (Default)

```sql
SELECT first_name, last_name, salary
FROM employee
ORDER BY salary;
-- or explicitly: ORDER BY salary ASC
```

### Descending Order

```sql
SELECT first_name, last_name, salary
FROM employee
ORDER BY salary DESC;
```

### Multiple Sort Columns

```sql
-- Sort by department, then by salary within department
SELECT first_name, last_name, department_id, salary
FROM employee
ORDER BY department_id ASC, salary DESC;
```

### Sorting by Column Position

```sql
-- Sort by the 3rd column (salary), then 1st column (first_name)
SELECT first_name, last_name, salary
FROM employee
ORDER BY 3 DESC, 1 ASC;
```

!!! tip "Column Position Sorting"
    While sorting by column position works, it's better to use column names for clarity:
    ```sql
    -- Less clear:
    ORDER BY 3 DESC, 1 ASC

    -- More clear:
    ORDER BY salary DESC, first_name ASC
    ```

## 3.7 Limiting Results

### MySQL/PostgreSQL - LIMIT

```sql
-- Get the top 10 highest-paid employees
SELECT first_name, last_name, salary
FROM employee
ORDER BY salary DESC
LIMIT 10;

-- Get rows 11-20 (pagination)
SELECT first_name, last_name, salary
FROM employee
ORDER BY salary DESC
LIMIT 10 OFFSET 10;
```

### SQL Server / MS Access - TOP

```sql
-- SQL Server syntax (different from MySQL!)
SELECT TOP 10 first_name, last_name, salary
FROM employee
ORDER BY salary DESC;
```

## 3.8 Aggregate Functions

Aggregate functions perform calculations on sets of rows.

### Common Aggregate Functions

| Function | Purpose | Example |
|----------|---------|---------|
| **COUNT()** | Count rows | `COUNT(*)`, `COUNT(email)` |
| **SUM()** | Sum values | `SUM(salary)` |
| **AVG()** | Average value | `AVG(salary)` |
| **MIN()** | Minimum value | `MIN(salary)` |
| **MAX()** | Maximum value | `MAX(salary)` |

### COUNT - Counting Rows

```sql
-- Count all employees
SELECT COUNT(*) AS employee_count
FROM employee;

-- Count employees with email addresses
SELECT COUNT(email) AS employees_with_email
FROM employee;

-- Count unique departments
SELECT COUNT(DISTINCT department_id) AS department_count
FROM employee;
```

!!! note "COUNT(*) vs COUNT(column)"
    - `COUNT(*)` counts all rows
    - `COUNT(column)` counts rows where column IS NOT NULL
    - `COUNT(DISTINCT column)` counts unique non-NULL values

### SUM - Total

```sql
-- Total salary expense
SELECT SUM(salary) AS total_salary_expense
FROM employee;

-- Total sales
SELECT SUM(amount) AS total_sales
FROM orders
WHERE order_date >= '2024-01-01';
```

### AVG - Average

```sql
-- Average salary
SELECT AVG(salary) AS average_salary
FROM employee;

-- Average order value
SELECT AVG(total_amount) AS average_order_value
FROM orders;
```

### MIN and MAX

```sql
-- Salary range
SELECT
    MIN(salary) AS lowest_salary,
    MAX(salary) AS highest_salary,
    MAX(salary) - MIN(salary) AS salary_range
FROM employee;

-- Earliest and latest hire dates
SELECT
    MIN(hire_date) AS first_hire,
    MAX(hire_date) AS most_recent_hire
FROM employee;
```

### Combining Aggregate Functions

```sql
SELECT
    COUNT(*) AS total_employees,
    AVG(salary) AS avg_salary,
    MIN(salary) AS min_salary,
    MAX(salary) AS max_salary,
    SUM(salary) AS total_payroll
FROM employee;
```

## 3.9 Business Application Examples

### Marketing: Customer Analysis

```sql
-- Find all customers who joined in the last year
SELECT customer_id, first_name, last_name, registration_date
FROM customer
WHERE registration_date >= DATE_SUB(CURRENT_DATE, INTERVAL 1 YEAR)
ORDER BY registration_date DESC;

-- Find customers from Illinois
SELECT first_name, last_name, email, city
FROM customer
WHERE state = 'IL'
ORDER BY city, last_name;
```

### Finance: Transaction Analysis

```sql
-- Find all high-value transactions
SELECT transaction_id, customer_id, amount, transaction_date
FROM transactions
WHERE amount > 1000
ORDER BY amount DESC
LIMIT 20;

-- Summary statistics
SELECT
    COUNT(*) AS total_transactions,
    SUM(amount) AS total_revenue,
    AVG(amount) AS avg_transaction_value,
    MAX(amount) AS largest_transaction
FROM transactions
WHERE transaction_date >= '2024-01-01';
```

### HR: Employee Analysis

```sql
-- Find recently hired employees
SELECT first_name, last_name, hire_date, department_id
FROM employee
WHERE hire_date >= '2024-01-01'
ORDER BY hire_date DESC;

-- Salary statistics by department
SELECT
    department_id,
    COUNT(*) AS employee_count,
    AVG(salary) AS avg_salary,
    MIN(salary) AS min_salary,
    MAX(salary) AS max_salary
FROM employee
GROUP BY department_id;
```

## Key Takeaways

A. **SQL is the universal language** for working with relational databases
B. **Choose appropriate data types** to ensure data integrity and performance
C. **SELECT retrieves data** - be specific about which columns you need
D. **WHERE filters rows** - use comparison and logical operators effectively
5. **ORDER BY sorts results** - critical for meaningful output
6. **Aggregate functions summarize data** - COUNT, SUM, AVG, MIN, MAX
7. **Practice is essential** - the more queries you write, the more comfortable you'll become

## Review Questions

A. What's the difference between CHAR and VARCHAR data types?
B. Write a query to find all products priced between $10 and $50, sorted by price.
C. Explain the difference between `COUNT(*)` and `COUNT(column_name)`.
D. Why should you avoid using `SELECT *` in production code?
5. What's wrong with this query: `WHERE email = NULL`?

## Practical Exercise

Given this PRODUCT table:
```
PRODUCT
+------------+-----------------+-------+----------+-----------+
| Product_ID | Product_Name    | Price | Category | Stock_Qty |
+------------+-----------------+-------+----------+-----------+
| P001       | Laptop          | 999   | Tech     | 15        |
| P002       | Mouse           | 25    | Tech     | 150       |
| P003       | Desk Chair      | 250   | Furniture| 30        |
| P004       | Monitor         | 350   | Tech     | 45        |
| P005       | Standing Desk   | 600   | Furniture| 12        |
+------------+-----------------+-------+----------+-----------+
```

Write SQL queries for:

A. Find all Tech products
B. Find products priced over $200
C. Find the average price of all products
D. Find products with less than 20 items in stock
5. Find all products with "Desk" in the name
6. Calculate the total value of inventory (Price × Stock_Qty for all products)

## Chapter Quiz

Test your understanding of SQL fundamentals:

#### 1. What does SQL stand for?

<div class="upper-alpha" markdown>

- Simple Query Language
- Structured Query Language
- Standard Quality Language
- System Query Logic

</div>

??? question "Show Answer"
    The correct answer is **B**. SQL stands for Structured Query Language, the standard language for interacting with relational databases.

    **Concept Tested:** SQL Basics

#### 2. Which SQL command category does SELECT belong to?

<div class="upper-alpha" markdown>

- DDL (Data Definition Language)
- DML (Data Manipulation Language)
- DCL (Data Control Language)
- TCL (Transaction Control Language)

</div>

??? question "Show Answer"
    The correct answer is **B**. SELECT belongs to DML (Data Manipulation Language), which is used to retrieve and manipulate data in databases.

    **Concept Tested:** SQL Categories

#### 3. What is the main difference between CHAR and VARCHAR data types?

<div class="upper-alpha" markdown>

- CHAR stores numbers, VARCHAR stores text
- CHAR is fixed-length, VARCHAR is variable-length
- VARCHAR is faster than CHAR
- There is no difference

</div>

??? question "Show Answer"
    The correct answer is **B**. CHAR stores fixed-length strings (always uses the specified number of characters), while VARCHAR stores variable-length strings (uses only the space needed).

    **Concept Tested:** Data Types

#### 4. Which operator would you use to find customers whose last name starts with 'S'?

<div class="upper-alpha" markdown>

- WHERE last_name = 'S'
- WHERE last_name LIKE 'S%'
- WHERE last_name CONTAINS 'S'
- WHERE last_name STARTS 'S'

</div>

??? question "Show Answer"
    The correct answer is **B**. The LIKE operator with the wildcard % is used for pattern matching. 'S%' means "starts with S followed by any characters."

    **Concept Tested:** Pattern Matching

#### 5. What is wrong with this query: `WHERE email = NULL`?

<div class="upper-alpha" markdown>

- Nothing, it's correct
- Should use 'null' instead of NULL
- Should use IS NULL instead of = NULL
- Should use != NULL instead

</div>

??? question "Show Answer"
    The correct answer is **C**. NULL is a special value and requires special operators. You must use `IS NULL` or `IS NOT NULL`, never `= NULL` or `!= NULL`.

    **Concept Tested:** NULL Handling

#### 6. Which aggregate function would you use to count the number of rows in a table?

<div class="upper-alpha" markdown>

- SUM()
- TOTAL()
- COUNT()
- NUM()

</div>

??? question "Show Answer"
    The correct answer is **C**. COUNT() is the aggregate function used to count rows. COUNT(*) counts all rows, while COUNT(column) counts non-null values in that column.

    **Concept Tested:** Aggregate Functions

#### 7. What does the DISTINCT keyword do in a SELECT statement?

<div class="upper-alpha" markdown>

- Sorts the results in ascending order
- Filters rows based on a condition
- Removes duplicate rows from the result set
- Limits the number of results returned

</div>

??? question "Show Answer"
    The correct answer is **C**. DISTINCT removes duplicate rows from the result set, ensuring each row in the output is unique.

    **Concept Tested:** DISTINCT

#### 8. Which SQL statement would you use to find employees with salary between $40,000 and $60,000?

<div class="upper-alpha" markdown>

- WHERE salary > 40000 AND < 60000
- WHERE salary BETWEEN 40000 AND 60000
- WHERE salary IN (40000, 60000)
- WHERE salary LIKE '40000-60000'

</div>

??? question "Show Answer"
    The correct answer is **B**. The BETWEEN operator is used for range conditions and is equivalent to `WHERE salary >= 40000 AND salary <= 60000`.

    **Concept Tested:** Range Conditions

#### 9. Why should you avoid using `SELECT *` in production code?

<div class="upper-alpha" markdown>

- It's slower than listing specific columns
- It can break code if table structure changes
- It retrieves unnecessary data
- All of the above

</div>

??? question "Show Answer"
    The correct answer is **D**. `SELECT *` should be avoided because it's less efficient, less clear about data needs, and can break code if the table structure changes.

    **Concept Tested:** Best Practices

#### 10. What is the purpose of the ORDER BY clause?

<div class="upper-alpha" markdown>

- To filter rows based on conditions
- To group rows with the same values
- To sort the result set by specified columns
- To join multiple tables together

</div>

??? question "Show Answer"
    The correct answer is **C**. The ORDER BY clause sorts the result set by one or more specified columns, either in ascending (ASC) or descending (DESC) order.

    **Concept Tested:** Sorting Results

## Next Steps

In [Chapter 4](04-advanced-sql.md), we'll learn advanced SQL techniques including JOIN operations to combine data from multiple tables, subqueries, and window functions.

---

*Corresponds to Week 3 of BADM 350 - Chapter 7 of the textbook*
