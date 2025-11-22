# Data Definition Language (DDL)

DDL statements define and modify database structure - creating, altering, and dropping tables and other database objects.

## CREATE TABLE

### Basic Syntax

```sql
CREATE TABLE table_name (
    column1 datatype constraints,
    column2 datatype constraints,
    ...
    table_constraints
);
```

### Example

```sql
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    hire_date DATE DEFAULT CURRENT_DATE,
    salary DECIMAL(10,2) CHECK (salary > 0),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(dept_id)
);
```

### Common Data Types

```sql
-- Numeric
INT, SMALLINT, BIGINT          -- Integers
DECIMAL(10,2), NUMERIC(10,2)   -- Fixed precision
FLOAT, DOUBLE                  -- Floating point

-- String
VARCHAR(n)                     -- Variable length
CHAR(n)                        -- Fixed length
TEXT                           -- Long text
ENUM('val1', 'val2')          -- Enumeration

-- Date/Time
DATE                           -- Date only
TIME                           -- Time only
DATETIME, TIMESTAMP            -- Date and time

-- Binary
BLOB                           -- Binary Large Object

-- Boolean
BOOLEAN, BOOL                  -- True/False
```

### Constraints

```sql
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    stock INT DEFAULT 0 CHECK (stock >= 0),
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);
```

## ALTER TABLE

### Add Column

```sql
ALTER TABLE employees
ADD COLUMN phone VARCHAR(20);

ALTER TABLE employees
ADD COLUMN bonus DECIMAL(10,2) DEFAULT 0;
```

### Modify Column

```sql
-- Change data type
ALTER TABLE employees
MODIFY COLUMN email VARCHAR(150);

-- Add/drop NOT NULL
ALTER TABLE employees
MODIFY COLUMN phone VARCHAR(20) NOT NULL;
```

### Drop Column

```sql
ALTER TABLE employees
DROP COLUMN bonus;
```

### Add Constraint

```sql
-- Add unique constraint
ALTER TABLE employees
ADD CONSTRAINT uk_email UNIQUE (email);

-- Add foreign key
ALTER TABLE employees
ADD CONSTRAINT fk_dept
    FOREIGN KEY (department_id)
    REFERENCES departments(dept_id);

-- Add check constraint
ALTER TABLE employees
ADD CONSTRAINT chk_salary CHECK (salary > 0);
```

### Drop Constraint

```sql
ALTER TABLE employees
DROP CONSTRAINT uk_email;
```

### Rename Table

```sql
ALTER TABLE employees
RENAME TO staff;
```

## DROP TABLE

### Basic Drop

```sql
DROP TABLE old_table;
```

### Drop if Exists

```sql
DROP TABLE IF EXISTS temp_table;
```

### Cascade Drop

```sql
-- Drop table and dependent objects
DROP TABLE orders CASCADE;
```

## CREATE INDEX

```sql
-- Single column index
CREATE INDEX idx_last_name ON employees(last_name);

-- Composite index
CREATE INDEX idx_name ON employees(last_name, first_name);

-- Unique index
CREATE UNIQUE INDEX idx_email ON employees(email);
```

## DROP INDEX

```sql
DROP INDEX idx_last_name ON employees;
```

## TRUNCATE TABLE

**Remove all rows** (faster than DELETE)

```sql
TRUNCATE TABLE temp_data;
```

**Difference from DELETE**:
- TRUNCATE is faster
- TRUNCATE resets AUTO_INCREMENT
- TRUNCATE cannot be rolled back (in some databases)
- DELETE can have WHERE clause

## CREATE VIEW

```sql
CREATE VIEW active_employees AS
SELECT emp_id, first_name, last_name, department_id
FROM employees
WHERE status = 'active';

-- Use view like a table
SELECT * FROM active_employees;
```

## DROP VIEW

```sql
DROP VIEW active_employees;
```

## Practical Examples

### E-Commerce Schema

```sql
-- Categories
CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- Products
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    stock INT DEFAULT 0 CHECK (stock >= 0),
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    INDEX idx_category (category_id),
    INDEX idx_sku (sku)
);

-- Customers
CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);
```

## Best Practices

1. **Use appropriate data types**
   ```sql
   -- Good
   CREATE TABLE orders (
       order_date DATE,
       amount DECIMAL(10,2)
   );

   -- Bad
   CREATE TABLE orders (
       order_date VARCHAR(50),  -- Use DATE
       amount FLOAT             -- Use DECIMAL for money
   );
   ```

2. **Name constraints explicitly**
   ```sql
   CREATE TABLE products (
       product_id INT,
       CONSTRAINT pk_products PRIMARY KEY (product_id),
       CONSTRAINT uk_sku UNIQUE (sku),
       CONSTRAINT fk_category FOREIGN KEY (category_id)
           REFERENCES categories(category_id)
   );
   ```

3. **Use NOT NULL for required fields**
   ```sql
   CREATE TABLE users (
       user_id INT PRIMARY KEY,
       email VARCHAR(100) NOT NULL,
       name VARCHAR(100) NOT NULL
   );
   ```

4. **Add indexes for frequently queried columns**
   ```sql
   CREATE INDEX idx_email ON users(email);
   CREATE INDEX idx_last_name ON users(last_name);
   ```

## Practice Questions

!!! question "Check Your Understanding"
    1. What's the difference between DROP and TRUNCATE?
    2. When should you use VARCHAR vs CHAR?
    3. Why name constraints explicitly?

??? example "Answers"
    1. DROP removes the table entirely. TRUNCATE removes all rows but keeps the table structure. TRUNCATE is faster than DELETE for removing all rows
    2. Use VARCHAR for variable-length strings (saves space). Use CHAR for fixed-length strings (slightly faster for small, fixed-length data like state codes)
    3. Named constraints are easier to identify in error messages and easier to drop/modify later

## Summary

DDL statements define database structure:
- **CREATE TABLE**: Define new tables
- **ALTER TABLE**: Modify existing tables
- **DROP TABLE**: Remove tables
- **CREATE/DROP INDEX**: Manage indexes
- **TRUNCATE**: Remove all rows

Proper schema design with appropriate data types and constraints is crucial for data integrity.

---

**Next**: Learn to manipulate data: [Data Manipulation Language (DML)](dml.md)
