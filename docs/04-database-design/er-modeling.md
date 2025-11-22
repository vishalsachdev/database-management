# Entity-Relationship Modeling

ER modeling visually represents data and relationships in a database.

## Components

### Entities
Things with independent existence (represented as rectangles)

Examples: Customer, Product, Order

### Attributes
Properties of entities (represented as ovals)

Examples: name, email, price

### Relationships
Connections between entities (represented as diamonds)

Examples: Customer PLACES Order

## Cardinality

- **One-to-Many (1:M)**: One customer has many orders
- **Many-to-Many (M:N)**: Many students enroll in many courses
- **One-to-One (1:1)**: One employee has one office

## Example ER Diagram

```
[Customer] ----PLACES---- [Order] ----CONTAINS---- [OrderItem] ----IS---- [Product]
   1:M                       1:M                        M:1
```

## Converting ER to Tables

- Each entity becomes a table
- M:N relationships need junction tables
- 1:M relationships use foreign keys

---

**Next**: [Normalization](normalization.md)
