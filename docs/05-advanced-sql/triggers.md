# Triggers

Triggers automatically execute SQL code in response to database events.

## Creating Triggers

```sql
CREATE TRIGGER update_product_count
AFTER INSERT ON products
FOR EACH ROW
    UPDATE categories
    SET product_count = product_count + 1
    WHERE category_id = NEW.category_id;
```

## Trigger Types

- **BEFORE**: Execute before operation
- **AFTER**: Execute after operation

## Events

- INSERT
- UPDATE
- DELETE

## Use Cases

- Audit logging
- Maintain denormalized data
- Enforce complex business rules
- Automatic timestamp updates

---

**Next**: [Common Table Expressions](cte.md)
