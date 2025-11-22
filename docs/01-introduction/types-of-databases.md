# Types of Databases

Databases come in many varieties, each optimized for specific use cases and data models. Understanding these types helps you choose the right database for your application.

## Classification by Data Model

### 1. Relational Databases (RDBMS)

**Structure**: Data organized in tables (relations) with rows and columns

**Query Language**: SQL (Structured Query Language)

**Key Features**:
- ACID transactions
- Strong data integrity
- Relationships via foreign keys
- Normalized data structure

**Popular Systems**:
- MySQL / MariaDB
- PostgreSQL
- Oracle Database
- Microsoft SQL Server
- SQLite

**Example**:
```sql
-- Customers table
CREATE TABLE customers (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE
);

-- Orders table with foreign key
CREATE TABLE orders (
    id INT PRIMARY KEY,
    customer_id INT,
    total DECIMAL(10,2),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

**Best For**:
- Structured data with clear relationships
- Applications requiring ACID guarantees
- Complex queries and joins
- Financial systems, ERP, CRM

### 2. Document Databases

**Structure**: Collections of JSON-like documents

**Key Features**:
- Flexible schema
- Nested data structures
- Horizontal scalability
- Natural fit for object-oriented programming

**Popular Systems**:
- MongoDB
- CouchDB
- Amazon DocumentDB
- Azure Cosmos DB

**Example**:
```json
{
  "_id": "12345",
  "name": "John Smith",
  "email": "john@example.com",
  "orders": [
    {
      "order_id": "ORD001",
      "date": "2025-01-15",
      "items": [
        {"product": "Laptop", "price": 999.99},
        {"product": "Mouse", "price": 29.99}
      ],
      "total": 1029.98
    }
  ],
  "addresses": {
    "shipping": {
      "street": "123 Main St",
      "city": "Boston",
      "zip": "02101"
    }
  }
}
```

**Best For**:
- Content management systems
- User profiles and preferences
- Product catalogs
- Mobile applications
- Rapidly changing schemas

### 3. Key-Value Databases

**Structure**: Simple key-value pairs (like a hash table)

**Key Features**:
- Extremely fast lookups
- Simple data model
- High scalability
- Low latency

**Popular Systems**:
- Redis
- Amazon DynamoDB
- Riak
- Memcached

**Example**:
```
Key                      Value
-----------------------------------------
user:1001:name        → "John Smith"
user:1001:email       → "john@example.com"
session:abc123        → {"user_id": 1001, "expires": 1234567890}
cart:user:1001        → ["item1", "item2", "item3"]
```

**Best For**:
- Caching
- Session storage
- Real-time recommendations
- Shopping carts
- User preferences
- Leaderboards and counters

### 4. Column-Family Databases

**Structure**: Data stored in columns rather than rows

**Key Features**:
- Optimized for reading/writing columns
- High write throughput
- Efficient compression
- Horizontal scalability

**Popular Systems**:
- Apache Cassandra
- HBase
- ScyllaDB
- Google Bigtable

**Example**:
```
Row Key: user:12345
Column Family: profile
  ├── name:first → "John"
  ├── name:last → "Smith"
  └── name:middle → "A"

Column Family: contact
  ├── email → "john@example.com"
  ├── phone → "555-1234"
  └── address → "123 Main St"
```

**Best For**:
- Time-series data
- Event logging
- IoT sensor data
- Analytics workloads
- Write-heavy applications

### 5. Graph Databases

**Structure**: Nodes (entities) and edges (relationships)

**Key Features**:
- Optimized for relationship queries
- Natural representation of connected data
- Traversal operations
- Pattern matching

**Popular Systems**:
- Neo4j
- Amazon Neptune
- ArangoDB
- JanusGraph

**Example**:
```
Nodes:
(Person {name: "John", age: 30})
(Person {name: "Jane", age: 28})
(Company {name: "Acme Corp"})
(Skill {name: "Python"})

Relationships:
(John)-[:FRIENDS_WITH {since: 2020}]->(Jane)
(John)-[:WORKS_AT {role: "Developer"}]->(Acme Corp)
(John)-[:HAS_SKILL {level: "Expert"}]->(Python)
(Jane)-[:HAS_SKILL {level: "Intermediate"}]->(Python)
```

**Best For**:
- Social networks
- Recommendation engines
- Fraud detection
- Knowledge graphs
- Network and IT operations

### 6. Time-Series Databases

**Structure**: Optimized for time-stamped data

**Key Features**:
- High ingestion rates
- Efficient time-based queries
- Data retention policies
- Downsampling and aggregation

**Popular Systems**:
- InfluxDB
- TimescaleDB
- Prometheus
- OpenTSDB

**Example**:
```
Measurement: temperature
Tags: sensor=sensor1, location=warehouse
Fields: celsius=22.5, fahrenheit=72.5
Timestamp: 2025-01-15T10:30:00Z

Measurement: temperature
Tags: sensor=sensor1, location=warehouse
Fields: celsius=22.7, fahrenheit=72.9
Timestamp: 2025-01-15T10:31:00Z
```

**Best For**:
- IoT sensor data
- Application metrics
- System monitoring
- Financial tick data
- DevOps metrics

## Classification by Use Case

### OLTP (Online Transaction Processing)

**Characteristics**:
- High volume of short transactions
- Real-time processing
- Normalized data
- ACID compliance

**Examples**: E-commerce orders, banking transactions, reservation systems

**Databases**: MySQL, PostgreSQL, Oracle

### OLAP (Online Analytical Processing)

**Characteristics**:
- Complex queries on large datasets
- Historical data analysis
- Denormalized data (star/snowflake schema)
- Read-optimized

**Examples**: Business intelligence, data warehousing, reporting

**Databases**: Amazon Redshift, Google BigQuery, Snowflake

## Classification by Deployment

### 1. Centralized Databases

**Definition**: Single database location serving all users

**Advantages**:
- Simple management
- Data consistency
- Lower cost

**Disadvantages**:
- Single point of failure
- Scalability limits
- Latency for remote users

### 2. Distributed Databases

**Definition**: Data spread across multiple locations

**Types**:

#### Homogeneous
- Same DBMS at all locations
- Example: Multi-region PostgreSQL

#### Heterogeneous
- Different DBMS at different locations
- Example: Oracle + MySQL with integration layer

**Advantages**:
- High availability
- Better performance (data locality)
- Scalability

**Challenges**:
- Complex management
- Data consistency
- Network overhead

### 3. Cloud Databases

**Definition**: Database services hosted on cloud platforms

**Types**:

#### IaaS (Infrastructure as a Service)
- Virtual machines with database software
- Example: EC2 with self-managed MySQL

#### DBaaS (Database as a Service)
- Fully managed database service
- Examples: Amazon RDS, Azure SQL, Google Cloud SQL

**Advantages**:
- No infrastructure management
- Automatic scaling
- Built-in backup and recovery
- Pay-as-you-go pricing

## Comparison Matrix

| Database Type | Scalability | Complexity | Consistency | Use Case |
|---------------|-------------|------------|-------------|----------|
| **Relational** | Vertical | Medium | Strong | Structured transactional data |
| **Document** | Horizontal | Low | Eventual | Flexible schemas, content management |
| **Key-Value** | Horizontal | Very Low | Eventual | Caching, session data |
| **Column-Family** | Horizontal | Medium | Tunable | Time-series, analytics |
| **Graph** | Medium | High | Strong | Relationship-heavy data |
| **Time-Series** | Horizontal | Low | Strong | Metrics, IoT data |

## Choosing the Right Database

### Decision Factors

1. **Data Structure**
   - Structured? → Relational
   - Semi-structured? → Document
   - Highly connected? → Graph

2. **Query Patterns**
   - Complex joins? → Relational
   - Simple lookups? → Key-Value
   - Relationship traversal? → Graph
   - Time-based aggregations? → Time-Series

3. **Scalability Needs**
   - Moderate growth? → Relational
   - Massive scale? → NoSQL (Document, Key-Value, Column-Family)

4. **Consistency Requirements**
   - Strong ACID? → Relational, Graph
   - Eventual consistency okay? → Document, Key-Value

5. **Development Speed**
   - Stable schema? → Relational
   - Rapid iteration? → Document

## Practice Questions

!!! question "Check Your Understanding"
    1. What is the main difference between OLTP and OLAP databases?
    2. When would you choose a document database over a relational database?
    3. What type of database is best suited for storing social network connections?
    4. Why are time-series databases optimized differently than relational databases?

??? example "Answers"
    1. OLTP handles many short transactions in real-time (e.g., order processing), while OLAP performs complex analytical queries on large datasets (e.g., business intelligence)
    2. When you have flexible/evolving schemas, nested data structures, or when data naturally maps to documents (e.g., content management, user profiles)
    3. Graph database - optimized for storing and querying relationships between entities
    4. Time-series databases are optimized for high ingestion rates, time-based queries, and efficient storage/compression of sequential timestamped data

## Summary

Different database types serve different needs:

- **Relational**: Structured data, complex queries, ACID transactions
- **Document**: Flexible schemas, nested data, rapid development
- **Key-Value**: Simple lookups, caching, high performance
- **Column-Family**: Time-series, analytics, high write throughput
- **Graph**: Connected data, relationship queries
- **Time-Series**: Metrics, IoT, monitoring

Modern applications often use **polyglot persistence** - multiple database types working together, each handling the data it's best suited for.

---

**Next**: Learn about Database Management Systems: [Database Management Systems (DBMS)](dbms.md)
