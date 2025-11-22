# NoSQL Databases

NoSQL databases provide alternatives to traditional relational databases, designed for specific use cases requiring scalability, flexibility, or performance characteristics that relational databases don't provide optimally.

## Chapter Overview

This chapter explores:

- **Introduction to NoSQL** - What NoSQL is and when to use it
- **Document Stores** - MongoDB, CouchDB
- **Key-Value Stores** - Redis, DynamoDB
- **Column-Family Stores** - Cassandra, HBase
- **Graph Databases** - Neo4j, Amazon Neptune
- **CAP Theorem** - Fundamental trade-offs
- **When to Use NoSQL** - Making the right choice

## Learning Objectives

By the end of this chapter, you should be able to:

1. Understand the motivation behind NoSQL databases
2. Identify different types of NoSQL databases
3. Choose appropriate NoSQL database for specific use cases
4. Understand CAP theorem and its implications
5. Compare NoSQL and relational databases
6. Work with document, key-value, column-family, and graph databases

## Why NoSQL?

NoSQL databases emerged to address:
- **Scalability**: Horizontal scaling for web-scale applications
- **Flexibility**: Schema-less or flexible schemas
- **Performance**: Optimized for specific access patterns
- **Big Data**: Handle massive volumes of unstructured data

## NoSQL vs SQL

| Aspect | SQL (Relational) | NoSQL |
|--------|------------------|-------|
| **Schema** | Fixed schema | Flexible/no schema |
| **Scalability** | Vertical (scale up) | Horizontal (scale out) |
| **Transactions** | ACID | BASE (usually) |
| **Joins** | Complex joins supported | Limited/no joins |
| **Use Case** | Complex queries, transactions | High scale, flexibility |

## Chapter Contents

1. [Introduction to NoSQL](intro-nosql.md) - Fundamentals and history
2. [Document Stores](document-stores.md) - JSON-like documents
3. [Key-Value Stores](key-value-stores.md) - Simple key-value pairs
4. [Column-Family Stores](column-family-stores.md) - Wide-column stores
5. [Graph Databases](graph-databases.md) - Nodes and relationships
6. [CAP Theorem](cap-theorem.md) - Consistency, Availability, Partition tolerance
7. [When to Use NoSQL](when-to-use.md) - Decision guidelines

## Prerequisites

- Understanding of relational databases
- Familiarity with database concepts
- Knowledge of data modeling

---

*Ready to explore NoSQL? Start with [Introduction to NoSQL](intro-nosql.md)*
