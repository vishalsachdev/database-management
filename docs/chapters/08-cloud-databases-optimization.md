# Chapter 8: Cloud Databases & Optimization

## Learning Objectives

After completing this chapter, you will be able to:

- Explain why organizations move databases to the cloud and evaluate trade-offs versus on-premise deployments
- Describe the key components of an AWS RDS setup including instance configuration and security groups
- Connect to a cloud database from Python using SQLAlchemy
- Understand how indexes work, including B-tree structure, and know when to create them
- Read and interpret EXPLAIN query plans to diagnose performance bottlenecks
- Design an index strategy using composite and covering indexes
- Automate database tasks using cron jobs and AWS Lambda
- Apply cloud cost awareness principles including instance sizing, free tier limits, and resource lifecycle

## 8.1 Why Cloud Databases?

### The Shift from On-Premise to Cloud

Throughout this course, you have been working with databases running on your local machine or a university server. In production, organizations increasingly run their databases in the cloud. Understanding why requires thinking about what happens when a business grows beyond a single server.

### On-Premise vs Cloud: A Business Comparison

| Factor | On-Premise | Cloud (e.g., AWS RDS) |
|--------|-----------|----------------------|
| **Upfront cost** | High (hardware, licenses, data center) | Low (pay-as-you-go) |
| **Time to deploy** | Weeks to months | Minutes |
| **Scaling** | Buy and install new hardware | Click a button or auto-scale |
| **Maintenance** | Your team patches OS, DBMS, hardware | Provider handles patching |
| **Backups** | You configure and monitor | Automated daily snapshots |
| **Availability** | You build redundancy | Multi-AZ with automatic failover |
| **Control** | Full control over everything | Less control, more guardrails |

!!! tip "When On-Premise Still Wins"
    Some industries (healthcare, defense, certain financial institutions) keep databases on-premise due to regulatory requirements, data sovereignty laws, or latency-sensitive workloads. Cloud is not always the answer, but it is the default starting point for most modern applications.

### Managed Database Services

A **managed database service** like AWS RDS, Google Cloud SQL, or Azure SQL Database handles the undifferentiated heavy lifting:

- Operating system patching
- Database engine upgrades
- Automated backups and point-in-time recovery
- Monitoring and alerting
- Hardware provisioning

This frees your team to focus on schema design, query optimization, and building applications rather than maintaining infrastructure.

## 8.2 AWS RDS Setup

### What is Amazon RDS?

**Amazon Relational Database Service (RDS)** is a managed service that makes it easy to set up, operate, and scale a relational database in the cloud. It supports multiple database engines:

| Engine | Use Case |
|--------|----------|
| **MySQL** | General purpose, web applications |
| **PostgreSQL** | Advanced features, geospatial data, analytics |
| **MariaDB** | MySQL-compatible, open source |
| **Oracle** | Enterprise applications with Oracle dependencies |
| **SQL Server** | Microsoft ecosystem, .NET applications |
| **Aurora** | AWS-native, MySQL/PostgreSQL compatible, high performance |

### Key Configuration Decisions

When launching an RDS instance, you make several decisions that affect performance, cost, and security:

**1. Instance Class** determines CPU, memory, and network capacity:

| Class | Example | vCPUs | RAM | Use Case |
|-------|---------|-------|-----|----------|
| **db.t3.micro** | Free tier eligible | 2 | 1 GB | Development, learning |
| **db.t3.medium** | Small production | 2 | 4 GB | Light production workloads |
| **db.r6g.large** | Memory-optimized | 2 | 16 GB | Analytics, caching |
| **db.r6g.xlarge** | Heavy production | 4 | 32 GB | Large-scale applications |

**2. Storage** is allocated in GB and can be SSD (gp3) or provisioned IOPS (io1) for high-throughput workloads.

**3. Multi-AZ Deployment** creates a standby replica in a different Availability Zone for automatic failover. This doubles your cost but provides high availability.

!!! warning "Free Tier Limits"
    The AWS Free Tier includes 750 hours/month of db.t3.micro for 12 months. If you leave an instance running 24/7, that is roughly 720 hours per month, which fits within the limit. However, running two instances or choosing a larger class will incur charges. Always set a billing alarm.

### Security Groups: Controlling Network Access

A **security group** acts as a virtual firewall for your RDS instance. It controls which IP addresses and services can connect to your database.

```
Inbound Rules (who can connect to the database):
+--------+----------+-----------+---------------------------+
| Type   | Protocol | Port      | Source                    |
+--------+----------+-----------+---------------------------+
| MySQL  | TCP      | 3306      | My IP (73.xx.xx.xx/32)    |
| MySQL  | TCP      | 3306      | Lambda SG (sg-0abc1234)   |
+--------+----------+-----------+---------------------------+
```

!!! warning "Never Open Port 3306 to 0.0.0.0/0"
    Setting the source to `0.0.0.0/0` means anyone on the internet can attempt to connect to your database. This is a critical security mistake. Always restrict access to specific IP addresses or security groups.

Key security group principles:

- **Least privilege**: Only allow the IP addresses and services that need access
- **Use security group references**: Instead of IP addresses, reference other security groups (e.g., allow connections from your application server's security group)
- **Separate environments**: Use different security groups for development, staging, and production

## 8.3 Connecting to RDS from Python

### Connection String Anatomy

Once your RDS instance is running, you connect to it using a connection string. The format follows a standard URI pattern:

```
mysql+pymysql://username:password@hostname:port/database_name
```

Each component maps to your RDS configuration:

| Component | Example | Where to Find It |
|-----------|---------|-------------------|
| `username` | `admin` | Set during RDS creation |
| `password` | `MyStr0ngP@ss!` | Set during RDS creation |
| `hostname` | `mydb.abc123.us-east-1.rds.amazonaws.com` | RDS console, "Endpoint" |
| `port` | `3306` | RDS console (MySQL default) |
| `database_name` | `company_db` | Created after connecting |

### SQLAlchemy Connection

```python
from sqlalchemy import create_engine
import pandas as pd

# Build the connection string
engine = create_engine(
    "mysql+pymysql://admin:MyStr0ngP@ss@"
    "mydb.abc123.us-east-1.rds.amazonaws.com:3306/company_db"
)

# Test the connection
with engine.connect() as conn:
    result = conn.execute("SELECT 1")
    print("Connected successfully!")

# Query into a DataFrame
df = pd.read_sql("SELECT * FROM employee LIMIT 10", engine)
print(df.head())
```

!!! warning "Never Hardcode Credentials"
    The example above hardcodes the password for clarity. In practice, use environment variables or a secrets manager:

    ```python
    import os

    db_user = os.environ["DB_USER"]
    db_pass = os.environ["DB_PASS"]
    db_host = os.environ["DB_HOST"]
    db_name = os.environ["DB_NAME"]

    engine = create_engine(
        f"mysql+pymysql://{db_user}:{db_pass}@{db_host}:3306/{db_name}"
    )
    ```

### Writing Data to RDS

```python
import pandas as pd

# Prepare a DataFrame
new_customers = pd.DataFrame({
    "first_name": ["Alice", "Bob"],
    "last_name": ["Chen", "Smith"],
    "email": ["alice@example.com", "bob@example.com"]
})

# Write to the database
new_customers.to_sql("customer", engine, if_exists="append", index=False)
```

!!! tip "if_exists Parameter"
    - `"fail"` (default): Raise an error if the table already exists
    - `"replace"`: Drop the table and recreate it with the new data
    - `"append"`: Add rows to the existing table

## 8.4 Indexes

### What is an Index?

An **index** is a data structure that improves the speed of data retrieval on a table. Think of it like the index at the back of a textbook: instead of reading every page to find a topic, you look up the page number in the index.

Without an index, the database must perform a **full table scan**, reading every row to find matches. With an index, it can jump directly to the relevant rows.

### How B-Tree Indexes Work

Most relational databases use **B-tree** (balanced tree) indexes by default. A simplified view:

```
                    [Johnson]
                   /         \
          [Chen, Davis]    [Miller, Smith]
          /    |    \       /    |    \
        [rows] [rows] [rows] [rows] [rows] [rows]
```

Key properties of B-trees:

- **Balanced**: Every path from root to leaf has the same length
- **Sorted**: Values are stored in order, enabling range queries
- **Logarithmic lookup**: Finding a value in a million rows takes roughly 20 comparisons, not 1,000,000
- **Self-balancing**: The tree reorganizes itself as data is inserted or deleted

### Creating Indexes

```sql
-- Single-column index
CREATE INDEX idx_employee_last_name
ON employee (last_name);

-- Composite index (multiple columns)
CREATE INDEX idx_employee_dept_salary
ON employee (department_id, salary);

-- Unique index (enforces uniqueness)
CREATE UNIQUE INDEX idx_employee_email
ON employee (email);
```

### When Indexes Help (and When They Hurt)

| Scenario | Index Helps? | Why |
|----------|-------------|-----|
| `WHERE last_name = 'Chen'` | Yes | Direct lookup instead of full scan |
| `WHERE salary > 80000` | Yes | Range scan on sorted structure |
| `ORDER BY hire_date DESC` | Yes | Data already sorted in index |
| `JOIN employee ON dept.id = e.dept_id` | Yes | Fast lookup of matching rows |
| `INSERT INTO employee ...` | No (slower) | Index must be updated on every insert |
| `SELECT * FROM employee` (no WHERE) | No | Full scan needed anyway |
| Table with 50 rows | Rarely | Full scan is fast on small tables |

!!! note "The Index Trade-Off"
    Indexes speed up reads but slow down writes. Every INSERT, UPDATE, or DELETE must also update every index on that table. For write-heavy workloads (logging, IoT sensor data), excessive indexing can degrade performance.

## 8.5 Query Optimization with EXPLAIN

### What is a Query Plan?

When you submit a SQL query, the database engine does not simply execute it line by line. It creates a **query plan**, an internal strategy for how to retrieve the data most efficiently. The `EXPLAIN` statement lets you see this plan.

### Reading an EXPLAIN Plan

```sql
EXPLAIN SELECT first_name, last_name, salary
FROM employee
WHERE department_id = 3 AND salary > 60000;
```

Sample output (MySQL):

```
+----+-------+------+-----------------------+------+-------+------+----------------------------+
| id | type  | table| possible_keys         | key  | rows  | Extra                      |
+----+-------+------+-----------------------+------+-------+------+----------------------------+
|  1 | ref   | emp  | idx_emp_dept_salary   | idx  |    45 | Using where; Using index   |
+----+-------+------+-----------------------+------+-------+------+----------------------------+
```

Key columns to examine:

| Column | What to Look For |
|--------|-----------------|
| **type** | `ALL` = full table scan (bad). `ref`, `range`, `const` = using index (good) |
| **possible_keys** | Which indexes the optimizer considered |
| **key** | Which index was actually chosen |
| **rows** | Estimated number of rows to examine (lower is better) |
| **Extra** | `Using index` = great. `Using filesort` or `Using temporary` = potential problem |

!!! example "Before and After Indexing"
    **Before** (no index on `department_id`):
    ```
    type: ALL | rows: 50000 | Extra: Using where
    ```
    The database scans all 50,000 rows.

    **After** (index on `department_id`):
    ```
    type: ref | rows: 312 | Extra: Using where; Using index
    ```
    The database examines only 312 rows. A 160x improvement.

### Common Performance Red Flags

When reviewing EXPLAIN output, watch for these patterns:

1. **`type: ALL`** on a large table indicates a full table scan
2. **`Using filesort`** means the database must sort results in memory rather than using an index
3. **`Using temporary`** means a temporary table was created, often for GROUP BY or DISTINCT operations
4. **Large `rows` estimate** relative to the total table size suggests the query is not selective enough

## 8.6 Index Strategy

### Composite Indexes and Column Order

A **composite index** covers multiple columns. The order of columns matters because the index follows a **leftmost prefix** rule:

```sql
CREATE INDEX idx_dept_salary ON employee (department_id, salary);
```

This index supports:

- `WHERE department_id = 3` (uses the index)
- `WHERE department_id = 3 AND salary > 50000` (uses the index)
- `WHERE salary > 50000` (does NOT use this index, wrong prefix)

!!! tip "Column Order Rule of Thumb"
    Put the most selective column (the one that narrows results the most) first, followed by columns used in range conditions. Equality conditions before range conditions.

### Covering Indexes

A **covering index** includes all columns the query needs, so the database never has to read the actual table row:

```sql
-- Query
SELECT department_id, AVG(salary)
FROM employee
GROUP BY department_id;

-- Covering index for this query
CREATE INDEX idx_dept_salary ON employee (department_id, salary);
```

The EXPLAIN output will show `Using index`, meaning the query is satisfied entirely from the index. This is the fastest possible execution path.

### When NOT to Index

Not every column deserves an index. Avoid indexing:

- **Low-cardinality columns** like `gender` or `is_active` (only a few distinct values, so the index does not narrow results meaningfully)
- **Columns rarely used in WHERE, JOIN, or ORDER BY** (the index is maintained but never used)
- **Very wide columns** like `TEXT` or `VARCHAR(500)` (large index size, diminishing returns)
- **Tables with heavy write workloads** where insert/update speed is critical

!!! note "Index Strategy Summary"
    1. Start with no indexes beyond the primary key
    2. Identify slow queries using EXPLAIN
    3. Add indexes that address specific bottlenecks
    4. Monitor write performance after adding indexes
    5. Remove unused indexes periodically

## 8.7 Automated Jobs

### Why Automate Database Tasks?

Many database operations need to run on a schedule without human intervention:

- **Nightly ETL loads**: Pull data from source systems into your data warehouse
- **Report generation**: Create and email daily sales summaries
- **Data cleanup**: Archive old records, remove expired sessions
- **Health checks**: Monitor table sizes, index fragmentation, slow queries

### Cron Jobs (Linux/macOS)

**Cron** is a time-based job scheduler available on Linux and macOS systems. You define schedules using a five-field syntax:

```
# ┌───────────── minute (0-59)
# │ ┌───────────── hour (0-23)
# │ │ ┌───────────── day of month (1-31)
# │ │ │ ┌───────────── month (1-12)
# │ │ │ │ ┌───────────── day of week (0-6, Sunday=0)
# │ │ │ │ │
# * * * * * command_to_run
```

!!! example "Common Cron Schedules"
    ```bash
    # Run ETL every night at 2:00 AM
    0 2 * * * /usr/bin/python3 /home/app/etl_pipeline.py >> /var/log/etl.log 2>&1

    # Generate weekly report every Monday at 8:00 AM
    0 8 * * 1 /usr/bin/python3 /home/app/weekly_report.py

    # Clean up temporary data every hour
    0 * * * * /usr/bin/python3 /home/app/cleanup.py
    ```

### AWS Lambda (Serverless)

**AWS Lambda** runs code without provisioning servers. You pay only for the compute time consumed. For scheduled database tasks, you combine Lambda with **Amazon EventBridge** (formerly CloudWatch Events):

```python
# lambda_function.py
import pymysql
import os

def lambda_handler(event, context):
    """Nightly job: archive orders older than 1 year."""
    conn = pymysql.connect(
        host=os.environ["DB_HOST"],
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASS"],
        database=os.environ["DB_NAME"]
    )

    with conn.cursor() as cursor:
        cursor.execute("""
            INSERT INTO orders_archive
            SELECT * FROM orders
            WHERE order_date < DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
        """)
        cursor.execute("""
            DELETE FROM orders
            WHERE order_date < DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
        """)
    conn.commit()
    conn.close()

    return {"statusCode": 200, "body": "Archive complete"}
```

| Feature | Cron Job | AWS Lambda |
|---------|----------|------------|
| **Infrastructure** | Requires a server running 24/7 | No server to manage |
| **Cost** | Server cost even when idle | Pay per invocation (often pennies) |
| **Timeout** | No limit | 15-minute maximum |
| **Setup** | Edit crontab on the server | AWS Console, CLI, or Terraform |
| **Monitoring** | You build it (logs, alerts) | Built-in CloudWatch metrics |

## 8.8 Cloud Cost Awareness

### Why Cost Matters

Cloud databases bill by the hour, by the GB, and by the request. Without awareness, costs can escalate rapidly. As a data professional, understanding cost drivers is as important as understanding SQL.

### Key Cost Drivers for RDS

| Cost Component | What Drives It | How to Optimize |
|----------------|---------------|-----------------|
| **Instance hours** | Instance class and running time | Right-size; stop dev instances when not in use |
| **Storage** | Allocated GB (not used GB) | Start small, enable auto-scaling |
| **I/O requests** | Number of read/write operations | Optimize queries, use indexes |
| **Data transfer** | Data leaving AWS (egress) | Keep application in the same region |
| **Backups** | Storage beyond free allocation | Reduce retention period if acceptable |

!!! warning "Stopping vs Terminating"
    - **Stop** an RDS instance: It pauses (no compute charges) but storage charges continue. The instance auto-restarts after 7 days.
    - **Delete** an RDS instance: Permanently removes it. Take a final snapshot first.
    - A common mistake: forgetting to stop a development instance over a weekend or holiday.

### Practical Cost Tips

1. **Use the Free Tier** for learning and development (db.t3.micro, 20 GB storage)
2. **Set billing alarms** in AWS to alert you before costs exceed a threshold
3. **Use Reserved Instances** for production workloads with predictable usage (up to 60% savings)
4. **Right-size regularly**: Monitor CPU and memory utilization; downgrade if consistently underused
5. **Schedule start/stop** for development databases that only need to run during business hours

## 8.9 Advanced: Connection Pooling and Read Replicas

### Connection Pooling

Every database connection consumes memory and CPU on the database server. Opening and closing connections for each request is wasteful. **Connection pooling** maintains a pool of reusable connections:

```python
from sqlalchemy import create_engine

# Create an engine with connection pooling
engine = create_engine(
    "mysql+pymysql://admin:pass@mydb.rds.amazonaws.com:3306/company_db",
    pool_size=10,          # Maintain 10 connections
    max_overflow=20,       # Allow up to 20 additional connections under load
    pool_recycle=3600      # Recycle connections after 1 hour
)
```

Without pooling, an application serving 100 concurrent users opens 100 connections. With pooling, those 100 users share 10-30 connections, dramatically reducing database load.

### Read Replicas

A **read replica** is a read-only copy of your primary database that stays in sync through asynchronous replication. Use cases include:

- **Offload read traffic**: Route analytics queries and reporting dashboards to the replica
- **Geographic distribution**: Place replicas closer to users in different regions
- **Backup source**: Run backups against the replica instead of the primary

```
Primary (read/write)  ──replication──>  Read Replica (read-only)
       ↑                                       ↑
  Application writes                   Analytics / Reporting
```

!!! note "Deepened in BADM 558"
    Connection pooling strategies, replica lag management, and multi-region architectures are covered in depth in BADM 558 (Advanced Data Infrastructure). For now, understand that these tools exist and why they matter for scaling.

## Key Takeaways

1. **Cloud databases reduce operational burden** by offloading patching, backups, and hardware management to the provider
2. **Security groups are your first line of defense** for controlling network access to your database; never expose a database to the public internet
3. **Indexes dramatically improve read performance** but slow down writes; add them based on evidence from EXPLAIN plans, not guesswork
4. **EXPLAIN is the single most important tool** for diagnosing query performance; learn to read its output fluently
5. **Composite index column order matters** because of the leftmost prefix rule; equality columns first, then range columns
6. **Automate recurring tasks** with cron for simple schedules or Lambda for serverless, event-driven execution
7. **Cloud cost awareness is a professional skill**; right-size instances, stop unused resources, and set billing alarms

## Review Questions

1. A startup is deciding between running MySQL on an EC2 instance they manage versus using AWS RDS. What are three specific benefits RDS provides, and what is one trade-off they accept?
2. You run `EXPLAIN` on a query and see `type: ALL` and `rows: 2000000`. What does this tell you, and what is your next step?
3. Given the composite index `CREATE INDEX idx_abc ON orders (customer_id, order_date, total)`, which of the following queries can use this index? Explain why or why not for each: (a) `WHERE customer_id = 5`, (b) `WHERE order_date = '2026-01-01'`, (c) `WHERE customer_id = 5 AND total > 100`.
4. Why is it dangerous to set an RDS security group's inbound rule source to `0.0.0.0/0` on port 3306?
5. A data engineer schedules a Python ETL script using cron (`0 3 * * *`) but it fails silently. What two practices would help them detect and debug the failure?

## Practical Exercise

**Scenario**: You are a data analyst at a mid-size e-commerce company. Your team has migrated the production database to AWS RDS (MySQL). The `orders` table has 2 million rows and the following structure:

```sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    order_date DATE NOT NULL,
    status ENUM('pending', 'shipped', 'delivered', 'cancelled'),
    total DECIMAL(10, 2),
    shipping_city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Complete the following tasks:

1. **Connect**: Write a Python script using SQLAlchemy that connects to the RDS instance using environment variables for credentials.

2. **Diagnose**: The following query is slow. Use `EXPLAIN` to analyze it, then create an appropriate index:
    ```sql
    SELECT customer_id, COUNT(*) AS order_count, SUM(total) AS lifetime_value
    FROM orders
    WHERE status = 'delivered' AND order_date >= '2025-01-01'
    GROUP BY customer_id
    ORDER BY lifetime_value DESC
    LIMIT 20;
    ```

3. **Automate**: Write a cron expression that runs a Python cleanup script every Sunday at 4:00 AM, redirecting output to a log file.

4. **Cost check**: Your RDS instance is a db.r6g.large (16 GB RAM) but CloudWatch shows average memory utilization at 12%. What action would you recommend and why?

## Next Steps

In the final week, we will cover data quality, governance, and the professional responsibilities that come with managing an organization's data assets.

---

*Corresponds to Week 7 of BADM 554 — Cloud Databases & Optimization*
