# Schema Design Best Practices

Practical guidelines for designing effective database schemas.

## Naming Conventions

### Tables
- Plural nouns: `customers`, `orders`, `products`
- Or singular: `customer`, `order`, `product` (choose one style, be consistent)
- Use underscores: `order_items`, not `OrderItems`

### Columns
- Descriptive names: `first_name`, not `fn`
- Avoid reserved words: `order_date`, not `date`
- Include units if applicable: `price_usd`, `weight_kg`

### Keys
- Primary keys: `id` or `table_name_id` (e.g., `customer_id`)
- Foreign keys: match referenced column name

## Data Types

### Choose Appropriate Types

```sql
-- Good
CREATE TABLE products (
    price DECIMAL(10,2),      -- Fixed precision for money
    created_at TIMESTAMP,     -- Proper date/time type
    in_stock BOOLEAN          -- Boolean for true/false
);

-- Bad
CREATE TABLE products (
    price FLOAT,              -- Floating point errors with money
    created_at VARCHAR(50),   -- String instead of date
    in_stock CHAR(1)          -- 'Y'/'N' instead of boolean
);
```

### Use Smallest Appropriate Type

```sql
-- Good for small range
age TINYINT              -- 0-255
status ENUM('active', 'inactive')

-- Overkill
age BIGINT
status VARCHAR(255)
```

## Constraints

### Always Use Primary Keys

```sql
-- Every table needs a primary key
CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    ...
);
```

### Use Foreign Keys

```sql
-- Enforce referential integrity
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
```

### Add NOT NULL for Required Fields

```sql
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,  -- Product must have name
    price DECIMAL(10,2) NOT NULL -- Product must have price
);
```

## Indexes

### Index Foreign Keys

```sql
CREATE INDEX idx_customer ON orders(customer_id);
```

### Index Frequently Queried Columns

```sql
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_created_at ON orders(created_at);
```

### Don't Over-Index

- Indexes slow down writes
- Take up space
- Index only what you need

## Timestamps

### Track Record Creation and Updates

```sql
CREATE TABLE posts (
    post_id INT PRIMARY KEY,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Soft Deletes

### Consider Soft Deletes for Important Data

```sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    deleted_at TIMESTAMP NULL,
    ...
);

-- Instead of DELETE, set deleted_at
UPDATE orders SET deleted_at = CURRENT_TIMESTAMP WHERE order_id = 123;

-- Query active records
SELECT * FROM orders WHERE deleted_at IS NULL;
```

## Documentation

### Add Comments

```sql
CREATE TABLE products (
    product_id INT PRIMARY KEY COMMENT 'Unique product identifier',
    sku VARCHAR(50) COMMENT 'Stock Keeping Unit',
    price DECIMAL(10,2) COMMENT 'Price in USD'
);
```

## Performance

### Avoid SELECT *

```sql
-- Good: Select only needed columns
SELECT customer_id, name, email FROM customers;

-- Bad: Select everything
SELECT * FROM customers;
```

### Use LIMIT for Testing

```sql
-- Test queries with LIMIT first
SELECT * FROM large_table LIMIT 10;
```

## Security

### Never Store Passwords in Plain Text

```sql
-- Good: Store hashed passwords
CREATE TABLE users (
    user_id INT PRIMARY KEY,
    email VARCHAR(100),
    password_hash VARCHAR(255)  -- Hashed, not plain text
);
```

### Use Prepared Statements

```sql
-- Prevents SQL injection
PREPARE stmt FROM 'SELECT * FROM users WHERE email = ?';
```

## Summary

Key practices:
- Consistent naming conventions
- Appropriate data types
- Primary and foreign keys
- Strategic indexing
- Timestamps for auditing
- Consider soft deletes
- Document your schema
- Security considerations

---

**Next Chapter**: [Advanced SQL](../05-advanced-sql/index.md)
