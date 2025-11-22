# Chapter 9: NoSQL Databases

## Learning Objectives

After completing this chapter, you will be able to:

- Understand what NoSQL databases are and why they emerged
- Identify different types of NoSQL databases and their use cases
- Compare SQL and NoSQL databases
- Work with MongoDB, a popular document database
- Understand when to choose NoSQL vs SQL
- Apply NoSQL concepts to real-world scenarios
- Understand the CAP theorem and its implications

## 9.1 Introduction to NoSQL

### What is NoSQL?

**NoSQL** stands for "Not Only SQL" - a category of database management systems that differ from traditional relational databases.

**Key Characteristics:**
- **Flexible schemas** - No fixed table structure
- **Horizontal scalability** - Easy to scale across multiple servers
- **High performance** - Optimized for specific use cases
- **Distributed architecture** - Built for cloud and distributed systems

### Why NoSQL Emerged

Traditional relational databases face challenges with:

1. **Big Data** - Billions of records, petabytes of data
2. **High Traffic** - Millions of concurrent users
3. **Flexible Data** - Varying structure, semi-structured data
4. **Rapid Development** - Schema changes slow down development
5. **Geographic Distribution** - Global user base requires distributed data

!!! example "Real-World Drivers"
    **Companies that drove NoSQL adoption:**
    - **Google:** BigTable for massive scale
    - **Amazon:** DynamoDB for high availability
    - **Facebook:** Cassandra for social graph
    - **LinkedIn:** Voldemort for key-value storage

### SQL vs NoSQL

| Aspect | SQL (Relational) | NoSQL |
|--------|------------------|-------|
| **Schema** | Fixed, predefined | Flexible, dynamic |
| **Scalability** | Vertical (bigger servers) | Horizontal (more servers) |
| **Transactions** | ACID guarantees | Eventually consistent (often) |
| **Relationships** | JOINs, foreign keys | Embedded or referenced |
| **Query Language** | SQL | Varies by database |
| **Use Case** | Complex queries, transactions | High scale, flexible data |
| **Examples** | MySQL, PostgreSQL, Oracle | MongoDB, Cassandra, Redis |

!!! note "Not a Replacement"
    NoSQL doesn't replace SQL databases - they complement each other. Many applications use both!

## 9.2 Types of NoSQL Databases

### 1. Document Databases

Store data as documents (JSON, BSON, XML).

**Structure:**
```json
{
  "_id": "12345",
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "orders": [
    {
      "order_id": 101,
      "date": "2024-01-15",
      "total": 150.00,
      "items": [
        {"product": "Laptop", "qty": 1},
        {"product": "Mouse", "qty": 2}
      ]
    }
  ]
}
```

**Popular Examples:**
- **MongoDB** - Most popular document database
- **Couchbase** - High performance, mobile sync
- **Amazon DocumentDB** - MongoDB-compatible cloud service

**Use Cases:**
- Content management systems
- E-commerce product catalogs
- User profiles
- Mobile applications

**Advantages:**
- ✅ Flexible schema
- ✅ Natural data representation
- ✅ Easy to develop with

**Disadvantages:**
- ❌ No complex joins
- ❌ Potential data duplication

### 2. Key-Value Databases

Store data as simple key-value pairs.

**Structure:**
```
Key: "user:12345:session"
Value: "a8f7d9e2-session-token-12345"

Key: "product:5001:price"
Value: "999.99"
```

**Popular Examples:**
- **Redis** - In-memory, extremely fast
- **Amazon DynamoDB** - Fully managed, serverless
- **Riak** - Distributed, high availability

**Use Cases:**
- Session management
- Caching
- Real-time analytics
- Shopping carts
- User preferences

**Advantages:**
- ✅ Extremely fast (often in-memory)
- ✅ Simple to use
- ✅ Highly scalable

**Disadvantages:**
- ❌ Limited querying (only by key)
- ❌ No relationships between data

### 3. Column-Family Databases

Store data in columns rather than rows, optimized for reading/writing columns.

**Structure:**
```
Row Key: "customer_12345"
  - personal:name = "Alice Johnson"
  - personal:email = "alice@example.com"
  - purchase:last_order = "2024-11-20"
  - purchase:total_spent = "5000.00"
```

**Popular Examples:**
- **Apache Cassandra** - High write throughput
- **HBase** - Hadoop integration
- **Google Bigtable** - Managed service

**Use Cases:**
- Time-series data
- IoT sensor data
- Event logging
- Analytics platforms

**Advantages:**
- ✅ Extremely fast writes
- ✅ Scales horizontally easily
- ✅ Good for wide tables

**Disadvantages:**
- ❌ Complex to model
- ❌ Limited ad-hoc queries

### 4. Graph Databases

Store data as nodes and relationships (edges).

**Structure:**
```
(Alice) -[FRIENDS_WITH]-> (Bob)
(Alice) -[PURCHASED]-> (Laptop)
(Laptop) -[CATEGORY]-> (Electronics)
```

**Popular Examples:**
- **Neo4j** - Most popular graph database
- **Amazon Neptune** - Fully managed
- **ArangoDB** - Multi-model database

**Use Cases:**
- Social networks
- Recommendation engines
- Fraud detection
- Network analysis
- Knowledge graphs

**Advantages:**
- ✅ Excellent for relationships
- ✅ Fast graph traversal
- ✅ Natural for connected data

**Disadvantages:**
- ❌ Not suitable for simple queries
- ❌ Learning curve for query language

## 9.3 MongoDB: Document Database

**MongoDB** is the most popular NoSQL database, storing data as JSON-like documents.

### MongoDB Basics

**Database → Collections → Documents**

Compare to SQL:
- Database = Database
- Collection = Table
- Document = Row
- Field = Column

**Key Differences:**
- No fixed schema - documents in same collection can have different fields
- Supports nested documents and arrays
- No JOINs (use embedded documents or references)

### MongoDB Document Example

```json
// Customer document
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "customer_id": 12345,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "address": {
    "street": "123 Main St",
    "city": "Champaign",
    "state": "IL",
    "zip": "61820"
  },
  "phone_numbers": [
    {"type": "mobile", "number": "217-555-1234"},
    {"type": "home", "number": "217-555-5678"}
  ],
  "orders": [
    {
      "order_id": 101,
      "date": ISODate("2024-01-15T10:30:00Z"),
      "total": 150.00,
      "items": [
        {"product": "Laptop", "sku": "LAP-001", "qty": 1, "price": 999.99},
        {"product": "Mouse", "sku": "MOU-001", "qty": 2, "price": 25.00}
      ]
    }
  ],
  "loyalty_points": 1500,
  "created_at": ISODate("2024-01-01T00:00:00Z"),
  "updated_at": ISODate("2024-11-20T15:30:00Z")
}
```

### MongoDB CRUD Operations

#### Create (Insert)

```javascript
// Insert one document
db.customers.insertOne({
  customer_id: 12345,
  name: "Alice Johnson",
  email: "alice@example.com",
  address: {
    city: "Champaign",
    state: "IL"
  }
});

// Insert multiple documents
db.customers.insertMany([
  {customer_id: 12346, name: "Bob Smith", email: "bob@example.com"},
  {customer_id: 12347, name: "Carol Davis", email: "carol@example.com"}
]);
```

#### Read (Find)

```javascript
// Find all customers
db.customers.find();

// Find one customer
db.customers.findOne({customer_id: 12345});

// Find with conditions
db.customers.find({
  "address.state": "IL",
  loyalty_points: {$gt: 1000}
});

// Find with projection (select specific fields)
db.customers.find(
  {"address.state": "IL"},
  {name: 1, email: 1, _id: 0}  // 1 = include, 0 = exclude
);

// Find and sort
db.customers.find().sort({loyalty_points: -1}).limit(10);
```

#### Update

```javascript
// Update one document
db.customers.updateOne(
  {customer_id: 12345},
  {
    $set: {email: "alice.new@example.com"},
    $inc: {loyalty_points: 100}
  }
);

// Update multiple documents
db.customers.updateMany(
  {"address.state": "IL"},
  {$set: {region: "Midwest"}}
);

// Upsert (update or insert if not exists)
db.customers.updateOne(
  {customer_id: 12350},
  {$set: {name: "New Customer"}},
  {upsert: true}
);
```

#### Delete

```javascript
// Delete one document
db.customers.deleteOne({customer_id: 12345});

// Delete multiple documents
db.customers.deleteMany({"address.state": "IL"});
```

### MongoDB Query Operators

#### Comparison Operators

```javascript
// Greater than
db.customers.find({loyalty_points: {$gt: 1000}});

// Less than or equal
db.products.find({price: {$lte: 100}});

// Not equal
db.customers.find({status: {$ne: "inactive"}});

// In array
db.customers.find({
  "address.state": {$in: ["IL", "CA", "NY"]}
});
```

#### Logical Operators

```javascript
// AND (implicit)
db.customers.find({
  "address.state": "IL",
  loyalty_points: {$gt: 1000}
});

// OR
db.customers.find({
  $or: [
    {"address.state": "IL"},
    {loyalty_points: {$gt: 5000}}
  ]
});

// NOT
db.customers.find({
  loyalty_points: {$not: {$gt: 1000}}
});
```

#### Array Operators

```javascript
// Array contains element
db.customers.find({
  "phone_numbers.type": "mobile"
});

// Array size
db.customers.find({
  phone_numbers: {$size: 2}
});

// All elements match
db.customers.find({
  "orders.status": {$all: ["shipped", "delivered"]}
});
```

### MongoDB Aggregation Pipeline

Powerful framework for data aggregation (similar to SQL GROUP BY).

```javascript
// Calculate total sales by state
db.customers.aggregate([
  // Stage 1: Unwind orders array
  {$unwind: "$orders"},

  // Stage 2: Group by state and sum
  {
    $group: {
      _id: "$address.state",
      total_sales: {$sum: "$orders.total"},
      customer_count: {$sum: 1},
      avg_order: {$avg: "$orders.total"}
    }
  },

  // Stage 3: Sort by total sales
  {$sort: {total_sales: -1}},

  // Stage 4: Limit to top 5
  {$limit: 5}
]);
```

**Common Aggregation Stages:**

```javascript
// $match - Filter documents (like WHERE)
{$match: {"address.state": "IL"}}

// $group - Group documents (like GROUP BY)
{
  $group: {
    _id: "$category",
    count: {$sum: 1},
    avg_price: {$avg: "$price"}
  }
}

// $project - Select/reshape fields (like SELECT)
{
  $project: {
    name: 1,
    email: 1,
    total_orders: {$size: "$orders"}
  }
}

// $sort - Sort results (like ORDER BY)
{$sort: {total_sales: -1}}

// $limit - Limit results (like LIMIT)
{$limit: 10}

// $lookup - Join with another collection (like JOIN)
{
  $lookup: {
    from: "products",
    localField: "product_id",
    foreignField: "_id",
    as: "product_info"
  }
}
```

### MongoDB Indexes

```javascript
// Create index on single field
db.customers.createIndex({email: 1});  // 1 = ascending, -1 = descending

// Create compound index
db.customers.createIndex({"address.state": 1, loyalty_points: -1});

// Create unique index
db.customers.createIndex({email: 1}, {unique: true});

// Create text index for full-text search
db.products.createIndex({description: "text"});

// List indexes
db.customers.getIndexes();

// Drop index
db.customers.dropIndex("email_1");
```

## 9.4 Data Modeling in MongoDB

### Embedded Documents vs References

**Choice:** Should you embed related data or reference it?

#### Embedded Documents (Denormalized)

**When to use:**
- One-to-few relationship
- Data is always accessed together
- Data doesn't change often

```json
// Customer with embedded orders
{
  "_id": ObjectId("..."),
  "name": "Alice Johnson",
  "orders": [
    {
      "order_id": 101,
      "date": "2024-01-15",
      "total": 150.00,
      "items": [...]
    },
    {
      "order_id": 102,
      "date": "2024-02-01",
      "total": 75.00,
      "items": [...]
    }
  ]
}
```

**Advantages:**
- ✅ Single query to get all data
- ✅ Better performance
- ✅ Atomic updates

**Disadvantages:**
- ❌ Document size limits (16MB in MongoDB)
- ❌ Data duplication

#### References (Normalized)

**When to use:**
- One-to-many or many-to-many relationship
- Data is large
- Data changes frequently
- Data is accessed independently

```json
// Customer document
{
  "_id": ObjectId("customer_123"),
  "name": "Alice Johnson",
  "email": "alice@example.com"
}

// Order documents (separate collection)
{
  "_id": ObjectId("order_101"),
  "customer_id": ObjectId("customer_123"),  // Reference
  "date": "2024-01-15",
  "total": 150.00
}

{
  "_id": ObjectId("order_102"),
  "customer_id": ObjectId("customer_123"),  // Reference
  "date": "2024-02-01",
  "total": 75.00
}
```

**Query with references:**
```javascript
// Find customer
const customer = db.customers.findOne({_id: ObjectId("customer_123")});

// Find customer's orders (separate query)
const orders = db.orders.find({customer_id: customer._id});

// Or use $lookup (join)
db.customers.aggregate([
  {$match: {_id: ObjectId("customer_123")}},
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "customer_id",
      as: "orders"
    }
  }
]);
```

### Design Patterns

#### Pattern 1: One-to-Few (Embed)

**Example:** Customer with 2-3 addresses

```json
{
  "name": "Alice Johnson",
  "addresses": [
    {type: "home", street: "123 Main St", city: "Champaign"},
    {type: "work", street: "456 Business Rd", city: "Urbana"}
  ]
}
```

#### Pattern 2: One-to-Many (Reference)

**Example:** Author with hundreds of books

```json
// Author document
{
  "_id": ObjectId("author_1"),
  "name": "J.K. Rowling"
}

// Book documents
{
  "title": "Harry Potter 1",
  "author_id": ObjectId("author_1")
}
```

#### Pattern 3: Many-to-Many (Array of References)

**Example:** Students and courses

```json
// Student document
{
  "_id": ObjectId("student_1"),
  "name": "Alice",
  "course_ids": [
    ObjectId("course_350"),
    ObjectId("course_310")
  ]
}

// Course document
{
  "_id": ObjectId("course_350"),
  "title": "Database Management",
  "student_ids": [
    ObjectId("student_1"),
    ObjectId("student_2")
  ]
}
```

## 9.5 CAP Theorem

The **CAP theorem** states that a distributed database can only guarantee two of these three properties:

### The Three Properties

1. **Consistency (C):** All nodes see the same data at the same time
2. **Availability (A):** Every request receives a response (success or failure)
3. **Partition Tolerance (P):** System continues to operate despite network failures

### Trade-offs

**In practice, you must choose:**

**CP System (Consistency + Partition Tolerance)**
- Sacrifices availability during network partition
- Example: MongoDB (with strong consistency)
- Use case: Financial transactions

**AP System (Availability + Partition Tolerance)**
- Sacrifices consistency (eventually consistent)
- Example: Cassandra, DynamoDB
- Use case: Social media feeds, shopping carts

**CA System (Consistency + Availability)**
- Not partition-tolerant (single-node or local)
- Example: Traditional relational databases (single server)
- Limited scalability

!!! note "Real World"
    In distributed systems, **partition tolerance is not optional** (networks can fail), so you're really choosing between **CP or AP**.

## 9.6 When to Use SQL vs NoSQL

### Use SQL (Relational) When:

✅ **ACID transactions are critical**
- Banking, financial systems
- E-commerce orders

✅ **Complex queries and JOINs needed**
- Business intelligence
- Reporting systems

✅ **Data structure is well-defined and stable**
- Accounting systems
- HR systems

✅ **Data integrity is paramount**
- Medical records
- Compliance requirements

### Use NoSQL When:

✅ **Flexible schema needed**
- Content management
- Product catalogs with varying attributes

✅ **High scalability required**
- Social media platforms
- IoT applications

✅ **Performance at scale**
- Real-time analytics
- Session storage

✅ **Rapid development**
- Prototyping
- Startups iterating quickly

### Polyglot Persistence

Modern applications often use **both SQL and NoSQL**:

**Example E-commerce Application:**
- **MySQL:** Orders, payments, inventory (ACID transactions)
- **MongoDB:** Product catalog, user profiles (flexible schema)
- **Redis:** Session data, shopping carts (high performance)
- **Elasticsearch:** Product search (full-text search)

## 9.7 Business Application Examples

### Example 1: E-Commerce Product Catalog

**Problem:** Products have vastly different attributes.

**MongoDB Solution:**
```javascript
// Electronics product
{
  "product_id": "ELEC-001",
  "name": "Laptop Pro 15",
  "category": "Electronics",
  "price": 1299.99,
  "specs": {
    "brand": "TechBrand",
    "screen_size": "15 inch",
    "ram": "16GB",
    "storage": "512GB SSD",
    "processor": "Intel i7"
  },
  "reviews": [
    {user: "Alice", rating: 5, comment: "Excellent laptop!"},
    {user: "Bob", rating: 4, comment: "Good value"}
  ]
}

// Clothing product (different structure)
{
  "product_id": "CLO-001",
  "name": "Cotton T-Shirt",
  "category": "Clothing",
  "price": 29.99,
  "specs": {
    "brand": "FashionCo",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Blue", "Red", "Black"],
    "material": "100% Cotton",
    "care": "Machine wash cold"
  },
  "reviews": [...]
}
```

### Example 2: Social Media User Profile

```javascript
{
  "user_id": 12345,
  "username": "alice_j",
  "email": "alice@example.com",
  "profile": {
    "full_name": "Alice Johnson",
    "bio": "Database enthusiast | UIUC student",
    "avatar_url": "https://...",
    "location": "Champaign, IL"
  },
  "following": [23456, 34567, 45678],
  "followers": [56789, 67890],
  "posts": [
    {
      "post_id": 101,
      "content": "Learning NoSQL databases!",
      "timestamp": ISODate("2024-11-20T10:30:00Z"),
      "likes": 45,
      "comments": [
        {user: "bob_s", comment: "Great post!"},
        {user: "carol_m", comment: "Very informative"}
      ]
    }
  ],
  "settings": {
    "privacy": "friends",
    "notifications": {
      "email": true,
      "push": false
    }
  }
}
```

### Example 3: IoT Sensor Data (Time Series)

**MongoDB with Time Series Collection:**

```javascript
// Temperature sensor readings
{
  "sensor_id": "TEMP-001",
  "location": "Building A - Room 101",
  "timestamp": ISODate("2024-11-20T14:30:00Z"),
  "temperature": 72.5,
  "humidity": 45,
  "metadata": {
    "building": "A",
    "floor": 1,
    "room": "101"
  }
}

// Query: Average temperature by hour
db.sensor_readings.aggregate([
  {
    $match: {
      timestamp: {
        $gte: ISODate("2024-11-20T00:00:00Z"),
        $lt: ISODate("2024-11-21T00:00:00Z")
      }
    }
  },
  {
    $group: {
      _id: {
        $dateToString: {
          format: "%Y-%m-%d %H:00",
          date: "$timestamp"
        }
      },
      avg_temp: {$avg: "$temperature"},
      avg_humidity: {$avg: "$humidity"}
    }
  },
  {$sort: {_id: 1}}
]);
```

## 9.8 MongoDB Best Practices

### 1. Design for Your Queries

Model data based on how you'll query it, not how it's structured in your application.

### 2. Use Indexes Wisely

```javascript
// Index frequently queried fields
db.customers.createIndex({email: 1});
db.orders.createIndex({customer_id: 1, order_date: -1});
```

### 3. Limit Document Size

Keep documents under 16MB. For large arrays, consider references.

### 4. Use Projection

Only retrieve fields you need:
```javascript
db.customers.find({}, {name: 1, email: 1, _id: 0});
```

### 5. Handle Errors

```javascript
try {
  db.customers.insertOne({...});
} catch (error) {
  if (error.code === 11000) {
    console.log("Duplicate key error");
  }
}
```

## Key Takeaways

1. **NoSQL provides flexibility** - Different types for different needs
2. **Document databases are popular** - Natural data representation
3. **MongoDB is widely used** - Flexible schema, rich queries
4. **Embedded vs references** - Design choice affects performance
5. **CAP theorem limits distributed systems** - Choose CP or AP
6. **SQL and NoSQL complement each other** - Use both when appropriate
7. **Design for your queries** - Structure follows access patterns

## Review Questions

1. What are the four main types of NoSQL databases?
2. When would you choose MongoDB over MySQL?
3. What's the difference between embedding documents and using references?
4. Explain the CAP theorem and its implications.
5. What are the advantages and disadvantages of flexible schemas?
6. How do MongoDB aggregation pipelines work?

## Practical Exercise

**Scenario:** Design a MongoDB database for a blog platform.

**Requirements:**
- Users can create posts with tags
- Posts can have comments
- Users can follow other users
- Track post views and likes

**Tasks:**

1. **Design document structure:**
   - User document
   - Post document
   - Should comments be embedded or referenced?

2. **Write MongoDB queries:**
   - Find all posts by a specific user
   - Find posts with a specific tag
   - Get the 10 most recent posts
   - Calculate total likes per user

3. **Create aggregation pipeline:**
   - Find top 10 users by post count
   - Find most popular tags (used in most posts)
   - Calculate average comments per post

4. **Index strategy:**
   - Which fields should be indexed?
   - What compound indexes make sense?

## Next Steps

Congratulations! You've completed the Database Management course. You now have a solid foundation in:
- Database fundamentals and the database environment
- Relational data modeling and SQL
- Advanced SQL techniques and JSON/APIs
- Database design and normalization
- Data warehousing and ETL
- NoSQL databases

**Continue your learning:**
- Practice with real databases
- Build projects that use databases
- Explore cloud database services (AWS RDS, MongoDB Atlas)
- Learn about database administration and optimization

---

*Corresponds to Week 9 of the course - Chapter 11 of the textbook*
