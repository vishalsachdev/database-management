# Denormalization

Denormalization strategically introduces redundancy to improve query performance.

## When to Denormalize

### Read-Heavy Applications
When queries are more frequent than updates, denormalization can improve read performance by reducing joins.

### Reporting and Analytics
Data warehouses often denormalize for faster analytical queries.

### Performance Bottlenecks
When joins become too expensive.

## Techniques

### 1. Add Redundant Columns

```sql
-- Normalized: requires join
orders (order_id, customer_id, amount)
customers (customer_id, name)

-- Denormalized: add customer_name to orders
orders (order_id, customer_id, customer_name, amount)
```

### 2. Precompute Aggregates

```sql
-- Add total_orders count to customers
customers (customer_id, name, email, total_orders)

-- Update with trigger
CREATE TRIGGER update_order_count
AFTER INSERT ON orders
FOR EACH ROW
    UPDATE customers SET total_orders = total_orders + 1
    WHERE customer_id = NEW.customer_id;
```

### 3. Combine Tables

```sql
-- Normalized: separate tables
users (user_id, username)
profiles (user_id, bio, avatar)

-- Denormalized: combined
users (user_id, username, bio, avatar)
```

## Tradeoffs

### Benefits
- Faster queries (fewer joins)
- Simpler queries
- Better read performance

### Costs
- Data redundancy
- More complex updates
- Risk of inconsistency
- More storage space

## Best Practices

1. **Normalize first**, denormalize only when needed
2. **Measure performance** before denormalizing
3. **Use triggers or application logic** to maintain consistency
4. **Document** denormalization decisions

## Summary

Denormalization sacrifices storage and update complexity for query performance. Use strategically in read-heavy applications.

---

**Next**: [Schema Design Best Practices](best-practices.md)
