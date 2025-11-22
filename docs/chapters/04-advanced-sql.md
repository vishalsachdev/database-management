# Chapter 4: Advanced SQL

## Learning Objectives

After completing this chapter, you will be able to:

- Combine data from multiple tables using JOIN operations
- Write and use subqueries for complex queries
- Group and filter aggregated data using GROUP BY and HAVING
- Use CASE statements for conditional logic
- Apply set operations to combine query results
- Understand and use Common Table Expressions (CTEs)
- Perform basic window functions for advanced analytics

## 4.1 Introduction to JOIN Operations

In real-world databases, data is distributed across multiple tables to reduce redundancy and improve organization. JOIN operations allow us to combine related data from different tables.

### Why Use Multiple Tables?

Consider a poorly designed single table:

```
BAD_DESIGN - All in One Table
+------------+-------------+--------+-------------+---------------+-------------+
| Student_ID | Student_Name| Major  | Course_Code | Course_Title  | Grade       |
+------------+-------------+--------+-------------+---------------+-------------+
| 123456789  | Alice       | MIS    | BADM350     | Database Mgmt | A           |
| 123456789  | Alice       | MIS    | BADM310     | MIS           | A-          |
| 987654321  | Bob         | FIN    | BADM350     | Database Mgmt | B+          |
+------------+-------------+--------+-------------+---------------+-------------+
```

Problems:
- Student information (Name, Major) is repeated for every enrollment
- Course information (Course_Title) is repeated for every enrollment
- Updating a student's major requires changing multiple rows
- More storage space needed

**Better Design:** Split into separate tables and use JOINs to combine them when needed.

## 4.2 INNER JOIN

An **INNER JOIN** returns only the rows that have matching values in both tables.

### Syntax

```sql
SELECT columns
FROM table1
INNER JOIN table2 ON table1.key = table2.key;
```

### Example Database

```sql
-- STUDENT table
+------------+------------------+--------+------+
| Student_ID | Name             | Major  | GPA  |
+------------+------------------+--------+------+
| 123456789  | Alice Johnson    | MIS    | 3.8  |
| 987654321  | Bob Smith        | FIN    | 3.5  |
| 456789123  | Carol Martinez   | ACCY   | 3.9  |
+------------+------------------+--------+------+

-- ENROLLMENT table
+---------------+------------+-------------+-------+
| Enrollment_ID | Student_ID | Course_Code | Grade |
+---------------+------------+-------------+-------+
| E001          | 123456789  | BADM350     | A     |
| E002          | 123456789  | BADM310     | A-    |
| E003          | 987654321  | BADM350     | B+    |
+---------------+------------+-------------+-------+
```

### Basic INNER JOIN

```sql
-- Find students and their enrollments
SELECT
    s.Student_ID,
    s.Name,
    s.Major,
    e.Course_Code,
    e.Grade
FROM student s
INNER JOIN enrollment e ON s.Student_ID = e.Student_ID;
```

**Result:**
```
+------------+------------------+--------+-------------+-------+
| Student_ID | Name             | Major  | Course_Code | Grade |
+------------+------------------+--------+-------------+-------+
| 123456789  | Alice Johnson    | MIS    | BADM350     | A     |
| 123456789  | Alice Johnson    | MIS    | BADM310     | A-    |
| 987654321  | Bob Smith        | FIN    | BADM350     | B+    |
+------------+------------------+--------+-------------+-------+
```

Note: Carol Martinez doesn't appear because she has no enrollments!

### Joining Three Tables

```sql
SELECT
    s.Name,
    c.Course_Title,
    e.Grade
FROM student s
INNER JOIN enrollment e ON s.Student_ID = e.Student_ID
INNER JOIN course c ON e.Course_Code = c.Course_Code;
```

!!! tip "Table Aliases"
    Using aliases (s, e, c) makes queries shorter and more readable:
    - `student s` creates alias 's' for the student table
    - Use `s.Name` instead of `student.Name`

## 4.3 LEFT JOIN (LEFT OUTER JOIN)

A **LEFT JOIN** returns all rows from the left table, and matching rows from the right table. If there's no match, NULL values are returned for the right table's columns.

### Syntax

```sql
SELECT columns
FROM table1
LEFT JOIN table2 ON table1.key = table2.key;
```

### Example

```sql
-- Find all students and their enrollments (including students with no enrollments)
SELECT
    s.Student_ID,
    s.Name,
    e.Course_Code,
    e.Grade
FROM student s
LEFT JOIN enrollment e ON s.Student_ID = e.Student_ID;
```

**Result:**
```
+------------+------------------+-------------+-------+
| Student_ID | Name             | Course_Code | Grade |
+------------+------------------+-------------+-------+
| 123456789  | Alice Johnson    | BADM350     | A     |
| 123456789  | Alice Johnson    | BADM310     | A-    |
| 987654321  | Bob Smith        | BADM350     | B+    |
| 456789123  | Carol Martinez   | NULL        | NULL  |  ← Carol has no enrollments
+------------+------------------+-------------+-------+
```

### Finding Students with No Enrollments

```sql
SELECT
    s.Student_ID,
    s.Name
FROM student s
LEFT JOIN enrollment e ON s.Student_ID = e.Student_ID
WHERE e.Enrollment_ID IS NULL;
```

## 4.4 RIGHT JOIN (RIGHT OUTER JOIN)

A **RIGHT JOIN** returns all rows from the right table, and matching rows from the left table.

```sql
-- Find all enrollments and student info (including orphaned enrollments)
SELECT
    s.Name,
    e.Course_Code,
    e.Grade
FROM student s
RIGHT JOIN enrollment e ON s.Student_ID = e.Student_ID;
```

!!! note "LEFT vs RIGHT JOIN"
    Most developers prefer LEFT JOIN and rearrange their tables rather than using RIGHT JOIN:
    ```sql
    -- These are equivalent:
    FROM student LEFT JOIN enrollment
    FROM enrollment RIGHT JOIN student
    ```

## 4.5 FULL OUTER JOIN

A **FULL OUTER JOIN** returns all rows from both tables, with NULLs where there are no matches.

```sql
-- MySQL doesn't directly support FULL OUTER JOIN, but you can simulate it:
SELECT s.Student_ID, s.Name, e.Course_Code
FROM student s
LEFT JOIN enrollment e ON s.Student_ID = e.Student_ID

UNION

SELECT s.Student_ID, s.Name, e.Course_Code
FROM student s
RIGHT JOIN enrollment e ON s.Student_ID = e.Student_ID;
```

## 4.6 CROSS JOIN

A **CROSS JOIN** returns the Cartesian product - every combination of rows from both tables.

```sql
-- Create all possible combinations of students and courses
SELECT
    s.Name,
    c.Course_Title
FROM student s
CROSS JOIN course c;
```

If there are 3 students and 5 courses, you get 3 × 5 = 15 rows.

**Use Cases:**
- Generating test data
- Creating scheduling matrices
- Analysis requiring all combinations

## 4.7 GROUP BY and Aggregation

**GROUP BY** groups rows with the same values and allows aggregate functions on each group.

### Basic GROUP BY

```sql
-- Count enrollments per student
SELECT
    Student_ID,
    COUNT(*) AS enrollment_count
FROM enrollment
GROUP BY Student_ID;
```

### GROUP BY with JOIN

```sql
-- Count enrollments per student with student names
SELECT
    s.Name,
    s.Major,
    COUNT(e.Enrollment_ID) AS course_count
FROM student s
LEFT JOIN enrollment e ON s.Student_ID = e.Student_ID
GROUP BY s.Student_ID, s.Name, s.Major;
```

!!! warning "GROUP BY Rules"
    **Every column in SELECT must be either:**
    1. In the GROUP BY clause, OR
    2. Inside an aggregate function (COUNT, SUM, AVG, etc.)

    ```sql
    -- WRONG:
    SELECT Name, Major, COUNT(*)
    FROM student
    GROUP BY Major;  -- Name is not in GROUP BY!

    -- CORRECT:
    SELECT Major, COUNT(*) AS student_count
    FROM student
    GROUP BY Major;
    ```

### Multiple Aggregates

```sql
-- Comprehensive student statistics
SELECT
    s.Major,
    COUNT(DISTINCT s.Student_ID) AS student_count,
    COUNT(e.Enrollment_ID) AS total_enrollments,
    AVG(s.GPA) AS average_gpa
FROM student s
LEFT JOIN enrollment e ON s.Student_ID = e.Student_ID
GROUP BY s.Major;
```

## 4.8 HAVING Clause

**HAVING** filters groups after aggregation (WHERE filters rows before aggregation).

### HAVING vs WHERE

```sql
-- WHERE filters rows before grouping
SELECT Major, COUNT(*) AS student_count
FROM student
WHERE GPA > 3.5  -- Filter individual students
GROUP BY Major;

-- HAVING filters groups after grouping
SELECT Major, COUNT(*) AS student_count
FROM student
GROUP BY Major
HAVING COUNT(*) > 10;  -- Filter groups (majors with > 10 students)
```

### Practical Examples

```sql
-- Find majors with average GPA above 3.5
SELECT
    Major,
    COUNT(*) AS student_count,
    AVG(GPA) AS avg_gpa
FROM student
GROUP BY Major
HAVING AVG(GPA) > 3.5;

-- Find students enrolled in more than 2 courses
SELECT
    s.Student_ID,
    s.Name,
    COUNT(e.Enrollment_ID) AS course_count
FROM student s
JOIN enrollment e ON s.Student_ID = e.Student_ID
GROUP BY s.Student_ID, s.Name
HAVING COUNT(e.Enrollment_ID) > 2;
```

## 4.9 Subqueries

A **subquery** is a query nested inside another query.

### Subquery in WHERE Clause

```sql
-- Find students with GPA above average
SELECT Student_ID, Name, GPA
FROM student
WHERE GPA > (
    SELECT AVG(GPA)
    FROM student
);
```

### Subquery with IN

```sql
-- Find students enrolled in BADM350
SELECT Student_ID, Name
FROM student
WHERE Student_ID IN (
    SELECT Student_ID
    FROM enrollment
    WHERE Course_Code = 'BADM350'
);
```

### Subquery in FROM Clause (Derived Table)

```sql
-- Find majors with average GPA, then filter high-performing majors
SELECT Major, avg_gpa
FROM (
    SELECT Major, AVG(GPA) AS avg_gpa
    FROM student
    GROUP BY Major
) AS major_stats
WHERE avg_gpa > 3.5;
```

### Correlated Subquery

A **correlated subquery** references columns from the outer query.

```sql
-- Find students whose GPA is above their major's average
SELECT s1.Student_ID, s1.Name, s1.Major, s1.GPA
FROM student s1
WHERE s1.GPA > (
    SELECT AVG(s2.GPA)
    FROM student s2
    WHERE s2.Major = s1.Major  -- Correlated: references outer query
);
```

!!! tip "Subquery vs JOIN"
    Often, you can write the same query using either subqueries or JOINs:
    ```sql
    -- Using subquery:
    SELECT Name FROM student
    WHERE Student_ID IN (SELECT Student_ID FROM enrollment);

    -- Using JOIN:
    SELECT DISTINCT s.Name
    FROM student s
    JOIN enrollment e ON s.Student_ID = e.Student_ID;
    ```
    JOINs are often faster and more readable for simple cases.

## 4.10 Common Table Expressions (CTEs)

**CTEs** create temporary named result sets that can be referenced within a query.

### Basic CTE Syntax

```sql
WITH cte_name AS (
    SELECT ...
)
SELECT ...
FROM cte_name;
```

### Example: Single CTE

```sql
-- Using CTE to find high-performing students
WITH high_performers AS (
    SELECT Student_ID, Name, GPA
    FROM student
    WHERE GPA > 3.7
)
SELECT
    hp.Name,
    e.Course_Code,
    e.Grade
FROM high_performers hp
JOIN enrollment e ON hp.Student_ID = e.Student_ID;
```

### Multiple CTEs

```sql
WITH
    high_gpa_students AS (
        SELECT Student_ID, Name, GPA
        FROM student
        WHERE GPA > 3.7
    ),
    stem_courses AS (
        SELECT Course_Code, Course_Title
        FROM course
        WHERE Course_Code LIKE 'CS%' OR Course_Code LIKE 'MATH%'
    )
SELECT
    s.Name,
    c.Course_Title,
    e.Grade
FROM high_gpa_students s
JOIN enrollment e ON s.Student_ID = e.Student_ID
JOIN stem_courses c ON e.Course_Code = c.Course_Code;
```

!!! tip "CTEs vs Subqueries"
    **Advantages of CTEs:**
    - More readable and maintainable
    - Can be referenced multiple times
    - Can be recursive (advanced feature)

    **When to use each:**
    - Simple, one-time use: Subquery
    - Complex, reused, or step-by-step logic: CTE

## 4.11 CASE Statements

**CASE** statements provide conditional logic in SQL.

### Simple CASE Syntax

```sql
SELECT
    Student_ID,
    Name,
    GPA,
    CASE
        WHEN GPA >= 3.7 THEN 'High Honors'
        WHEN GPA >= 3.3 THEN 'Honors'
        WHEN GPA >= 3.0 THEN 'Good Standing'
        ELSE 'Standard'
    END AS academic_standing
FROM student;
```

### CASE in Aggregation

```sql
-- Count students by academic standing
SELECT
    CASE
        WHEN GPA >= 3.7 THEN 'High Honors'
        WHEN GPA >= 3.3 THEN 'Honors'
        WHEN GPA >= 3.0 THEN 'Good Standing'
        ELSE 'Standard'
    END AS standing,
    COUNT(*) AS student_count
FROM student
GROUP BY
    CASE
        WHEN GPA >= 3.7 THEN 'High Honors'
        WHEN GPA >= 3.3 THEN 'Honors'
        WHEN GPA >= 3.0 THEN 'Good Standing'
        ELSE 'Standard'
    END;
```

### CASE for Pivot-Like Results

```sql
-- Count enrollments by grade category
SELECT
    Course_Code,
    COUNT(*) AS total_enrollments,
    SUM(CASE WHEN Grade IN ('A', 'A-') THEN 1 ELSE 0 END) AS a_grades,
    SUM(CASE WHEN Grade IN ('B+', 'B', 'B-') THEN 1 ELSE 0 END) AS b_grades,
    SUM(CASE WHEN Grade IN ('C+', 'C', 'C-') THEN 1 ELSE 0 END) AS c_grades
FROM enrollment
GROUP BY Course_Code;
```

## 4.12 Set Operations

Set operations combine results from multiple SELECT statements.

### UNION - Combine and Remove Duplicates

```sql
-- Students from two different semesters
SELECT Student_ID, Name FROM spring_2024_students
UNION
SELECT Student_ID, Name FROM fall_2024_students;
```

### UNION ALL - Combine and Keep Duplicates

```sql
-- All enrollments from two semesters (duplicates allowed)
SELECT Student_ID, Course_Code FROM spring_enrollments
UNION ALL
SELECT Student_ID, Course_Code FROM fall_enrollments;
```

### INTERSECT - Common Rows

```sql
-- Students enrolled in both semesters
SELECT Student_ID FROM spring_2024_students
INTERSECT
SELECT Student_ID FROM fall_2024_students;
```

!!! note "MySQL and INTERSECT"
    MySQL doesn't support INTERSECT directly. You can achieve the same result with:
    ```sql
    SELECT DISTINCT s.Student_ID
    FROM spring_2024_students s
    INNER JOIN fall_2024_students f ON s.Student_ID = f.Student_ID;
    ```

### EXCEPT (or MINUS) - Difference

```sql
-- Students in spring but not fall
SELECT Student_ID FROM spring_2024_students
EXCEPT
SELECT Student_ID FROM fall_2024_students;
```

## 4.13 Window Functions (Introduction)

**Window functions** perform calculations across rows related to the current row.

### Basic Window Function Syntax

```sql
function_name() OVER (
    [PARTITION BY column]
    [ORDER BY column]
)
```

### ROW_NUMBER()

```sql
-- Rank students by GPA within each major
SELECT
    Student_ID,
    Name,
    Major,
    GPA,
    ROW_NUMBER() OVER (PARTITION BY Major ORDER BY GPA DESC) AS rank_in_major
FROM student;
```

### RANK() and DENSE_RANK()

```sql
-- Rank with gap for ties (RANK) vs no gap (DENSE_RANK)
SELECT
    Name,
    GPA,
    RANK() OVER (ORDER BY GPA DESC) AS rank_with_gaps,
    DENSE_RANK() OVER (ORDER BY GPA DESC) AS rank_no_gaps
FROM student;
```

### Running Totals with SUM()

```sql
-- Running total of sales by date
SELECT
    sale_date,
    amount,
    SUM(amount) OVER (ORDER BY sale_date) AS running_total
FROM sales;
```

### Moving Averages

```sql
-- 3-day moving average of sales
SELECT
    sale_date,
    amount,
    AVG(amount) OVER (
        ORDER BY sale_date
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS moving_avg_3day
FROM sales;
```

## 4.14 Business Application Examples

### Marketing: Customer Segmentation

```sql
-- Find high-value customers who haven't purchased recently
WITH customer_stats AS (
    SELECT
        c.customer_id,
        c.name,
        COUNT(o.order_id) AS total_orders,
        SUM(o.amount) AS total_spent,
        MAX(o.order_date) AS last_order_date,
        DATEDIFF(CURRENT_DATE, MAX(o.order_date)) AS days_since_last_order
    FROM customer c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
    GROUP BY c.customer_id, c.name
)
SELECT
    customer_id,
    name,
    total_orders,
    total_spent,
    days_since_last_order,
    CASE
        WHEN total_spent > 5000 AND days_since_last_order > 90 THEN 'High Value - At Risk'
        WHEN total_spent > 5000 THEN 'High Value - Active'
        WHEN days_since_last_order > 180 THEN 'Inactive'
        ELSE 'Standard'
    END AS customer_segment
FROM customer_stats
WHERE total_spent > 5000 AND days_since_last_order > 90
ORDER BY total_spent DESC;
```

### Finance: Revenue Analysis

```sql
-- Monthly revenue with year-over-year comparison
SELECT
    DATE_FORMAT(order_date, '%Y-%m') AS month,
    SUM(amount) AS monthly_revenue,
    LAG(SUM(amount), 12) OVER (ORDER BY DATE_FORMAT(order_date, '%Y-%m')) AS revenue_last_year,
    ROUND(
        (SUM(amount) - LAG(SUM(amount), 12) OVER (ORDER BY DATE_FORMAT(order_date, '%Y-%m')))
        / LAG(SUM(amount), 12) OVER (ORDER BY DATE_FORMAT(order_date, '%Y-%m')) * 100,
        2
    ) AS yoy_growth_pct
FROM orders
GROUP BY DATE_FORMAT(order_date, '%Y-%m')
ORDER BY month;
```

### HR: Department Analytics

```sql
-- Employee distribution and salary stats by department
WITH dept_stats AS (
    SELECT
        d.department_name,
        COUNT(e.employee_id) AS employee_count,
        AVG(e.salary) AS avg_salary,
        MIN(e.salary) AS min_salary,
        MAX(e.salary) AS max_salary,
        SUM(e.salary) AS total_payroll
    FROM department d
    LEFT JOIN employee e ON d.department_id = e.department_id
    GROUP BY d.department_id, d.department_name
)
SELECT
    department_name,
    employee_count,
    ROUND(avg_salary, 2) AS avg_salary,
    total_payroll,
    ROUND(total_payroll / SUM(total_payroll) OVER () * 100, 2) AS pct_of_total_payroll
FROM dept_stats
ORDER BY total_payroll DESC;
```

## Key Takeaways

1. **JOINs combine data from multiple tables** - INNER JOIN for matches only, LEFT JOIN to include all from left table
2. **GROUP BY aggregates data** - Combine with COUNT, SUM, AVG, MIN, MAX
3. **HAVING filters aggregated results** - Use WHERE for row-level filtering, HAVING for group-level filtering
4. **Subqueries nest queries** - Useful for complex filtering and multi-step logic
5. **CTEs improve readability** - Break complex queries into logical steps
6. **CASE adds conditional logic** - Essential for categorization and business rules
7. **Window functions enable advanced analytics** - Rankings, running totals, moving averages

## Review Questions

1. What's the difference between INNER JOIN and LEFT JOIN?
2. When would you use HAVING instead of WHERE?
3. Write a query to find departments with more than 5 employees.
4. What's the advantage of using a CTE over a subquery?
5. How do you find the top 3 students by GPA in each major?

## Practical Exercise

Given these tables:

```
CUSTOMER (customer_id, name, city, state, registration_date)
ORDERS (order_id, customer_id, order_date, total_amount)
PRODUCT (product_id, product_name, category, price)
ORDER_ITEM (order_id, product_id, quantity)
```

Write SQL queries for:

1. **Join Practice:**
   - List all customers and their order count (include customers with no orders)
   - Find customers who have never placed an order

2. **Aggregation:**
   - Calculate total revenue by state
   - Find the top 5 customers by total spending

3. **Subqueries:**
   - Find products that have never been ordered
   - Find customers who spent more than the average customer

4. **Window Functions:**
   - Rank customers by total spending within each state
   - Calculate each customer's contribution to total revenue (as a percentage)

5. **Complex Query:**
   - Find customers who ordered in Q1 2024 but not in Q2 2024

## Next Steps

In [Chapter 5](05-json-apis.md), we'll explore working with JSON data and APIs - essential skills for modern database applications that integrate with web services and NoSQL databases.

---

*Corresponds to Week 4 of BADM 350 - Chapter 8 of the textbook*
