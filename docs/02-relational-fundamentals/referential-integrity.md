# Referential Integrity

Referential integrity ensures that relationships between tables remain consistent - foreign keys must always reference valid primary keys or be NULL.

## Definition

**Referential Integrity Rule**: A foreign key value must either:
1. Match an existing primary key value in the referenced table, OR
2. Be NULL (if allowed)

## Enforcement

### Basic Foreign Key Constraint

```sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- This succeeds (customer 1 exists)
INSERT INTO orders VALUES (101, 1, '2025-01-15');

-- This fails (customer 999 doesn't exist)
INSERT INTO orders VALUES (102, 999, '2025-01-15');
-- Error: Foreign key constraint violated
```

## Referential Actions

### ON DELETE

#### CASCADE
Delete related child rows when parent is deleted

```sql
CREATE TABLE order_items (
    item_id INT PRIMARY KEY,
    order_id INT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON DELETE CASCADE
);

-- Delete order
DELETE FROM orders WHERE order_id = 101;
-- All order_items for order 101 are automatically deleted
```

#### RESTRICT (or NO ACTION)
Prevent deletion of parent if children exist

```sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        ON DELETE RESTRICT
);

-- This fails if customer has orders
DELETE FROM customers WHERE customer_id = 1;
-- Error: Cannot delete - orders exist for this customer
```

#### SET NULL
Set foreign key to NULL when parent is deleted

```sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    sales_rep_id INT,
    FOREIGN KEY (sales_rep_id) REFERENCES employees(emp_id)
        ON DELETE SET NULL
);

-- Delete employee
DELETE FROM employees WHERE emp_id = 5;
-- orders.sales_rep_id becomes NULL for orders where sales_rep_id was 5
```

#### SET DEFAULT
Set foreign key to default value when parent is deleted

```sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    sales_rep_id INT DEFAULT 999,  -- Default "unassigned" rep
    FOREIGN KEY (sales_rep_id) REFERENCES employees(emp_id)
        ON DELETE SET DEFAULT
);
```

### ON UPDATE

Similar options for when primary key is updated:

```sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        ON UPDATE CASCADE  -- Update foreign keys when primary key changes
        ON DELETE RESTRICT
);
```

## Common Patterns

### Prevent Orphan Records

```sql
-- Orders cannot exist without customers
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        ON DELETE RESTRICT
);
```

### Cascade Deletes for Dependent Data

```sql
-- Order items are meaningless without orders
CREATE TABLE order_items (
    item_id INT PRIMARY KEY,
    order_id INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON DELETE CASCADE
);
```

### Preserve History with SET NULL

```sql
-- Keep order history even if sales rep leaves
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    sales_rep_id INT,
    FOREIGN KEY (sales_rep_id) REFERENCES employees(emp_id)
        ON DELETE SET NULL
);
```

## Benefits of Referential Integrity

1. **Data Consistency**: No orphaned records
2. **Data Accuracy**: Relationships always valid
3. **Automatic Enforcement**: Database ensures integrity
4. **Error Prevention**: Invalid operations rejected
5. **Simplified Application Logic**: Less validation code needed

## Practice Questions

!!! question "Check Your Understanding"
    1. What happens if you try to insert a row with a foreign key that doesn't exist?
    2. When would you use ON DELETE CASCADE vs ON DELETE RESTRICT?
    3. Can a foreign key be NULL?

??? example "Answers"
    1. The database rejects the insert with a foreign key constraint violation error
    2. CASCADE when child records should be deleted with parent (e.g., order items with orders). RESTRICT when you want to prevent deletion if children exist (e.g., can't delete customer with orders)
    3. Yes, unless the column has a NOT NULL constraint. NULL foreign key means "no relationship"

## Summary

Referential integrity:
- Maintains valid relationships between tables
- Prevents orphaned records
- Provides options for handling parent deletions/updates
- Is automatically enforced by the database

---

**Next Chapter**: [SQL Basics](../03-sql-basics/index.md)
