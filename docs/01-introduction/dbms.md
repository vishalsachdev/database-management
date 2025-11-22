# Database Management Systems (DBMS)

A **Database Management System (DBMS)** is software that enables users to define, create, maintain, and control access to databases. It serves as an intermediary between users/applications and the physical database.

## Core Functions of a DBMS

### 1. Data Definition

**Purpose**: Define the database structure and schema

**Operations**:
- Create tables, views, indexes
- Define data types and constraints
- Establish relationships
- Set up user roles and permissions

**Example**:
```sql
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(50),
    salary DECIMAL(10,2) CHECK (salary > 0),
    hire_date DATE DEFAULT CURRENT_DATE
);
```

### 2. Data Manipulation

**Purpose**: Insert, update, delete, and query data

**Operations**:
- INSERT: Add new records
- UPDATE: Modify existing records
- DELETE: Remove records
- SELECT: Query and retrieve data

**Example**:
```sql
-- Insert
INSERT INTO employees (emp_id, name, department, salary)
VALUES (101, 'John Smith', 'Engineering', 75000);

-- Update
UPDATE employees
SET salary = salary * 1.10
WHERE department = 'Engineering';

-- Delete
DELETE FROM employees
WHERE emp_id = 101;

-- Select
SELECT name, salary
FROM employees
WHERE department = 'Engineering'
ORDER BY salary DESC;
```

### 3. Data Security

**Purpose**: Protect data from unauthorized access

**Features**:
- User authentication
- Access control (permissions)
- Encryption
- Audit logging

**Example**:
```sql
-- Create user
CREATE USER 'analyst'@'localhost' IDENTIFIED BY 'secure_password';

-- Grant specific permissions
GRANT SELECT, INSERT ON sales_db.* TO 'analyst'@'localhost';

-- Revoke permissions
REVOKE INSERT ON sales_db.* FROM 'analyst'@'localhost';
```

### 4. Data Integrity

**Purpose**: Maintain accuracy and consistency of data

**Mechanisms**:
- Entity integrity (primary keys)
- Referential integrity (foreign keys)
- Domain constraints (data types, CHECK constraints)
- Business rules (triggers)

**Example**:
```sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY,                    -- Entity integrity
    customer_id INT NOT NULL,
    order_date DATE DEFAULT CURRENT_DATE,
    total DECIMAL(10,2) CHECK (total >= 0),      -- Domain constraint
    FOREIGN KEY (customer_id)                    -- Referential integrity
        REFERENCES customers(customer_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);
```

### 5. Transaction Management

**Purpose**: Ensure database consistency through ACID properties

**ACID Properties**:

#### Atomicity
All operations in a transaction succeed or all fail
```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;
UPDATE accounts SET balance = balance + 100 WHERE account_id = 2;
COMMIT;  -- Both updates succeed or both are rolled back
```

#### Consistency
Database moves from one valid state to another
```sql
-- Constraint ensures consistency
ALTER TABLE accounts ADD CONSTRAINT positive_balance
CHECK (balance >= 0);
```

#### Isolation
Concurrent transactions don't interfere with each other
```sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
```

#### Durability
Committed changes are permanent
```sql
COMMIT;  -- Changes are written to disk and survive system failures
```

### 6. Concurrency Control

**Purpose**: Handle multiple users accessing data simultaneously

**Techniques**:

#### Locking
```sql
-- Explicit locking
SELECT * FROM inventory WHERE product_id = 100 FOR UPDATE;
-- Other transactions must wait
UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 100;
COMMIT;
```

#### Multi-Version Concurrency Control (MVCC)
- Each transaction sees a snapshot of the database
- Readers don't block writers, writers don't block readers

### 7. Backup and Recovery

**Purpose**: Protect against data loss and restore after failures

**Mechanisms**:

#### Backup Types
```sql
-- Full backup
BACKUP DATABASE sales_db TO DISK = '/backups/sales_full.bak';

-- Incremental backup
BACKUP DATABASE sales_db TO DISK = '/backups/sales_incr.bak'
WITH DIFFERENTIAL;

-- Transaction log backup
BACKUP LOG sales_db TO DISK = '/backups/sales_log.bak';
```

#### Recovery
```sql
-- Restore from backup
RESTORE DATABASE sales_db FROM DISK = '/backups/sales_full.bak';

-- Point-in-time recovery
RESTORE DATABASE sales_db FROM DISK = '/backups/sales_full.bak'
WITH RECOVERY, STOPAT = '2025-01-15 14:30:00';
```

### 8. Query Processing and Optimization

**Purpose**: Execute queries efficiently

**Process**:
1. **Parsing**: Validate SQL syntax
2. **Optimization**: Choose best execution plan
3. **Execution**: Run the optimized query

**Example**:
```sql
-- Query
EXPLAIN SELECT e.name, d.department_name
FROM employees e
JOIN departments d ON e.dept_id = d.dept_id
WHERE d.location = 'New York';

-- DBMS might choose:
-- 1. Use index on departments.location
-- 2. Filter departments first
-- 3. Use nested loop join
-- 4. Use index on dept_id for join
```

## DBMS Architecture

### Three-Schema Architecture

#### 1. External Level (User Views)
What users see - customized views of the data
```sql
CREATE VIEW engineering_employees AS
SELECT emp_id, name, salary
FROM employees
WHERE department = 'Engineering';
```

#### 2. Conceptual Level (Logical Schema)
Overall logical structure of the database
```sql
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    name VARCHAR(100),
    department VARCHAR(50),
    salary DECIMAL(10,2)
);
```

#### 3. Internal Level (Physical Schema)
How data is physically stored
```
- Storage structure (B-trees, hash tables)
- File organization
- Index structures
- Data compression
```

### Data Independence

**Logical Data Independence**:
Change logical schema without affecting external schemas
```sql
-- Add column to table
ALTER TABLE employees ADD COLUMN email VARCHAR(100);
-- Existing views remain unaffected
```

**Physical Data Independence**:
Change physical storage without affecting logical schema
```sql
-- Add index - doesn't change table structure
CREATE INDEX idx_department ON employees(department);
-- Query results unchanged, performance improved
```

## Components of a DBMS

```
┌─────────────────────────────────────────┐
│         Application Programs            │
│             User Queries                │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│      Query Processor                    │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │ DML Compiler │  │ DDL Compiler    │ │
│  └──────────────┘  └─────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │    Query Optimizer                 │ │
│  └────────────────────────────────────┘ │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│      Storage Manager                    │
│  ┌──────────────────────────────────┐  │
│  │  Transaction Manager             │  │
│  │  Buffer Manager                  │  │
│  │  File Manager                    │  │
│  │  Authorization & Integrity       │  │
│  └──────────────────────────────────┘  │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│         Physical Storage                │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │  Data   │  │ Indexes │  │  Logs   │ │
│  │  Files  │  │         │  │         │ │
│  └─────────┘  └─────────┘  └─────────┘ │
└─────────────────────────────────────────┘
```

## Popular DBMS Systems

### Open Source

#### MySQL / MariaDB
- Most popular open-source RDBMS
- Web applications, WordPress, etc.
- High performance for read-heavy workloads

#### PostgreSQL
- Advanced open-source RDBMS
- Strong standards compliance
- Extensible (custom types, functions)
- ACID compliant

#### SQLite
- Embedded database
- Zero configuration
- Mobile apps, desktop applications

### Commercial

#### Oracle Database
- Enterprise-grade RDBMS
- High scalability and availability
- Advanced features (RAC, partitioning)

#### Microsoft SQL Server
- Tight integration with Microsoft ecosystem
- Business intelligence tools
- Cloud version (Azure SQL)

#### IBM DB2
- Mainframe and enterprise systems
- High performance for OLTP and OLAP

## Advantages of Using a DBMS

### 1. Data Independence
Applications don't depend on physical storage details

### 2. Efficient Data Access
Optimized query execution and indexing

### 3. Data Integrity and Security
Built-in constraints and access control

### 4. Reduced Data Redundancy
Centralized data storage minimizes duplication

### 5. Concurrent Access
Multiple users can access data simultaneously safely

### 6. Backup and Recovery
Automated tools for data protection

### 7. Standards Compliance
SQL standards ensure portability

## Disadvantages and Limitations

### 1. Cost
- Expensive licensing (commercial systems)
- Hardware requirements
- Skilled personnel needed

### 2. Complexity
- Learning curve for administrators
- Complex configuration and tuning

### 3. Performance Overhead
- Additional layer between application and data
- May be overkill for simple applications

### 4. Single Point of Failure
- If DBMS fails, all applications affected
- Mitigated with clustering and replication

## Practice Questions

!!! question "Check Your Understanding"
    1. What are the four ACID properties and why are they important?
    2. Explain the difference between physical and logical data independence.
    3. What is the role of the query optimizer in a DBMS?
    4. Why is concurrency control necessary in a DBMS?

??? example "Answers"
    1. **ACID**: Atomicity (all or nothing), Consistency (valid state to valid state), Isolation (concurrent transactions don't interfere), Durability (committed changes persist). They ensure reliable transaction processing
    2. **Physical data independence**: Changing storage details doesn't affect logical schema. **Logical data independence**: Changing logical schema doesn't affect external views/applications
    3. The query optimizer analyzes different ways to execute a query and chooses the most efficient execution plan based on statistics, indexes, and cost models
    4. Concurrency control prevents conflicts when multiple users access the same data simultaneously, ensuring data consistency and isolation between transactions

## Summary

A DBMS is essential software that:

- **Manages** the creation, maintenance, and use of databases
- **Ensures** data integrity, security, and consistency
- **Provides** efficient data access and query processing
- **Supports** concurrent users and transactions
- **Protects** data through backup and recovery mechanisms

The DBMS acts as a critical intermediary between users/applications and the physical database, providing abstraction, automation, and control that makes modern data-driven applications possible.

---

**Next**: Understand the benefits of databases: [Why Use Databases?](why-databases.md)
