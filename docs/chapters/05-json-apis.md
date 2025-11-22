# Chapter 5: JSON Data and APIs

## Learning Objectives

After completing this chapter, you will be able to:

- Understand JSON data structure and syntax
- Work with JSON data types in modern databases
- Query and manipulate JSON data using SQL
- Understand REST APIs and how they work
- Integrate database data with web APIs
- Parse and transform JSON data
- Make informed decisions about when to use JSON vs traditional relational structures

## 5.1 Introduction to JSON

### What is JSON?

**JSON (JavaScript Object Notation)** is a lightweight, text-based data format for storing and exchanging data. It's human-readable, easy to parse, and has become the standard for web APIs.

### Why JSON Matters in Databases

Modern applications often need to:
- Store semi-structured or flexible data
- Integrate with web APIs
- Handle nested or hierarchical data
- Work with data from various sources

JSON provides flexibility that traditional relational tables sometimes lack.

### JSON vs Relational Data

| Aspect | Relational | JSON |
|--------|-----------|------|
| **Structure** | Fixed schema | Flexible schema |
| **Storage** | Multiple tables with JOINs | Nested documents |
| **Updates** | Update specific fields easily | May require rewriting entire document |
| **Queries** | Rich querying with SQL | Requires JSON-specific functions |
| **Use Case** | Well-defined, structured data | Semi-structured, varying schemas |

!!! tip "When to Use Each"
    **Use traditional relational:**
    - Data structure is well-defined and stable
    - Need complex JOINs and relationships
    - Data integrity and normalization are critical

    **Use JSON:**
    - Schema varies by record
    - Storing API responses
    - Nested/hierarchical data
    - Rapid prototyping

## 5.2 JSON Structure and Syntax

### Basic JSON Data Types

```json
{
  "string_example": "Hello World",
  "number_example": 42,
  "decimal_example": 3.14,
  "boolean_example": true,
  "null_example": null,
  "array_example": [1, 2, 3, 4, 5],
  "object_example": {
    "nested_key": "nested_value"
  }
}
```

### JSON Objects

A JSON object is a collection of key-value pairs enclosed in `{}`:

```json
{
  "customer_id": 12345,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "active": true
}
```

### JSON Arrays

A JSON array is an ordered list enclosed in `[]`:

```json
{
  "customer_id": 12345,
  "name": "Alice Johnson",
  "orders": [101, 102, 103, 104]
}
```

### Nested JSON

JSON supports nesting objects and arrays:

```json
{
  "customer_id": 12345,
  "name": "Alice Johnson",
  "contact": {
    "email": "alice@example.com",
    "phone": "217-555-1234",
    "address": {
      "street": "123 Main St",
      "city": "Champaign",
      "state": "IL",
      "zip": "61820"
    }
  },
  "orders": [
    {
      "order_id": 101,
      "date": "2024-01-15",
      "total": 150.00,
      "items": [
        {"product": "Laptop", "qty": 1, "price": 999.99},
        {"product": "Mouse", "qty": 2, "price": 25.00}
      ]
    },
    {
      "order_id": 102,
      "date": "2024-02-01",
      "total": 75.00,
      "items": [
        {"product": "Keyboard", "qty": 1, "price": 75.00}
      ]
    }
  ]
}
```

### JSON Validation

Valid JSON must follow strict rules:

```json
// VALID JSON:
{
  "name": "Alice",
  "age": 25,
  "active": true
}

// INVALID JSON (common mistakes):
{
  name: "Alice",           // ✗ Keys must be in quotes
  'age': 25,               // ✗ Use double quotes, not single
  "active": True,          // ✗ Use lowercase: true, false, null
  "hobbies": ["reading",]  // ✗ No trailing comma
}
```

!!! warning "JSON Syntax Rules"
    - Keys must be strings in double quotes
    - String values must use double quotes (not single quotes)
    - No trailing commas
    - Boolean values are lowercase: `true`, `false`
    - Use `null` for null values
    - No comments allowed in JSON

## 5.3 JSON in MySQL

Modern MySQL (5.7+) has a native JSON data type and many functions for working with JSON.

### Creating Tables with JSON Columns

```sql
CREATE TABLE customer (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    contact_info JSON,
    preferences JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Inserting JSON Data

```sql
-- Insert JSON as a string
INSERT INTO customer (name, email, contact_info, preferences)
VALUES (
    'Alice Johnson',
    'alice@example.com',
    '{"phone": "217-555-1234", "address": {"city": "Champaign", "state": "IL"}}',
    '{"newsletter": true, "notifications": {"email": true, "sms": false}}'
);

-- Insert using JSON_OBJECT function
INSERT INTO customer (name, email, contact_info)
VALUES (
    'Bob Smith',
    'bob@example.com',
    JSON_OBJECT(
        'phone', '312-555-5678',
        'address', JSON_OBJECT('city', 'Chicago', 'state', 'IL')
    )
);
```

### Querying JSON Data

#### Extract JSON Values with ->

```sql
-- Extract phone number
SELECT
    customer_id,
    name,
    contact_info->'$.phone' AS phone
FROM customer;

-- Extract nested value
SELECT
    customer_id,
    name,
    contact_info->'$.address.city' AS city,
    contact_info->'$.address.state' AS state
FROM customer;
```

#### Extract JSON Values with ->> (Unquoted)

```sql
-- -> returns quoted JSON, ->> returns unquoted text
SELECT
    name,
    contact_info->'$.phone' AS phone_quoted,    -- Returns: "217-555-1234"
    contact_info->>'$.phone' AS phone_unquoted  -- Returns: 217-555-1234
FROM customer;
```

#### Filter by JSON Values

```sql
-- Find customers in Illinois
SELECT name, email
FROM customer
WHERE contact_info->>'$.address.state' = 'IL';

-- Find customers who opted in to newsletter
SELECT name, email
FROM customer
WHERE preferences->>'$.newsletter' = 'true';
```

### Common JSON Functions

#### JSON_EXTRACT()

```sql
-- Extract values (equivalent to ->)
SELECT
    name,
    JSON_EXTRACT(contact_info, '$.phone') AS phone,
    JSON_EXTRACT(contact_info, '$.address.city') AS city
FROM customer;
```

#### JSON_UNQUOTE()

```sql
-- Remove quotes from extracted value
SELECT
    name,
    JSON_UNQUOTE(JSON_EXTRACT(contact_info, '$.phone')) AS phone
FROM customer;
-- Equivalent to: contact_info->>'$.phone'
```

#### JSON_CONTAINS()

```sql
-- Check if JSON contains a value
SELECT name
FROM customer
WHERE JSON_CONTAINS(preferences, 'true', '$.newsletter');
```

#### JSON_SEARCH()

```sql
-- Search for a value and return its path
SELECT
    name,
    JSON_SEARCH(contact_info, 'one', 'Champaign') AS path_to_champaign
FROM customer;
```

#### JSON_SET(), JSON_INSERT(), JSON_REPLACE()

```sql
-- JSON_SET: Insert or update
UPDATE customer
SET contact_info = JSON_SET(
    contact_info,
    '$.phone', '217-555-9999',
    '$.verified', true
)
WHERE customer_id = 1;

-- JSON_INSERT: Insert only if doesn't exist
UPDATE customer
SET preferences = JSON_INSERT(
    preferences,
    '$.theme', 'dark'
)
WHERE customer_id = 1;

-- JSON_REPLACE: Update only if exists
UPDATE customer
SET contact_info = JSON_REPLACE(
    contact_info,
    '$.phone', '217-555-8888'
)
WHERE customer_id = 1;
```

#### JSON_REMOVE()

```sql
-- Remove a key from JSON
UPDATE customer
SET preferences = JSON_REMOVE(preferences, '$.old_setting')
WHERE customer_id = 1;
```

#### JSON_ARRAY() and JSON_OBJECT()

```sql
-- Create JSON array
SELECT JSON_ARRAY(1, 2, 3, 'four', true);
-- Result: [1, 2, 3, "four", true]

-- Create JSON object
SELECT JSON_OBJECT(
    'name', 'Alice',
    'age', 25,
    'active', true
);
-- Result: {"name": "Alice", "age": 25, "active": true}
```

### Working with JSON Arrays

```sql
-- Table with JSON array
CREATE TABLE customer_order (
    order_id INT PRIMARY KEY,
    customer_id INT,
    items JSON  -- Array of order items
);

INSERT INTO customer_order (order_id, customer_id, items)
VALUES (
    101,
    1,
    JSON_ARRAY(
        JSON_OBJECT('product', 'Laptop', 'qty', 1, 'price', 999.99),
        JSON_OBJECT('product', 'Mouse', 'qty', 2, 'price', 25.00)
    )
);

-- Extract array length
SELECT
    order_id,
    JSON_LENGTH(items) AS item_count
FROM customer_order;

-- Extract specific array element (0-indexed)
SELECT
    order_id,
    items->'$[0].product' AS first_item_product,
    items->'$[0].price' AS first_item_price
FROM customer_order;
```

## 5.4 Introduction to APIs

### What is an API?

**API (Application Programming Interface)** is a set of rules that allows different software applications to communicate with each other.

### REST APIs

**REST (Representational State Transfer)** is the most common architectural style for web APIs.

Key characteristics:
- Uses HTTP methods (GET, POST, PUT, DELETE)
- Stateless (each request is independent)
- Returns data in JSON (or XML)
- Uses URLs to identify resources

### HTTP Methods

| Method | Purpose | Example |
|--------|---------|---------|
| **GET** | Retrieve data | Get customer details |
| **POST** | Create new data | Create new customer |
| **PUT** | Update existing data | Update customer info |
| **DELETE** | Delete data | Delete a customer |

### API Request Example

```
GET https://api.example.com/customers/12345
```

### API Response Example (JSON)

```json
{
  "status": "success",
  "data": {
    "customer_id": 12345,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "created_at": "2024-01-15T10:30:00Z",
    "orders": [
      {
        "order_id": 101,
        "date": "2024-01-20",
        "total": 150.00,
        "status": "shipped"
      },
      {
        "order_id": 102,
        "date": "2024-02-01",
        "total": 75.00,
        "status": "delivered"
      }
    ]
  }
}
```

## 5.5 Integrating Databases with APIs

### Use Case: E-commerce Application

An e-commerce application might:

1. **Store core data in relational tables:**
   - Customers, Products, Orders (well-structured data)

2. **Store API responses in JSON columns:**
   - Payment gateway responses
   - Shipping carrier tracking updates
   - Third-party analytics data

### Example Database Design

```sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2),
    status VARCHAR(50),

    -- JSON columns for API data
    payment_response JSON,        -- Store full payment gateway response
    shipping_tracking JSON,        -- Store shipping carrier updates
    metadata JSON,                 -- Store additional flexible data

    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);
```

### Storing API Responses

```sql
-- After calling payment API, store the full response
UPDATE orders
SET payment_response = '{
    "transaction_id": "txn_1234567890",
    "status": "approved",
    "amount": 150.00,
    "currency": "USD",
    "card_type": "Visa",
    "last_4": "4242",
    "timestamp": "2024-01-20T15:30:00Z",
    "gateway": "Stripe"
}'
WHERE order_id = 101;

-- Store shipping tracking updates
UPDATE orders
SET shipping_tracking = JSON_ARRAY_APPEND(
    COALESCE(shipping_tracking, JSON_ARRAY()),
    '$',
    JSON_OBJECT(
        'timestamp', NOW(),
        'status', 'In Transit',
        'location', 'Chicago, IL',
        'carrier', 'UPS'
    )
)
WHERE order_id = 101;
```

### Querying API Data

```sql
-- Find orders paid with Visa
SELECT
    order_id,
    customer_id,
    total_amount,
    payment_response->>'$.card_type' AS card_type,
    payment_response->>'$.last_4' AS last_4
FROM orders
WHERE payment_response->>'$.card_type' = 'Visa';

-- Find orders currently in transit
SELECT
    order_id,
    customer_id,
    JSON_UNQUOTE(JSON_EXTRACT(
        shipping_tracking,
        CONCAT('$[', JSON_LENGTH(shipping_tracking) - 1, '].status')
    )) AS latest_status
FROM orders
WHERE JSON_UNQUOTE(JSON_EXTRACT(
    shipping_tracking,
    CONCAT('$[', JSON_LENGTH(shipping_tracking) - 1, '].status')
)) = 'In Transit';
```

## 5.6 Practical Examples

### Example 1: User Preferences

```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    preferences JSON
);

INSERT INTO users (username, email, preferences)
VALUES (
    'alice_j',
    'alice@example.com',
    JSON_OBJECT(
        'theme', 'dark',
        'language', 'en',
        'notifications', JSON_OBJECT(
            'email', true,
            'sms', false,
            'push', true
        ),
        'privacy', JSON_OBJECT(
            'profile_visible', true,
            'show_email', false
        )
    )
);

-- Query users who have email notifications enabled
SELECT username, email
FROM users
WHERE preferences->>'$.notifications.email' = 'true';

-- Update a specific preference
UPDATE users
SET preferences = JSON_SET(
    preferences,
    '$.theme', 'light'
)
WHERE user_id = 1;
```

### Example 2: Product Catalog with Varying Attributes

```sql
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(200) NOT NULL,
    category VARCHAR(50),
    price DECIMAL(10, 2),
    attributes JSON  -- Flexible attributes that vary by product type
);

-- Electronics product
INSERT INTO products (product_name, category, price, attributes)
VALUES (
    'Laptop Pro 15',
    'Electronics',
    1299.99,
    JSON_OBJECT(
        'brand', 'TechBrand',
        'screen_size', '15 inch',
        'ram', '16GB',
        'storage', '512GB SSD',
        'color', 'Silver'
    )
);

-- Clothing product (different attributes)
INSERT INTO products (product_name, category, price, attributes)
VALUES (
    'Cotton T-Shirt',
    'Clothing',
    29.99,
    JSON_OBJECT(
        'brand', 'FashionCo',
        'size', 'M',
        'color', 'Blue',
        'material', '100% Cotton',
        'care_instructions', 'Machine wash cold'
    )
);

-- Query electronics with specific specs
SELECT
    product_name,
    price,
    attributes->>'$.brand' AS brand,
    attributes->>'$.ram' AS ram,
    attributes->>'$.storage' AS storage
FROM products
WHERE category = 'Electronics'
  AND attributes->>'$.ram' = '16GB';
```

### Example 3: Event Logging

```sql
CREATE TABLE event_log (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    event_type VARCHAR(50),
    user_id INT,
    event_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Log a login event
INSERT INTO event_log (event_type, user_id, event_data)
VALUES (
    'user_login',
    12345,
    JSON_OBJECT(
        'ip_address', '192.168.1.100',
        'user_agent', 'Mozilla/5.0...',
        'device', 'iPhone',
        'location', 'Chicago, IL'
    )
);

-- Log a purchase event
INSERT INTO event_log (event_type, user_id, event_data)
VALUES (
    'purchase',
    12345,
    JSON_OBJECT(
        'order_id', 101,
        'items', JSON_ARRAY(
            JSON_OBJECT('product_id', 5, 'qty', 2),
            JSON_OBJECT('product_id', 12, 'qty', 1)
        ),
        'total', 150.00,
        'payment_method', 'credit_card'
    )
);

-- Query login events from specific location
SELECT
    user_id,
    event_data->>'$.ip_address' AS ip,
    event_data->>'$.location' AS location,
    created_at
FROM event_log
WHERE event_type = 'user_login'
  AND event_data->>'$.location' LIKE '%Chicago%';
```

## 5.7 JSON Best Practices

### When to Use JSON in Databases

✅ **Good Use Cases:**
- Storing API responses
- User preferences and settings
- Product attributes that vary by type
- Event logging with flexible schemas
- Temporary data that will be processed
- Audit trails and metadata

❌ **Poor Use Cases:**
- Frequently queried, structured data
- Data requiring complex JOINs
- Financial transactions (use proper types)
- Data with strict validation requirements

### Performance Considerations

```sql
-- Create indexes on JSON paths for better query performance
-- MySQL 8.0+ supports functional indexes
CREATE INDEX idx_customer_state
ON customer ((contact_info->>'$.address.state'));

-- Create virtual columns for frequently queried JSON data
ALTER TABLE customer
ADD COLUMN state VARCHAR(2) AS (contact_info->>'$.address.state') VIRTUAL;

CREATE INDEX idx_state ON customer(state);
```

### Data Validation

```sql
-- Use CHECK constraints to validate JSON structure (MySQL 8.0.16+)
CREATE TABLE customer_new (
    customer_id INT PRIMARY KEY,
    name VARCHAR(100),
    contact_info JSON,
    CONSTRAINT valid_json CHECK (JSON_VALID(contact_info)),
    CONSTRAINT has_phone CHECK (JSON_CONTAINS_PATH(contact_info, 'one', '$.phone'))
);
```

## Business Application Examples

### Marketing: Campaign Tracking

```sql
CREATE TABLE campaigns (
    campaign_id INT PRIMARY KEY AUTO_INCREMENT,
    campaign_name VARCHAR(200),
    start_date DATE,
    end_date DATE,
    targeting JSON,  -- Flexible targeting criteria
    metrics JSON     -- Performance metrics
);

INSERT INTO campaigns (campaign_name, start_date, end_date, targeting, metrics)
VALUES (
    'Summer Sale 2024',
    '2024-06-01',
    '2024-08-31',
    JSON_OBJECT(
        'age_range', JSON_OBJECT('min', 18, 'max', 45),
        'interests', JSON_ARRAY('technology', 'gadgets', 'electronics'),
        'locations', JSON_ARRAY('IL', 'CA', 'NY'),
        'previous_purchase', true
    ),
    JSON_OBJECT(
        'impressions', 150000,
        'clicks', 7500,
        'conversions', 450,
        'revenue', 67500.00,
        'ctr', 0.05,
        'conversion_rate', 0.06
    )
);

-- Find campaigns targeting technology enthusiasts
SELECT campaign_name, start_date, end_date
FROM campaigns
WHERE JSON_CONTAINS(targeting->'$.interests', '"technology"');
```

## Key Takeaways

1. **JSON provides flexibility** for semi-structured and varying data
2. **Modern databases support JSON natively** with dedicated functions
3. **Use JSON wisely** - not a replacement for relational structures
4. **APIs commonly use JSON** for data exchange
5. **Store API responses** in JSON columns for flexibility
6. **Index JSON paths** for frequently queried data
7. **Validate JSON data** to ensure data integrity

## Review Questions

1. What are the key differences between JSON and traditional relational data storage?
2. When should you use JSON columns instead of creating additional tables?
3. What's the difference between `->` and `->>` operators in MySQL?
4. How would you index a JSON field for better query performance?
5. Give three examples of good use cases for storing JSON in a database.

## Practical Exercise

Design a database for a social media platform:

1. **Create a posts table** that includes:
   - Standard columns: post_id, user_id, created_at
   - JSON column for flexible content (text, images, videos, polls, etc.)
   - JSON column for engagement metrics (likes, shares, comments count)

2. **Write queries to:**
   - Find all posts with images
   - Find posts with more than 100 likes
   - Update the like count for a specific post
   - Find all poll posts created in the last 7 days

3. **Design the JSON structure** for different post types:
   - Text post
   - Image post (with multiple images)
   - Video post
   - Poll post (with multiple options and vote counts)

## Next Steps

In [Chapter 6](06-database-design.md), we'll learn how to design effective database schemas using Entity-Relationship modeling, ensuring your database structure is optimized for your application's needs.

---

*Corresponds to Week 5 of the course - Chapter 9 of the textbook*
