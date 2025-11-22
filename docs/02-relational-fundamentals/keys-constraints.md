# Keys and Constraints

Keys and constraints are fundamental mechanisms for ensuring data integrity, uniqueness, and establishing relationships in relational databases.

## Types of Keys

### 1. Super Key

**Definition**: Any combination of attributes that uniquely identifies a row

**Examples** (Students table):
```
| student_id | email               | name       |
|------------|---------------------|------------|
| 1001       | alice@university    | Alice Chen |
| 1002       | bob@university      | Bob Smith  |
```

Super keys:
- `{student_id}`
- `{email}`
- `{student_id, name}`
- `{student_id, email}`
- `{email, name}`
- `{student_id, email, name}`

### 2. Candidate Key

**Definition**: Minimal super key (no redundant attributes)

**From above super keys, candidate keys are**:
- `{student_id}` ✓ (minimal)
- `{email}` ✓ (minimal)
- `{student_id, name}` ✗ (not minimal - student_id alone is enough)

```sql
-- Both could serve as primary key
CREATE TABLE students (
    student_id INT UNIQUE,
    email VARCHAR(100) UNIQUE,  -- Alternative candidate key
    name VARCHAR(100)
);
```

### 3. Primary Key

**Definition**: The chosen candidate key to uniquely identify rows

**Characteristics**:
- Must be **unique**
- Cannot be **NULL**
- Should be **immutable** (doesn't change)
- Preferably **simple** (single column)

```sql
CREATE TABLE students (
    student_id INT PRIMARY KEY,  -- Chosen as primary key
    email VARCHAR(100) UNIQUE,   -- Remains a unique key
    name VARCHAR(100)
);
```

**Simple vs Composite Primary Key**:

#### Simple (Single Column)
```sql
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    name VARCHAR(100),
    price DECIMAL(10,2)
);
```

#### Composite (Multiple Columns)
```sql
CREATE TABLE enrollments (
    student_id INT,
    course_id VARCHAR(10),
    semester VARCHAR(20),
    grade CHAR(2),
    PRIMARY KEY (student_id, course_id, semester)
);
```

### 4. Foreign Key

**Definition**: Column(s) that reference the primary key of another table

**Purpose**: Establish relationships between tables

```sql
-- Parent table
CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Child table
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    order_date DATE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
```

**Visual Representation**:
```
Customers                      Orders
┌─────────────┬────────┐      ┌──────────┬─────────────┬────────────┐
│ customer_id │ name   │      │ order_id │ customer_id │ order_date │
├─────────────┼────────┤      ├──────────┼─────────────┼────────────┤
│     1       │ Alice  │◄─────┤   101    │      1      │ 2025-01-15 │
│     2       │ Bob    │      │   102    │      2      │ 2025-01-16 │
│     3       │ Carol  │◄─────┤   103    │      3      │ 2025-01-17 │
└─────────────┴────────┘      │   104    │      1      │ 2025-01-18 │
                               └──────────┴─────────────┴────────────┘
```

### 5. Alternate Key

**Definition**: Candidate keys not chosen as primary key

```sql
CREATE TABLE students (
    student_id INT PRIMARY KEY,     -- Primary key
    email VARCHAR(100) UNIQUE,      -- Alternate key
    ssn VARCHAR(11) UNIQUE          -- Alternate key
);
```

### 6. Surrogate Key

**Definition**: Artificial key with no business meaning

```sql
-- Natural key (business meaning)
CREATE TABLE countries (
    country_code CHAR(2) PRIMARY KEY,  -- 'US', 'UK', etc.
    name VARCHAR(100)
);

-- Surrogate key (no business meaning)
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- Surrogate
    email VARCHAR(100),
    name VARCHAR(100)
);
```

**Advantages of Surrogate Keys**:
- Immutable (business data can change)
- Simple (single column, integer)
- Better performance
- No business logic dependency

### 7. Natural Key

**Definition**: Key derived from data attributes with business meaning

```sql
CREATE TABLE countries (
    country_code CHAR(2) PRIMARY KEY,  -- Natural key
    name VARCHAR(100)
);

CREATE TABLE products (
    isbn VARCHAR(13) PRIMARY KEY,      -- Natural key (for books)
    title VARCHAR(200)
);
```

**Natural vs Surrogate**:

| Aspect | Natural Key | Surrogate Key |
|--------|-------------|---------------|
| **Meaning** | Has business meaning | Arbitrary value |
| **Stability** | May change | Never changes |
| **Simplicity** | May be complex | Usually simple integer |
| **Example** | Email, SSN, ISBN | Auto-increment ID |

## Constraints

### 1. PRIMARY KEY Constraint

**Enforces**:
- Uniqueness
- Not NULL

```sql
-- Method 1: Column level
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Method 2: Table level
CREATE TABLE students (
    student_id INT,
    name VARCHAR(100),
    PRIMARY KEY (student_id)
);

-- Method 3: Composite key
CREATE TABLE enrollments (
    student_id INT,
    course_id VARCHAR(10),
    PRIMARY KEY (student_id, course_id)
);
```

### 2. FOREIGN KEY Constraint

**Enforces**: Referential integrity

```sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
```

**Referential Actions**:

#### ON DELETE
```sql
-- CASCADE: Delete related rows
FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    ON DELETE CASCADE

-- SET NULL: Set foreign key to NULL
FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    ON DELETE SET NULL

-- RESTRICT: Prevent deletion
FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    ON DELETE RESTRICT

-- NO ACTION: Same as RESTRICT
FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    ON DELETE NO ACTION
```

#### ON UPDATE
```sql
-- CASCADE: Update related rows
FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    ON UPDATE CASCADE

-- SET NULL: Set foreign key to NULL
FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    ON UPDATE SET NULL
```

### 3. UNIQUE Constraint

**Enforces**: All values must be distinct (NULL allowed)

```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY,
    email VARCHAR(100) UNIQUE,    -- No duplicate emails
    username VARCHAR(50) UNIQUE   -- No duplicate usernames
);

-- Composite unique constraint
CREATE TABLE enrollments (
    enrollment_id INT PRIMARY KEY,
    student_id INT,
    course_id VARCHAR(10),
    semester VARCHAR(20),
    UNIQUE (student_id, course_id, semester)  -- Can't enroll twice in same course/semester
);
```

### 4. NOT NULL Constraint

**Enforces**: Column must have a value

```sql
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,     -- Must have a name
    description TEXT,               -- Can be NULL
    price DECIMAL(10,2) NOT NULL    -- Must have a price
);
```

### 5. CHECK Constraint

**Enforces**: Custom conditions

```sql
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT CHECK (age >= 18 AND age <= 65),
    salary DECIMAL(10,2) CHECK (salary > 0),
    email VARCHAR(100) CHECK (email LIKE '%@%'),
    status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'on_leave'))
);

-- Table-level CHECK constraint
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    order_date DATE,
    ship_date DATE,
    CHECK (ship_date >= order_date)  -- Ship date must be after order date
);
```

### 6. DEFAULT Constraint

**Sets**: Default value if none provided

```sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    order_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'pending',
    priority INT DEFAULT 1
);

-- Insert without specifying defaults
INSERT INTO orders (order_id) VALUES (1);
-- Results in: order_date = today, status = 'pending', priority = 1
```

### 7. AUTO_INCREMENT (MySQL) / SERIAL (PostgreSQL)

**Automatically generates** sequential numbers

```sql
-- MySQL
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100)
);

-- PostgreSQL
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

-- Insert without specifying ID
INSERT INTO customers (name) VALUES ('Alice');
-- customer_id automatically set to 1

INSERT INTO customers (name) VALUES ('Bob');
-- customer_id automatically set to 2
```

## Naming Constraints

**Why name constraints?**
- Easier to identify in error messages
- Easier to drop/modify later

```sql
CREATE TABLE products (
    product_id INT,
    name VARCHAR(100),
    price DECIMAL(10,2),
    category_id INT,

    CONSTRAINT pk_products PRIMARY KEY (product_id),
    CONSTRAINT uk_product_name UNIQUE (name),
    CONSTRAINT fk_products_category FOREIGN KEY (category_id)
        REFERENCES categories(category_id),
    CONSTRAINT chk_positive_price CHECK (price > 0)
);

-- Drop constraint by name
ALTER TABLE products DROP CONSTRAINT chk_positive_price;

-- Add constraint
ALTER TABLE products ADD CONSTRAINT chk_price_range
    CHECK (price BETWEEN 0.01 AND 100000);
```

## Practical Examples

### Example 1: E-Commerce Schema

```sql
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    stock INT DEFAULT 0 CHECK (stock >= 0)
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'processing', 'shipped', 'delivered') DEFAULT 'pending',
    total DECIMAL(10,2) CHECK (total >= 0),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        ON DELETE RESTRICT
);

CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE RESTRICT
);
```

### Example 2: University Schema

```sql
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    gpa DECIMAL(3,2) CHECK (gpa >= 0.0 AND gpa <= 4.0),
    enrollment_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE courses (
    course_id VARCHAR(10) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    credits INT NOT NULL CHECK (credits BETWEEN 1 AND 5),
    max_students INT CHECK (max_students > 0)
);

CREATE TABLE enrollments (
    student_id INT,
    course_id VARCHAR(10),
    semester VARCHAR(20),
    grade CHAR(2) CHECK (grade IN ('A', 'B', 'C', 'D', 'F', 'W')),
    PRIMARY KEY (student_id, course_id, semester),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
        ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
        ON DELETE RESTRICT
);
```

## Practice Questions

!!! question "Check Your Understanding"
    1. What is the difference between a candidate key and a primary key?
    2. When would you use ON DELETE CASCADE vs ON DELETE RESTRICT?
    3. What's the difference between UNIQUE and PRIMARY KEY constraints?
    4. Why might you choose a surrogate key over a natural key?

??? example "Answers"
    1. A candidate key is any minimal set of attributes that uniquely identifies rows. A primary key is the chosen candidate key used as the main identifier
    2. ON DELETE CASCADE automatically deletes related rows (e.g., order items when order is deleted). ON DELETE RESTRICT prevents deletion if related rows exist (e.g., can't delete customer with orders)
    3. UNIQUE allows NULL values and multiple unique constraints per table. PRIMARY KEY doesn't allow NULL and there can be only one per table
    4. Surrogate keys are: immutable (business data may change), simple (usually single integer), no business logic dependency, and often better for performance

## Summary

Keys and constraints are essential for:
- **Uniqueness**: Primary keys, unique constraints
- **Relationships**: Foreign keys
- **Data Validity**: Check constraints
- **Completeness**: NOT NULL constraints
- **Default Values**: DEFAULT constraints

Proper use of keys and constraints ensures data integrity and prevents invalid data from entering the database.

---

**Next**: Learn how tables relate to each other: [Relationships](relationships.md)
