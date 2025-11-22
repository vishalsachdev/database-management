# Glossary

## A

**ACID** - Atomicity, Consistency, Isolation, Durability - Four properties that guarantee reliable transaction processing.

**Aggregate Function** - SQL function that performs calculation on multiple rows (SUM, COUNT, AVG, MIN, MAX).

**Atomicity** - Transaction property ensuring all operations complete or none do (all-or-nothing).

**Attribute** - Column in a relational table.

## B

**BCNF** - Boyce-Codd Normal Form - Stricter version of 3NF.

**B-Tree** - Balanced tree data structure commonly used for database indexes.

## C

**CAP Theorem** - States that distributed systems can only guarantee two of three: Consistency, Availability, Partition tolerance.

**Candidate Key** - Minimal set of attributes that uniquely identifies a tuple.

**Cardinality** - Number of rows in a table or relationship type (1:1, 1:M, M:N).

**Column** - Vertical component of a table representing an attribute.

**Composite Key** - Primary key consisting of multiple columns.

**Concurrency Control** - Managing simultaneous database access by multiple users.

**Constraint** - Rule that restricts data values (PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, NOT NULL).

**CTE (Common Table Expression)** - Temporary named result set in a query.

## D

**Database** - Organized collection of structured data.

**DBMS** - Database Management System - Software for creating and managing databases.

**DDL** - Data Definition Language - SQL commands for defining schema (CREATE, ALTER, DROP).

**Deadlock** - Situation where two transactions wait indefinitely for each other's locks.

**Denormalization** - Intentionally introducing redundancy to improve performance.

**DML** - Data Manipulation Language - SQL commands for data operations (SELECT, INSERT, UPDATE, DELETE).

**Document Store** - NoSQL database storing JSON-like documents (e.g., MongoDB).

## E

**Entity** - Distinguishable object or concept in a database.

**Entity Integrity** - Rule that primary key cannot be NULL.

**ER Diagram** - Entity-Relationship Diagram - Visual representation of database structure.

## F

**Foreign Key** - Column(s) referencing primary key of another table.

**Functional Dependency** - Relationship where one attribute determines another (A → B).

## G

**Graph Database** - Database storing nodes and relationships (e.g., Neo4j).

## I

**Index** - Data structure improving query performance.

**Isolation** - Transaction property preventing interference between concurrent transactions.

**Isolation Level** - Degree of isolation between transactions (READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE).

## J

**Join** - Operation combining rows from multiple tables based on related columns.

**Junction Table** - Table implementing many-to-many relationship.

## K

**Key-Value Store** - NoSQL database using simple key-value pairs (e.g., Redis).

## L

**Lock** - Mechanism preventing concurrent access conflicts.

## M

**Materialized View** - Precomputed view stored physically.

**MVCC** - Multi-Version Concurrency Control - Concurrency technique using multiple data versions.

## N

**Natural Key** - Primary key with business meaning (e.g., SSN, ISBN).

**Normalization** - Process of organizing data to reduce redundancy.

**NoSQL** - "Not Only SQL" - Non-relational databases.

**NULL** - Absence of a value (unknown or not applicable).

## O

**OLAP** - Online Analytical Processing - Systems for complex analytical queries.

**OLTP** - Online Transaction Processing - Systems for transactional operations.

## P

**Partition** - Dividing large table into smaller pieces.

**Primary Key** - Column(s) uniquely identifying each row.

**Projection** - Selecting specific columns in a query.

## Q

**Query** - Request for data from database.

**Query Optimization** - Process of finding efficient query execution plan.

## R

**RDBMS** - Relational Database Management System.

**Referential Integrity** - Ensures foreign keys reference existing primary keys.

**Relation** - Formal term for table.

**Relationship** - Association between entities.

**Rollback** - Undoing transaction changes.

**Row** - Horizontal component of a table representing a tuple/record.

## S

**Schema** - Structure and organization of database.

**Selection** - Filtering rows based on condition.

**Shard** - Horizontal partition of data across multiple servers.

**SQL** - Structured Query Language - Standard language for relational databases.

**Stored Procedure** - Precompiled SQL code stored in database.

**Subquery** - Query nested within another query.

**Surrogate Key** - Artificial primary key with no business meaning.

## T

**Table** - Collection of related data organized in rows and columns.

**Transaction** - Sequence of database operations treated as single unit.

**Trigger** - Automatic action in response to database event.

**Tuple** - Formal term for row/record.

## U

**UNIQUE** - Constraint ensuring all values in column are distinct.

## V

**View** - Virtual table based on query results.

## W

**WHERE** - SQL clause for filtering rows.

**Window Function** - Function performing calculation across set of related rows.

---

[Back to Home](index.md)
