# Chapter 8: Data Warehousing and ETL

## Learning Objectives

After completing this chapter, you will be able to:

- Understand the difference between OLTP and OLAP systems
- Explain what a data warehouse is and why organizations use them
- Design star schemas and snowflake schemas
- Understand dimensional modeling concepts (fact tables and dimension tables)
- Explain the ETL (Extract, Transform, Load) process
- Identify data quality issues and cleansing strategies
- Understand common ETL tools and their applications
- Apply data warehousing concepts to business scenarios

## 8.1 OLTP vs OLAP

### OLTP: Online Transaction Processing

**OLTP systems** are designed for day-to-day operational transactions.

**Characteristics:**
- **Purpose:** Support daily operations
- **Users:** Many concurrent users (employees, customers)
- **Data:** Current, detailed, normalized
- **Transactions:** Short, frequent updates (INSERT, UPDATE, DELETE)
- **Database size:** Smaller (GB to low TB)
- **Design:** Normalized (3NF) to minimize redundancy

**Examples:**
- E-commerce order processing
- Banking transactions
- Student enrollment systems
- Point-of-sale systems

**Example OLTP Query:**
```sql
-- Process a customer order
INSERT INTO orders (customer_id, order_date, total)
VALUES (12345, CURRENT_TIMESTAMP, 150.00);

-- Update inventory
UPDATE product
SET stock_quantity = stock_quantity - 1
WHERE product_id = 5001;
```

### OLAP: Online Analytical Processing

**OLAP systems** are designed for complex analysis and business intelligence.

**Characteristics:**
- **Purpose:** Support decision-making and analysis
- **Users:** Fewer users (analysts, managers, executives)
- **Data:** Historical, aggregated, denormalized
- **Transactions:** Complex queries, mostly reads (SELECT)
- **Database size:** Larger (TB to PB)
- **Design:** Denormalized (star/snowflake schema)

**Examples:**
- Sales trend analysis
- Customer segmentation
- Financial forecasting
- Marketing campaign performance

**Example OLAP Query:**
```sql
-- Analyze quarterly sales trends by region and product category
SELECT
    d.year,
    d.quarter,
    r.region_name,
    p.category,
    SUM(f.sales_amount) AS total_sales,
    COUNT(DISTINCT f.customer_id) AS unique_customers
FROM sales_fact f
JOIN date_dim d ON f.date_key = d.date_key
JOIN region_dim r ON f.region_key = r.region_key
JOIN product_dim p ON f.product_key = p.product_key
WHERE d.year IN (2023, 2024)
GROUP BY d.year, d.quarter, r.region_name, p.category
ORDER BY d.year, d.quarter, total_sales DESC;
```

### OLTP vs OLAP Comparison

| Aspect | OLTP | OLAP |
|--------|------|------|
| **Purpose** | Day-to-day operations | Analysis and decision-making |
| **Data** | Current, detailed | Historical, aggregated |
| **Users** | Many | Fewer |
| **Queries** | Simple, fast | Complex, slower |
| **Operations** | INSERT, UPDATE, DELETE | SELECT (reads) |
| **Design** | Normalized | Denormalized |
| **Size** | GB to low TB | TB to PB |
| **Response Time** | Milliseconds | Seconds to minutes |
| **Examples** | Order processing, CRM | Sales analysis, forecasting |

!!! tip "Separation of Concerns"
    Organizations typically maintain separate OLTP and OLAP systems:
    - **OLTP:** Operational database (fast transactions)
    - **OLAP:** Data warehouse (complex analysis)
    - **ETL:** Process to move data from OLTP → OLAP

## 8.2 What is a Data Warehouse?

### Definition

A **data warehouse** is a centralized repository that stores integrated data from multiple sources, optimized for analysis and reporting.

### Characteristics

1. **Subject-Oriented:** Organized around business subjects (sales, customers, products)
2. **Integrated:** Combines data from multiple sources into consistent format
3. **Time-Variant:** Maintains historical data for trend analysis
4. **Non-Volatile:** Data is loaded and queried, not updated (read-mostly)

### Why Data Warehouses?

**Problems with using OLTP for analysis:**
- Queries slow down operational systems
- Data scattered across multiple systems
- Inconsistent formats and definitions
- Limited historical data

**Benefits of data warehouses:**
- **Better performance** - Optimized for analytics
- **Integrated view** - Single source of truth
- **Historical analysis** - Track trends over time
- **Business intelligence** - Support decision-making

### Data Warehouse Architecture

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Source 1     │  │ Source 2     │  │ Source 3     │
│ (OLTP DB)    │  │ (CRM)        │  │ (ERP)        │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └─────────────────┼─────────────────┘
                         │
                    ┌────▼─────┐
                    │   ETL    │  Extract, Transform, Load
                    │ Process  │
                    └────┬─────┘
                         │
                  ┌──────▼──────────┐
                  │ Data Warehouse  │
                  │  (OLAP)         │
                  └──────┬──────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
    │ Reports │    │Dashboards│   │Analytics│
    └─────────┘    └─────────┘    └─────────┘
```

## 8.3 Dimensional Modeling

**Dimensional modeling** is a design technique for data warehouses that organizes data into **fact tables** and **dimension tables**.

### Fact Tables

A **fact table** stores measurable, quantitative data (metrics) about business events.

**Characteristics:**
- Contains **facts** (numerical measures)
- Contains **foreign keys** to dimension tables
- Typically has many rows (millions to billions)
- Grows over time

**Common facts:**
- Sales amount, quantity sold
- Revenue, profit, cost
- Number of calls, minutes
- Page views, clicks

**Example Fact Table:**
```sql
CREATE TABLE sales_fact (
    sale_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- Foreign keys to dimension tables
    date_key INT,
    product_key INT,
    customer_key INT,
    store_key INT,

    -- Facts (measures)
    quantity_sold INT,
    sales_amount DECIMAL(10,2),
    cost_amount DECIMAL(10,2),
    profit_amount DECIMAL(10,2),

    FOREIGN KEY (date_key) REFERENCES date_dim(date_key),
    FOREIGN KEY (product_key) REFERENCES product_dim(product_key),
    FOREIGN KEY (customer_key) REFERENCES customer_dim(customer_key),
    FOREIGN KEY (store_key) REFERENCES store_dim(store_key)
);
```

### Dimension Tables

A **dimension table** provides descriptive attributes (context) for analyzing facts.

**Characteristics:**
- Contains **dimensions** (descriptive attributes)
- Contains a **surrogate key** (primary key)
- Typically has fewer rows than fact tables
- Relatively static (changes infrequently)

**Common dimensions:**
- Time/Date (year, quarter, month, day)
- Product (name, category, brand)
- Customer (name, segment, location)
- Geography (city, state, region, country)

**Example Dimension Tables:**
```sql
-- Date dimension
CREATE TABLE date_dim (
    date_key INT PRIMARY KEY,         -- Surrogate key
    full_date DATE,                   -- Actual date
    day_of_week VARCHAR(10),          -- Monday, Tuesday...
    day_of_month INT,
    day_of_year INT,
    week_of_year INT,
    month_name VARCHAR(10),           -- January, February...
    month_number INT,
    quarter INT,                      -- 1, 2, 3, 4
    year INT,
    is_weekend BOOLEAN,
    is_holiday BOOLEAN
);

-- Product dimension
CREATE TABLE product_dim (
    product_key INT PRIMARY KEY,      -- Surrogate key
    product_id VARCHAR(50),           -- Business key
    product_name VARCHAR(200),
    category VARCHAR(100),
    subcategory VARCHAR(100),
    brand VARCHAR(100),
    unit_price DECIMAL(10,2)
);

-- Customer dimension
CREATE TABLE customer_dim (
    customer_key INT PRIMARY KEY,     -- Surrogate key
    customer_id VARCHAR(50),          -- Business key
    customer_name VARCHAR(200),
    email VARCHAR(100),
    segment VARCHAR(50),              -- Retail, Wholesale, etc.
    city VARCHAR(100),
    state VARCHAR(50),
    country VARCHAR(50),
    region VARCHAR(50)
);

-- Store dimension
CREATE TABLE store_dim (
    store_key INT PRIMARY KEY,        -- Surrogate key
    store_id VARCHAR(50),             -- Business key
    store_name VARCHAR(200),
    address VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(50),
    region VARCHAR(50),
    store_type VARCHAR(50),           -- Flagship, Outlet, etc.
    size_sqft INT
);
```

### Surrogate Keys vs Natural Keys

**Natural Key:** Business identifier from source system (Customer_ID, Product_SKU)

**Surrogate Key:** System-generated unique identifier (auto-incrementing integer)

**Why use surrogate keys in data warehouses?**
- **Independence:** Source system can change without affecting warehouse
- **Performance:** Smaller integers are faster to join
- **Slowly Changing Dimensions:** Track historical changes
- **Integration:** Combine data from multiple sources with same natural key

## 8.4 Star Schema

A **star schema** is the simplest dimensional model with a central fact table surrounded by dimension tables.

### Star Schema Structure

```
                   ┌──────────────┐
                   │  DATE_DIM    │
                   │  date_key PK │
                   │  year        │
                   │  quarter     │
                   │  month       │
                   └──────┬───────┘
                          │
       ┌──────────────┐   │
       │ PRODUCT_DIM  │   │   ┌──────────────┐
       │product_key PK├───┼───┤ SALES_FACT   │
       │ category     │   │   │ sale_id PK   │
       │ brand        │   └───┤ date_key FK  │
       └──────────────┘       │ product_key FK│
                              │ customer_key FK│
       ┌──────────────┐       │ store_key FK │
       │CUSTOMER_DIM  │       │ sales_amount │
       │customer_key PK├──────┤ profit       │
       │ name         │       └──────┬───────┘
       │ segment      │              │
       └──────────────┘              │
                          ┌──────────▼──────┐
                          │  STORE_DIM      │
                          │  store_key PK   │
                          │  region         │
                          │  store_type     │
                          └─────────────────┘
```

### Star Schema Example

```sql
-- Complete star schema for sales analysis

-- Fact table
CREATE TABLE sales_fact (
    sale_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    date_key INT,
    product_key INT,
    customer_key INT,
    store_key INT,
    quantity INT,
    sales_amount DECIMAL(10,2),
    cost_amount DECIMAL(10,2),
    profit_amount DECIMAL(10,2),
    FOREIGN KEY (date_key) REFERENCES date_dim(date_key),
    FOREIGN KEY (product_key) REFERENCES product_dim(product_key),
    FOREIGN KEY (customer_key) REFERENCES customer_dim(customer_key),
    FOREIGN KEY (store_key) REFERENCES store_dim(store_key)
);

-- Dimension tables (see previous section for full definitions)
```

### Querying a Star Schema

```sql
-- Total sales by quarter and product category
SELECT
    d.year,
    d.quarter,
    p.category,
    SUM(f.sales_amount) AS total_sales,
    SUM(f.quantity) AS total_quantity,
    COUNT(*) AS transaction_count
FROM sales_fact f
JOIN date_dim d ON f.date_key = d.date_key
JOIN product_dim p ON f.product_key = p.product_key
WHERE d.year = 2024
GROUP BY d.year, d.quarter, p.category
ORDER BY d.quarter, total_sales DESC;

-- Top customers by region
SELECT
    c.region,
    c.customer_name,
    SUM(f.sales_amount) AS total_spent,
    COUNT(DISTINCT f.sale_id) AS purchase_count
FROM sales_fact f
JOIN customer_dim c ON f.customer_key = c.customer_key
JOIN date_dim d ON f.date_key = d.date_key
WHERE d.year = 2024
GROUP BY c.region, c.customer_key, c.customer_name
HAVING SUM(f.sales_amount) > 10000
ORDER BY c.region, total_spent DESC;
```

### Star Schema Benefits

✅ **Simple to understand** - Easy for business users
✅ **Fast queries** - Fewer joins, better performance
✅ **Easy to navigate** - Direct relationships
✅ **Widely supported** - BI tools work well with star schemas

## 8.5 Snowflake Schema

A **snowflake schema** is a normalized version of the star schema where dimension tables are normalized into multiple related tables.

### Snowflake Schema Structure

```
                      ┌──────────────┐
                      │  YEAR_DIM    │
                      │  year_key PK │
                      └──────┬───────┘
                             │
                      ┌──────▼───────┐
                      │ QUARTER_DIM  │
                      │quarter_key PK│
                      │ year_key FK  │
                      └──────┬───────┘
                             │
       ┌──────────────┐      │
       │ CATEGORY_DIM │      │   ┌──────────────┐
       │category_key PK├──┐  └───┤ SALES_FACT   │
       └──────────────┘  │      │ ...          │
                         │      │ quarter_key FK│
       ┌──────────────┐  │      │ product_key FK│
       │ PRODUCT_DIM  │  │      └──────────────┘
       │product_key PK│◄─┘
       │category_key FK│
       └──────────────┘
```

### Snowflake Schema Example

```sql
-- Normalized product dimension (snowflake)
CREATE TABLE category_dim (
    category_key INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100),
    department VARCHAR(100)
);

CREATE TABLE brand_dim (
    brand_key INT PRIMARY KEY AUTO_INCREMENT,
    brand_name VARCHAR(100),
    manufacturer VARCHAR(100)
);

CREATE TABLE product_dim (
    product_key INT PRIMARY KEY AUTO_INCREMENT,
    product_id VARCHAR(50),
    product_name VARCHAR(200),
    category_key INT,              -- FK to category_dim
    brand_key INT,                 -- FK to brand_dim
    unit_price DECIMAL(10,2),
    FOREIGN KEY (category_key) REFERENCES category_dim(category_key),
    FOREIGN KEY (brand_key) REFERENCES brand_dim(brand_key)
);
```

### Star vs Snowflake

| Aspect | Star Schema | Snowflake Schema |
|--------|-------------|------------------|
| **Structure** | Denormalized dimensions | Normalized dimensions |
| **Joins** | Fewer (faster queries) | More (slower queries) |
| **Storage** | More redundancy | Less redundancy |
| **Complexity** | Simpler | More complex |
| **Maintenance** | Easier to update | More complex updates |
| **Use Case** | Most common, best for performance | When storage is critical |

!!! tip "When to Use Each"
    **Star Schema (Recommended):**
    - General-purpose analytics
    - Fast query performance needed
    - Business users run queries

    **Snowflake Schema:**
    - Storage space is limited
    - Dimension tables are very large
    - Need to reduce redundancy

## 8.6 ETL: Extract, Transform, Load

**ETL** is the process of moving data from source systems to a data warehouse.

### ETL Process Overview

```
┌─────────────┐
│  EXTRACT    │  Get data from source systems
└──────┬──────┘
       │
┌──────▼──────┐
│ TRANSFORM   │  Clean, validate, and format data
└──────┬──────┘
       │
┌──────▼──────┐
│   LOAD      │  Insert data into data warehouse
└─────────────┘
```

### 1. Extract

**Extract** data from various source systems.

**Source Systems:**
- Operational databases (MySQL, PostgreSQL, Oracle)
- Files (CSV, Excel, JSON, XML)
- APIs (REST, SOAP)
- Cloud services (Salesforce, Google Analytics)
- Legacy systems

**Extraction Methods:**

**Full Extraction:**
- Extract all data from source
- Simple but inefficient
- Used for initial load

```sql
-- Extract all customers
SELECT * FROM source_db.customer;
```

**Incremental Extraction:**
- Extract only changed data since last extraction
- More efficient
- Requires tracking changes (timestamp, change flag)

```sql
-- Extract customers modified since last run
SELECT * FROM source_db.customer
WHERE last_modified > '2024-11-20 00:00:00';
```

### 2. Transform

**Transform** data to make it consistent, clean, and ready for analysis.

**Common Transformations:**

#### Data Cleansing
```sql
-- Remove duplicates
SELECT DISTINCT customer_id, email, name
FROM staging.customer;

-- Handle NULL values
UPDATE staging.customer
SET phone = 'UNKNOWN'
WHERE phone IS NULL;

-- Fix data format inconsistencies
UPDATE staging.customer
SET state = UPPER(state),  -- IL, not il or Il
    phone = REGEXP_REPLACE(phone, '[^0-9]', '');  -- Remove formatting
```

#### Data Validation
```sql
-- Ensure email format is valid
DELETE FROM staging.customer
WHERE email NOT LIKE '%@%.%';

-- Ensure dates are valid
DELETE FROM staging.order
WHERE order_date > CURRENT_DATE;

-- Ensure referential integrity
DELETE FROM staging.order
WHERE customer_id NOT IN (SELECT customer_id FROM staging.customer);
```

#### Data Standardization
```sql
-- Standardize country names
UPDATE staging.customer
SET country = CASE
    WHEN country IN ('US', 'USA', 'United States') THEN 'United States'
    WHEN country IN ('UK', 'United Kingdom') THEN 'United Kingdom'
    ELSE country
END;

-- Standardize gender
UPDATE staging.customer
SET gender = CASE
    WHEN gender IN ('M', 'Male', 'male') THEN 'M'
    WHEN gender IN ('F', 'Female', 'female') THEN 'F'
    ELSE 'U'  -- Unknown
END;
```

#### Data Enrichment
```sql
-- Add calculated fields
ALTER TABLE staging.order
ADD COLUMN profit_amount DECIMAL(10,2);

UPDATE staging.order
SET profit_amount = sales_amount - cost_amount;

-- Derive customer segment
ALTER TABLE staging.customer
ADD COLUMN segment VARCHAR(50);

UPDATE staging.customer c
SET segment = CASE
    WHEN total_purchases > 10000 THEN 'Premium'
    WHEN total_purchases > 5000 THEN 'Gold'
    WHEN total_purchases > 1000 THEN 'Silver'
    ELSE 'Bronze'
END;
```

#### Data Aggregation
```sql
-- Create monthly sales summary
INSERT INTO warehouse.monthly_sales
SELECT
    DATE_FORMAT(order_date, '%Y-%m-01') AS month,
    SUM(sales_amount) AS total_sales,
    COUNT(*) AS order_count,
    AVG(sales_amount) AS avg_order_value
FROM staging.order
GROUP BY DATE_FORMAT(order_date, '%Y-%m-01');
```

### 3. Load

**Load** transformed data into the data warehouse.

**Loading Strategies:**

#### Full Load
Replace all data in the target table.

```sql
-- Truncate and reload
TRUNCATE TABLE warehouse.product_dim;

INSERT INTO warehouse.product_dim
SELECT * FROM staging.product_transformed;
```

#### Incremental Load
Add only new or changed records.

```sql
-- Insert new records
INSERT INTO warehouse.sales_fact
SELECT * FROM staging.sales_new
WHERE sale_id NOT IN (SELECT sale_id FROM warehouse.sales_fact);

-- Update existing records
UPDATE warehouse.customer_dim c
JOIN staging.customer_updated s ON c.customer_id = s.customer_id
SET
    c.name = s.name,
    c.email = s.email,
    c.updated_date = CURRENT_TIMESTAMP;
```

#### Slowly Changing Dimensions (SCD)

**Type 1: Overwrite**
Simply update the existing record.

```sql
-- Customer changes address - just update
UPDATE customer_dim
SET city = 'Chicago', state = 'IL'
WHERE customer_id = 12345;
```

**Type 2: Add New Row**
Keep history by adding a new row with version tracking.

```sql
-- Customer changes address - keep history
-- First, expire the old record
UPDATE customer_dim
SET end_date = CURRENT_DATE, is_current = FALSE
WHERE customer_id = 12345 AND is_current = TRUE;

-- Insert new record
INSERT INTO customer_dim (
    customer_id, name, email, city, state,
    start_date, end_date, is_current
)
VALUES (
    12345, 'Alice Johnson', 'alice@example.com', 'Chicago', 'IL',
    CURRENT_DATE, '9999-12-31', TRUE
);
```

**Type 3: Add New Column**
Keep limited history in additional columns.

```sql
ALTER TABLE customer_dim
ADD COLUMN previous_city VARCHAR(100),
ADD COLUMN previous_state VARCHAR(50);

UPDATE customer_dim
SET
    previous_city = city,
    previous_state = state,
    city = 'Chicago',
    state = 'IL'
WHERE customer_id = 12345;
```

## 8.7 Data Quality

### Data Quality Dimensions

1. **Accuracy** - Is the data correct?
2. **Completeness** - Is all required data present?
3. **Consistency** - Is data consistent across sources?
4. **Timeliness** - Is data up-to-date?
5. **Validity** - Does data conform to business rules?
6. **Uniqueness** - Are there duplicates?

### Data Quality Checks

```sql
-- Check for duplicates
SELECT customer_id, COUNT(*)
FROM staging.customer
GROUP BY customer_id
HAVING COUNT(*) > 1;

-- Check for NULL values in required fields
SELECT COUNT(*) AS null_emails
FROM staging.customer
WHERE email IS NULL;

-- Check for invalid data
SELECT COUNT(*) AS invalid_dates
FROM staging.order
WHERE order_date > CURRENT_DATE;

-- Check referential integrity
SELECT COUNT(*) AS orphan_orders
FROM staging.order o
LEFT JOIN staging.customer c ON o.customer_id = c.customer_id
WHERE c.customer_id IS NULL;
```

## 8.8 ETL Tools

### KNIME (Konstanz Information Miner)

**KNIME** is a free, open-source data analytics platform with visual ETL capabilities.

**Features:**
- Visual workflow designer (drag-and-drop)
- Connect to databases, files, APIs
- Data transformation nodes
- Machine learning integration

**Example KNIME Workflow:**
```
[CSV Reader] → [Column Filter] → [Row Filter] → [DB Writer]
                                      ↓
                               [Data Cleansing]
```

### Other ETL Tools

**Open Source:**
- **Talend Open Studio** - Java-based ETL
- **Apache NiFi** - Data flow automation
- **Pentaho Data Integration (PDI)** - Kettle

**Commercial:**
- **Informatica PowerCenter** - Enterprise ETL
- **Microsoft SSIS** - SQL Server Integration Services
- **IBM DataStage** - Enterprise data integration
- **AWS Glue** - Cloud-based ETL

## 8.9 Business Application Example

### Retail Sales Data Warehouse

**Scenario:** A retail chain wants to analyze sales across stores, products, and time.

**Source Systems:**
- POS (Point of Sale) database - Transaction data
- Product database - Product information
- Store database - Store information
- CRM - Customer information

**Star Schema Design:**

```sql
-- Fact table
CREATE TABLE sales_fact (
    sale_id BIGINT PRIMARY KEY,
    date_key INT,
    product_key INT,
    customer_key INT,
    store_key INT,
    quantity INT,
    sales_amount DECIMAL(10,2),
    discount_amount DECIMAL(10,2),
    profit_amount DECIMAL(10,2),
    FOREIGN KEY (date_key) REFERENCES date_dim(date_key),
    FOREIGN KEY (product_key) REFERENCES product_dim(product_key),
    FOREIGN KEY (customer_key) REFERENCES customer_dim(customer_key),
    FOREIGN KEY (store_key) REFERENCES store_dim(store_key),
    INDEX idx_date (date_key),
    INDEX idx_store (store_key),
    INDEX idx_product (product_key)
);
```

**ETL Process:**

```sql
-- 1. EXTRACT: Get yesterday's sales
CREATE TEMPORARY TABLE staging_sales AS
SELECT *
FROM pos_db.transaction
WHERE transaction_date = CURRENT_DATE - INTERVAL 1 DAY;

-- 2. TRANSFORM: Clean and enrich
UPDATE staging_sales
SET amount = 0
WHERE amount < 0;  -- Fix negative amounts

-- Calculate profit
ALTER TABLE staging_sales
ADD COLUMN profit DECIMAL(10,2);

UPDATE staging_sales s
JOIN product_dim p ON s.product_id = p.product_id
SET s.profit = s.amount - (s.quantity * p.cost);

-- 3. LOAD: Insert into fact table
INSERT INTO sales_fact (
    date_key, product_key, customer_key, store_key,
    quantity, sales_amount, discount_amount, profit_amount
)
SELECT
    d.date_key,
    p.product_key,
    c.customer_key,
    st.store_key,
    s.quantity,
    s.amount,
    s.discount,
    s.profit
FROM staging_sales s
JOIN date_dim d ON s.transaction_date = d.full_date
JOIN product_dim p ON s.product_id = p.product_id
JOIN customer_dim c ON s.customer_id = c.customer_id
JOIN store_dim st ON s.store_id = st.store_id;
```

**Analysis Queries:**

```sql
-- Monthly sales by store region
SELECT
    d.year,
    d.month_name,
    st.region,
    SUM(f.sales_amount) AS total_sales,
    SUM(f.profit_amount) AS total_profit
FROM sales_fact f
JOIN date_dim d ON f.date_key = d.date_key
JOIN store_dim st ON f.store_key = st.store_key
WHERE d.year = 2024
GROUP BY d.year, d.month_number, d.month_name, st.region
ORDER BY d.month_number, total_sales DESC;

-- Top products by category
SELECT
    p.category,
    p.product_name,
    SUM(f.quantity) AS units_sold,
    SUM(f.sales_amount) AS revenue,
    SUM(f.profit_amount) AS profit
FROM sales_fact f
JOIN product_dim p ON f.product_key = p.product_key
JOIN date_dim d ON f.date_key = d.date_key
WHERE d.year = 2024
GROUP BY p.category, p.product_key, p.product_name
ORDER BY p.category, revenue DESC;
```

## Key Takeaways

1. **OLTP vs OLAP** - Different purposes require different designs
2. **Data warehouses centralize data** - Single source of truth for analytics
3. **Star schemas are most common** - Simple, fast, effective
4. **Fact tables store measures** - Quantitative data about events
5. **Dimension tables provide context** - Who, what, when, where
6. **ETL is essential** - Extract, Transform, Load process moves and prepares data
7. **Data quality matters** - Garbage in, garbage out
8. **Tools make ETL easier** - KNIME, Talend, and others simplify workflows

## Review Questions

1. What's the difference between OLTP and OLAP systems?
2. What are the four characteristics of a data warehouse?
3. Explain the difference between fact tables and dimension tables.
4. What is a star schema, and why is it popular?
5. What are the three main steps in the ETL process?
6. When would you use a snowflake schema instead of a star schema?

## Practical Exercise

**Scenario:** Design a data warehouse for a university.

**Requirements:**
- Track student course enrollments and grades over time
- Analyze enrollment trends by semester, department, and instructor
- Track student demographics and performance

**Tasks:**

1. **Identify dimensions:**
   - What dimension tables do you need?
   - What attributes should each dimension have?

2. **Design fact table:**
   - What facts (measures) should you track?
   - What foreign keys to dimension tables?

3. **Draw star schema:**
   - Show all tables and relationships

4. **Write CREATE statements:**
   - Create all dimension tables
   - Create fact table

5. **Write analysis queries:**
   - Average grade by department and semester
   - Enrollment trends over time
   - Top-performing students by major

## Next Steps

In [Chapter 9](09-nosql.md), we'll explore NoSQL databases - modern database systems designed for flexibility, scalability, and handling unstructured data.

---

*Corresponds to Week 8 of the course - Chapter 12 of the textbook*
