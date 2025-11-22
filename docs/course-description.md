---
title: Database Management - BADM 350
description: A comprehensive course on database management systems, SQL, NoSQL, data modeling, and enterprise data integration
quality_score: 100
---

# Database Management - BADM 350

## Target Audience

College undergraduate students in Business Information Systems, Management Information Systems, Finance, Accounting, Marketing, and related business disciplines at the University of Illinois.

## Prerequisites

- Basic understanding of business operations
- Familiarity with spreadsheet applications (Excel)
- Basic computer literacy
- No prior programming or database experience required

## Main Topics Covered

This course provides comprehensive coverage of:

1. **Database Fundamentals** - Understanding database systems, DBMS architecture, data vs. information, database users and roles
2. **Relational Database Theory** - Tables, keys, constraints, relational algebra operations, set theory foundations
3. **SQL Programming** - DDL, DML, queries, filtering, sorting, aggregation, joins, subqueries, views
4. **Advanced SQL** - Common Table Expressions (CTEs), window functions, recursive queries, complex joins
5. **JSON and APIs** - JSON data types, REST APIs, data integration, API authentication, web services
6. **Database Design** - Entity-Relationship (ER) modeling, cardinality, identifying entities and relationships
7. **Normalization** - First through Boyce-Codd Normal Forms (1NF, 2NF, 3NF, BCNF), denormalization strategies
8. **Data Warehousing** - OLAP vs OLTP, star schema, snowflake schema, fact and dimension tables
9. **ETL Processes** - Extract, Transform, Load workflows, data quality, Knime tool usage
10. **NoSQL Databases** - Document databases, MongoDB, CAP theorem, BASE properties, when to use NoSQL

## Topics Not Covered

To maintain focus on business database applications, this course does not cover:

- Database Administration (DBA) tasks like backup/recovery, performance tuning
- Advanced security topics (encryption, penetration testing)
- Distributed database systems and replication
- Graph databases (Neo4j, Neptune)
- Time-series databases
- Database internals (B-trees, query optimization algorithms)
- Object-oriented databases
- Blockchain databases

## Tools and Technologies

Students will gain hands-on experience with:

- **SQL Databases**: MySQL, PostgreSQL
- **Development Environment**: Jupyter Notebooks, Google Colab with Python
- **Data Modeling**: MySQL Workbench for ER diagrams
- **ETL Tool**: Knime Analytics Platform
- **NoSQL Database**: MongoDB
- **APIs**: REST API clients, JSON processing

## After This Course, Students Will Be Able To...

### Remember Level

- Recall the definition of databases, DBMS, metadata, and information
- List the components of a database system
- Identify different types of database users (end users, application programmers, DBAs)
- Name the ACID properties of transactions
- Recognize different SQL data types (VARCHAR, INT, DATE, JSON)
- State the purpose of primary keys, foreign keys, and constraints
- Remember the normal forms (1NF, 2NF, 3NF, BCNF)
- Identify NoSQL database types (document, key-value, columnar, graph)
- Recall REST API methods (GET, POST, PUT, DELETE)
- List components of a star schema (fact tables, dimension tables)

### Understand Level

- Explain the difference between data and information
- Describe how relational databases organize data into tables
- Interpret Entity-Relationship (ER) diagrams
- Explain the purpose of database normalization
- Differentiate between OLTP and OLAP systems
- Understand the CAP theorem and its implications for distributed databases
- Explain when to use SQL vs. NoSQL databases
- Describe the ETL process and its role in data integration
- Understand JSON data structure and its advantages
- Explain cardinality in database relationships (one-to-one, one-to-many, many-to-many)

### Apply Level

- Write SELECT queries to retrieve data from single tables using WHERE, ORDER BY, and LIMIT
- Apply SQL aggregate functions (COUNT, SUM, AVG, MIN, MAX) with GROUP BY
- Use INNER JOIN, LEFT JOIN, RIGHT JOIN to combine data from multiple tables
- Create tables using SQL DDL statements with appropriate data types and constraints
- Insert, update, and delete data using SQL DML statements
- Query JSON data within SQL databases using JSON functions
- Apply normalization rules to transform tables into 1NF, 2NF, and 3NF
- Use MySQL Workbench to create ER diagrams for business scenarios
- Execute REST API calls to retrieve and send data
- Build ETL workflows using Knime to integrate data from multiple sources

### Analyze Level

- Analyze business requirements to identify entities, attributes, and relationships
- Evaluate table structures to determine if they violate normal forms
- Compare different JOIN strategies to determine the most efficient approach
- Analyze query results to identify data quality issues
- Examine ER diagrams to find design flaws or missing relationships
- Analyze when subqueries vs. JOINs are more appropriate
- Investigate performance differences between normalized and denormalized schemas
- Compare SQL and NoSQL solutions for specific business problems
- Analyze API responses to extract relevant business information
- Examine data warehouse schemas to understand business metrics

### Evaluate Level

- Assess the quality of database designs against normalization principles
- Critique ER diagrams for completeness and accuracy
- Evaluate whether a NoSQL database is more appropriate than a relational database for a given scenario
- Judge the effectiveness of different indexing strategies
- Assess data quality issues in ETL processes
- Evaluate the trade-offs between normalization and denormalization
- Critique API designs for usability and efficiency
- Judge when to use views vs. materialized views
- Evaluate star schema designs for data warehousing projects
- Assess the security implications of database design decisions

### Create Level

- Design complete database schemas for business applications (e.g., e-commerce, HR systems)
- Develop complex SQL queries combining joins, subqueries, CTEs, and window functions
- Create ETL workflows that extract data from APIs, transform it, and load it into databases
- Build ER diagrams from business case studies and requirements
- Design star schemas for business intelligence and reporting
- Create MongoDB document structures for unstructured business data
- Develop Python scripts that interact with databases and APIs
- Design data integration solutions combining SQL and NoSQL databases
- Create data quality validation rules for ETL processes
- **Capstone Project**: Design and implement a complete database solution including:
  - Requirements analysis and ER modeling
  - Normalized relational schema
  - Sample data population
  - Complex analytical queries
  - ETL pipeline for external data sources
  - NoSQL component for flexible data storage
  - REST API integration for data exchange

## Course Context

Databases are the backbone of modern business operations. From customer relationship management to supply chain optimization, from financial analysis to marketing campaigns, virtually every business function relies on effective data management. This course equips students with one of the most marketable skills in today's data-driven economy.

According to industry reports, SQL is consistently ranked as one of the most in-demand technical skills for business analysts, data analysts, and management professionals. The ability to design databases, write complex queries, and integrate data from multiple sources is valuable across all business disciplines.

This course bridges theory and practice, using real-world business scenarios from marketing (customer segmentation), finance (macroeconomic analysis), accounting (fraud detection), and supply chain (vendor performance analysis). Students will work with the same tools and technologies used by Fortune 500 companies.

## Real-World Applications

Students will apply database concepts to:

- **Marketing**: Customer segmentation, campaign analysis, customer lifetime value calculation
- **Finance**: Portfolio analysis, macroeconomic data integration, risk assessment
- **Accounting**: Fraud detection patterns, audit trail analysis, financial reporting
- **Supply Chain**: Vendor performance tracking, inventory optimization, logistics analysis
- **Human Resources**: Employee analytics, compensation analysis, talent management

## Learning Approach

The course follows a progressive learning path:

1. Start with foundational concepts (what is a database?)
2. Build SQL skills from basic to advanced
3. Learn data modeling and design principles
4. Apply normalization theory to real problems
5. Explore modern technologies (JSON, APIs, NoSQL)
6. Integrate everything in enterprise-scale projects

Each chapter includes:
- Detailed explanations with business context
- Hands-on SQL examples students can run
- Practice exercises with increasing difficulty
- Real-world business scenarios
- Review questions to reinforce learning
