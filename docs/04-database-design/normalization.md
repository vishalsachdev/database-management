# Normalization

Normalization is the process of organizing data to reduce redundancy and improve data integrity.

## What is Normalization?

**Normalization** systematically decomposes tables to eliminate:
- Data redundancy
- Update anomalies
- Insert anomalies
- Delete anomalies

## Why Normalize?

### Problem: Unnormalized Data

```
Orders table (poorly designed):
| order_id | customer_name | customer_email | product_name | product_price | quantity |
|----------|---------------|----------------|--------------|---------------|----------|
| 1        | Alice         | alice@email    | Laptop       | 999.99        | 1        |
| 2        | Bob           | bob@email      | Mouse        | 29.99         | 2        |
| 3        | Alice         | alice@email    | Keyboard     | 79.99         | 1        |
```

**Problems**:
1. **Update Anomaly**: Change Alice's email → must update multiple rows
2. **Insert Anomaly**: Can't add customer without order
3. **Delete Anomaly**: Delete last order → lose customer info
4. **Redundancy**: Customer data repeated for each order

### Solution: Normalized Data

```sql
-- Customers table
| customer_id | name  | email        |
|-------------|-------|--------------|
| 1           | Alice | alice@email  |
| 2           | Bob   | bob@email    |

-- Products table
| product_id | name     | price  |
|------------|----------|--------|
| 1          | Laptop   | 999.99 |
| 2          | Mouse    | 29.99  |
| 3          | Keyboard | 79.99  |

-- Orders table
| order_id | customer_id | product_id | quantity |
|----------|-------------|------------|----------|
| 1        | 1           | 1          | 1        |
| 2        | 2           | 2          | 2        |
| 3        | 1           | 3          | 1        |
```

**Benefits**:
- No redundancy
- Update customer email once
- Can add customers without orders
- Deleting order doesn't lose customer data

## Functional Dependencies

**Key concept** for normalization

**Definition**: Attribute B is functionally dependent on A if each value of A determines exactly one value of B.

```
A → B  (A determines B)

Examples:
student_id → student_name  (each student_id has one name)
isbn → book_title          (each ISBN has one title)
order_id → order_date      (each order has one date)
```

### Types of Dependencies

**Full Dependency**: B depends on all of A
```
(student_id, course_id) → grade
```

**Partial Dependency**: B depends on part of A
```
(student_id, course_id) → student_name  (Bad! Only depends on student_id)
```

**Transitive Dependency**: A → B → C
```
student_id → department_id → department_name
```

## Normalization Process

### Step 1: Identify Functional Dependencies

```
Example table: student_courses
(student_id, course_id, student_name, course_name, instructor, grade)

Dependencies:
student_id → student_name
course_id → course_name, instructor
(student_id, course_id) → grade
```

### Step 2: Apply Normal Forms

Progress through normal forms (1NF → 2NF → 3NF → BCNF) to eliminate anomalies.

See [Normal Forms](normal-forms.md) for detailed rules.

### Step 3: Decompose Tables

Split tables to satisfy normal form requirements.

```sql
-- Before (not normalized)
student_courses (student_id, course_id, student_name, course_name, instructor, grade)

-- After (normalized)
students (student_id, student_name)
courses (course_id, course_name, instructor)
enrollments (student_id, course_id, grade)
```

## Benefits vs. Costs

### Benefits

1. **Reduced Redundancy**: Data stored once
2. **Data Integrity**: Updates in one place
3. **Smaller Storage**: Less duplication
4. **Consistent Data**: Single source of truth

### Costs

1. **More Joins**: Queries become more complex
2. **Performance Impact**: Joins can be slower
3. **Complexity**: More tables to manage

## When to Stop Normalizing

**Balance** between normalization and performance:

- **OLTP Systems**: Normalize to 3NF or BCNF
- **Data Warehouses**: Often denormalized for query speed
- **Read-Heavy Applications**: May denormalize frequently accessed data

## Example: Blog System

### Unnormalized

```
posts_table:
| post_id | title | author_name | author_email | category_name | tags          |
|---------|-------|-------------|--------------|---------------|---------------|
| 1       | ...   | Alice       | alice@email  | Technology    | sql, db       |
| 2       | ...   | Alice       | alice@email  | Tutorial      | python, code  |
```

**Problems**: Author data repeated, tags not atomic

### Normalized

```sql
authors (author_id, name, email)
categories (category_id, name)
posts (post_id, title, author_id, category_id, content, created_at)
tags (tag_id, name)
post_tags (post_id, tag_id)
```

**Benefits**: No redundancy, flexible tagging, easy to update author info

## Practice Questions

!!! question "Check Your Understanding"
    1. What are the three types of anomalies that normalization prevents?
    2. What is a functional dependency?
    3. When might you choose not to fully normalize?

??? example "Answers"
    1. Update anomaly (data must be changed in multiple places), Insert anomaly (can't add data without unrelated data), Delete anomaly (deleting data loses other information)
    2. A functional dependency (A → B) means each value of A determines exactly one value of B
    3. When query performance is critical and you have read-heavy workloads, strategic denormalization may improve performance by reducing joins

## Summary

Normalization:
- Reduces redundancy
- Prevents anomalies
- Improves data integrity
- Requires understanding functional dependencies
- Must balance with performance needs

---

**Next**: Learn the specific rules: [Normal Forms](normal-forms.md)
