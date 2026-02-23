# Chapter 6: ETL Pipelines

## Learning Objectives

After completing this chapter, you will be able to:

- Explain the ETL pattern and why it matters for data-driven organizations
- Extract data from CSV files, databases, and APIs using Python
- Transform data using pandas for cleaning, validation, and standardization
- Load data into a database using SQLAlchemy's `create_engine` and `to_sql`
- Implement error handling with try-except blocks in data pipelines
- Use Python's logging module to track pipeline execution
- Design a complete ETL pipeline script with a modular architecture
- Apply retry logic and idempotent operations for production reliability

## 6.1 What is ETL?

**ETL** stands for **Extract, Transform, Load** -- the three phases of moving data from source systems into a target database or data warehouse.

```
┌──────────┐     ┌──────────────┐     ┌──────────┐
│ EXTRACT  │────▶│  TRANSFORM   │────▶│   LOAD   │
│          │     │              │     │          │
│ - CSV    │     │ - Clean      │     │ - Insert │
│ - API    │     │ - Validate   │     │ - Upsert │
│ - Database│    │ - Standardize│     │ - Replace│
└──────────┘     └──────────────┘     └──────────┘
```

| Phase | Purpose | Tools |
|-------|---------|-------|
| **Extract** | Read raw data from sources | `pd.read_csv`, `requests`, `pd.read_sql` |
| **Transform** | Clean, validate, and reshape data | `pandas` (dropna, fillna, merge, apply) |
| **Load** | Write processed data to a target | `SQLAlchemy`, `to_sql` |

Business data rarely lives in a single, clean source. ETL pipelines bring multiple sources together into one reliable dataset for analysis.

!!! tip "ETL vs ELT"
    In modern cloud warehouses (Snowflake, BigQuery), you may encounter **ELT** -- load raw data first, then transform inside the warehouse with SQL. We focus on ETL because it gives you full control over transformation in Python.

## 6.2 Extract Phase

The extract phase reads data from source systems **without modifying the source**.

### CSV Data Sources

```python
import pandas as pd

orders = pd.read_csv(
    "data/orders.csv",
    dtype={"order_id": str, "zip_code": str},  # Prevent leading-zero loss
    parse_dates=["order_date"],
    na_values=["N/A", "NULL", ""],
)
```

!!! warning "Leading Zeros"
    Zip codes like `07101` lose their leading zeros if pandas reads them as integers. Always pass `dtype={"column": str}` for columns that should remain text.

### Database Sources

```python
from sqlalchemy import create_engine

source_engine = create_engine("mysql+pymysql://user:pass@localhost/source_db")
products = pd.read_sql(
    "SELECT product_id, name, price FROM product WHERE active = 1",
    source_engine,
)
```

### API Data Sources

```python
import requests

response = requests.get(
    "https://api.example.com/v1/transactions",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    params={"start_date": "2026-01-01", "limit": 1000},
)
response.raise_for_status()
transactions = pd.DataFrame(response.json()["results"])
```

| Source | Pros | Cons | Best For |
|--------|------|------|----------|
| **CSV** | Simple, portable | No schema enforcement | One-time imports, data sharing |
| **Database** | Structured, typed, SQL filtering | Requires credentials | Recurring extracts |
| **API** | Real-time, vendor-maintained | Rate limits, pagination | Third-party services |

## 6.3 Transform Phase

### Data Cleaning

```python
# Missing values
df = df.dropna(subset=["customer_id", "email"])
df["phone"] = df["phone"].fillna("UNKNOWN")

# Duplicates
df = df.drop_duplicates(subset=["order_id"], keep="last")

# Data types
df["amount"] = df["amount"].astype(float)
df["order_date"] = pd.to_datetime(df["order_date"])
```

### Data Standardization

```python
df["state"] = df["state"].str.upper().str.strip()
df["email"] = df["email"].str.lower().str.strip()
df["phone"] = df["phone"].str.replace(r"[^\d]", "", regex=True)
```

!!! example "Why Standardization Matters"
    Joining customer records where one system stores "IL" and another "Illinois" will miss matches. Always standardize **before** loading.

### Data Validation

```python
# Validate email format
valid_email = df["email"].str.contains(r"^[\w.+-]+@[\w-]+\.[\w.]+$", na=False)
df = df[valid_email]

# Validate numeric ranges
df = df[df["price"] > 0]
df = df[df["quantity"] >= 1]
```

### A Complete Transform Function

```python
def transform_orders(raw_orders: pd.DataFrame) -> pd.DataFrame:
    """Clean, validate, and standardize raw order data."""
    df = raw_orders.copy()
    df = df.dropna(subset=["order_id", "customer_id", "amount"])
    df = df.drop_duplicates(subset=["order_id"], keep="last")
    df["amount"] = df["amount"].astype(float)
    df["order_date"] = pd.to_datetime(df["order_date"])
    df["status"] = df["status"].str.lower().str.strip()
    df = df[df["amount"] > 0]
    return df.reset_index(drop=True)
```

## 6.4 Load Phase

### SQLAlchemy and create_engine

SQLAlchemy provides a uniform interface to many databases. The **engine** manages connections.

```python
from sqlalchemy import create_engine

# SQLite (file-based, no server needed)
engine = create_engine("sqlite:///warehouse.db")

# MySQL
engine = create_engine("mysql+pymysql://user:password@localhost:3306/warehouse")
```

Connection string pattern: `dialect+driver://username:password@host:port/database`

### DataFrame to SQL

```python
df.to_sql("customers", engine, index=False, if_exists="replace")
```

| `if_exists` | Behavior | Use Case |
|-------------|----------|----------|
| `"fail"` | Raise an error (default) | First-time creation |
| `"replace"` | Drop and recreate the table | Full refresh pipelines |
| `"append"` | Add rows to existing table | Incremental pipelines |

!!! warning "replace Drops the Table"
    `if_exists="replace"` **deletes all existing data** before writing. Fine for development, but use `"append"` with deduplication for production incremental loads.

### SQL to DataFrame

```python
customers = pd.read_sql("SELECT * FROM customers", engine)
recent = pd.read_sql(
    "SELECT * FROM orders WHERE order_date >= :start",
    engine,
    params={"start": "2026-01-01"},
)
```

## 6.5 Error Handling with try-except

ETL pipelines interact with files, networks, and databases -- all of which can fail.

```python
from sqlalchemy.exc import OperationalError, IntegrityError

try:
    df.to_sql("customers", engine, index=False, if_exists="append")
except IntegrityError as e:
    logger.error(f"Duplicate key or constraint violation: {e}")
except OperationalError as e:
    logger.error(f"Database connection failed: {e}")
```

!!! warning "Never Use Bare except"
    A bare `except:` catches **everything**, including keyboard interrupts. Always catch specific exceptions.

    ```python
    # BAD                          # GOOD
    try:                           try:
        do_something()                 do_something()
    except:                        except ValueError as e:
        pass                           logger.error(f"Bad value: {e}")
    ```

Use `else` for success-only code and `finally` for cleanup:

```python
try:
    df = pd.read_csv(filepath)
except FileNotFoundError:
    logger.error(f"File not found: {filepath}")
    raise
else:
    logger.info(f"Read {len(df)} rows from {filepath}")
finally:
    logger.info("Extract phase complete")
```

## 6.6 Logging

Print statements are fine for debugging, but production pipelines need structured **logging**.

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("pipeline.log"), logging.StreamHandler()],
)
logger = logging.getLogger(__name__)
```

| Level | When to Use |
|-------|-------------|
| `DEBUG` | Detailed diagnostic info |
| `INFO` | Normal operations (phase start/end, row counts) |
| `WARNING` | Unexpected but non-fatal (e.g., "3 rows had missing emails") |
| `ERROR` | Something failed |
| `CRITICAL` | Pipeline cannot continue |

!!! tip "Log Counts at Every Phase"
    Always log row counts: "Extracted 1,500 rows", "After cleaning: 1,487 rows", "Loaded 1,487 rows". These counts are the fastest way to find where data was lost.

## 6.7 Pipeline Architecture

A well-structured pipeline separates each phase into its own function and orchestrates them from a single entry point.

```python
import logging
import pandas as pd
from sqlalchemy import create_engine

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

def extract_from_csv(filepath: str) -> pd.DataFrame:
    logger.info(f"Extracting from {filepath}")
    df = pd.read_csv(filepath)
    logger.info(f"Extracted {len(df)} rows")
    return df

def transform_customers(df: pd.DataFrame) -> pd.DataFrame:
    logger.info("Starting transform")
    initial = len(df)
    df = df.dropna(subset=["customer_id", "email"]).drop_duplicates(subset=["customer_id"])
    df["email"] = df["email"].str.lower().str.strip()
    df["state"] = df["state"].str.upper().str.strip()
    df = df[df["email"].str.contains("@", na=False)]
    logger.info(f"Transform: {initial} -> {len(df)} rows")
    return df.reset_index(drop=True)

def load_to_database(df: pd.DataFrame, table: str, engine) -> None:
    logger.info(f"Loading {len(df)} rows into '{table}'")
    df.to_sql(table, engine, index=False, if_exists="replace")
    logger.info(f"Load complete: '{table}'")

def run_pipeline():
    logger.info("=== Pipeline started ===")
    engine = create_engine("sqlite:///warehouse.db")
    try:
        raw = extract_from_csv("data/customers.csv")
        clean = transform_customers(raw)
        load_to_database(clean, "customers", engine)
        logger.info("=== Pipeline completed successfully ===")
    except Exception as e:
        logger.critical(f"Pipeline failed: {e}")
        raise

if __name__ == "__main__":
    run_pipeline()
```

!!! example "Sample Log Output"
    ```
    2026-09-15 09:00:01 - INFO - === Pipeline started ===
    2026-09-15 09:00:01 - INFO - Extracting from data/customers.csv
    2026-09-15 09:00:02 - INFO - Extracted 2,340 rows
    2026-09-15 09:00:02 - INFO - Transform: 2,340 -> 2,298 rows
    2026-09-15 09:00:03 - INFO - Loading 2,298 rows into 'customers'
    2026-09-15 09:00:03 - INFO - Load complete: 'customers'
    2026-09-15 09:00:03 - INFO - === Pipeline completed successfully ===
    ```

## 6.8 Retry Logic and Idempotent Operations

### Retry Logic

When network calls fail, they often work on the next attempt. A retry pattern with **exponential backoff** automates this.

```python
import time

def extract_with_retry(url: str, max_retries: int = 3) -> pd.DataFrame:
    for attempt in range(1, max_retries + 1):
        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            return pd.DataFrame(response.json()["results"])
        except requests.exceptions.RequestException as e:
            logger.warning(f"Attempt {attempt}/{max_retries} failed: {e}")
            if attempt == max_retries:
                raise
            time.sleep(2 ** attempt)  # 2s, 4s, 8s
```

### Idempotent Operations

An operation is **idempotent** if running it multiple times produces the same result as running it once. If a pipeline fails halfway and you re-run it, you should not end up with duplicate data.

| Strategy | How It Works | Example |
|----------|-------------|---------|
| **Replace** | Delete all, then insert | `to_sql(if_exists="replace")` |
| **Upsert** | Insert new, update existing | `INSERT ... ON DUPLICATE KEY UPDATE` |
| **Deduplicate** | Append, then remove dupes | SQL `DELETE` after load |

!!! tip "Design for Re-Runs"
    When building any pipeline, ask: "What happens if I run this twice?" If the answer is "duplicate rows," redesign the load step to be idempotent.

## Key Takeaways

1. **ETL is a three-phase pattern** -- Extract from sources, Transform with cleaning and validation, Load into a target database
2. **pandas handles extraction and transformation** -- `read_csv`, `read_sql`, and the pandas API cover most ETL needs
3. **SQLAlchemy bridges Python and databases** -- `create_engine` connects, `to_sql` writes, `read_sql` reads
4. **Error handling prevents silent failures** -- use try-except with specific exceptions, never bare `except`
5. **Logging tracks pipeline execution** -- log row counts at every phase to diagnose issues quickly
6. **Modular architecture matters** -- separate E, T, and L into functions; orchestrate from a single entry point
7. **Idempotency makes pipelines safe** -- design loads so running twice gives the same result as running once

## Review Questions

1. What are the three phases of ETL, and what happens in each one?
2. Why should you pass `dtype={"zip_code": str}` when reading a CSV that contains zip codes?
3. Explain the difference between `if_exists="replace"` and `if_exists="append"` in `to_sql`. When would you use each?
4. Why is catching a specific exception (like `FileNotFoundError`) better than using a bare `except:`?
5. What does it mean for a load operation to be idempotent, and why is this important for ETL pipelines?

## Practical Exercise

Build a complete ETL pipeline that processes sales data.

**Setup:** Create `sales_raw.csv`:

```
order_id,customer_email,product,amount,order_date,region
1001,ALICE@EXAMPLE.COM,Widget,25.50,2026-08-01,midwest
1002,bob@example.com,Gadget,-5.00,2026-08-02,EAST
1003,alice@example.com,Widget,25.50,2026-08-01,Midwest
1004,,Gizmo,100.00,2026-08-03,West
1005,carol@example.com,Gadget,75.00,bad_date,south
1006,dave@example.com,Widget,30.00,2026-08-04,Midwest
```

**Tasks:**

1. **Extract**: Read the CSV into a DataFrame
2. **Transform** (`transform_sales` function): drop rows missing `customer_email`, remove duplicate `order_id`s, lowercase emails, title-case regions, convert `order_date` to datetime (coerce errors to NaT then drop), remove rows where `amount <= 0`
3. **Load**: Write cleaned data to a SQLite table `sales` using SQLAlchemy
4. **Verify**: Read the table back with `read_sql` and print it
5. **Log**: Add logging at each phase with row counts

**Expected result:** 3 clean rows (1001, 1003 deduplicated to one, plus 1006) loaded into `sales`.

## Next Steps

In [Chapter 7](07-nosql-apis.md), we'll explore NoSQL databases and how to work with APIs and document-oriented data stores like MongoDB for semi-structured data.

---

*Corresponds to Week 5 of BADM 554 -- ETL Pipelines*
