# Tables and Relations

In the relational model, data is organized into **tables** (also called relations). Understanding table structure is fundamental to database design and usage.

## Table Structure

A table consists of:
- **Columns** (attributes): Define what kind of data is stored
- **Rows** (tuples): Individual records containing actual data
- **Schema**: The table's structure definition

```
students table:
┌─────────────┬─────────────┬──────────────────┬──────┐
│ student_id  │    name     │      email       │ gpa  │ ← Column headers
├─────────────┼─────────────┼──────────────────┼──────┤
│    1001     │ Alice Chen  │ alice@university │ 3.8  │ ← Row 1
│    1002     │ Bob Smith   │ bob@university   │ 3.5  │ ← Row 2
│    1003     │ Carol Lee   │ carol@university │ 3.9  │ ← Row 3
└─────────────┴─────────────┴──────────────────┴──────┘
```

## Creating Tables

```sql
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    gpa DECIMAL(3,2),
    enrollment_date DATE
);
```

## Data Types

### Numeric Types
```sql
CREATE TABLE example (
    tiny_int TINYINT,           -- -128 to 127
    small_int SMALLINT,         -- -32768 to 32767
    int_value INT,              -- -2147483648 to 2147483647
    big_int BIGINT,             -- Very large integers
    decimal_val DECIMAL(10,2),  -- Fixed precision (e.g., money)
    float_val FLOAT,            -- Floating point
    double_val DOUBLE           -- Double precision float
);
```

### String Types
```sql
CREATE TABLE text_example (
    fixed_char CHAR(10),        -- Fixed length (padded)
    var_char VARCHAR(100),      -- Variable length
    text_val TEXT,              -- Long text
    enum_val ENUM('A', 'B', 'C') -- Enumeration
);
```

### Date and Time Types
```sql
CREATE TABLE datetime_example (
    date_val DATE,              -- Date only: '2025-01-15'
    time_val TIME,              -- Time only: '14:30:00'
    datetime_val DATETIME,      -- Date and time: '2025-01-15 14:30:00'
    timestamp_val TIMESTAMP,    -- Timestamp with timezone
    year_val YEAR               -- Year only: 2025
);
```

## Table Properties

### 1. Degree (Arity)
Number of columns in a table

```sql
CREATE TABLE students (
    student_id INT,    -- Column 1
    name VARCHAR(100), -- Column 2
    email VARCHAR(100) -- Column 3
);
-- Degree = 3
```

### 2. Cardinality
Number of rows in a table

```
| student_id | name  |
|------------|-------|
| 1001       | Alice |
| 1002       | Bob   |
| 1003       | Carol |
-- Cardinality = 3 rows
```

## Summary

Tables are the foundation of relational databases, organizing data into rows and columns with defined types and constraints.

---

**Next**: [Keys and Constraints](keys-constraints.md)
