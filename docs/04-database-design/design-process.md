# Database Design Process

A systematic approach to database design ensures a well-structured, efficient, and maintainable database.

## Design Phases

### 1. Requirements Analysis

**Goal**: Understand what data needs to be stored and how it will be used

**Activities**:
- Interview stakeholders
- Identify data entities
- Identify relationships
- Understand business rules
- Define queries and operations

**Example**: E-Commerce System
```
Requirements:
- Store customer information (name, email, address)
- Track products (name, price, stock)
- Record orders and order items
- Support multiple addresses per customer
- Track order status
- Generate sales reports
```

### 2. Conceptual Design

**Goal**: Create high-level data model (ER diagram)

**Output**: Entity-Relationship Diagram

```
Entities:
- Customer (customer_id, name, email)
- Product (product_id, name, price, stock)
- Order (order_id, order_date, status)
- OrderItem (quantity, price)

Relationships:
- Customer places Order (1:M)
- Order contains OrderItem (1:M)
- Product appears in OrderItem (1:M)
```

### 3. Logical Design

**Goal**: Convert ER model to relational schema

**Output**: Table definitions

```sql
customers (customer_id, name, email)
products (product_id, name, price, stock)
orders (order_id, customer_id, order_date, status)
order_items (order_item_id, order_id, product_id, quantity, price)
```

### 4. Normalization

**Goal**: Remove redundancy and anomalies

**Process**:
- Apply normal forms (1NF, 2NF, 3NF)
- Eliminate update anomalies
- Ensure data integrity

### 5. Physical Design

**Goal**: Optimize for performance

**Activities**:
- Choose data types
- Create indexes
- Define partitioning strategy
- Plan for growth

```sql
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category_id),
    INDEX idx_sku (sku)
) ENGINE=InnoDB;
```

### 6. Implementation

**Goal**: Create the actual database

```sql
-- Create database
CREATE DATABASE ecommerce;

-- Create tables
CREATE TABLE customers (...);
CREATE TABLE products (...);
CREATE TABLE orders (...);

-- Add constraints
ALTER TABLE orders
    ADD CONSTRAINT fk_customer
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id);
```

### 7. Testing and Refinement

**Activities**:
- Test with sample data
- Verify constraints work
- Test query performance
- Adjust indexes if needed
- Refine based on usage patterns

## Design Example: Library System

### Requirements

```
A library system needs to:
- Track books (title, ISBN, author, publisher)
- Track members (name, email, phone, address)
- Record borrowing transactions
- Support multiple authors per book
- Track book copies (a book can have multiple physical copies)
- Set borrowing limits (max 5 books per member)
```

### Conceptual Model

```
Entities:
- Book (isbn, title, publisher, publication_date)
- Author (author_id, name)
- Member (member_id, name, email, phone)
- BookCopy (copy_id, isbn, status)
- Borrowing (borrowing_id, copy_id, member_id, borrow_date, due_date, return_date)

Relationships:
- Book written by Author (M:N) → BookAuthor junction table
- Book has BookCopy (1:M)
- Member borrows BookCopy (M:N) → Borrowing junction table
```

### Logical Schema

```sql
books (isbn, title, publisher, publication_date)
authors (author_id, name)
book_authors (isbn, author_id)  -- Junction table
book_copies (copy_id, isbn, status)
members (member_id, name, email, phone, address)
borrowings (borrowing_id, copy_id, member_id, borrow_date, due_date, return_date)
```

### Physical Implementation

```sql
CREATE TABLE books (
    isbn VARCHAR(13) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    publisher VARCHAR(100),
    publication_date DATE,
    INDEX idx_title (title)
);

CREATE TABLE authors (
    author_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    INDEX idx_name (name)
);

CREATE TABLE book_authors (
    isbn VARCHAR(13),
    author_id INT,
    PRIMARY KEY (isbn, author_id),
    FOREIGN KEY (isbn) REFERENCES books(isbn),
    FOREIGN KEY (author_id) REFERENCES authors(author_id)
);

CREATE TABLE book_copies (
    copy_id INT PRIMARY KEY AUTO_INCREMENT,
    isbn VARCHAR(13) NOT NULL,
    status ENUM('available', 'borrowed', 'lost', 'damaged') DEFAULT 'available',
    FOREIGN KEY (isbn) REFERENCES books(isbn),
    INDEX idx_status (status)
);

CREATE TABLE members (
    member_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    INDEX idx_email (email)
);

CREATE TABLE borrowings (
    borrowing_id INT PRIMARY KEY AUTO_INCREMENT,
    copy_id INT NOT NULL,
    member_id INT NOT NULL,
    borrow_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    FOREIGN KEY (copy_id) REFERENCES book_copies(copy_id),
    FOREIGN KEY (member_id) REFERENCES members(member_id),
    INDEX idx_member (member_id),
    INDEX idx_copy (copy_id),
    INDEX idx_borrow_date (borrow_date)
);
```

## Common Pitfalls

### 1. Skipping Requirements Analysis
- Leads to redesign later
- Misses important relationships
- Incomplete data model

### 2. Over-Normalization
- Too many joins affect performance
- Overly complex queries
- Solution: Strategic denormalization where needed

### 3. Under-Normalization
- Data redundancy
- Update anomalies
- Data inconsistency

### 4. Poor Naming Conventions
- Inconsistent names confuse developers
- Use clear, descriptive names
- Follow naming standards

### 5. Ignoring Performance
- Missing indexes on frequently queried columns
- Wrong data types
- No partitioning strategy for large tables

## Summary

Database design process:
1. **Requirements Analysis** - What to store
2. **Conceptual Design** - ER modeling
3. **Logical Design** - Relational schema
4. **Normalization** - Remove redundancy
5. **Physical Design** - Optimize
6. **Implementation** - Build it
7. **Testing** - Verify and refine

A systematic process ensures a well-designed, efficient database.

---

**Next**: [Entity-Relationship Modeling](er-modeling.md)
