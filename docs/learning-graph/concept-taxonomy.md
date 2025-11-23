# Database Management - Concept Taxonomy

16 categorical groupings for organizing the 231 concepts in the Database Management learning graph.

## Taxonomy Categories

### 1. Database Foundations
**TaxonomyID**: `DBFND`

**Description**: Core concepts about databases, data, information, DBMS components, and database users/roles.

**Typical Concepts**: Data, Information, Database, Metadata, DBMS, Database Administrator, End User, Application Programmer, Schema, Instance

---

### 2. Relational Model
**TaxonomyID**: `RELMD`

**Description**: Relational database theory including the relational model, relational algebra operations, and set theory foundations.

**Typical Concepts**: Relational Model, Relation, Tuple, Domain, Relational Algebra, Selection, Projection, Union, Intersection, Difference, Cartesian Product

---

### 3. Table Structure
**TaxonomyID**: `TBLST`

**Description**: Physical and logical structure of database tables including rows, columns, records, fields, attributes, and entities.

**Typical Concepts**: Table, Row, Column, Record, Field, Attribute, Entity, Cardinality, Degree

---

### 4. Keys and Constraints
**TaxonomyID**: `KEYCT`

**Description**: Database integrity mechanisms including primary keys, foreign keys, candidate keys, and various constraint types.

**Typical Concepts**: Primary Key, Foreign Key, Composite Key, Candidate Key, Unique Constraint, Not Null Constraint, Check Constraint, Referential Integrity

---

### 5. SQL Fundamentals
**TaxonomyID**: `SQLFN`

**Description**: Basic SQL language components including statement types (DDL, DML, DCL, TCL), data types, and fundamental statements.

**Typical Concepts**: SQL, DDL, DML, DCL, TCL, CREATE TABLE, ALTER TABLE, DROP TABLE, INSERT, UPDATE, DELETE, VARCHAR, INT, DATE, DATETIME, BOOLEAN

---

### 6. SQL Functions
**TaxonomyID**: `SQLFN2`

**Description**: SQL built-in functions for data manipulation including string functions, date/time functions, NULL handling, conditional logic, and type conversion.

**Typical Concepts**: CASE Statement, COALESCE, NULLIF, CONCAT, SUBSTRING, TRIM, UPPER, LOWER, NOW, DATE_ADD, DATEDIFF, EXTRACT, CAST, CONVERT

---

### 7. SQL Queries
**TaxonomyID**: `SQLQY`

**Description**: SQL SELECT statements and query components including filtering, sorting, limiting, and aliasing.

**Typical Concepts**: SELECT Statement, WHERE Clause, ORDER BY, LIMIT, DISTINCT, AS Keyword, Alias

---

### 8. SQL Aggregation
**TaxonomyID**: `SQLAG`

**Description**: Aggregate functions and grouping mechanisms for summarizing data.

**Typical Concepts**: Aggregate Function, COUNT, SUM, AVG, MIN, MAX, GROUP BY, HAVING

---

### 9. SQL Joins
**TaxonomyID**: `SQLJN`

**Description**: Various types of JOIN operations for combining data from multiple tables.

**Typical Concepts**: Join Operation, INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN, CROSS JOIN, Self Join, Natural Join, Equijoin, Non-Equijoin

---

### 10. Advanced SQL
**TaxonomyID**: `SQLAD`

**Description**: Advanced SQL features including subqueries, CTEs, window functions, views, indexes, and set operations.

**Typical Concepts**: Subquery, Correlated Subquery, CTE, Recursive CTE, Window Function, ROW_NUMBER, RANK, PARTITION BY, View, Materialized View, Index, UNION, INTERSECT

---

### 11. JSON and APIs
**TaxonomyID**: `JSNAP`

**Description**: JSON data structures, JSON functions in SQL, and REST API concepts for data integration.

**Typical Concepts**: JSON, JSON Data Type, JSON Object, JSON Array, JSON_EXTRACT, REST API, HTTP Method, GET, POST, PUT, DELETE, API Endpoint, Authentication

---

### 12. Data Modeling
**TaxonomyID**: `DMDEL`

**Description**: Entity-Relationship modeling including ER diagrams, notations, entity types, relationships, and cardinality patterns.

**Typical Concepts**: Entity Relationship Diagram, ER Diagram, Chen Notation, Crow's Foot Notation, Entity Type, Weak Entity, Strong Entity, Relationship, One-to-One, One-to-Many, Many-to-Many, Associative Entity, Bridge Table

---

### 13. Normalization
**TaxonomyID**: `NORML`

**Description**: Database normalization theory including functional dependencies, normal forms, decomposition, and anomalies.

**Typical Concepts**: Functional Dependency, Partial Dependency, Transitive Dependency, First Normal Form (1NF), Second Normal Form (2NF), Third Normal Form (3NF), BCNF, Normalization, Denormalization, Decomposition, Update Anomaly, Insertion Anomaly

---

### 14. Data Warehousing
**TaxonomyID**: `DWHOU`

**Description**: Data warehousing concepts including OLAP, OLTP, dimensional modeling, star schema, and slowly changing dimensions.

**Typical Concepts**: Data Warehouse, OLTP, OLAP, Star Schema, Snowflake Schema, Fact Table, Dimension Table, Measure, Grain, Slowly Changing Dimension, SCD Types

---

### 15. ETL and Data Integration
**TaxonomyID**: `ETLDI`

**Description**: Extract, Transform, Load processes, data quality, data cleansing, and ETL tools.

**Typical Concepts**: ETL, Extract Transform Load, Data Quality, Data Cleansing, Knime

---

### 16. NoSQL Databases
**TaxonomyID**: `NOSQL`

**Description**: Non-relational database concepts including document databases, MongoDB, CAP theorem, and BASE properties.

**Typical Concepts**: NoSQL, Document Database, MongoDB, Collection, Document, BSON, CAP Theorem, BASE Properties

---

## Taxonomy Summary

| ID | Category Name | Concept Count |
|----|---------------|---------------|
| DBFND | Database Foundations | 11 |
| RELMD | Relational Model | 13 |
| TBLST | Table Structure | 8 |
| KEYCT | Keys and Constraints | 9 |
| SQLFN | SQL Fundamentals | 21 |
| SQLFN2 | SQL Functions | 29 |
| SQLQY | SQL Queries | 7 |
| SQLAG | SQL Aggregation | 8 |
| SQLJN | SQL Joins | 10 |
| SQLAD | Advanced SQL | 29 |
| JSNAP | JSON and APIs | 21 |
| DMDEL | Data Modeling | 17 |
| NORML | Normalization | 20 |
| DWHOU | Data Warehousing | 15 |
| ETLDI | ETL and Data Integration | 5 |
| NOSQL | NoSQL Databases | 8 |
| **Total** | | **231** |

**Note**: This taxonomy has 16 categories to ensure balanced distribution. The new SQL Functions category contains 29 commonly-used functions for data manipulation. No category exceeds 30 concepts (13% of 231), providing a well-organized learning structure.
