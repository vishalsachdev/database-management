# Relationships

Relationships connect tables together, enabling relational databases to model complex real-world scenarios without data redundancy.

## Types of Relationships

### 1. One-to-Many (1:N)

**Most common relationship type**

**Example**: One customer can have many orders

```sql
CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    order_date DATE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
```

**Visual**:
```
Customer                Orders
┌────┬──────┐          ┌────┬─────────┬──────┐
│ id │ name │          │ id │ cust_id │ date │
├────┼──────┤          ├────┼─────────┼──────┤
│ 1  │Alice │────────┬─│101 │    1    │ ... │
└────┴──────┘        ├─│102 │    1    │ ... │
                     └─│103 │    1    │ ... │
                       └────┴─────────┴──────┘
```

### 2. Many-to-Many (M:N)

**Requires junction/bridge table**

**Example**: Students can enroll in many courses; courses can have many students

```sql
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE courses (
    course_id VARCHAR(10) PRIMARY KEY,
    title VARCHAR(100)
);

-- Junction table
CREATE TABLE enrollments (
    student_id INT,
    course_id VARCHAR(10),
    semester VARCHAR(20),
    grade CHAR(2),
    PRIMARY KEY (student_id, course_id, semester),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);
```

**Visual**:
```
Students          Enrollments          Courses
┌────┬──────┐    ┌──────┬────────┐    ┌────┬────────┐
│ id │ name │    │ stud │ course │    │ id │ title  │
├────┼──────┤    ├──────┼────────┤    ├────┼────────┤
│ 1  │Alice │───►│  1   │ CS101  │◄───│CS101│ Intro │
│ 2  │Bob   │─┐  │  1   │ CS102  │◄─┐ │CS102│ Prog  │
└────┴──────┘ │  │  2   │ CS101  │  │ └────┴────────┘
              └─►│  2   │ CS102  │◄─┘
                 └──────┴────────┘
```

### 3. One-to-One (1:1)

**Less common, used for:**
- Security (separate sensitive data)
- Performance (split large tables)
- Optional attributes

**Example**: One employee has one office

```sql
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE offices (
    office_id INT PRIMARY KEY,
    emp_id INT UNIQUE,  -- UNIQUE makes it 1:1
    room_number VARCHAR(10),
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id)
);
```

## Relationship Participation

### Optional (Partial)
Entity can exist without relationship

```sql
-- Customer can exist without orders
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,  -- Can be NULL
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
```

### Mandatory (Total)
Entity must participate in relationship

```sql
-- Order must have a customer
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT NOT NULL,  -- Cannot be NULL
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
```

## Summary

Relationships model real-world connections between entities:
- **1:Many** - Most common (customer/orders)
- **Many:Many** - Requires junction table (students/courses)
- **1:1** - Special cases (employee/office)

---

**Next**: [Referential Integrity](referential-integrity.md)
