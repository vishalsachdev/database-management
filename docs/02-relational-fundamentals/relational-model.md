# The Relational Model

The relational model, proposed by Edgar F. Codd in 1970, provides a mathematical foundation for database management. It remains the most widely used database model today.

## Core Concepts

### 1. Relations (Tables)

A **relation** is a table with rows and columns:
- **Relation** = Table
- **Tuple** = Row (record)
- **Attribute** = Column (field)
- **Domain** = Set of allowed values for an attribute

### 2. Mathematical Foundation

Based on:
- **Set Theory**: Relations are sets of tuples
- **Predicate Logic**: Each row represents a true statement
- **Relational Algebra**: Operations on relations

## Key Principles

### 1. Data is Stored in Tables

```
Students Table:
| student_id | name       | email               | gpa  |
|------------|------------|---------------------|------|
| 1001       | Alice Chen | alice@university    | 3.8  |
| 1002       | Bob Smith  | bob@university      | 3.5  |
| 1003       | Carol Lee  | carol@university    | 3.9  |
```

### 2. Each Table Represents an Entity

**Entity**: A thing or concept with independent existence

Examples:
- Students (people)
- Courses (things)
- Enrollments (relationships)

### 3. Attributes Have Domains

**Domain**: Set of valid values

```sql
CREATE TABLE students (
    student_id INT,              -- Domain: integers
    name VARCHAR(100),           -- Domain: strings up to 100 chars
    email VARCHAR(100),          -- Domain: strings (email format)
    gpa DECIMAL(3,2),           -- Domain: decimal numbers 0.00-4.00
    enrollment_date DATE         -- Domain: valid dates
);
```

### 4. Atomic Values

Each cell contains a **single, indivisible value**

**Bad (Non-Atomic)**:
```
| student_id | name       | courses              |
|------------|------------|----------------------|
| 1001       | Alice Chen | CS101, CS102, MATH201|
```

**Good (Atomic)**:
```
Students:
| student_id | name       |
|------------|------------|
| 1001       | Alice Chen |

Enrollments:
| student_id | course_id |
|------------|-----------|
| 1001       | CS101     |
| 1001       | CS102     |
| 1001       | MATH201   |
```

### 5. No Duplicate Rows

Each tuple (row) must be unique

**Enforced by primary key**:
```sql
CREATE TABLE students (
    student_id INT PRIMARY KEY,  -- Ensures uniqueness
    name VARCHAR(100),
    email VARCHAR(100)
);
```

### 6. Row Order is Irrelevant

These two tables are equivalent:

**Table A**:
```
| student_id | name  |
|------------|-------|
| 1001       | Alice |
| 1002       | Bob   |
```

**Table B**:
```
| student_id | name  |
|------------|-------|
| 1002       | Bob   |
| 1001       | Alice |
```

### 7. Column Order is Irrelevant

Access columns by name, not position:

```sql
-- Both equivalent
SELECT name, email FROM students;
SELECT email, name FROM students;
```

## Relational Algebra

Operations for manipulating relations:

### Selection (σ)
Filter rows based on condition

```sql
-- Relational algebra: σ(gpa > 3.5)(Students)
SELECT * FROM students WHERE gpa > 3.5;
```

### Projection (π)
Select specific columns

```sql
-- Relational algebra: π(name, email)(Students)
SELECT name, email FROM students;
```

### Union (∪)
Combine rows from two tables

```sql
-- Students in CS101 OR CS102
SELECT student_id FROM cs101_students
UNION
SELECT student_id FROM cs102_students;
```

### Intersection (∩)
Find common rows

```sql
-- Students in both CS101 AND CS102
SELECT student_id FROM cs101_students
INTERSECT
SELECT student_id FROM cs102_students;
```

### Difference (−)
Rows in first table but not second

```sql
-- Students in CS101 but not CS102
SELECT student_id FROM cs101_students
EXCEPT
SELECT student_id FROM cs102_students;
```

### Cartesian Product (×)
All combinations of rows

```sql
-- All possible student-course combinations
SELECT * FROM students CROSS JOIN courses;
```

### Join (⋈)
Combine tables based on related columns

```sql
-- Students with their enrollments
SELECT s.name, e.course_id
FROM students s
JOIN enrollments e ON s.student_id = e.student_id;
```

## Codd's 12 Rules

Edgar F. Codd defined 12 rules for true relational databases:

### Rule 0: Foundation Rule
System must use relational capabilities exclusively

### Rule 1: Information Rule
All data must be stored in tables (rows and columns)

### Rule 2: Guaranteed Access
Every data value must be accessible using table name, primary key, and column name

### Rule 3: Systematic Treatment of NULL
NULL values must be supported and handled consistently

### Rule 4: Dynamic Online Catalog
Database structure must be stored in the database itself (metadata)

```sql
-- Query the catalog
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'my_database';
```

### Rule 5: Comprehensive Data Sublanguage
Must support data definition, manipulation, integrity, and transaction control

### Rule 6: View Updating
All views must be theoretically updatable

### Rule 7: High-Level Insert, Update, Delete
Must support set-based operations, not just row-by-row

### Rule 8: Physical Data Independence
Changes to storage don't affect applications

### Rule 9: Logical Data Independence
Changes to table structure don't affect applications (within reason)

### Rule 10: Integrity Independence
Integrity constraints must be stored in catalog, not application code

### Rule 11: Distribution Independence
Database can be distributed without affecting applications

### Rule 12: Non-Subversion
Cannot bypass integrity rules through low-level access

## Integrity Rules

### Entity Integrity
**Primary key cannot be NULL**

```sql
CREATE TABLE students (
    student_id INT PRIMARY KEY,  -- Cannot be NULL
    name VARCHAR(100)
);

-- This fails:
INSERT INTO students (student_id, name) VALUES (NULL, 'Alice');
-- Error: PRIMARY KEY cannot be NULL
```

### Referential Integrity
**Foreign key must reference existing primary key or be NULL**

```sql
CREATE TABLE enrollments (
    enrollment_id INT PRIMARY KEY,
    student_id INT,
    course_id VARCHAR(10),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- This fails if student 9999 doesn't exist:
INSERT INTO enrollments VALUES (1, 9999, 'CS101');
-- Error: Foreign key constraint violation
```

### Domain Integrity
**Values must be from allowed domain**

```sql
CREATE TABLE students (
    student_id INT,
    gpa DECIMAL(3,2) CHECK (gpa >= 0 AND gpa <= 4.0),
    status ENUM('active', 'inactive', 'graduated')
);

-- This fails:
INSERT INTO students VALUES (1, 5.0, 'active');
-- Error: CHECK constraint violation (gpa > 4.0)
```

## Example: University Database

```sql
-- Students relation
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    major VARCHAR(50),
    gpa DECIMAL(3,2) CHECK (gpa >= 0 AND gpa <= 4.0)
);

-- Courses relation
CREATE TABLE courses (
    course_id VARCHAR(10) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    credits INT CHECK (credits > 0),
    department VARCHAR(50)
);

-- Enrollments relation (represents relationship)
CREATE TABLE enrollments (
    enrollment_id INT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id VARCHAR(10) NOT NULL,
    semester VARCHAR(20),
    grade CHAR(2),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    UNIQUE (student_id, course_id, semester)
);
```

## Advantages of Relational Model

1. **Simplicity**: Easy to understand tables
2. **Flexibility**: Query any way needed
3. **Data Independence**: Separate logical from physical
4. **Minimal Redundancy**: Through normalization
5. **Consistency**: ACID transactions
6. **Security**: Column/row level access control
7. **Standardization**: SQL is universal

## Practice Questions

!!! question "Check Your Understanding"
    1. What are the three main components of a relation?
    2. Why must attribute values be atomic?
    3. What is the difference between a relation and a table?
    4. Explain entity integrity and referential integrity.

??? example "Answers"
    1. A relation consists of: (1) Attributes (columns), (2) Tuples (rows), (3) Domain (allowed values for attributes)
    2. Atomic values ensure each cell contains a single, indivisible value, which simplifies querying, updating, and maintains consistency
    3. Technically, a relation is a mathematical set of tuples, while a table is its physical representation. In practice, the terms are used interchangeably
    4. **Entity integrity**: Primary key cannot be NULL (each entity must be uniquely identifiable). **Referential integrity**: Foreign keys must reference existing values or be NULL (relationships must be valid)

## Summary

The relational model provides:
- Clear mathematical foundation
- Simple, intuitive structure (tables)
- Powerful operations (relational algebra)
- Strong integrity guarantees
- Data independence
- Standardization through SQL

Understanding these fundamentals is essential for effective database design and usage.

---

**Next**: Learn about table structure in detail: [Tables and Relations](tables-relations.md)
