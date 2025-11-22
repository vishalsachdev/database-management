# Chapter 7: Normalization

## Learning Objectives

After completing this chapter, you will be able to:

- Understand what normalization is and why it's important
- Identify functional dependencies in data
- Recognize and eliminate data anomalies
- Apply normalization rules to convert tables to First Normal Form (1NF)
- Apply normalization rules to convert tables to Second Normal Form (2NF)
- Apply normalization rules to convert tables to Third Normal Form (3NF)
- Understand Boyce-Codd Normal Form (BCNF)
- Make informed decisions about when to denormalize

## 7.1 Introduction to Normalization

### What is Normalization?

**Normalization** is a systematic process of organizing data in a database to:
- Minimize data redundancy (duplicate data)
- Eliminate undesirable characteristics like insertion, update, and deletion anomalies
- Ensure data dependencies make sense (i.e., storing related data together)

### Why Normalize?

**Benefits:**
1. **Eliminates redundancy** - Saves storage space
2. **Prevents anomalies** - Ensures data consistency
3. **Improves data integrity** - Easier to maintain accurate data
4. **Simplifies updates** - Change data in one place
5. **Better organization** - Logical structure reflects real-world relationships

### The Normalization Process

Normalization progresses through stages called **normal forms**:

1. **First Normal Form (1NF)** - Eliminate repeating groups and multi-valued attributes
2. **Second Normal Form (2NF)** - Eliminate partial dependencies
3. **Third Normal Form (3NF)** - Eliminate transitive dependencies
4. **Boyce-Codd Normal Form (BCNF)** - Stricter version of 3NF

!!! note "Progressive Refinement"
    Each normal form builds on the previous one. A table in 3NF is automatically in 2NF and 1NF.

## 7.2 Data Anomalies

Before we dive into normalization, let's understand the problems it solves.

### Unnormalized Table Example

```
STUDENT_COURSE (Unnormalized)
+------------+-------------+--------+-------------+------------------+----------+
| Student_ID | Student_Name| Major  | Course_Code | Course_Title     | Grade    |
+------------+-------------+--------+-------------+------------------+----------+
| 123456789  | Alice       | MIS    | BADM350     | Database Mgmt    | A        |
| 123456789  | Alice       | MIS    | BADM310     | MIS              | A-       |
| 987654321  | Bob         | FIN    | BADM350     | Database Mgmt    | B+       |
| 987654321  | Bob         | FIN    | FIN221      | Corp Finance     | A        |
+------------+-------------+--------+-------------+------------------+----------+
```

### Insertion Anomaly

**Problem:** Can't add a course unless a student enrolls in it.

**Example:** We want to add a new course BADM400 to our database, but we can't until a student enrolls in it.

### Update Anomaly

**Problem:** Updating data in one place requires updates in multiple places.

**Example:** If Alice changes her major from MIS to ACCY, we need to update multiple rows. If we miss one, we have inconsistent data.

```
-- After partial update (BAD!):
+------------+-------------+--------+-------------+------------------+----------+
| Student_ID | Student_Name| Major  | Course_Code | Course_Title     | Grade    |
+------------+-------------+--------+-------------+------------------+----------+
| 123456789  | Alice       | ACCY   | BADM350     | Database Mgmt    | A        |
| 123456789  | Alice       | MIS    | BADM310     | MIS              | A-       | ← Inconsistent!
+------------+-------------+--------+-------------+------------------+----------+
```

### Deletion Anomaly

**Problem:** Deleting data unintentionally removes other valuable information.

**Example:** If Bob drops all his courses, we lose all information about Bob as a student.

## 7.3 Functional Dependencies

Understanding **functional dependencies** is key to normalization.

### Definition

A functional dependency exists when one attribute uniquely determines another attribute.

**Notation:** X → Y (read: "X determines Y" or "Y is functionally dependent on X")

**Example:**
```
Student_ID → Student_Name, Major
```
- If you know Student_ID, you can uniquely determine Student_Name and Major
- Student_ID 123456789 always corresponds to "Alice" with major "MIS"

### Types of Functional Dependencies

#### Full Functional Dependency

Y is fully functionally dependent on X if:
- X → Y
- Y is not dependent on any proper subset of X

**Example:**
```
{Student_ID, Course_Code} → Grade
```
You need BOTH Student_ID AND Course_Code to determine Grade.

#### Partial Dependency

Y is partially dependent on X if:
- X is a composite key
- Y depends on only part of X

**Example:**
```
{Student_ID, Course_Code} → Student_Name
```
Student_Name only depends on Student_ID, not the full composite key.

#### Transitive Dependency

If A → B and B → C, then A → C is a transitive dependency.

**Example:**
```
Student_ID → Major
Major → Department_Building
Therefore: Student_ID → Department_Building (transitive)
```

## 7.4 First Normal Form (1NF)

### 1NF Rules

A table is in First Normal Form if:

1. **Each cell contains a single value** (atomic values)
2. **Each column has a unique name**
3. **The order of rows doesn't matter**
4. **No repeating groups** (no arrays or lists in fields)

### Violation Example 1: Multi-Valued Attributes

```
STUDENT (Violates 1NF)
+------------+-------------+---------------------------+
| Student_ID | Name        | Phone_Numbers             |
+------------+-------------+---------------------------+
| 123456789  | Alice       | 217-555-1234, 312-555-5678| ← Multiple values!
+------------+-------------+---------------------------+
```

**Solution:** Create a separate table for phone numbers.

```sql
-- 1NF Compliant
CREATE TABLE student (
    student_id INT PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE student_phone (
    student_id INT,
    phone_type VARCHAR(20),
    phone_number VARCHAR(15),
    PRIMARY KEY (student_id, phone_type),
    FOREIGN KEY (student_id) REFERENCES student(student_id)
);
```

### Violation Example 2: Repeating Groups

```
STUDENT (Violates 1NF)
+------------+-------------+--------+--------+--------+
| Student_ID | Name        | Course1| Course2| Course3|
+------------+-------------+--------+--------+--------+
| 123456789  | Alice       | BADM350| BADM310| NULL   | ← Repeating groups!
| 987654321  | Bob         | BADM350| FIN221 | ACCY201|
+------------+-------------+--------+--------+--------+
```

**Problems:**
- Limited number of courses
- Wastes space (NULLs)
- Difficult to query

**Solution:** Create separate enrollment table.

```sql
-- 1NF Compliant
CREATE TABLE student (
    student_id INT PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE enrollment (
    student_id INT,
    course_code VARCHAR(10),
    PRIMARY KEY (student_id, course_code),
    FOREIGN KEY (student_id) REFERENCES student(student_id)
);
```

### Practice: Converting to 1NF

**Unnormalized:**
```
ORDER
+----------+---------------+---------------------------------+
| Order_ID | Customer_Name | Products                        |
+----------+---------------+---------------------------------+
| 1001     | Alice Johnson | Laptop, Mouse, Keyboard         |
| 1002     | Bob Smith     | Monitor                         |
+----------+---------------+---------------------------------+
```

**1NF Solution:**
```sql
CREATE TABLE customer (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100)
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE product (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(100)
);

CREATE TABLE order_item (
    order_id INT,
    product_id INT,
    quantity INT DEFAULT 1,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);
```

## 7.5 Second Normal Form (2NF)

### 2NF Rules

A table is in Second Normal Form if:

1. **It is in 1NF**
2. **All non-key attributes are fully functionally dependent on the entire primary key**
   - No partial dependencies
   - Only applies to tables with composite primary keys

### Violation Example

```
ENROLLMENT (In 1NF, but violates 2NF)
+------------+-------------+-------------+------------------+----------+--------+
| Student_ID | Course_Code | Student_Name| Course_Title     | Credits  | Grade  |
+------------+-------------+-------------+------------------+----------+--------+
| 123456789  | BADM350     | Alice       | Database Mgmt    | 3        | A      |
| 123456789  | BADM310     | Alice       | MIS              | 3        | A-     |
| 987654321  | BADM350     | Bob         | Database Mgmt    | 3        | B+     |
+------------+-------------+-------------+------------------+----------+--------+
```

**Primary Key:** {Student_ID, Course_Code}

**Functional Dependencies:**
- {Student_ID, Course_Code} → Grade ✓ (Full dependency - OK)
- Student_ID → Student_Name ✗ (Partial dependency - NOT OK)
- Course_Code → Course_Title, Credits ✗ (Partial dependency - NOT OK)

**Problems:**
- Student_Name repeated for each course enrollment
- Course_Title and Credits repeated for each student enrollment
- Update anomalies: If course title changes, must update all rows

### Converting to 2NF

**Solution:** Remove partial dependencies by creating separate tables.

```sql
-- Separate table for student information
CREATE TABLE student (
    student_id INT PRIMARY KEY,
    student_name VARCHAR(100)
);

-- Separate table for course information
CREATE TABLE course (
    course_code VARCHAR(10) PRIMARY KEY,
    course_title VARCHAR(200),
    credits INT
);

-- Enrollment only stores the relationship and grade
CREATE TABLE enrollment (
    student_id INT,
    course_code VARCHAR(10),
    grade VARCHAR(2),
    PRIMARY KEY (student_id, course_code),
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (course_code) REFERENCES course(course_code)
);
```

**Result:**
```
STUDENT                          COURSE
+------------+-------------+     +-------------+------------------+--------+
| Student_ID | Student_Name|     | Course_Code | Course_Title     | Credits|
+------------+-------------+     +-------------+------------------+--------+
| 123456789  | Alice       |     | BADM350     | Database Mgmt    | 3      |
| 987654321  | Bob         |     | BADM310     | MIS              | 3      |
+------------+-------------+     +-------------+------------------+--------+

ENROLLMENT
+------------+-------------+-------+
| Student_ID | Course_Code | Grade |
+------------+-------------+-------+
| 123456789  | BADM350     | A     |
| 123456789  | BADM310     | A-    |
| 987654321  | BADM350     | B+    |
+------------+-------------+-------+
```

## 7.6 Third Normal Form (3NF)

### 3NF Rules

A table is in Third Normal Form if:

1. **It is in 2NF**
2. **No transitive dependencies** - Non-key attributes should not depend on other non-key attributes

### Violation Example

```
STUDENT (In 2NF, but violates 3NF)
+------------+-------------+--------+------------------+
| Student_ID | Student_Name| Major  | Department_Chair |
+------------+-------------+--------+------------------+
| 123456789  | Alice       | MIS    | Dr. Smith        |
| 987654321  | Bob         | FIN    | Dr. Johnson      |
| 456789123  | Carol       | MIS    | Dr. Smith        |
+------------+-------------+--------+------------------+
```

**Primary Key:** Student_ID

**Functional Dependencies:**
- Student_ID → Student_Name, Major, Department_Chair ✓
- Major → Department_Chair ✗ (Transitive dependency!)

**Transitive Dependency:**
```
Student_ID → Major → Department_Chair
```

**Problems:**
- Department_Chair repeated for each student in that major
- If department chair changes, must update all students in that major
- Update anomaly risk

### Converting to 3NF

**Solution:** Remove transitive dependencies by creating separate tables.

```sql
-- Student table (no transitive dependencies)
CREATE TABLE student (
    student_id INT PRIMARY KEY,
    student_name VARCHAR(100),
    major VARCHAR(50)
);

-- Department table (eliminates transitive dependency)
CREATE TABLE department (
    major VARCHAR(50) PRIMARY KEY,
    department_chair VARCHAR(100),
    building VARCHAR(100)
);

-- Add foreign key
ALTER TABLE student
ADD FOREIGN KEY (major) REFERENCES department(major);
```

**Result:**
```
STUDENT                              DEPARTMENT
+------------+-------------+--------+ +--------+------------------+
| Student_ID | Student_Name| Major  | | Major  | Department_Chair |
+------------+-------------+--------+ +--------+------------------+
| 123456789  | Alice       | MIS    | | MIS    | Dr. Smith        |
| 987654321  | Bob         | FIN    | | FIN    | Dr. Johnson      |
| 456789123  | Carol       | MIS    | | ACCY   | Dr. Williams     |
+------------+-------------+--------+ +--------+------------------+
```

### Another 3NF Example

```
EMPLOYEE (Violates 3NF)
+-------------+-------------+--------+----------------+
| Employee_ID | Name        | Zip    | City           |
+-------------+-------------+--------+----------------+
| 1001        | Alice       | 61820  | Champaign      |
| 1002        | Bob         | 60601  | Chicago        |
| 1003        | Carol       | 61820  | Champaign      |
+-------------+-------------+--------+----------------+
```

**Transitive Dependency:** Employee_ID → Zip → City

**Solution:**
```sql
CREATE TABLE employee (
    employee_id INT PRIMARY KEY,
    name VARCHAR(100),
    zip VARCHAR(10),
    FOREIGN KEY (zip) REFERENCES zip_code(zip)
);

CREATE TABLE zip_code (
    zip VARCHAR(10) PRIMARY KEY,
    city VARCHAR(100),
    state CHAR(2)
);
```

## 7.7 Boyce-Codd Normal Form (BCNF)

### BCNF Rules

A table is in BCNF if:

1. **It is in 3NF**
2. **For every functional dependency X → Y, X must be a super key**

BCNF is a stricter version of 3NF. Most tables in 3NF are also in BCNF.

### BCNF Violation Example

```
COURSE_INSTRUCTOR (In 3NF, violates BCNF)
+-------------+----------------+----------+
| Course_Code | Instructor_ID  | Room     |
+-------------+----------------+----------+
| BADM350     | 101            | BIF 100  |
| BADM350     | 102            | BIF 101  |
| BADM310     | 101            | BIF 100  |
+-------------+----------------+----------+
```

**Functional Dependencies:**
- {Course_Code, Instructor_ID} → Room
- Instructor_ID → Room (Each instructor always uses the same room)

**Problem:** Instructor_ID → Room, but Instructor_ID is not a super key.

**Solution:**
```sql
CREATE TABLE course_instructor (
    course_code VARCHAR(10),
    instructor_id INT,
    PRIMARY KEY (course_code, instructor_id),
    FOREIGN KEY (instructor_id) REFERENCES instructor(instructor_id)
);

CREATE TABLE instructor (
    instructor_id INT PRIMARY KEY,
    instructor_name VARCHAR(100),
    room VARCHAR(50)
);
```

## 7.8 Complete Normalization Example

Let's normalize a complex table step by step.

### Unnormalized Table

```
ORDER_DATA (Unnormalized)
+----------+---------------+---------------------+----------+---------------------------+
| Order_ID | Customer_Name | Customer_Email      | Zip      | Products                  |
+----------+---------------+---------------------+----------+---------------------------+
| 1001     | Alice Johnson | alice@example.com   | 61820    | Laptop:999, Mouse:25      |
| 1002     | Bob Smith     | bob@example.com     | 60601    | Keyboard:75               |
| 1003     | Alice Johnson | alice@example.com   | 61820    | Monitor:350, Cable:15     |
+----------+---------------+---------------------+----------+---------------------------+
```

### Step 1: Convert to 1NF

**Remove multi-valued attributes (Products field)**

```
ORDER_DATA (1NF)
+----------+---------------+---------------------+----------+-------------+-------+
| Order_ID | Customer_Name | Customer_Email      | Zip      | Product     | Price |
+----------+---------------+---------------------+----------+-------------+-------+
| 1001     | Alice Johnson | alice@example.com   | 61820    | Laptop      | 999   |
| 1001     | Alice Johnson | alice@example.com   | 61820    | Mouse       | 25    |
| 1002     | Bob Smith     | bob@example.com     | 60601    | Keyboard    | 75    |
| 1003     | Alice Johnson | alice@example.com   | 61820    | Monitor     | 350   |
| 1003     | Alice Johnson | alice@example.com   | 61820    | Cable       | 15    |
+----------+---------------+---------------------+----------+-------------+-------+
```

**Primary Key:** {Order_ID, Product}

### Step 2: Convert to 2NF

**Remove partial dependencies:**
- Order_ID → Customer_Name, Customer_Email, Zip (partial dependency)
- Product → Price (partial dependency)

```sql
-- Orders table
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_name VARCHAR(100),
    customer_email VARCHAR(100),
    zip VARCHAR(10)
);

-- Products table
CREATE TABLE product (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(100),
    price DECIMAL(10,2)
);

-- Order items (junction table)
CREATE TABLE order_item (
    order_id INT,
    product_id INT,
    quantity INT DEFAULT 1,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);
```

### Step 3: Convert to 3NF

**Remove transitive dependencies:**
- In ORDERS table: Order_ID → Zip → City (if we had city)
- In ORDERS table: Customer info should be separate

```sql
-- Final 3NF design
CREATE TABLE customer (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100),
    customer_email VARCHAR(100) UNIQUE,
    zip VARCHAR(10),
    FOREIGN KEY (zip) REFERENCES zip_code(zip)
);

CREATE TABLE zip_code (
    zip VARCHAR(10) PRIMARY KEY,
    city VARCHAR(100),
    state CHAR(2)
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE product (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(100),
    price DECIMAL(10,2)
);

CREATE TABLE order_item (
    order_id INT,
    product_id INT,
    quantity INT DEFAULT 1,
    unit_price DECIMAL(10,2),  -- Price at time of order
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);
```

## 7.9 Denormalization

### When to Denormalize

While normalization is generally good, sometimes we intentionally **denormalize** for:

1. **Performance** - Reduce JOINs for frequently accessed data
2. **Reporting** - Pre-calculated aggregates
3. **Read-heavy applications** - Optimize for queries over updates

### Denormalization Example

**Normalized (3NF):**
```sql
-- Requires JOIN to get order total
SELECT o.order_id, SUM(oi.quantity * oi.unit_price) AS total
FROM orders o
JOIN order_item oi ON o.order_id = oi.order_id
GROUP BY o.order_id;
```

**Denormalized:**
```sql
-- Store pre-calculated total
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    order_date TIMESTAMP,
    total_amount DECIMAL(10,2),  -- Denormalized!
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

-- Much faster query:
SELECT order_id, total_amount FROM orders WHERE order_id = 1001;
```

**Trade-off:**
- ✅ Faster queries (no JOIN, no SUM)
- ❌ Must update total_amount when order items change
- ❌ Risk of inconsistency

### Denormalization Best Practices

1. **Only denormalize when necessary** - Measure performance first
2. **Document denormalized fields** - Make it clear they're calculated
3. **Use triggers or application logic** - Keep denormalized data in sync
4. **Consider materialized views** - Database-managed denormalization

```sql
-- Example: Trigger to maintain denormalized total
DELIMITER //
CREATE TRIGGER update_order_total
AFTER INSERT ON order_item
FOR EACH ROW
BEGIN
    UPDATE orders
    SET total_amount = (
        SELECT SUM(quantity * unit_price)
        FROM order_item
        WHERE order_id = NEW.order_id
    )
    WHERE order_id = NEW.order_id;
END//
DELIMITER ;
```

## 7.10 Business Application Examples

### Example 1: Customer Order System

**Unnormalized:**
```
ORDERS
+----------+---------------+------------------+----------+----------+
| Order_ID | Customer_Name | Customer_Address | Products | Total    |
+----------+---------------+------------------+----------+----------+
```

**Normalized to 3NF:**
```sql
CREATE TABLE customer (
    customer_id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);

CREATE TABLE customer_address (
    address_id INT PRIMARY KEY,
    customer_id INT,
    street VARCHAR(200),
    city VARCHAR(100),
    state CHAR(2),
    zip VARCHAR(10),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    order_date TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE product (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(200),
    price DECIMAL(10,2)
);

CREATE TABLE order_item (
    order_id INT,
    product_id INT,
    quantity INT,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);
```

## Key Takeaways

1. **Normalization eliminates redundancy** - Reduces storage and prevents anomalies
2. **Progressive refinement** - 1NF → 2NF → 3NF → BCNF
3. **1NF requires atomic values** - No multi-valued fields or repeating groups
4. **2NF eliminates partial dependencies** - Only for composite keys
5. **3NF eliminates transitive dependencies** - Non-key attributes depend only on the key
6. **Denormalization is sometimes necessary** - Trade consistency for performance
7. **Document your decisions** - Explain why you normalized or denormalized

## Review Questions

1. What problems does normalization solve?
2. Explain the difference between partial and transitive dependencies.
3. What is the primary goal of First Normal Form (1NF)?
4. When would you intentionally denormalize a database?
5. Why is it important to eliminate transitive dependencies?

## Practical Exercise

Normalize the following table to 3NF:

```
EMPLOYEE_PROJECT
+-------------+---------------+------------+----------+--------------+----------------+
| Employee_ID | Employee_Name | Department | Dept_Mgr | Project_Code | Hours_Worked   |
+-------------+---------------+------------+----------+--------------+----------------+
| 1001        | Alice Johnson | IT         | Bob Chen | P100, P101   | 40, 20         |
| 1002        | Carol Smith   | HR         | Sue Park | P102         | 30             |
| 1003        | Dave Wilson   | IT         | Bob Chen | P100         | 35             |
+-------------+---------------+------------+----------+--------------+----------------+
```

**Tasks:**
1. Identify all violations of 1NF, 2NF, and 3NF
2. List all functional dependencies
3. Create a normalized 3NF design with CREATE TABLE statements
4. Draw an ER diagram of your normalized design

## Next Steps

In [Chapter 8](08-data-warehousing-etl.md), we'll explore data warehousing and ETL (Extract, Transform, Load) processes - essential for business intelligence and analytics.

---

*Corresponds to Week 7 of BADM 350 - Chapter 6 of the textbook*
