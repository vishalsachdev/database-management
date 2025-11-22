# Chapter 6: Database Design and Modeling

## Learning Objectives

After completing this chapter, you will be able to:

- Understand the database design process
- Identify entities, attributes, and relationships from business requirements
- Create Entity-Relationship (ER) diagrams
- Understand different types of relationships and cardinality
- Convert ER diagrams into database tables
- Apply database design best practices
- Model real-world business scenarios

## 6.1 The Importance of Good Database Design

### Why Database Design Matters

A well-designed database:
- **Reduces data redundancy** - Minimizes duplicate data
- **Ensures data integrity** - Maintains accuracy and consistency
- **Improves performance** - Enables efficient querying
- **Facilitates maintenance** - Makes updates and changes easier
- **Supports business growth** - Scales with changing needs

### Consequences of Poor Design

A poorly designed database leads to:
- **Data anomalies** - Inconsistent or contradictory data
- **Storage waste** - Unnecessary duplication
- **Query complexity** - Difficult to extract meaningful information
- **Maintenance nightmares** - Simple changes require extensive modifications
- **Performance issues** - Slow queries and inefficient operations

!!! example "Poor Design Example"
    ```
    BAD_ORDERS_TABLE
    +----------+---------------+-------------+---------------+-------------+
    | Order_ID | Customer_Name | Customer_Email | Product_Name | Price    |
    +----------+---------------+-------------+---------------+-------------+
    | 1001     | Alice Johnson | alice@ex.com| Laptop, Mouse | 1024.99  |
    | 1002     | Bob Smith     | bob@ex.com  | Keyboard      | 75.00    |
    | 1003     | Alice Johnson | alice@ex.com| Monitor       | 350.00   |
    +----------+---------------+-------------+---------------+-------------+
    ```

    **Problems:**
    1. Customer data duplicated (Alice appears twice)
    2. Multiple products in one field (violates atomic values)
    3. Can't easily update Alice's email
    4. Can't track product inventory separately

## 6.2 The Database Design Process

### Step 1: Requirements Analysis

Understand what the database needs to accomplish:
- Interview stakeholders
- Identify business rules
- Determine what data needs to be stored
- Understand how data will be used

### Step 2: Conceptual Design

Create a high-level model:
- Identify entities (things we need to store data about)
- Identify attributes (properties of entities)
- Identify relationships (how entities relate to each other)
- Create Entity-Relationship (ER) diagrams

### Step 3: Logical Design

Convert conceptual model to database structures:
- Convert ER diagrams to table structures
- Define primary keys and foreign keys
- Apply normalization rules
- Ensure referential integrity

### Step 4: Physical Design

Implement in a specific DBMS:
- Choose appropriate data types
- Create indexes for performance
- Define constraints and triggers
- Plan for storage and backup

### Step 5: Implementation and Testing

Build and validate:
- Create tables and relationships
- Load initial data
- Test with realistic queries
- Verify performance

## 6.3 Entities and Attributes

### Entities

An **entity** is a thing or object in the real world that we want to store information about.

**Examples:**
- **People:** Customer, Employee, Student, Instructor
- **Places:** Store, Warehouse, Campus, Building
- **Things:** Product, Order, Course, Invoice
- **Events:** Sale, Enrollment, Appointment, Transaction
- **Concepts:** Account, Department, Project, Contract

### Identifying Entities

Ask: "What are the **nouns** in our business requirements that we need to track?"

!!! example "Business Scenario: University System"
    **Requirement:** We need to track students, the courses they enroll in, and the instructors who teach those courses.

    **Entities:**
    - STUDENT
    - COURSE
    - INSTRUCTOR

### Attributes

An **attribute** is a property or characteristic of an entity.

**Examples:**
- STUDENT: Student_ID, Name, Email, Major, GPA, Enrollment_Date
- COURSE: Course_Code, Title, Credits, Department
- INSTRUCTOR: Instructor_ID, Name, Email, Department, Hire_Date

### Types of Attributes

#### Simple vs Composite

**Simple:** Cannot be divided further
- Example: Age, Price, Quantity

**Composite:** Can be divided into sub-parts
- Example: Name → (First_Name, Last_Name)
- Example: Address → (Street, City, State, Zip)

#### Single-Valued vs Multi-Valued

**Single-Valued:** One value per entity
- Example: Student_ID, Birth_Date

**Multi-Valued:** Multiple values possible
- Example: Phone_Numbers (home, mobile, work)
- Example: Email_Addresses

!!! tip "Handling Multi-Valued Attributes"
    Multi-valued attributes typically require a separate table:

    Instead of storing multiple phones in one field:
    ```
    STUDENT_PHONE
    +------------+------------+-------------+
    | Student_ID | Phone_Type | Phone_Number|
    +------------+------------+-------------+
    | 123456789  | Mobile     | 217-555-1234|
    | 123456789  | Home       | 217-555-5678|
    +------------+------------+-------------+
    ```

#### Derived Attributes

**Derived:** Can be calculated from other attributes
- Example: Age (derived from Birth_Date)
- Example: Total_Price (derived from Unit_Price × Quantity)

Generally, don't store derived attributes - calculate them when needed.

## 6.4 Relationships

A **relationship** is an association between two or more entities.

### Types of Relationships

#### One-to-One (1:1)

One instance of Entity A is associated with one instance of Entity B.

**Example:** Employee ↔ Parking Spot
- Each employee has one assigned parking spot
- Each parking spot is assigned to one employee

```
EMPLOYEE (1) --------- (1) PARKING_SPOT
```

#### One-to-Many (1:M)

One instance of Entity A is associated with many instances of Entity B.

**Example:** Customer ↔ Orders
- One customer can place many orders
- Each order belongs to one customer

```
CUSTOMER (1) --------- (M) ORDER
```

This is the most common type of relationship.

#### Many-to-Many (M:N)

Many instances of Entity A are associated with many instances of Entity B.

**Example:** Students ↔ Courses
- One student can enroll in many courses
- One course can have many students

```
STUDENT (M) --------- (N) COURSE
```

!!! note "Implementing Many-to-Many"
    Many-to-many relationships require a **junction table** (also called associative entity):

    ```
    STUDENT (1) --------- (M) ENROLLMENT (M) --------- (1) COURSE
    ```

    ENROLLMENT table contains:
    - Student_ID (FK)
    - Course_Code (FK)
    - Grade
    - Enrollment_Date

### Cardinality

**Cardinality** specifies the number of instances of one entity that can be associated with instances of another entity.

**Notation:**
- **(1,1)** - Exactly one (mandatory)
- **(0,1)** - Zero or one (optional)
- **(1,N)** - One or more (mandatory)
- **(0,N)** - Zero or more (optional)

**Example:**
```
CUSTOMER (1,1) -----places----- (0,N) ORDER
```
- Each ORDER must be placed by exactly one CUSTOMER (1,1)
- Each CUSTOMER can place zero or more ORDERS (0,N)

### Participation

**Total Participation (Mandatory):**
- Every instance must participate in the relationship
- Shown with double line or (1,N) cardinality

**Partial Participation (Optional):**
- Some instances may not participate
- Shown with single line or (0,N) cardinality

## 6.5 Entity-Relationship (ER) Diagrams

ER diagrams visually represent the database structure.

### Basic ER Diagram Symbols

```
┌─────────────┐
│   ENTITY    │    Rectangle = Entity
└─────────────┘

     ○         Oval = Attribute
  Attribute

     ⬭         Underlined oval = Primary Key
  Entity_ID

   ◇───────◇   Diamond = Relationship
  Relationship

─────────────   Line = Connects entities to relationships
```

### Simple ER Diagram Example

```
        ┌─────────────┐
        │   STUDENT   │
        └─────────────┘
               │
           (1,1) │ enrolls
               │
               ◇
               │
           (0,N) │
               │
        ┌─────────────┐
        │   COURSE    │
        └─────────────┘
```

### Complete University ER Diagram

```
┌──────────────┐                    ┌──────────────┐
│   STUDENT    │                    │   COURSE     │
├──────────────┤                    ├──────────────┤
│ Student_ID PK│───┐            ┌───│ Course_Code PK│
│ Name         │   │(1,1)       │   │ Title        │
│ Email        │   │            │   │ Credits      │
│ Major        │   │  enrolls   │   │ Department   │
│ GPA          │   │            │   │              │
└──────────────┘   │     ◇      │   └──────────────┘
                   └─────◇──────┘
                      (0,N) │ (0,N)
                            │
                   ┌────────────────┐
                   │  ENROLLMENT    │
                   ├────────────────┤
                   │ Enrollment_ID PK│
                   │ Student_ID FK  │
                   │ Course_Code FK │
                   │ Grade          │
                   │ Semester       │
                   └────────────────┘


┌──────────────┐                    ┌──────────────┐
│ INSTRUCTOR   │                    │   COURSE     │
├──────────────┤                    ├──────────────┤
│Instructor_ID │(1,1)       (0,N)   │ Course_Code  │
│ Name         │────── teaches ─────│ Title        │
│ Email        │                    │ Credits      │
│ Department   │                    │ Instructor_ID│
└──────────────┘                    └──────────────┘
```

## 6.6 Converting ER Diagrams to Tables

### Rule 1: Entity → Table

Each entity becomes a table with:
- Entity name → Table name
- Attributes → Columns
- Primary key attribute → Primary key column

**Example:**
```
STUDENT Entity → STUDENT Table

CREATE TABLE student (
    student_id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    major VARCHAR(50),
    gpa DECIMAL(3,2)
);
```

### Rule 2: One-to-Many Relationship

Add a foreign key in the "many" side table.

**Example:** CUSTOMER (1) ↔ (M) ORDER

```sql
CREATE TABLE customer (
    customer_id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,  -- FK to customer table
    order_date DATE,
    total_amount DECIMAL(10,2),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);
```

### Rule 3: One-to-One Relationship

Two approaches:

**Approach 1:** Merge into one table (if participation is total)

**Approach 2:** Keep separate tables with FK in either table

**Example:** EMPLOYEE (1) ↔ (1) PARKING_SPOT

```sql
-- Option 1: FK in EMPLOYEE table
CREATE TABLE employee (
    employee_id INT PRIMARY KEY,
    name VARCHAR(100),
    parking_spot_id INT UNIQUE,
    FOREIGN KEY (parking_spot_id) REFERENCES parking_spot(spot_id)
);

-- Option 2: FK in PARKING_SPOT table
CREATE TABLE parking_spot (
    spot_id INT PRIMARY KEY,
    location VARCHAR(50),
    employee_id INT UNIQUE,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);
```

### Rule 4: Many-to-Many Relationship

Create a junction (associative) table with:
- Foreign keys to both related tables
- Composite primary key (both FKs)
- Any additional attributes of the relationship

**Example:** STUDENT (M) ↔ (N) COURSE

```sql
CREATE TABLE student (
    student_id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);

CREATE TABLE course (
    course_code VARCHAR(10) PRIMARY KEY,
    title VARCHAR(200),
    credits INT
);

-- Junction table
CREATE TABLE enrollment (
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    course_code VARCHAR(10),
    grade VARCHAR(2),
    semester VARCHAR(20),
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (course_code) REFERENCES course(course_code),
    UNIQUE (student_id, course_code)  -- Prevent duplicate enrollments
);
```

## 6.7 Design Best Practices

### 1. Use Meaningful Names

```sql
-- Good:
customer_id, first_name, order_date

-- Bad:
id, fn, dt
```

### 2. Choose Appropriate Data Types

```sql
-- Use the right size
phone CHAR(10)           -- Not VARCHAR(255)
email VARCHAR(100)       -- Not TEXT
age TINYINT             -- Not INT

-- Use appropriate types
birth_date DATE         -- Not VARCHAR
price DECIMAL(10,2)     -- Not FLOAT for money
is_active BOOLEAN       -- Not VARCHAR
```

### 3. Always Define Primary Keys

```sql
-- Every table should have a primary key
CREATE TABLE customer (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    -- ...
);
```

### 4. Use Foreign Keys for Referential Integrity

```sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
        ON DELETE RESTRICT   -- Prevent deleting customers with orders
        ON UPDATE CASCADE    -- Update order if customer_id changes
);
```

### 5. Avoid Storing Derived Data

```sql
-- Don't store what you can calculate
-- Bad:
CREATE TABLE order_item (
    product_id INT,
    quantity INT,
    unit_price DECIMAL(10,2),
    total_price DECIMAL(10,2)  -- Can be calculated!
);

-- Good:
CREATE TABLE order_item (
    product_id INT,
    quantity INT,
    unit_price DECIMAL(10,2)
    -- Calculate total_price in queries: quantity * unit_price
);
```

### 6. Plan for Data Growth

```sql
-- Use AUTO_INCREMENT for growing data
customer_id INT AUTO_INCREMENT

-- Consider BIGINT for high-volume tables
transaction_id BIGINT AUTO_INCREMENT
```

## 6.8 Real-World Design Examples

### Example 1: E-Commerce System

**Requirements:**
- Track customers and their orders
- Each order contains multiple products
- Track product inventory
- Record shipping addresses

**Entities:**
- CUSTOMER
- ORDERS
- PRODUCT
- ORDER_ITEM (junction between ORDER and PRODUCT)
- SHIPPING_ADDRESS

**Relationships:**
- CUSTOMER (1) ↔ (M) ORDERS
- ORDERS (1) ↔ (M) ORDER_ITEM
- PRODUCT (1) ↔ (M) ORDER_ITEM
- CUSTOMER (1) ↔ (M) SHIPPING_ADDRESS

**Implementation:**
```sql
CREATE TABLE customer (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shipping_address (
    address_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    address_line1 VARCHAR(200),
    city VARCHAR(100),
    state CHAR(2),
    zip_code VARCHAR(10),
    is_default BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE product (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(200),
    description TEXT,
    price DECIMAL(10,2),
    stock_quantity INT,
    category VARCHAR(50)
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    shipping_address_id INT,
    total_amount DECIMAL(10,2),
    status VARCHAR(50),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    FOREIGN KEY (shipping_address_id) REFERENCES shipping_address(address_id)
);

CREATE TABLE order_item (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    product_id INT,
    quantity INT,
    unit_price DECIMAL(10,2),  -- Price at time of order
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);
```

### Example 2: Hospital Management System

**Requirements:**
- Track patients and their medical records
- Schedule appointments with doctors
- Record diagnoses and treatments
- Track prescriptions

**Entities:**
- PATIENT
- DOCTOR
- APPOINTMENT
- DIAGNOSIS
- PRESCRIPTION
- MEDICATION

**Relationships:**
- PATIENT (1) ↔ (M) APPOINTMENT
- DOCTOR (1) ↔ (M) APPOINTMENT
- APPOINTMENT (1) ↔ (M) DIAGNOSIS
- DIAGNOSIS (1) ↔ (M) PRESCRIPTION
- MEDICATION (1) ↔ (M) PRESCRIPTION

**Implementation:**
```sql
CREATE TABLE patient (
    patient_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    date_of_birth DATE,
    gender CHAR(1),
    phone VARCHAR(15),
    email VARCHAR(100),
    address TEXT,
    insurance_info JSON
);

CREATE TABLE doctor (
    doctor_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    specialization VARCHAR(100),
    phone VARCHAR(15),
    email VARCHAR(100)
);

CREATE TABLE appointment (
    appointment_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    doctor_id INT,
    appointment_date DATETIME,
    duration_minutes INT,
    status VARCHAR(50),
    notes TEXT,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id)
);

CREATE TABLE diagnosis (
    diagnosis_id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT,
    diagnosis_code VARCHAR(20),  -- ICD-10 code
    description TEXT,
    severity VARCHAR(50),
    FOREIGN KEY (appointment_id) REFERENCES appointment(appointment_id)
);

CREATE TABLE medication (
    medication_id INT PRIMARY KEY AUTO_INCREMENT,
    medication_name VARCHAR(200),
    generic_name VARCHAR(200),
    dosage_form VARCHAR(50)
);

CREATE TABLE prescription (
    prescription_id INT PRIMARY KEY AUTO_INCREMENT,
    diagnosis_id INT,
    medication_id INT,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    duration_days INT,
    instructions TEXT,
    FOREIGN KEY (diagnosis_id) REFERENCES diagnosis(diagnosis_id),
    FOREIGN KEY (medication_id) REFERENCES medication(medication_id)
);
```

### Example 3: University Course Registration

**Requirements:**
- Students enroll in courses
- Courses have prerequisites
- Instructors teach courses
- Track grades and GPAs

**Entities:**
- STUDENT
- COURSE
- INSTRUCTOR
- ENROLLMENT
- PREREQUISITE

**Self-Referencing Relationship:**
- COURSE (1) ↔ (M) PREREQUISITE (references COURSE)

**Implementation:**
```sql
CREATE TABLE student (
    student_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    major VARCHAR(50),
    gpa DECIMAL(3,2)
);

CREATE TABLE instructor (
    instructor_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    department VARCHAR(50)
);

CREATE TABLE course (
    course_code VARCHAR(10) PRIMARY KEY,
    title VARCHAR(200),
    credits INT,
    department VARCHAR(50),
    instructor_id INT,
    max_enrollment INT,
    FOREIGN KEY (instructor_id) REFERENCES instructor(instructor_id)
);

-- Self-referencing relationship for prerequisites
CREATE TABLE prerequisite (
    course_code VARCHAR(10),
    prerequisite_code VARCHAR(10),
    PRIMARY KEY (course_code, prerequisite_code),
    FOREIGN KEY (course_code) REFERENCES course(course_code),
    FOREIGN KEY (prerequisite_code) REFERENCES course(course_code)
);

CREATE TABLE enrollment (
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    course_code VARCHAR(10),
    semester VARCHAR(20),
    grade VARCHAR(2),
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (course_code) REFERENCES course(course_code),
    UNIQUE (student_id, course_code, semester)
);
```

## 6.9 Common Design Mistakes

### Mistake 1: Storing Multiple Values in One Field

```sql
-- Bad:
CREATE TABLE customer (
    customer_id INT PRIMARY KEY,
    name VARCHAR(100),
    phone_numbers VARCHAR(200)  -- "217-555-1234, 312-555-5678"
);

-- Good:
CREATE TABLE customer_phone (
    customer_id INT,
    phone_type VARCHAR(20),
    phone_number VARCHAR(15),
    PRIMARY KEY (customer_id, phone_type),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);
```

### Mistake 2: Not Using Foreign Keys

```sql
-- Bad: No relationship enforcement
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT  -- No foreign key!
);

-- Good: Enforce referential integrity
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);
```

### Mistake 3: Redundant Data Storage

```sql
-- Bad: Customer info repeated in every order
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_name VARCHAR(100),   -- Redundant!
    customer_email VARCHAR(100),  -- Redundant!
    order_date DATE
);

-- Good: Reference customer table
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,              -- FK to customer table
    order_date DATE,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);
```

## Key Takeaways

1. **Good design is critical** - Saves time and prevents problems later
2. **Follow the design process** - Requirements → Conceptual → Logical → Physical
3. **Identify entities and relationships** - The foundation of your design
4. **ER diagrams visualize structure** - Essential communication tool
5. **Convert ER diagrams systematically** - Follow proven rules
6. **Use appropriate cardinality** - Model real-world constraints accurately
7. **Junction tables for M:N relationships** - Essential pattern to know

## Review Questions

1. What are the five steps in the database design process?
2. Explain the difference between one-to-many and many-to-many relationships.
3. How do you implement a many-to-many relationship in a relational database?
4. What is the purpose of foreign keys?
5. When would you use a composite primary key?

## Practical Exercise

**Scenario: Library System**

Design a database for a library with these requirements:

1. **Track books** with title, ISBN, author, publisher, publication year
2. **Track members** with name, email, phone, membership date
3. **Track loans** - members can borrow multiple books
4. **Handle authors** - books can have multiple authors
5. **Track fines** - members may have fines for late returns
6. **Reserve books** - members can reserve books that are currently on loan

**Tasks:**
1. Identify all entities and their attributes
2. Identify all relationships and their cardinality
3. Draw an ER diagram
4. Write CREATE TABLE statements for all tables
5. Write sample queries to:
   - Find all books currently on loan
   - Find members with overdue books
   - Calculate total fines per member

## Next Steps

In [Chapter 7](07-normalization.md), we'll learn about normalization - a formal process for organizing data to minimize redundancy and ensure data integrity.

---

*Corresponds to Week 6 of BADM 350 - Chapter 5 of the textbook*
