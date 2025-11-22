# Chapter 2: Tables and Relational Algebra

## Learning Objectives

After completing this chapter, you will be able to:

- Understand the structure of relational database tables
- Identify and work with different types of keys
- Explain and apply integrity rules
- Perform relational algebra operations
- Understand how tables relate to each other

## 2.1 The Relational Model

The **relational model**, developed by E.F. Codd in 1970, represents data as a collection of **relations** (tables). This model is the foundation of modern database systems like MySQL, PostgreSQL, Oracle, and SQL Server.

### Why "Relational"?

The term "relational" comes from the mathematical concept of relations, not from relationships between tables (though those exist too!). Each table represents a relation, which is a set of tuples (rows).

## 2.2 Tables (Relations)

A **table** (or relation) is a two-dimensional structure consisting of rows and columns.

### Table Structure

```
STUDENT Table
+------------+------------------+--------+------+
| Student_ID | Name             | Major  | GPA  |
+------------+------------------+--------+------+
| 123456789  | Alice Johnson    | MIS    | 3.8  |
| 987654321  | Bob Smith        | FIN    | 3.5  |
| 456789123  | Carol Martinez   | ACCY   | 3.9  |
+------------+------------------+--------+------+
```

### Terminology

| Formal Term | Common Term | Definition |
|-------------|-------------|------------|
| Relation | Table | A two-dimensional structure of data |
| Tuple | Row/Record | A single entry in a table |
| Attribute | Column/Field | A characteristic or property |
| Domain | Data Type | Set of allowable values for an attribute |
| Cardinality | Row count | Number of tuples in a relation |
| Degree | Column count | Number of attributes in a relation |

### Table Characteristics

A proper relational table must have these characteristics:

1. **Each column has a unique name**
   - Column names cannot be repeated in the same table

2. **All values in a column are from the same domain**
   - All values in the GPA column must be numbers between 0.0 and 4.0

3. **Each row is unique**
   - No two rows can be exactly identical

4. **The order of rows is irrelevant**
   - Tables are sets, not lists

5. **The order of columns is irrelevant**
   - Columns can be rearranged without changing the table's meaning

6. **Each cell contains a single value (atomic)**
   - No lists or multiple values in a single cell

!!! example "Table Characteristics in Practice"
    **Good Table (Follows Rules):**
    ```
    PRODUCT
    +------------+------------------+--------+
    | Product_ID | Product_Name     | Price  |
    +------------+------------------+--------+
    | P001       | Laptop           | 999.99 |
    | P002       | Mouse            | 24.99  |
    +------------+------------------+--------+
    ```

    **Bad Table (Violates Atomic Value Rule):**
    ```
    ORDER
    +----------+------------------------+
    | Order_ID | Products               |
    +----------+------------------------+
    | O001     | Laptop, Mouse, Keyboard|  ← Multiple values!
    +----------+------------------------+
    ```

## 2.3 Keys

**Keys** are attributes (or combinations of attributes) that uniquely identify rows in a table.

### Types of Keys

#### 1. Super Key

A **super key** is any attribute (or set of attributes) that uniquely identifies a tuple.

**Example:**
In the STUDENT table:
- `Student_ID` is a super key
- `{Student_ID, Name}` is also a super key
- `{Student_ID, Name, Major}` is also a super key

#### 2. Candidate Key

A **candidate key** is a minimal super key - no subset of it can uniquely identify tuples.

**Example:**
- `Student_ID` is a candidate key (minimal)
- `{Student_ID, Name}` is NOT a candidate key (not minimal - we can remove Name)

#### 3. Primary Key (PK)

A **primary key** is the candidate key chosen to be the main identifier for the table.

Rules for primary keys:
- Must be unique
- Cannot be NULL
- Should be stable (not change over time)
- Preferably simple (single column if possible)

**Example:**
```
STUDENT
+------------+------------------+--------+------+
| Student_ID | Name             | Major  | GPA  |  ← Student_ID is the PK
+------------+------------------+--------+------+
```

#### 4. Foreign Key (FK)

A **foreign key** is an attribute in one table that references the primary key of another table.

**Example:**
```
ENROLLMENT
+---------------+------------+-------------+-------+
| Enrollment_ID | Student_ID | Course_Code | Grade |  ← Student_ID is an FK
+---------------+------------+-------------+-------+

STUDENT
+------------+------------------+--------+------+
| Student_ID | Name             | Major  | GPA  |  ← Student_ID is the PK
+------------+------------------+--------+------+
```

The `Student_ID` in ENROLLMENT references the `Student_ID` in STUDENT.

#### 5. Composite Key

A **composite key** is a primary key made up of two or more attributes.

**Example:**
```
ENROLLMENT
+------------+-------------+-------+
| Student_ID | Course_Code | Grade |  ← {Student_ID, Course_Code} is a composite PK
+------------+-------------+-------+
```

A student can enroll in multiple courses, and a course can have multiple students, but each combination of student + course is unique.

### Choosing Good Keys

!!! tip "Best Practices for Primary Keys"
    **Good PK choices:**
    - `Student_ID` (created for this purpose)
    - `Product_SKU` (unique identifier)
    - `Order_Number` (system-generated)

    **Poor PK choices:**
    - `Name` (not unique, can change)
    - `Email` (can change)
    - `Phone_Number` (can change, may not be unique internationally)

## 2.4 Integrity Rules

**Integrity rules** ensure data accuracy and consistency.

### 1. Entity Integrity

**Rule:** The primary key cannot be NULL.

**Why?** If the primary key is NULL, we cannot uniquely identify that row.

**Example:**
```
STUDENT
+------------+------------------+--------+------+
| Student_ID | Name             | Major  | GPA  |
+------------+------------------+--------+------+
| NULL       | Alice Johnson    | MIS    | 3.8  |  ← INVALID!
| 987654321  | Bob Smith        | FIN    | 3.5  |  ← Valid
+------------+------------------+--------+------+
```

### 2. Referential Integrity

**Rule:** A foreign key must either:
- Match a primary key value in the referenced table, OR
- Be NULL (if allowed)

**Why?** We shouldn't have references to non-existent records.

**Example:**
```
ENROLLMENT                           STUDENT
+---------------+------------+       +------------+------+
| Enrollment_ID | Student_ID |       | Student_ID | Name |
+---------------+------------+       +------------+------+
| E001          | 123456789  | ✓ OK  | 123456789  | Alice|
| E002          | 999999999  | ✗ BAD | 987654321  | Bob  |
+---------------+------------+       +------------+------+
                     ↑
      Student 999999999 doesn't exist!
```

### 3. Domain Integrity

**Rule:** All values in a column must be from the appropriate domain.

**Examples:**
- GPA must be between 0.0 and 4.0
- Email must contain an @ symbol
- Date_of_Birth must be a valid date

### 4. Key Integrity

**Rule:** Each primary key value must be unique within the table.

**Example:**
```
STUDENT
+------------+------------------+
| Student_ID | Name             |
+------------+------------------+
| 123456789  | Alice Johnson    |  ✓ OK
| 123456789  | Bob Smith        |  ✗ INVALID! Duplicate key
+------------+------------------+
```

## 2.5 Relational Algebra

**Relational algebra** is a formal language for querying relational databases. It provides the theoretical foundation for SQL.

### Basic Operators

#### 1. SELECT (σ) - Filter Rows

The SELECT operator filters rows based on a condition.

**Notation:** σ<sub>condition</sub>(Table)

**Example:**
```
σ_{GPA > 3.5}(STUDENT)

Returns students with GPA greater than 3.5
```

#### 2. PROJECT (π) - Choose Columns

The PROJECT operator selects specific columns.

**Notation:** π<sub>column1, column2, ...</sub>(Table)

**Example:**
```
π_{Student_ID, Name}(STUDENT)

Returns only the Student_ID and Name columns
```

#### 3. UNION (∪) - Combine Rows

The UNION operator combines rows from two tables (tables must have the same structure).

**Notation:** Table1 ∪ Table2

**Example:**
```
SPRING_STUDENTS ∪ FALL_STUDENTS

Returns all students from both semesters (no duplicates)
```

#### 4. INTERSECTION (∩) - Common Rows

The INTERSECTION operator returns rows that appear in both tables.

**Notation:** Table1 ∩ Table2

**Example:**
```
SPRING_STUDENTS ∩ FALL_STUDENTS

Returns students who enrolled in both semesters
```

#### 5. DIFFERENCE (−) - Remove Rows

The DIFFERENCE operator returns rows in the first table but not in the second.

**Notation:** Table1 − Table2

**Example:**
```
SPRING_STUDENTS − GRADUATED_STUDENTS

Returns students who were enrolled in spring but haven't graduated
```

#### 6. CARTESIAN PRODUCT (×) - All Combinations

The CARTESIAN PRODUCT creates all possible combinations of rows from two tables.

**Notation:** Table1 × Table2

**Example:**
If Table1 has 3 rows and Table2 has 4 rows, the result has 3 × 4 = 12 rows.

#### 7. JOIN (⋈) - Combine Related Rows

The JOIN operator combines rows from two tables based on a related column.

**Notation:** Table1 ⋈<sub>condition</sub> Table2

**Example:**
```
STUDENT ⋈_{STUDENT.Student_ID = ENROLLMENT.Student_ID} ENROLLMENT

Returns students with their enrollments
```

### Combining Operators

Relational algebra operators can be combined to create complex queries:

**Example:** Find names of students with GPA > 3.5
```
π_{Name}(σ_{GPA > 3.5}(STUDENT))
```

**Step-by-step:**
1. σ<sub>GPA > 3.5</sub>(STUDENT) - Filter students with GPA > 3.5
2. π<sub>Name</sub>(...) - Project only the Name column

## 2.6 Practical Example: University Database

Let's see how these concepts work together:

### Tables

```
STUDENT
+------------+------------------+--------+------+
| Student_ID | Name             | Major  | GPA  |  ← PK: Student_ID
+------------+------------------+--------+------+
| 123456789  | Alice Johnson    | MIS    | 3.8  |
| 987654321  | Bob Smith        | FIN    | 3.5  |
| 456789123  | Carol Martinez   | ACCY   | 3.9  |
+------------+------------------+--------+------+

COURSE
+-------------+----------------------------+---------+
| Course_Code | Course_Title               | Credits |  ← PK: Course_Code
+-------------+----------------------------+---------+
| BADM350     | Database Management        | 3       |
| BADM310     | Management Information Sys | 3       |
| FIN221      | Corporate Finance          | 3       |
+-------------+----------------------------+---------+

ENROLLMENT
+---------------+------------+-------------+-------+
| Enrollment_ID | Student_ID | Course_Code | Grade |  ← PK: Enrollment_ID
+---------------+------------+-------------+-------+  ← FK: Student_ID → STUDENT
| E001          | 123456789  | BADM350     | A     |  ← FK: Course_Code → COURSE
| E002          | 123456789  | BADM310     | A-    |
| E003          | 987654321  | BADM350     | B+    |
| E004          | 456789123  | FIN221      | A     |
+---------------+------------+-------------+-------+
```

### Sample Queries Using Relational Algebra

**Q1:** Find all MIS majors
```
σ_{Major = 'MIS'}(STUDENT)
```

**Q2:** Find student IDs and course codes for all enrollments
```
π_{Student_ID, Course_Code}(ENROLLMENT)
```

**Q3:** Find names of students enrolled in BADM350
```
π_{Name}(
  STUDENT ⋈_{STUDENT.Student_ID = ENROLLMENT.Student_ID}
  (σ_{Course_Code = 'BADM350'}(ENROLLMENT))
)
```

## Business Application Examples

### Marketing: Customer Segmentation

```
HIGH_VALUE_CUSTOMERS = σ_{Total_Purchases > 1000}(CUSTOMER)

RECENT_BUYERS = σ_{Last_Purchase_Date > '2024-01-01'}(CUSTOMER)

TARGET_LIST = HIGH_VALUE_CUSTOMERS ∩ RECENT_BUYERS
```

### Finance: Overdue Invoices

```
OVERDUE = σ_{Due_Date < TODAY AND Status ≠ 'PAID'}(INVOICE)

π_{Customer_Name, Invoice_Number, Amount}(
  CUSTOMER ⋈ OVERDUE
)
```

## Key Takeaways

1. **Tables are the foundation** of relational databases - they organize data in rows and columns
2. **Keys uniquely identify rows** - Primary keys identify rows within a table, foreign keys link tables
3. **Integrity rules ensure data quality** - Entity, referential, domain, and key integrity
4. **Relational algebra provides operations** - SELECT, PROJECT, JOIN, UNION, and others
5. **These concepts underlie SQL** - Understanding relational algebra helps you write better SQL

## Review Questions

1. What are the six characteristics that define a proper relational table?
2. Explain the difference between a candidate key and a primary key.
3. What is referential integrity, and why is it important?
4. Describe a scenario where a composite key would be appropriate.
5. Write a relational algebra expression to find all products with price less than $50.

## Practical Exercise

Design a simple database for a library system:

1. Create three tables: BOOK, MEMBER, and LOAN
2. Identify appropriate primary keys for each table
3. Identify any foreign keys needed
4. Write relational algebra expressions for:
   - Finding all books currently on loan
   - Finding members who have never borrowed a book
   - Finding overdue loans

## Next Steps

In [Chapter 3](03-sql-fundamentals.md), we'll learn SQL - the practical language for implementing the concepts you've learned in this chapter.

---

*Corresponds to Week 2 of BADM 350 - Chapter 3 of the textbook*
