# SQL Injection Prevention

Defending against SQL injection attacks.

## The Problem

```python
# Vulnerable code
query = f"SELECT * FROM users WHERE username = '{username}'"
```

## Solution: Prepared Statements

```python
# Safe code
query = "SELECT * FROM users WHERE username = ?"
cursor.execute(query, (username,))
```

## Best Practices

- Use parameterized queries
- Validate input
- Escape special characters
- Use ORM frameworks

---

**Next**: [Auditing and Compliance](auditing.md)
