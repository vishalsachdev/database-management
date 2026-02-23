# Chapter 3b: JOINs, Subqueries & Window Functions

## Learning Objectives

After completing this chapter, you will be able to:

- Insert, update, and delete data using DML write operations
- Modify table structures with ALTER TABLE
- Group and filter aggregated data using GROUP BY and HAVING
- Combine data from multiple tables using INNER, LEFT, RIGHT, and Self JOINs
- Write subqueries (scalar, correlated, and EXISTS) to solve multi-step problems
- Simplify complex queries with Common Table Expressions (CTEs)
- Apply window functions (ROW_NUMBER, RANK, DENSE_RANK, LEAD, LAG) for analytics
- Combine JOINs, CTEs, and window functions to answer sophisticated business questions

## Our Example Database

Every example in this chapter uses the same four-table e-commerce schema. If you completed the normalization exercise in Chapter 4, these tables will look familiar -- they are the end result of normalizing a flat order spreadsheet into 3NF.

```
CUSTOMER                          PRODUCT
+-------------+----------------+  +------------+------------------+--------+----------+
| customer_id | name           |  | product_id | product_name     | price  | category |
+-------------+----------------+  +------------+------------------+--------+----------+
| C01         | Alice Johnson  |  | P01        | Laptop           | 999.99 | Tech     |
| C02         | Bob Smith      |  | P02        | Mouse            |  24.99 | Tech     |
| C03         | Carol Martinez |  | P03        | Desk Chair       | 249.99 | Office   |
| C04         | David Lee      |  | P04        | Monitor          | 349.99 | Tech     |
| C05         | Eva Chen       |  | P05        | Standing Desk    | 599.99 | Office   |
+-------------+----------------+  +------------+------------------+--------+----------+

ORDERS                                          ORDER_LINE
+----------+-------------+------------+-------+ +----------+------------+-----+------------+
| order_id | customer_id | order_date | status| | order_id | product_id | qty | unit_price |
+----------+-------------+------------+-------+ +----------+------------+-----+------------+
| 1001     | C01         | 2026-01-15 | shipped| | 1001     | P01        | 1   | 999.99     |
| 1002     | C01         | 2026-02-20 | shipped| | 1001     | P02        | 2   |  24.99     |
| 1003     | C02         | 2026-02-25 | pending| | 1002     | P03        | 1   | 249.99     |
| 1004     | C03         | 2026-03-01 | shipped| | 1003     | P04        | 1   | 349.99     |
| 1005     | C03         | 2026-03-10 | pending| | 1003     | P02        | 3   |  24.99     |
| 1006     | C04         | 2026-03-15 | shipped| | 1004     | P01        | 1   | 999.99     |
+----------+-------------+------------+-------+ | 1004     | P05        | 1   | 599.99     |
                                                 | 1005     | P03        | 2   | 249.99     |
                                                 | 1006     | P02        | 5   |  24.99     |
                                                 | 1006     | P04        | 1   | 349.99     |
                                                 +----------+------------+-----+------------+
```

Notice that customer C05 (Eva Chen) has never placed an order. This is intentional -- it will matter when we discuss LEFT JOINs.

## 3b.1 DML Write Operations: INSERT, UPDATE, DELETE

Chapter 3 covered reading data with SELECT. Real databases also need to *write* data. The three DML write statements are INSERT, UPDATE, and DELETE.

### INSERT -- Adding Rows

```sql
-- Insert a single row
INSERT INTO customer (customer_id, name)
VALUES ('C06', 'Frank Nguyen');

-- Insert multiple rows at once
INSERT INTO product (product_id, product_name, price, category)
VALUES
    ('P06', 'Webcam',     79.99, 'Tech'),
    ('P07', 'Headphones', 59.99, 'Tech'),
    ('P08', 'Footrest',   34.99, 'Office');
```

!!! tip "Column List Best Practice"
    Always list the columns explicitly in your INSERT statement. Writing `INSERT INTO customer VALUES (...)` works but breaks if the table structure ever changes.

### UPDATE -- Modifying Existing Rows

```sql
-- Give the Mouse a price increase
UPDATE product
SET price = 29.99
WHERE product_id = 'P02';

-- Update multiple columns at once
UPDATE orders
SET status = 'delivered', order_date = '2026-01-16'
WHERE order_id = 1001;
```

!!! warning "Always Include a WHERE Clause"
    Running `UPDATE product SET price = 0` without a WHERE clause sets **every** product's price to zero. This is one of the most common and costly SQL mistakes. Always double-check your WHERE clause before executing an UPDATE.

### DELETE -- Removing Rows

```sql
-- Delete a specific order line
DELETE FROM order_line
WHERE order_id = 1006 AND product_id = 'P04';

-- Delete all pending orders
DELETE FROM orders
WHERE status = 'pending';
```

!!! warning "DELETE is Permanent"
    Unlike a spreadsheet, there is no "undo" for DELETE in SQL. In production, many teams use "soft deletes" -- setting an `is_deleted` flag instead of removing rows -- so data can be recovered.

## 3b.2 ALTER TABLE -- Changing Table Structure

After a table is created, you can modify its structure with ALTER TABLE.

```sql
-- Add a new column
ALTER TABLE customer
ADD COLUMN email VARCHAR(100);

-- Change a column's data type
ALTER TABLE product
MODIFY COLUMN price DECIMAL(12, 2);

-- Rename a column
ALTER TABLE orders
RENAME COLUMN status TO order_status;

-- Drop a column
ALTER TABLE customer
DROP COLUMN email;
```

| Operation | Syntax | Use Case |
|-----------|--------|----------|
| Add column | `ADD COLUMN name type` | New business requirement |
| Modify column | `MODIFY COLUMN name new_type` | Change data type or size |
| Rename column | `RENAME COLUMN old TO new` | Clarify naming |
| Drop column | `DROP COLUMN name` | Remove unused field |
| Add constraint | `ADD CONSTRAINT name ...` | Enforce new rule |

!!! note "DDL vs DML"
    ALTER TABLE is a **DDL** (Data Definition Language) command -- it changes the table's *structure*. INSERT, UPDATE, and DELETE are **DML** (Data Manipulation Language) commands -- they change the table's *data*. This distinction matters for transactions and permissions.

## 3b.3 GROUP BY and HAVING

Chapter 3 introduced aggregate functions (COUNT, SUM, AVG, MIN, MAX). GROUP BY lets you apply those functions *per group* rather than across the entire table.

### GROUP BY Basics

```sql
-- Count orders per customer
SELECT customer_id, COUNT(*) AS order_count
FROM orders
GROUP BY customer_id;
```

**Result:**
```
+-------------+-------------+
| customer_id | order_count |
+-------------+-------------+
| C01         | 2           |
| C02         | 1           |
| C03         | 2           |
| C04         | 1           |
+-------------+-------------+
```

### Multiple Aggregations in One Query

```sql
-- Revenue summary per product category
SELECT
    p.category,
    COUNT(DISTINCT ol.order_id) AS orders_with_category,
    SUM(ol.qty)                 AS total_units_sold,
    SUM(ol.qty * ol.unit_price) AS total_revenue,
    AVG(ol.unit_price)          AS avg_unit_price,
    MIN(ol.unit_price)          AS min_price,
    MAX(ol.unit_price)          AS max_price
FROM order_line ol
JOIN product p ON ol.product_id = p.product_id
GROUP BY p.category;
```

!!! tip "The GROUP BY Rule"
    Every column in your SELECT must either appear in the GROUP BY clause or be inside an aggregate function. If you SELECT `customer_id` and `COUNT(*)`, you must GROUP BY `customer_id`. Violating this rule produces an error in most databases (MySQL in strict mode, PostgreSQL, SQL Server).

### HAVING -- Filtering Groups

WHERE filters individual rows *before* grouping. HAVING filters groups *after* aggregation.

```sql
-- Find customers who have placed more than one order
SELECT customer_id, COUNT(*) AS order_count
FROM orders
GROUP BY customer_id
HAVING COUNT(*) > 1;
```

**Result:**
```
+-------------+-------------+
| customer_id | order_count |
+-------------+-------------+
| C01         | 2           |
| C03         | 2           |
+-------------+-------------+
```

### WHERE vs HAVING

| Clause | Filters | Runs | Can Use Aggregates? |
|--------|---------|------|---------------------|
| WHERE | Individual rows | Before GROUP BY | No |
| HAVING | Groups | After GROUP BY | Yes |

```sql
-- Combine WHERE and HAVING
-- Among shipped orders, find customers with total spending over $500
SELECT
    customer_id,
    SUM(ol.qty * ol.unit_price) AS total_spent
FROM orders o
JOIN order_line ol ON o.order_id = ol.order_id
WHERE o.status = 'shipped'
GROUP BY customer_id
HAVING SUM(ol.qty * ol.unit_price) > 500;
```

!!! example "Execution Order"
    SQL does not execute in the order you write it. The actual execution order is:

    1. **FROM** -- identify the tables
    2. **WHERE** -- filter individual rows
    3. **GROUP BY** -- form groups
    4. **HAVING** -- filter groups
    5. **SELECT** -- compute output columns
    6. **ORDER BY** -- sort results
    7. **LIMIT** -- restrict row count

    This is why you cannot use a column alias from SELECT inside a WHERE clause -- SELECT has not run yet.

## 3b.4 JOINs -- Combining Tables

JOINs are what make relational databases relational. They let you combine rows from two or more tables based on a related column (typically a foreign key relationship).

### INNER JOIN

An INNER JOIN returns only rows where the join condition matches in **both** tables.

```sql
-- Get each order with the customer's name
SELECT o.order_id, c.name, o.order_date, o.status
FROM orders o
INNER JOIN customer c ON o.customer_id = c.customer_id;
```

**How it works:**

```
CUSTOMER                    ORDERS
+-----+----------------+   +------+-----+------------+
| C01 | Alice Johnson  | --| 1001 | C01 | 2026-01-15 |  <- match
| C02 | Bob Smith      | --| 1002 | C01 | 2026-02-20 |  <- match
| C03 | Carol Martinez | --| 1003 | C02 | 2026-02-25 |  <- match
| C04 | David Lee      | --| 1004 | C03 | 2026-03-01 |  <- match
| C05 | Eva Chen       |   | 1005 | C03 | 2026-03-10 |  <- match
+-----+----------------+   | 1006 | C04 | 2026-03-15 |  <- match
       ^                    +------+-----+------------+
       |
  C05 has no orders -> excluded from INNER JOIN result
```

**Result:**
```
+----------+----------------+------------+---------+
| order_id | name           | order_date | status  |
+----------+----------------+------------+---------+
| 1001     | Alice Johnson  | 2026-01-15 | shipped |
| 1002     | Alice Johnson  | 2026-02-20 | shipped |
| 1003     | Bob Smith      | 2026-02-25 | pending |
| 1004     | Carol Martinez | 2026-03-01 | shipped |
| 1005     | Carol Martinez | 2026-03-10 | pending |
| 1006     | David Lee      | 2026-03-15 | shipped |
+----------+----------------+------------+---------+
```

### LEFT JOIN (LEFT OUTER JOIN)

A LEFT JOIN returns **all** rows from the left table, plus matching rows from the right table. If there is no match, the right side columns are NULL.

```sql
-- All customers, including those who have never ordered
SELECT c.customer_id, c.name, o.order_id, o.order_date
FROM customer c
LEFT JOIN orders o ON c.customer_id = o.customer_id;
```

**Result:**
```
+-------------+----------------+----------+------------+
| customer_id | name           | order_id | order_date |
+-------------+----------------+----------+------------+
| C01         | Alice Johnson  | 1001     | 2026-01-15 |
| C01         | Alice Johnson  | 1002     | 2026-02-20 |
| C02         | Bob Smith      | 1003     | 2026-02-25 |
| C03         | Carol Martinez | 1004     | 2026-03-01 |
| C03         | Carol Martinez | 1005     | 2026-03-10 |
| C04         | David Lee      | 1006     | 2026-03-15 |
| C05         | Eva Chen       | NULL     | NULL       |  <- no orders
+-------------+----------------+----------+------------+
```

!!! tip "Finding Missing Data with LEFT JOIN"
    A common pattern is LEFT JOIN + WHERE ... IS NULL to find records with *no* match:

    ```sql
    -- Customers who have NEVER placed an order
    SELECT c.customer_id, c.name
    FROM customer c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
    WHERE o.order_id IS NULL;
    ```

    Result: Eva Chen (C05).

### RIGHT JOIN (RIGHT OUTER JOIN)

A RIGHT JOIN is the mirror image of LEFT JOIN: it returns **all** rows from the right table, plus matching rows from the left.

```sql
-- All orders, including any without a valid customer (data quality check)
SELECT c.name, o.order_id, o.order_date
FROM customer c
RIGHT JOIN orders o ON c.customer_id = o.customer_id;
```

!!! note "LEFT JOIN vs RIGHT JOIN"
    In practice, most SQL developers use LEFT JOIN almost exclusively. Any RIGHT JOIN can be rewritten as a LEFT JOIN by swapping the table order:

    ```sql
    -- These two queries produce the same result:
    SELECT * FROM A RIGHT JOIN B ON A.id = B.id;
    SELECT * FROM B LEFT JOIN A ON A.id = B.id;
    ```

    Pick one convention and stick with it. LEFT JOIN is the industry standard.

### JOIN Summary

| JOIN Type | Left Table Rows | Right Table Rows | NULL Fills |
|-----------|----------------|------------------|------------|
| **INNER JOIN** | Only matching | Only matching | Never |
| **LEFT JOIN** | All | Only matching | Right side |
| **RIGHT JOIN** | Only matching | All | Left side |
| **FULL OUTER JOIN** | All | All | Both sides |

### Joining Multiple Tables

Real queries often join three or more tables. Read them left to right, one JOIN at a time.

```sql
-- Full order details: customer name, order date, product name, quantity, line total
SELECT
    c.name           AS customer_name,
    o.order_id,
    o.order_date,
    p.product_name,
    ol.qty,
    ol.qty * ol.unit_price AS line_total
FROM orders o
JOIN customer c    ON o.customer_id = c.customer_id
JOIN order_line ol ON o.order_id    = ol.order_id
JOIN product p     ON ol.product_id = p.product_id
ORDER BY o.order_id, p.product_name;
```

!!! tip "Table Aliases"
    Use short aliases (`o` for orders, `c` for customer) to keep multi-table queries readable. Without aliases, you would write `orders.order_id` and `customer.name` everywhere, which gets verbose quickly.

## 3b.5 Self Joins

A **self join** joins a table to itself. This is useful when a table contains a hierarchical or reflexive relationship -- where a row references another row in the same table.

### The Classic Example: Employee-Manager

```sql
-- Add a manager_id column that references another employee
CREATE TABLE employee (
    emp_id     INT PRIMARY KEY,
    emp_name   VARCHAR(50),
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES employee(emp_id)
);
```

```
EMPLOYEE
+--------+-----------+------------+
| emp_id | emp_name  | manager_id |
+--------+-----------+------------+
| 1      | Diana     | NULL       |  <- CEO, no manager
| 2      | Erik      | 1          |
| 3      | Fiona     | 1          |
| 4      | George    | 2          |
| 5      | Hannah    | 2          |
+--------+-----------+------------+
```

```sql
-- Show each employee alongside their manager's name
SELECT
    e.emp_name  AS employee,
    m.emp_name  AS manager
FROM employee e
LEFT JOIN employee m ON e.manager_id = m.emp_id;
```

**Result:**
```
+----------+---------+
| employee | manager |
+----------+---------+
| Diana    | NULL    |  <- CEO has no manager
| Erik     | Diana   |
| Fiona    | Diana   |
| George   | Erik    |
| Hannah   | Erik    |
+----------+---------+
```

The key insight: we use the **same table twice** with different aliases (`e` for the employee role, `m` for the manager role). The LEFT JOIN ensures the CEO (who has no manager) still appears in the results.

## 3b.6 Subqueries

A **subquery** is a query nested inside another query. Subqueries let you break complex problems into steps.

### Scalar Subqueries (Return One Value)

A scalar subquery returns a single value and can be used anywhere a single value is expected.

```sql
-- Find products priced above the average
SELECT product_name, price
FROM product
WHERE price > (SELECT AVG(price) FROM product);
```

**How it executes:**

1. Inner query runs first: `SELECT AVG(price) FROM product` returns 444.99
2. Outer query becomes: `WHERE price > 444.99`

### Column Subqueries (Return a List)

A column subquery returns a set of values, used with IN, ANY, or ALL.

```sql
-- Find customers who have placed at least one order
SELECT name
FROM customer
WHERE customer_id IN (
    SELECT DISTINCT customer_id
    FROM orders
);
```

### Table Subqueries (Return a Table)

A table subquery appears in the FROM clause and acts as a temporary table.

```sql
-- Find each customer's total spending, then get those above $500
SELECT customer_name, total_spent
FROM (
    SELECT
        c.name AS customer_name,
        SUM(ol.qty * ol.unit_price) AS total_spent
    FROM orders o
    JOIN customer c    ON o.customer_id = c.customer_id
    JOIN order_line ol ON o.order_id    = ol.order_id
    GROUP BY c.name
) AS customer_totals
WHERE total_spent > 500;
```

!!! note "Derived Table Alias"
    MySQL requires that every subquery in the FROM clause has an alias (the `AS customer_totals` above). Forgetting this alias is a common syntax error.

### Correlated Subqueries

A **correlated subquery** references a column from the outer query. It re-executes for every row of the outer query.

```sql
-- For each product, show its price and how it compares to the category average
SELECT
    p.product_name,
    p.price,
    p.category,
    (SELECT AVG(p2.price)
     FROM product p2
     WHERE p2.category = p.category) AS category_avg
FROM product p;
```

The inner query references `p.category` from the outer query, so it runs once per product, computing the average for that product's specific category.

### EXISTS -- Testing for Existence

EXISTS returns TRUE if the subquery returns **any** rows. It is often faster than IN for large datasets.

```sql
-- Find customers who have placed at least one shipped order
SELECT c.name
FROM customer c
WHERE EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.customer_id = c.customer_id
      AND o.status = 'shipped'
);
```

```sql
-- Find customers who have NEVER ordered (NOT EXISTS)
SELECT c.name
FROM customer c
WHERE NOT EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.customer_id = c.customer_id
);
```

!!! tip "EXISTS vs IN"
    - **EXISTS** stops as soon as it finds one matching row. Efficient when the subquery table is large.
    - **IN** collects all values from the subquery into a list, then checks membership. Can be simpler for small lists.

    Rule of thumb: use EXISTS for correlated checks against large tables; use IN for short, known lists.

## 3b.7 Common Table Expressions (CTEs)

A **Common Table Expression (CTE)** is a named temporary result set defined with the `WITH` keyword. CTEs make complex queries readable by breaking them into logical steps.

### Basic CTE Syntax

```sql
WITH customer_spending AS (
    SELECT
        c.customer_id,
        c.name,
        SUM(ol.qty * ol.unit_price) AS total_spent
    FROM orders o
    JOIN customer c    ON o.customer_id = c.customer_id
    JOIN order_line ol ON o.order_id    = ol.order_id
    GROUP BY c.customer_id, c.name
)
SELECT name, total_spent
FROM customer_spending
WHERE total_spent > 500
ORDER BY total_spent DESC;
```

Compare this to the table subquery version in Section 3b.6. The CTE version reads top-to-bottom like a recipe: "First, calculate customer spending. Then, filter to big spenders."

### Multiple CTEs

You can chain multiple CTEs separated by commas:

```sql
WITH order_totals AS (
    -- Step 1: Calculate total for each order
    SELECT
        order_id,
        SUM(qty * unit_price) AS order_total
    FROM order_line
    GROUP BY order_id
),
order_details AS (
    -- Step 2: Attach customer and date info
    SELECT
        o.order_id,
        c.name AS customer_name,
        o.order_date,
        ot.order_total
    FROM orders o
    JOIN customer c     ON o.customer_id = c.customer_id
    JOIN order_totals ot ON o.order_id   = ot.order_id
)
-- Step 3: Final output
SELECT customer_name, order_id, order_date, order_total
FROM order_details
ORDER BY order_total DESC;
```

!!! tip "CTEs vs Subqueries"
    CTEs and subqueries produce the same results. The advantages of CTEs:

    - **Readability**: Named steps are easier to follow than deeply nested parentheses
    - **Reuse**: You can reference a CTE multiple times in the same query
    - **Debugging**: You can test each CTE independently by selecting from it

    Use CTEs as your default for any query that would require more than one level of nesting.

## 3b.8 Window Functions

Window functions perform calculations across a *set of rows related to the current row* -- without collapsing those rows into a single group the way GROUP BY does.

### Window Functions vs GROUP BY

| Feature | GROUP BY + Aggregate | Window Function |
|---------|---------------------|-----------------|
| Rows in result | One row per group | Every original row preserved |
| Syntax | `GROUP BY col` | `OVER (PARTITION BY col)` |
| Use case | Summary tables | Rankings, running totals, comparisons |

### The OVER Clause

Every window function includes an `OVER()` clause that defines the "window" (the set of rows the function operates on).

```sql
-- Add a column showing overall average price alongside each product
SELECT
    product_name,
    price,
    AVG(price) OVER () AS overall_avg
FROM product;
```

**Result:**
```
+------------------+--------+-------------+
| product_name     | price  | overall_avg |
+------------------+--------+-------------+
| Laptop           | 999.99 | 444.99      |
| Mouse            |  24.99 | 444.99      |
| Desk Chair       | 249.99 | 444.99      |
| Monitor          | 349.99 | 444.99      |
| Standing Desk    | 599.99 | 444.99      |
+------------------+--------+-------------+
```

All five rows are preserved. The `OVER ()` with empty parentheses means "the window is the entire table."

### PARTITION BY -- Windows Within Groups

PARTITION BY divides rows into groups (partitions) for the window function, like GROUP BY but without collapsing rows.

```sql
-- Show each product's price alongside its category average
SELECT
    product_name,
    category,
    price,
    AVG(price) OVER (PARTITION BY category) AS category_avg
FROM product;
```

**Result:**
```
+------------------+----------+--------+--------------+
| product_name     | category | price  | category_avg |
+------------------+----------+--------+--------------+
| Laptop           | Tech     | 999.99 | 458.32       |
| Mouse            | Tech     |  24.99 | 458.32       |
| Monitor          | Tech     | 349.99 | 458.32       |
| Desk Chair       | Office   | 249.99 | 424.99       |
| Standing Desk    | Office   | 599.99 | 424.99       |
+------------------+----------+--------+--------------+
```

### ROW_NUMBER -- Sequential Numbering

ROW_NUMBER assigns a unique sequential integer to each row within a partition.

```sql
-- Number each order per customer by date
SELECT
    c.name,
    o.order_id,
    o.order_date,
    ROW_NUMBER() OVER (
        PARTITION BY o.customer_id
        ORDER BY o.order_date
    ) AS order_sequence
FROM orders o
JOIN customer c ON o.customer_id = c.customer_id;
```

**Result:**
```
+----------------+----------+------------+----------------+
| name           | order_id | order_date | order_sequence |
+----------------+----------+------------+----------------+
| Alice Johnson  | 1001     | 2026-01-15 | 1              |
| Alice Johnson  | 1002     | 2026-02-20 | 2              |
| Bob Smith      | 1003     | 2026-02-25 | 1              |
| Carol Martinez | 1004     | 2026-03-01 | 1              |
| Carol Martinez | 1005     | 2026-03-10 | 2              |
| David Lee      | 1006     | 2026-03-15 | 1              |
+----------------+----------+------------+----------------+
```

### RANK and DENSE_RANK

RANK and DENSE_RANK assign rankings based on the ORDER BY expression. They differ in how they handle ties.

```sql
SELECT
    product_name,
    price,
    RANK()       OVER (ORDER BY price DESC) AS price_rank,
    DENSE_RANK() OVER (ORDER BY price DESC) AS price_dense_rank
FROM product;
```

**To illustrate the difference, assume two products share the same price:**

```
+------------------+--------+------------+------------------+
| product_name     | price  | price_rank | price_dense_rank |
+------------------+--------+------------+------------------+
| Laptop           | 999.99 | 1          | 1                |
| Standing Desk    | 599.99 | 2          | 2                |
| Monitor          | 349.99 | 3          | 3                |
| Desk Chair       | 249.99 | 4          | 4                |
| Mouse            |  24.99 | 5          | 5                |
+------------------+--------+------------+------------------+
```

| Function | Ties | Next Rank After Tie |
|----------|------|---------------------|
| **ROW_NUMBER** | No ties (arbitrary tiebreak) | Always increments by 1 |
| **RANK** | Same rank for ties | Skips numbers (1, 1, 3) |
| **DENSE_RANK** | Same rank for ties | No gaps (1, 1, 2) |

!!! example "When Ties Matter"
    Imagine three students tied for 2nd place in a competition:

    - **RANK**: 1st, 2nd, 2nd, 2nd, 5th (skips 3rd and 4th)
    - **DENSE_RANK**: 1st, 2nd, 2nd, 2nd, 3rd (no gap)
    - **ROW_NUMBER**: 1st, 2nd, 3rd, 4th, 5th (no ties -- arbitrary among the tied students)

### LEAD and LAG -- Accessing Adjacent Rows

LEAD looks at the *next* row; LAG looks at the *previous* row. These are invaluable for time-series analysis.

```sql
-- For each of Alice's orders, show the previous and next order dates
SELECT
    o.order_id,
    o.order_date,
    LAG(o.order_date)  OVER (ORDER BY o.order_date) AS prev_order_date,
    LEAD(o.order_date) OVER (ORDER BY o.order_date) AS next_order_date
FROM orders o
WHERE o.customer_id = 'C01';
```

**Result:**
```
+----------+------------+-----------------+-----------------+
| order_id | order_date | prev_order_date | next_order_date |
+----------+------------+-----------------+-----------------+
| 1001     | 2026-01-15 | NULL            | 2026-02-20      |
| 1002     | 2026-02-20 | 2026-01-15      | NULL            |
+----------+------------+-----------------+-----------------+
```

A practical application -- calculating days between consecutive orders:

```sql
-- Days between consecutive orders for each customer
SELECT
    c.name,
    o.order_id,
    o.order_date,
    LAG(o.order_date) OVER (
        PARTITION BY o.customer_id
        ORDER BY o.order_date
    ) AS prev_order_date,
    DATEDIFF(
        o.order_date,
        LAG(o.order_date) OVER (
            PARTITION BY o.customer_id
            ORDER BY o.order_date
        )
    ) AS days_since_last_order
FROM orders o
JOIN customer c ON o.customer_id = c.customer_id;
```

### Window Function Summary

| Function | Purpose | Example Use Case |
|----------|---------|-----------------|
| **ROW_NUMBER()** | Sequential numbering | Pagination, deduplication |
| **RANK()** | Ranking with gaps | Competition rankings |
| **DENSE_RANK()** | Ranking without gaps | Top-N without skipping |
| **LEAD(col, n)** | Value from next row | Forecasting, trend analysis |
| **LAG(col, n)** | Value from previous row | Period-over-period comparison |
| **SUM() OVER** | Running total | Cumulative revenue |
| **AVG() OVER** | Moving average | Smoothing time-series data |

## 3b.9 Putting It All Together

Real business questions rarely require just one technique. This section combines JOINs, CTEs, and window functions in a single query.

**Business question:** "Rank our customers by total spending and show each customer's percentage of overall revenue."

```sql
WITH customer_revenue AS (
    -- Step 1: Total revenue per customer
    SELECT
        c.customer_id,
        c.name,
        SUM(ol.qty * ol.unit_price) AS total_spent
    FROM orders o
    JOIN customer c    ON o.customer_id = c.customer_id
    JOIN order_line ol ON o.order_id    = ol.order_id
    GROUP BY c.customer_id, c.name
),
ranked AS (
    -- Step 2: Rank customers and calculate percentage
    SELECT
        name,
        total_spent,
        RANK() OVER (ORDER BY total_spent DESC) AS spending_rank,
        ROUND(
            total_spent / SUM(total_spent) OVER () * 100, 1
        ) AS pct_of_total
    FROM customer_revenue
)
-- Step 3: Final output
SELECT
    spending_rank,
    name,
    total_spent,
    pct_of_total
FROM ranked
ORDER BY spending_rank;
```

**Result:**
```
+---------------+----------------+-------------+--------------+
| spending_rank | name           | total_spent | pct_of_total |
+---------------+----------------+-------------+--------------+
| 1             | Carol Martinez | 2099.96     | 41.1         |
| 2             | Alice Johnson  | 1299.96     | 25.5         |
| 3             | David Lee      | 474.94      | 9.3          |
| 4             | Bob Smith      | 424.96      | 8.3          |
+---------------+----------------+-------------+--------------+
```

!!! example "Reading the Query"
    This query uses four techniques from this chapter:

    1. **JOINs** (three tables: orders, customer, order_line) to bring the data together
    2. **GROUP BY** with SUM to calculate total spending per customer
    3. **CTE** (`customer_revenue`) to name and reuse the intermediate result
    4. **Window functions** (RANK and SUM OVER) to rank customers and compute percentages

    When building complex queries like this, develop and test each CTE independently before combining them. Start with Step 1, verify it produces correct numbers, then add Step 2, and so on.

## Key Takeaways

1. **INSERT, UPDATE, DELETE** complete the SQL data manipulation toolkit -- always include a WHERE clause with UPDATE and DELETE
2. **GROUP BY transforms rows into groups** for aggregation; HAVING filters those groups after aggregation
3. **JOINs connect tables** through foreign key relationships -- INNER JOIN keeps only matches, LEFT JOIN preserves all rows from the left table
4. **Subqueries nest queries inside queries** -- use scalar subqueries for single values, correlated subqueries when the inner query depends on the outer
5. **CTEs (WITH clause) are named subqueries** that make complex SQL readable and debuggable -- prefer them over deeply nested subqueries
6. **Window functions analyze rows without collapsing them** -- ROW_NUMBER for sequencing, RANK for ordering, LEAD/LAG for comparing adjacent rows
7. **Real business queries combine all these tools** -- build incrementally, test each piece, then assemble

## Review Questions

1. What is the difference between WHERE and HAVING? Write a query that uses both to find product categories with more than 2 products where the average price exceeds $100.
2. Explain when you would use a LEFT JOIN instead of an INNER JOIN. Give a business scenario where using INNER JOIN would produce incorrect results.
3. What is a correlated subquery? How does it differ from a regular subquery in terms of execution?
4. Rewrite the following subquery as a CTE. Which version is more readable?
    ```sql
    SELECT name FROM customer
    WHERE customer_id IN (
        SELECT customer_id FROM orders
        WHERE order_date >= '2026-03-01'
    );
    ```
5. Explain the difference between RANK() and DENSE_RANK(). In what business scenario would the distinction matter?

## Practical Exercise

Using the four-table e-commerce database from this chapter, write SQL queries for each task:

1. **INSERT**: Add a new customer (C06, 'Frank Nguyen') and a new order (1007) for that customer with two products of your choice.

2. **GROUP BY + HAVING**: Find all products that have been ordered more than twice (across all orders). Show the product name and total quantity ordered.

3. **LEFT JOIN**: Produce a list of ALL customers showing their name and total amount spent. Customers who have never ordered should show $0.00. (Hint: use COALESCE to replace NULL with 0.)

4. **CTE + Window Function**: Write a query that shows each order with its total value, and includes a column ranking orders from most to least expensive. Use a CTE to calculate order totals, then apply RANK() in the final SELECT.

5. **LEAD/LAG**: For customers who have placed more than one order, show each order date alongside the number of days since their previous order.

## Next Steps

In [Chapter 4](04-data-modeling-normalization.md), we'll learn how to design databases using ER diagrams and normalization -- the principles that produce well-structured schemas like the e-commerce database used throughout this chapter.

---

*Corresponds to Week 2 of BADM 554 -- JOINs, Subqueries & Window Functions*
