# Chapter 4: Data Modeling & Normalization

## Learning Objectives

After completing this chapter, you will be able to:

- Design Entity-Relationship (ER) diagrams using Chen and Crow's Foot notation
- Identify entities, attributes, relationships, and cardinality constraints
- Map ER diagrams to relational tables
- Recognize data redundancy and its problems
- Apply normalization rules (1NF, 2NF, 3NF, BCNF) to eliminate anomalies
- Determine functional dependencies in a relation
- Explain when and why denormalization is appropriate
- Evaluate normalization trade-offs in real business systems

## 4.1 Introduction to Data Modeling

Before writing SQL or loading data, you need a blueprint. **Data modeling** is the process of designing the structure of a database: what data to store, how pieces of data relate to each other, and what rules the data must follow.

Think of it like an architect's floor plan. You would never start pouring concrete without a plan, and you should never start building tables without a data model.

### Why Data Modeling Matters

| Concern | What Happens Without Modeling |
|---------|-------------------------------|
| **Data redundancy** | The same customer address stored in five tables |
| **Update anomalies** | Changing a price in one place but not another |
| **Insert anomalies** | Unable to add a new product until someone orders it |
| **Delete anomalies** | Deleting an order accidentally removes the only record of a customer |

!!! tip "Business Perspective"
    Poor data models cost real money. A 2023 Gartner report estimated that poor data quality costs organizations an average of $12.9 million per year. Much of this traces back to flawed database design.

## 4.2 The Entity-Relationship Model

The **Entity-Relationship (ER) model**, introduced by Peter Chen in 1976, is a conceptual tool for describing data requirements. It focuses on *what* data the business needs, not *how* it will be stored.

### Entities

An **entity** is a thing or object in the real world that is distinguishable from other objects. Entities become tables in a relational database.

**Examples:** Customer, Product, Order, Employee, Department

### Attributes

An **attribute** is a property or characteristic of an entity. Attributes become columns.

**Types of attributes:**

| Type | Description | Example |
|------|-------------|---------|
| **Simple** | Cannot be subdivided | `first_name`, `price` |
| **Composite** | Can be broken into sub-parts | `address` (street, city, state, zip) |
| **Derived** | Computed from other attributes | `age` (from `birth_date`) |
| **Multi-valued** | Can hold multiple values | `phone_numbers` (home, work, cell) |
| **Key attribute** | Uniquely identifies the entity | `customer_id` |

!!! warning "Multi-Valued Attributes"
    Multi-valued attributes violate the atomic value rule from Chapter 2. During ER-to-relational mapping, they must be moved to a separate table.

### Entity Relationships

A **relationship** is an association between two or more entities. In a business context, relationships represent verbs: a customer *places* an order, an employee *works in* a department, a product *belongs to* a category.

### Cardinality

**Cardinality** describes the maximum number of entity instances that can participate in a relationship.

| Cardinality | Meaning | Example |
|-------------|---------|---------|
| **1:1** (one-to-one) | Each A is associated with at most one B | Employee *has* one Parking Spot |
| **1:M** (one-to-many) | Each A can be associated with many Bs | Department *employs* many Employees |
| **M:N** (many-to-many) | Each A can be associated with many Bs and vice versa | Student *enrolls in* many Courses; each Course *has* many Students |

### Participation Constraints

**Participation** describes the minimum number of instances required in a relationship.

- **Total participation** (mandatory): Every entity instance must participate. Shown as a double line in Chen notation.
- **Partial participation** (optional): Some instances may not participate. Shown as a single line.

!!! example "Participation Example"
    In an e-commerce system:

    - Every ORDER **must** be placed by a CUSTOMER (total participation of ORDER in the "places" relationship)
    - A CUSTOMER **may or may not** have placed any orders (partial participation of CUSTOMER)

## 4.3 ER Diagrams

ER diagrams are the visual representation of the ER model. Two notations are widely used.

### Chen Notation

Chen notation uses distinct shapes for each component:

```
  +------------+         +-----------+         +-----------+
  |  CUSTOMER  |---<places>---| ORDER     |---<contains>---|  PRODUCT  |
  +------------+         +-----------+         +-----------+
       |                      |                     |
   customer_id (PK)       order_id (PK)        product_id (PK)
   name                   order_date           name
   email                  total_amount         price
```

**Shape legend:**

| Shape | Meaning |
|-------|---------|
| Rectangle | Entity |
| Ellipse | Attribute |
| Diamond | Relationship |
| Double rectangle | Weak entity |
| Double ellipse | Multi-valued attribute |
| Dashed ellipse | Derived attribute |

### Crow's Foot Notation

Crow's foot notation is more common in industry tools (MySQL Workbench, Lucidchart, draw.io). It shows cardinality using symbols at the ends of relationship lines.

```
CUSTOMER          ORDER             ORDER_ITEM         PRODUCT
+-------------+   +-------------+   +--------------+   +------------+
| customer_id |   | order_id    |   | item_id      |   | product_id |
| name        |---| customer_id |---| order_id     |---| name       |
| email       |   | order_date  |   | product_id   |   | price      |
| phone       |   | total       |   | quantity     |   | category   |
+-------------+   +-------------+   +--------------+   +------------+
      1       ||---o<   M             M   >o---||  1
```

**Crow's foot symbols:**

| Symbol | Meaning |
|--------|---------|
| `\|\|` (single bar) | Exactly one (mandatory) |
| `o` (circle) | Zero (optional) |
| `>` or crow's foot | Many |
| `\|\|---\|\|` | One-to-one, both mandatory |
| `\|\|---o<` | One-to-many, many side optional |

!!! tip "Which Notation to Use?"
    - **Chen notation** is better for learning because each concept has its own visual shape.
    - **Crow's foot notation** is better for implementation because it maps more directly to tables and is used by most database design tools.

    In this course, we will use both. Exams may use either notation.

## 4.4 Weak Entities and Enhanced ER

### Weak Entities

A **weak entity** cannot be uniquely identified by its own attributes alone. It depends on a **strong (owner) entity** for identification.

!!! example "Weak Entity Example"
    An ORDER_ITEM cannot exist without its parent ORDER. Its identity depends on the combination of `order_id` (from ORDER) and `line_number` (its own partial key).

    ```
    ORDER (strong entity)                ORDER_ITEM (weak entity)
    +-------------+                      +-------------------+
    | order_id PK |----<has items>----|| | order_id FK/PK    |
    | order_date  |                      | line_number PK    |
    | customer_id |                      | product_id FK     |
    +-------------+                      | quantity          |
                                         | unit_price        |
                                         +-------------------+
    ```

    The primary key of ORDER_ITEM is the composite key `{order_id, line_number}`.

### Enhanced ER Model: Specialization and Generalization

The **Enhanced ER (EER) model** adds inheritance-like concepts from object-oriented design.

**Specialization** (top-down): Splitting a general entity into specialized sub-entities.

**Generalization** (bottom-up): Combining similar entities into a general super-entity.

```
                  +----------+
                  | EMPLOYEE |
                  +----------+
                  | emp_id   |
                  | name     |
                  | salary   |
                  +----+-----+
                       |
              +--------+--------+
              |                 |
       +-----------+     +------------+
       | SALARIED  |     | HOURLY     |
       +-----------+     +------------+
       | annual_pay|     | hourly_rate|
       | bonus     |     | hours/week |
       +-----------+     +------------+
```

**Constraints on specialization:**

- **Disjoint (d):** An entity can belong to at most one subclass (an employee is either Salaried or Hourly, not both).
- **Overlapping (o):** An entity can belong to multiple subclasses.
- **Total:** Every entity in the superclass must belong to some subclass.
- **Partial:** Some entities may not belong to any subclass.

## 4.5 ER-to-Relational Mapping

Once your ER diagram is complete, you translate it into relational tables. Here are the mapping rules.

### Rule 1: Strong Entities Become Tables

Each strong entity becomes a table. Each attribute becomes a column. The key attribute becomes the primary key.

```
ER Entity: CUSTOMER(customer_id, name, email, phone)

SQL:
CREATE TABLE customer (
    customer_id INT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(100) UNIQUE,
    phone       CHAR(10)
);
```

### Rule 2: Weak Entities Become Tables with Composite Keys

The weak entity becomes a table. Its primary key is the combination of the owner's primary key (as a foreign key) and its own partial key.

```sql
CREATE TABLE order_item (
    order_id    INT,
    line_number INT,
    product_id  INT NOT NULL,
    quantity    INT NOT NULL,
    unit_price  DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (order_id, line_number),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);
```

### Rule 3: 1:1 Relationships

Add the primary key of one entity as a foreign key in the other. Prefer putting the FK on the side with total participation.

### Rule 4: 1:M Relationships

Add the primary key of the "one" side as a foreign key on the "many" side.

```
DEPARTMENT (1) ---employs--- (M) EMPLOYEE

Result: Add department_id as FK in EMPLOYEE table.
```

### Rule 5: M:N Relationships Become Junction Tables

Create a new **junction table** (also called a bridge table or associative entity) with foreign keys referencing both entities. The composite of these foreign keys forms the primary key.

```sql
-- M:N between STUDENT and COURSE
CREATE TABLE enrollment (
    student_id  INT,
    course_code VARCHAR(10),
    grade       CHAR(2),
    PRIMARY KEY (student_id, course_code),
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (course_code) REFERENCES course(course_code)
);
```

### Rule 6: Multi-Valued Attributes Become Tables

Create a separate table with the entity's PK as a FK plus the multi-valued attribute.

```sql
-- Multi-valued attribute: customer phone numbers
CREATE TABLE customer_phone (
    customer_id INT,
    phone       CHAR(15),
    phone_type  VARCHAR(10),
    PRIMARY KEY (customer_id, phone),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);
```

!!! note "Mapping Summary"
    | ER Concept | Relational Mapping |
    |------------|-------------------|
    | Strong entity | Table |
    | Weak entity | Table with composite PK (owner PK + partial key) |
    | 1:1 relationship | FK on either side (prefer total participation side) |
    | 1:M relationship | FK on the "many" side |
    | M:N relationship | Junction table with two FKs |
    | Multi-valued attribute | Separate table |
    | Composite attribute | Flatten into simple columns |
    | Derived attribute | Omit from schema (compute at query time) |

## 4.6 Data Redundancy and Anomalies

Now that we can build tables, we need to build them *well*. **Data redundancy** -- storing the same fact in multiple places -- is the root cause of most database design problems.

### A Badly Designed Table

Consider this single table for an e-commerce company:

```
ORDER_DETAILS (unnormalized)
+-----------+-------+---------------+-----------+--------------+--------+-----+
| order_id  | cust_id | cust_name   | cust_city | product_name | price  | qty |
+-----------+-------+---------------+-----------+--------------+--------+-----+
| 1001      | C01   | Alice Johnson | Chicago   | Laptop       | 999.99 | 1   |
| 1001      | C01   | Alice Johnson | Chicago   | Mouse        |  24.99 | 2   |
| 1002      | C02   | Bob Smith     | Urbana    | Laptop       | 999.99 | 1   |
| 1003      | C01   | Alice Johnson | Chicago   | Keyboard     |  49.99 | 1   |
+-----------+-------+---------------+-----------+--------------+--------+-----+
```

**Problems with this design:**

1. **Update anomaly:** If Alice moves from Chicago to Champaign, we must update every row where she appears. Miss one and the data is inconsistent.
2. **Insert anomaly:** We cannot add a new customer until they place an order, because `order_id` is required.
3. **Delete anomaly:** If we delete order 1002, we lose all information about Bob Smith entirely.

### Functional Dependencies

A **functional dependency** (FD) exists when the value of one attribute (or set of attributes) determines the value of another.

**Notation:** `A -> B` means "A determines B" or "B is functionally dependent on A."

**Examples from the table above:**

- `order_id, product_name -> qty` (an order and product determine the quantity)
- `cust_id -> cust_name, cust_city` (customer ID determines name and city)
- `product_name -> price` (product name determines price, assuming one price per product)

!!! tip "How to Find Functional Dependencies"
    Ask yourself: "If I know the value of X, can I determine exactly one value of Y?" If yes, then `X -> Y`.

    - Knowing `cust_id` tells you exactly one `cust_name`. So `cust_id -> cust_name`.
    - Knowing `order_id` does NOT tell you exactly one `product_name` (an order can have many products). So `order_id -> product_name` is NOT a valid FD.

## 4.7 Normalization: First Normal Form (1NF)

**Normalization** is the process of organizing tables to reduce redundancy and eliminate anomalies. We apply a series of "normal forms," each building on the previous one.

### 1NF: Atomic Values

A table is in **First Normal Form (1NF)** if:

1. Every column contains only **atomic** (indivisible) values
2. There are no repeating groups or arrays
3. Each row is unique (has a primary key)

**Violation of 1NF:**

```
BAD_ORDER
+----------+--------------------------+
| order_id | products                 |
+----------+--------------------------+
| 1001     | Laptop, Mouse, Keyboard  |  <- NOT atomic!
| 1002     | Laptop                   |
+----------+--------------------------+
```

**Fixed (1NF):**

```
ORDER_LINE
+----------+--------------+-----+
| order_id | product_name | qty |
+----------+--------------+-----+
| 1001     | Laptop       | 1   |
| 1001     | Mouse        | 2   |
| 1001     | Keyboard     | 1   |
| 1002     | Laptop       | 1   |
+----------+--------------+-----+
PK: {order_id, product_name}
```

!!! warning "Common 1NF Mistake"
    Storing comma-separated values in a column (like `"Laptop, Mouse"`) is a very common real-world mistake, especially in Excel-to-database migrations. It makes filtering, joining, and aggregating extremely difficult.

## 4.8 Second Normal Form (2NF)

A table is in **Second Normal Form (2NF)** if:

1. It is in 1NF, AND
2. Every non-key attribute is **fully** dependent on the **entire** primary key (no partial dependencies)

2NF only matters when the primary key is **composite** (multi-column). If the PK is a single column, a 1NF table is automatically in 2NF.

### Identifying Partial Dependencies

Return to our ORDER_DETAILS table. Suppose the primary key is `{order_id, product_name}`:

```
ORDER_DETAILS (1NF, composite PK: {order_id, product_name})
+-----------+---------+---------------+-----------+--------------+--------+-----+
| order_id  | cust_id | cust_name     | cust_city | product_name | price  | qty |
+-----------+---------+---------------+-----------+--------------+--------+-----+
```

**Partial dependencies (non-key attribute depends on only part of the PK):**

- `order_id -> cust_id, cust_name, cust_city` (depends on only `order_id`, not the full PK)
- `product_name -> price` (depends on only `product_name`, not the full PK)

**Full dependency:**

- `{order_id, product_name} -> qty` (depends on the entire PK)

### Fixing Partial Dependencies

Remove partially dependent attributes into their own tables:

```
ORDERS
+-----------+---------+
| order_id  | cust_id |   PK: order_id
+-----------+---------+
| 1001      | C01     |
| 1002      | C02     |
| 1003      | C01     |
+-----------+---------+

PRODUCT
+--------------+--------+
| product_name | price  |   PK: product_name
+--------------+--------+
| Laptop       | 999.99 |
| Mouse        |  24.99 |
| Keyboard     |  49.99 |
+--------------+--------+

ORDER_LINE
+-----------+--------------+-----+
| order_id  | product_name | qty |   PK: {order_id, product_name}
+-----------+--------------+-----+
| 1001      | Laptop       | 1   |
| 1001      | Mouse        | 2   |
| 1002      | Laptop       | 1   |
| 1003      | Keyboard     | 1   |
+-----------+--------------+-----+
```

Now every non-key attribute depends on the **full** primary key of its table. The tables are in 2NF.

## 4.9 Third Normal Form (3NF)

A table is in **Third Normal Form (3NF)** if:

1. It is in 2NF, AND
2. No non-key attribute depends on another non-key attribute (no **transitive dependencies**)

### Identifying Transitive Dependencies

Look at the ORDERS table. We still have customer info mixed in:

```
ORDERS (2NF, but has transitive dependency)
+-----------+---------+---------------+-----------+
| order_id  | cust_id | cust_name     | cust_city |
+-----------+---------+---------------+-----------+
```

The dependency chain is: `order_id -> cust_id -> cust_name, cust_city`

Here `cust_name` and `cust_city` depend on `cust_id`, which is not the primary key. This is a **transitive dependency**.

### Fixing Transitive Dependencies

Move the transitively dependent attributes to their own table:

```
CUSTOMER
+---------+---------------+-----------+
| cust_id | cust_name     | cust_city |   PK: cust_id
+---------+---------------+-----------+
| C01     | Alice Johnson | Chicago   |
| C02     | Bob Smith     | Urbana    |
+---------+---------------+-----------+

ORDERS
+-----------+---------+
| order_id  | cust_id |   PK: order_id, FK: cust_id -> CUSTOMER
+-----------+---------+
| 1001      | C01     |
| 1002      | C02     |
| 1003      | C01     |
+-----------+---------+
```

### The Complete 3NF Design

Here is our fully normalized e-commerce schema:

```
CUSTOMER                   ORDERS                    ORDER_LINE
+---------+----------+     +-----------+---------+   +-----------+---------+-----+
| cust_id | cust_name|     | order_id  | cust_id |   | order_id  | prod_name| qty|
|   (PK)  | cust_city|     |   (PK)    |  (FK)   |   |   (PK)    |  (PK/FK)|    |
+---------+----------+     +-----------+---------+   +-----------+---------+-----+

PRODUCT
+-----------+--------+
| prod_name | price  |
|   (PK)    |        |
+-----------+--------+
```

Each fact is stored exactly once. Update Alice's city in one row. Delete an order without losing customer data. Add a new product without needing an order.

!!! example "Step-by-Step Normalization Summary"
    Starting from the flat ORDER_DETAILS table:

    1. **1NF:** Made all values atomic, established composite PK `{order_id, product_name}`
    2. **2NF:** Removed partial dependencies -- split out PRODUCT (depends on `product_name` only) and ORDERS (depends on `order_id` only), keeping ORDER_LINE for fully dependent attributes
    3. **3NF:** Removed transitive dependency -- split CUSTOMER out of ORDERS because `cust_name` and `cust_city` depend on `cust_id`, not on `order_id`

## 4.10 Boyce-Codd Normal Form (BCNF)

**BCNF** is a stricter version of 3NF. A table is in BCNF if:

- For every functional dependency `X -> Y`, X is a **superkey** (can uniquely identify the entire row)

In most practical cases, 3NF and BCNF are equivalent. They differ only when a table has overlapping composite candidate keys.

!!! example "When BCNF Differs from 3NF"
    Consider a TEACHING table where each course section is taught by one professor, and each professor teaches only one course (but a course can have many professors):

    ```
    TEACHING
    +---------+---------+-----------+
    | student | course  | professor |
    +---------+---------+-----------+
    ```

    Candidate keys: `{student, course}` and `{student, professor}`

    FD: `professor -> course` (each professor teaches one course)

    This is in 3NF but NOT in BCNF because `professor` is not a superkey. The fix is to decompose into two tables.

For this course, achieving **3NF is sufficient** for most business database designs. BCNF is worth knowing for edge cases and interviews.

## 4.11 Denormalization and Trade-offs

### Why Denormalize?

Normalization reduces redundancy but increases the number of tables. Queries that need data from many tables require **JOINs**, which can be slower on large datasets.

**Denormalization** is the intentional introduction of controlled redundancy to improve read performance.

### When to Denormalize

| Scenario | Rationale |
|----------|-----------|
| **Reporting and analytics** | Dashboard queries that JOIN 8 tables are too slow |
| **Read-heavy workloads** | Application reads data 100x more often than it writes |
| **Caching derived values** | Storing `order_total` instead of recomputing `SUM(qty * price)` every time |
| **Data warehousing** | Star schema designs intentionally denormalize for query speed |

### When NOT to Denormalize

| Scenario | Rationale |
|----------|-----------|
| **Transactional systems** | Order entry, banking -- data integrity is paramount |
| **Write-heavy workloads** | Redundant data means more updates to keep in sync |
| **Small datasets** | JOINs on small tables are fast; denormalization adds complexity for no gain |

!!! warning "Denormalize by Choice, Not by Accident"
    Denormalization should be a deliberate design decision with documented rationale. A table that is "not normalized" because nobody thought about it is not "denormalized" -- it is poorly designed. Always normalize first, then selectively denormalize where performance data justifies it.

### Normalization Trade-offs Summary

| Factor | More Normalized | More Denormalized |
|--------|----------------|-------------------|
| **Data redundancy** | Low | Higher |
| **Data integrity** | Easier to maintain | Requires extra logic |
| **Write performance** | Better (fewer updates) | Worse (update multiple copies) |
| **Read performance** | May need many JOINs | Faster (fewer JOINs) |
| **Storage** | Less | More |
| **Schema complexity** | More tables | Fewer tables |
| **Best for** | OLTP (transactions) | OLAP (analytics) |

## Key Takeaways

1. **Data modeling comes before implementation** -- design your ER diagram before writing CREATE TABLE statements
2. **Entities are nouns, relationships are verbs** -- Customer *places* Order, Employee *works in* Department
3. **Cardinality (1:1, 1:M, M:N) determines how tables connect** -- M:N relationships always require a junction table
4. **Normalization eliminates redundancy step by step** -- 1NF (atomic values), 2NF (no partial dependencies), 3NF (no transitive dependencies)
5. **Functional dependencies drive normalization** -- ask "does knowing X uniquely determine Y?"
6. **3NF is the standard target** for transactional business databases
7. **Denormalization is a performance optimization** -- normalize first, denormalize selectively with justification

## Review Questions

1. Explain the difference between Chen notation and Crow's Foot notation for ER diagrams. When would you use each?
2. Given a university system with Students, Courses, and Professors, identify the entities, key attributes, and the cardinality of each relationship.
3. What is a functional dependency? Give two examples from a typical HR database.
4. Walk through the differences between 1NF, 2NF, and 3NF. Why must you achieve each form in order?
5. A data warehouse team wants to store `customer_name` directly in the ORDERS table to speed up reports. Is this denormalization justified? What risks does it introduce?

## Practical Exercise

Starting from this unnormalized INVOICE table, normalize it to 3NF:

```
INVOICE_RAW
+--------+--------+-----------+----------+-----------+---------+-----+-----------+
| inv_id | inv_dt | cust_id   | cust_name| prod_code | prod_nm | qty | unit_price|
+--------+--------+-----------+----------+-----------+---------+-----+-----------+
| I001   | 2026-01| C10       | Acme Corp| SKU-100   | Widget  | 50  | 4.99      |
| I001   | 2026-01| C10       | Acme Corp| SKU-200   | Gadget  | 20  | 12.50     |
| I002   | 2026-02| C20       | Beta LLC | SKU-100   | Widget  | 100 | 4.99      |
| I003   | 2026-02| C10       | Acme Corp| SKU-300   | Gizmo   | 10  | 29.99     |
+--------+--------+-----------+----------+-----------+---------+-----+-----------+
```

1. List all functional dependencies you can identify
2. Is this table in 1NF? Why or why not?
3. Decompose into 2NF tables. Show the resulting tables with sample data.
4. Decompose further into 3NF tables. Show the resulting tables with sample data.
5. Write the `CREATE TABLE` statements (with primary and foreign keys) for your final 3NF design.
6. Identify one scenario where you might denormalize part of this design and explain why.

## Next Steps

In [Chapter 5](05-python-pandas.md), we'll shift from database design to data analysis, learning how Python and pandas connect to databases and enable powerful data manipulation beyond what SQL alone can do.

---

*Corresponds to Week 3 of BADM 554 -- Data Modeling & Normalization*
