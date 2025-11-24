# Concept Taxonomy

This document describes the 13 taxonomic categories used to organize the 231 concepts in the BADM 554 Database Management learning graph.

## Taxonomy Categories

### FOUND - Foundation Concepts
**Description**: Fundamental prerequisite concepts that form the foundation for all database learning. These concepts have minimal or no dependencies and represent the starting point for students.

**Examples**: Data, Information, Database, File Management, Spreadsheets

**Concept Count**: 5

---

### BASIC - Basic Concepts
**Description**: Fundamental database concepts including system components, users, roles, and introductory data models. These build directly on foundation concepts.

**Examples**: Database Management System, Database Users, Database Administrator, Data Models, Hierarchical Model

**Concept Count**: 12

---

### RELAT - Relational Model
**Description**: Core concepts of the relational database model including tables, relationships, keys, and relational algebra operations.

**Examples**: Tables, Rows, Columns, Primary Key, Foreign Key, One-to-Many Relationship, Relational Algebra

**Concept Count**: 21

---

### SQL - SQL Fundamentals
**Description**: Basic SQL language concepts including DDL, DML, SELECT statements, filtering, sorting, aggregate functions, and basic joins.

**Examples**: SELECT Statement, WHERE Clause, ORDER BY, COUNT Function, GROUP BY, INNER JOIN

**Concept Count**: 31

---

### ASQL - Advanced SQL
**Description**: Advanced SQL techniques including complex joins, subqueries, CTEs, window functions, CASE statements, and string/date manipulation.

**Examples**: Subqueries, Common Table Expression, Window Functions, RANK Function, CASE Statement, Pattern Matching

**Concept Count**: 42

---

### JSON - JSON & APIs
**Description**: Working with JSON data structures, JSON functions in SQL, and integrating data from RESTful APIs.

**Examples**: JSON Structure, JSON Objects, JSON Arrays, JSON Functions in SQL, RESTful API, API Authentication

**Concept Count**: 19

---

### DESIGN - Database Design
**Description**: Entity-Relationship modeling, ER diagrams, cardinality, participation constraints, and mapping ER models to relational schemas.

**Examples**: Entity-Relationship Model, ER Diagrams, Entities, Cardinality, Weak Entity, Enhanced ER Model

**Concept Count**: 14

---

### NORM - Normalization
**Description**: Data normalization theory including functional dependencies, normal forms (1NF through BCNF), anomalies, and denormalization trade-offs.

**Examples**: Data Redundancy, Update Anomaly, Functional Dependency, First Normal Form, Third Normal Form, BCNF

**Concept Count**: 14

---

### DW - Data Warehousing
**Description**: Data warehouse architecture, dimensional modeling (star/snowflake schemas), OLTP vs OLAP, and ETL processes.

**Examples**: OLTP, OLAP, Data Warehouse, Star Schema, Fact Table, Dimension Table, ETL Process

**Concept Count**: 15

---

### NOSQL - NoSQL Databases
**Description**: NoSQL database concepts including CAP theorem, document databases, key-value stores, MongoDB operations, and SQL vs NoSQL comparison.

**Examples**: NoSQL Motivation, CAP Theorem, Document Database, MongoDB, MongoDB CRUD, NoSQL vs SQL

**Concept Count**: 19

---

### TOOLS - Tools & Environment
**Description**: Database tools and development environments including MySQL, PostgreSQL, MySQL Workbench, Jupyter Notebooks, Knime, and MongoDB Compass.

**Examples**: MySQL Installation, MySQL Workbench, PostgreSQL Setup, Jupyter Notebooks, Google Colab, Knime

**Concept Count**: 9

---

### PYTHON - Python Integration
**Description**: Using Python to interact with databases including connectivity libraries, executing SQL, parameterized queries, transactions, error handling, and Pandas integration.

**Examples**: Python Database Connectivity, PyMySQL Library, Executing SQL from Python, Parameterized Queries, Transaction Management, Pandas DataFrame

**Concept Count**: 21

---

### BIZ - Business Applications
**Description**: Real-world business applications of database skills including marketing analytics, supply chain management, financial analysis, fraud detection, and BI dashboards.

**Examples**: Customer Segmentation, Marketing Analytics, RFM Analysis, Vendor Analysis, Financial Analysis, BI Dashboards

**Concept Count**: 11

---

## Taxonomy Distribution Summary

| TaxonomyID | Category Name | Concept Count | Percentage |
|------------|---------------|---------------|------------|
| FOUND | Foundation Concepts | 5 | 2.2% |
| BASIC | Basic Concepts | 12 | 5.2% |
| RELAT | Relational Model | 21 | 9.1% |
| SQL | SQL Fundamentals | 31 | 13.4% |
| ASQL | Advanced SQL | 42 | 18.2% |
| JSON | JSON & APIs | 19 | 8.2% |
| DESIGN | Database Design | 14 | 6.1% |
| NORM | Normalization | 14 | 6.1% |
| DW | Data Warehousing | 15 | 6.5% |
| NOSQL | NoSQL Databases | 19 | 8.2% |
| TOOLS | Tools & Environment | 9 | 3.9% |
| PYTHON | Python Integration | 21 | 9.1% |
| BIZ | Business Applications | 11 | 4.8% |
| **TOTAL** | | **231** | **100%** |

## Design Rationale

The taxonomy was designed to:

1. **Align with course structure**: Categories map to the 12 main topic areas in the course description
2. **Support learning progression**: Foundation concepts lead to basic concepts, then to specialized areas
3. **Balance distribution**: No single category exceeds 20% of total concepts
4. **Enable filtering**: Students can focus on specific areas (e.g., SQL, NoSQL, Python)
5. **Highlight business value**: Separate BIZ category emphasizes practical applications

## Usage in Learning Graph

Each concept in the learning graph is assigned exactly one taxonomy category via the `TaxonomyID` field. The taxonomy:

- Provides visual color-coding in graph visualizations
- Enables filtering and search functionality
- Helps identify prerequisite vs. advanced concepts
- Organizes content generation and chapter structure
- Supports personalized learning path recommendations
