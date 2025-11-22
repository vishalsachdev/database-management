# Normal Forms

Normal forms are rules for organizing data to eliminate redundancy and anomalies. Each normal form builds upon the previous one.

## First Normal Form (1NF)

**Rule**: All attributes must contain atomic (indivisible) values.

### Violations

```
students table (violates 1NF):
| student_id | name  | courses              |
|------------|-------|----------------------|
| 1          | Alice | CS101, CS102, MATH201|
| 2          | Bob   | CS101, PHYS101       |
```

**Problem**: `courses` column contains multiple values

### Solution

```sql
-- Method 1: Separate table
students (student_id, name)
| student_id | name  |
|------------|-------|
| 1          | Alice |
| 2          | Bob   |

enrollments (student_id, course_id)
| student_id | course_id |
|------------|-----------|
| 1          | CS101     |
| 1          | CS102     |
| 1          | MATH201   |
| 2          | CS101     |
| 2          | PHYS101   |
```

**Requirements for 1NF**:
1. Each column contains atomic values
2. Each column contains values of the same type
3. Each column has a unique name
4. Order doesn't matter

## Second Normal Form (2NF)

**Rule**: Must be in 1NF AND all non-key attributes must depend on the entire primary key (no partial dependencies).

**Applies to**: Tables with composite primary keys

### Violation

```
enrollments table (violates 2NF):
Primary Key: (student_id, course_id)

| student_id | course_id | student_name | course_name | grade |
|------------|-----------|--------------|-------------|-------|
| 1          | CS101     | Alice        | Intro CS    | A     |
| 1          | CS102     | Alice        | Programming | B     |
| 2          | CS101     | Bob          | Intro CS    | B     |
```

**Problem**:
- `student_name` depends only on `student_id` (partial dependency)
- `course_name` depends only on `course_id` (partial dependency)

### Solution

```sql
students (student_id, student_name)
| student_id | student_name |
|------------|--------------|
| 1          | Alice        |
| 2          | Bob          |

courses (course_id, course_name)
| course_id | course_name  |
|-----------|--------------|
| CS101     | Intro CS     |
| CS102     | Programming  |

enrollments (student_id, course_id, grade)
| student_id | course_id | grade |
|------------|-----------|-------|
| 1          | CS101     | A     |
| 1          | CS102     | B     |
| 2          | CS101     | B     |
```

## Third Normal Form (3NF)

**Rule**: Must be in 2NF AND have no transitive dependencies (non-key attributes must not depend on other non-key attributes).

### Violation

```
employees table (violates 3NF):
Primary Key: emp_id

| emp_id | name  | dept_id | dept_name   | dept_location |
|--------|-------|---------|-------------|---------------|
| 1      | Alice | 10      | Engineering | Building A    |
| 2      | Bob   | 10      | Engineering | Building A    |
| 3      | Carol | 20      | Marketing   | Building B    |
```

**Problem**: Transitive dependency
```
emp_id → dept_id → dept_name, dept_location
```

`dept_name` and `dept_location` depend on `dept_id`, not on `emp_id`.

### Solution

```sql
departments (dept_id, dept_name, dept_location)
| dept_id | dept_name   | dept_location |
|---------|-------------|---------------|
| 10      | Engineering | Building A    |
| 20      | Marketing   | Building B    |

employees (emp_id, name, dept_id)
| emp_id | name  | dept_id |
|--------|-------|---------|
| 1      | Alice | 10      |
| 2      | Bob   | 10      |
| 3      | Carol | 20      |
```

## Boyce-Codd Normal Form (BCNF)

**Rule**: Must be in 3NF AND for every functional dependency A → B, A must be a superkey.

**Stricter than 3NF** - handles special cases

### Violation

```
course_instructors table:
(course_id, instructor_id) is primary key

| course_id | instructor_id | instructor_name |
|-----------|---------------|-----------------|
| CS101     | 1             | Dr. Smith       |
| CS101     | 2             | Dr. Jones       |
| CS102     | 1             | Dr. Smith       |
```

**Functional Dependencies**:
- `(course_id, instructor_id)` → `instructor_name`
- `instructor_id` → `instructor_name` (BCNF violation!)

`instructor_id` → `instructor_name`, but `instructor_id` is not a superkey.

### Solution

```sql
instructors (instructor_id, instructor_name)
| instructor_id | instructor_name |
|---------------|-----------------|
| 1             | Dr. Smith       |
| 2             | Dr. Jones       |

course_instructors (course_id, instructor_id)
| course_id | instructor_id |
|-----------|---------------|
| CS101     | 1             |
| CS101     | 2             |
| CS102     | 1             |
```

## Summary Table

| Normal Form | Requirement | Eliminates |
|-------------|-------------|------------|
| **1NF** | Atomic values | Repeating groups |
| **2NF** | 1NF + No partial dependencies | Partial dependencies on composite keys |
| **3NF** | 2NF + No transitive dependencies | Transitive dependencies |
| **BCNF** | 3NF + Every determinant is a superkey | All anomalies (stricter than 3NF) |

## Quick Test

### Is this table normalized?

```
| order_id | customer_name | customer_email | product_list     | total |
|----------|---------------|----------------|------------------|-------|
| 1        | Alice         | alice@email    | Laptop, Mouse    | 1029  |
```

**Answer**: No!
- **1NF violation**: `product_list` contains multiple values
- **2NF/3NF violations**: Customer data repeated

## Practice Questions

!!! question "Check Your Understanding"
    1. What's the main difference between 2NF and 3NF?
    2. When does BCNF matter beyond 3NF?
    3. Can a table be in 3NF but not BCNF?

??? example "Answers"
    1. 2NF eliminates partial dependencies (on part of composite key), while 3NF eliminates transitive dependencies (non-key depending on non-key)
    2. BCNF matters when you have overlapping candidate keys or when non-key attributes determine part of a candidate key
    3. Yes, rare cases exist where 3NF is satisfied but BCNF is not (when non-superkey attributes determine candidate key attributes)

## Summary

Progress through normal forms:
1. **1NF**: Atomic values
2. **2NF**: No partial dependencies
3. **3NF**: No transitive dependencies
4. **BCNF**: Every determinant is a superkey

Most applications normalize to 3NF or BCNF.

---

**Next**: [Denormalization](denormalization.md)
