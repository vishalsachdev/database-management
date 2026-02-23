# Chapter 5: Python & pandas for Data

## Learning Objectives

After completing this chapter, you will be able to:

- Write basic Python code using variables, lists, dictionaries, and functions
- Use Jupyter Notebooks and Google Colab as interactive data workspaces
- Create and manipulate pandas Series and DataFrames
- Read CSV files and select data using loc and iloc
- Filter, group, and merge DataFrames for business analysis
- Handle missing data and convert data types in pandas
- Translate familiar SQL operations into equivalent pandas code

## 5.1 Why Python for Data?

In Chapters 3 and 4, you learned SQL for querying databases. SQL is powerful for retrieving and aggregating data, but real-world analysis often requires more: cleaning messy data, building visualizations, running statistical models, and automating repetitive tasks. That is where Python comes in.

**Python** is a general-purpose programming language that has become the dominant tool for data science and analytics. You do not need to become a software engineer to use it effectively. In this chapter, we cover just enough Python to work with data using the **pandas** library.

### Python in the Business World

| Use Case | How Python Helps |
|----------|-----------------|
| **Data Cleaning** | Fix inconsistent formats, handle missing values, merge sources |
| **Analysis & Reporting** | Summarize data, compute metrics, automate recurring reports |
| **Visualization** | Create charts and dashboards with matplotlib, seaborn, Plotly |
| **Machine Learning** | Build predictive models with scikit-learn, TensorFlow |
| **Automation** | Schedule data pipelines, send alerts, update dashboards |

!!! tip "You Already Know the Concepts"
    If you can write a SQL query, you already understand filtering, grouping, and joining. Python and pandas use the same logic with different syntax.

## 5.2 Just Enough Python

This section covers the minimum Python you need to work with data. We are not teaching software engineering; we are teaching data manipulation.

### Variables and Data Types

A **variable** stores a value so you can use it later. Python figures out the type automatically.

```python
# Strings — text values
company_name = "Acme Corp"
region = 'Midwest'

# Integers — whole numbers
num_employees = 150
year = 2026

# Floats — decimal numbers
revenue = 2450000.75
growth_rate = 0.12

# Booleans — True or False
is_active = True
```

!!! note "No Semicolons, No Type Declarations"
    Unlike SQL or Java, Python does not require semicolons at the end of lines or explicit type declarations. Indentation (spaces) matters instead of curly braces.

### Lists

A **list** is an ordered collection of items. Think of it as a single column of data.

```python
# A list of quarterly revenue figures
quarterly_revenue = [1200000, 1350000, 1100000, 1500000]

# Access by position (0-indexed)
q1 = quarterly_revenue[0]   # 1200000
q4 = quarterly_revenue[-1]  # 1500000 (last item)

# Add an item
quarterly_revenue.append(1600000)

# Length of a list
len(quarterly_revenue)  # 5
```

### Dictionaries

A **dictionary** stores key-value pairs. Think of it as a single row of named data.

```python
# A customer record
customer = {
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "region": "Midwest",
    "lifetime_value": 12500.00
}

# Access by key
customer["name"]            # "Alice Johnson"
customer["lifetime_value"]  # 12500.00

# Add a new field
customer["segment"] = "Gold"
```

!!! example "Lists vs Dictionaries"
    - **List** = ordered items accessed by position: `revenue[0]`
    - **Dictionary** = named items accessed by key: `customer["name"]`
    - A table is essentially a list of dictionaries (rows of named columns)

### Functions

A **function** is a reusable block of code. You have already used functions in SQL (`COUNT()`, `SUM()`). Python functions work the same way.

```python
# Define a function
def calculate_margin(revenue, cost):
    """Calculate profit margin as a percentage."""
    margin = (revenue - cost) / revenue * 100
    return round(margin, 2)

# Call the function
calculate_margin(500000, 350000)  # 30.0
calculate_margin(120000, 108000)  # 10.0
```

### Loops and Comprehensions

Loops let you repeat an operation for every item in a collection.

```python
# A for loop — process each item
regions = ["East", "West", "Central"]
for region in regions:
    print(f"Processing {region} region...")

# List comprehension — create a new list from an old one
prices = [29.99, 49.99, 9.99, 79.99]
discounted = [price * 0.9 for price in prices]
# [26.991, 44.991, 8.991, 71.991]
```

!!! tip "Comprehensions Replace Simple Loops"
    List comprehensions are a compact way to transform data. You will see them frequently in pandas code and data pipelines.

### File I/O

Python can read and write files directly, though pandas usually handles this for data work.

```python
# Read a text file
with open("notes.txt", "r") as f:
    contents = f.read()

# Write to a text file
with open("output.txt", "w") as f:
    f.write("Report generated successfully.\n")
```

## 5.3 Jupyter Notebooks and Google Colab

### What is a Jupyter Notebook?

A **Jupyter Notebook** is an interactive document that combines code, output, and explanations in a single file. Instead of writing a script and running it all at once, you work in **cells** that you execute one at a time.

This is ideal for data analysis because you can:

- Load data, inspect it, then decide what to do next
- See results immediately after each step
- Mix code cells with markdown cells for documentation
- Share your analysis as a readable document

### Google Colab

**Google Colab** is a free, cloud-based Jupyter environment. You do not need to install anything. Open a browser, go to [colab.research.google.com](https://colab.research.google.com), and start coding.

| Feature | Jupyter (Local) | Google Colab |
|---------|-----------------|--------------|
| **Setup** | Install Python + Jupyter | None (browser only) |
| **Cost** | Free | Free (paid tiers for more GPU) |
| **Collaboration** | Manual sharing | Google Drive sharing |
| **Libraries** | Install yourself | pandas, numpy, etc. pre-installed |
| **Best For** | Production work, large datasets | Learning, quick analysis, sharing |

!!! note "We Use Google Colab in This Course"
    All assignments and labs use Google Colab. You only need a Google account and a web browser.

### Notebook Workflow

A typical data analysis notebook follows this pattern:

```python
# Cell 1: Import libraries
import pandas as pd

# Cell 2: Load data
df = pd.read_csv("sales_data.csv")

# Cell 3: Inspect data
df.head()

# Cell 4: Analyze
df.groupby("region")["revenue"].sum()

# Cell 5: Visualize (covered in later chapters)
```

## 5.4 Introduction to pandas

### What is pandas?

**pandas** is a Python library for data manipulation and analysis. It provides two core data structures:

- **Series**: A single column of data (like a list with labels)
- **DataFrame**: A table of data (like a spreadsheet or SQL table)

pandas is to Python what Excel is to business users, but far more powerful and reproducible.

```python
import pandas as pd  # Standard convention: import as "pd"
```

### Series

A **Series** is a one-dimensional labeled array. Think of it as a single column from a table.

```python
# Create a Series
revenue = pd.Series([120000, 150000, 98000, 175000],
                     index=["Q1", "Q2", "Q3", "Q4"],
                     name="Revenue")

# Access values
revenue["Q1"]       # 120000
revenue.mean()      # 135750.0
revenue.max()       # 175000
```

### DataFrame

A **DataFrame** is a two-dimensional table with labeled rows and columns. This is the data structure you will use 90% of the time.

```python
# Create a DataFrame from a dictionary
data = {
    "product": ["Laptop", "Mouse", "Monitor", "Keyboard"],
    "price": [999, 25, 350, 75],
    "units_sold": [120, 800, 200, 600]
}

df = pd.DataFrame(data)
```

This produces:

```
    product  price  units_sold
0    Laptop    999         120
1     Mouse     25         800
2   Monitor    350         200
3  Keyboard     75         600
```

!!! example "DataFrame = SQL Table = Excel Sheet"
    All three represent the same concept: rows and columns of structured data. The difference is how you interact with them:

    - **Excel**: Click and drag
    - **SQL**: Write queries against a database
    - **pandas**: Write Python code in a notebook

## 5.5 Reading Data into pandas

### Reading CSV Files

CSV (Comma-Separated Values) files are the most common format for sharing tabular data.

```python
# Read a CSV file
df = pd.read_csv("sales_data.csv")

# Read from a URL (works in Colab)
url = "https://example.com/data/customers.csv"
df = pd.read_csv(url)
```

### Inspecting Your Data

After loading data, always inspect it before doing anything else.

```python
df.head()          # First 5 rows
df.tail(3)         # Last 3 rows
df.shape           # (num_rows, num_columns)
df.columns         # Column names
df.dtypes          # Data type of each column
df.info()          # Summary: columns, types, non-null counts
df.describe()      # Statistics for numeric columns
```

!!! warning "Always Inspect Before You Analyze"
    Skipping this step is how you end up with wrong results. Check for unexpected column names, wrong data types (numbers stored as strings), and missing values before writing any analysis code.

## 5.6 Selecting Data: loc and iloc

pandas provides two main ways to select data from a DataFrame.

### Selecting Columns

```python
# Single column (returns a Series)
df["product"]

# Multiple columns (returns a DataFrame)
df[["product", "price"]]
```

### loc — Selection by Label

Use **loc** when you know the row labels or column names.

```python
# Single row by label (if index is set)
df.loc[0]

# Rows 0-2, specific columns
df.loc[0:2, ["product", "price"]]

# All rows, specific columns
df.loc[:, ["product", "units_sold"]]
```

### iloc — Selection by Position

Use **iloc** when you want rows/columns by numeric position (0-indexed).

```python
# First row
df.iloc[0]

# First 3 rows, first 2 columns
df.iloc[0:3, 0:2]

# Last row
df.iloc[-1]
```

| Method | Selects By | Example | Returns |
|--------|-----------|---------|---------|
| `df["col"]` | Column name | `df["price"]` | Series |
| `df[["a","b"]]` | Column names | `df[["price","units_sold"]]` | DataFrame |
| `df.loc[]` | Labels | `df.loc[0:2, "price"]` | By name |
| `df.iloc[]` | Positions | `df.iloc[0:3, 1]` | By number |

!!! tip "When in Doubt, Use loc"
    `loc` is explicit about what you are selecting by name. `iloc` is useful for quick positional slicing, but `loc` is safer for production code.

## 5.7 Filtering DataFrames

Filtering in pandas is conceptually identical to SQL's WHERE clause.

```python
# SQL: SELECT * FROM sales WHERE price > 100
df[df["price"] > 100]

# SQL: SELECT * FROM sales WHERE region = 'East'
df[df["region"] == "East"]

# SQL: SELECT * FROM sales WHERE price > 100 AND region = 'East'
df[(df["price"] > 100) & (df["region"] == "East")]

# SQL: SELECT * FROM sales WHERE region IN ('East', 'West')
df[df["region"].isin(["East", "West"])]
```

!!! warning "Use & and | Instead of 'and' and 'or'"
    When combining conditions in pandas, use `&` (and) and `|` (or), not Python's `and` / `or` keywords. Always wrap each condition in parentheses.

    ```python
    # WRONG:
    df[df["price"] > 100 and df["region"] == "East"]

    # CORRECT:
    df[(df["price"] > 100) & (df["region"] == "East")]
    ```

## 5.8 GroupBy: Aggregating Data

GroupBy in pandas works exactly like SQL's GROUP BY. It splits data into groups, applies a function to each group, and combines the results.

```python
# SQL: SELECT region, SUM(revenue) FROM sales GROUP BY region
df.groupby("region")["revenue"].sum()

# SQL: SELECT region, COUNT(*), AVG(revenue) FROM sales GROUP BY region
df.groupby("region")["revenue"].agg(["count", "mean", "sum"])

# Group by multiple columns
df.groupby(["region", "product_category"])["revenue"].sum()
```

!!! example "GroupBy in Action"
    Suppose you have monthly sales data for a retail company:

    ```python
    # Total revenue by region
    df.groupby("region")["revenue"].sum()
    # East      450000
    # Central   320000
    # West      510000

    # Average order value by customer segment
    df.groupby("segment")["order_value"].mean()
    # Gold        285.50
    # Silver      142.30
    # Bronze       68.90
    ```

## 5.9 Merging and Joining DataFrames

In SQL, you use JOIN to combine tables. In pandas, you use `merge()`.

```python
# Two DataFrames
orders = pd.DataFrame({
    "order_id": [1, 2, 3, 4],
    "customer_id": [101, 102, 101, 103],
    "amount": [250, 150, 300, 450]
})

customers = pd.DataFrame({
    "customer_id": [101, 102, 103],
    "name": ["Alice", "Bob", "Carol"],
    "region": ["East", "West", "East"]
})

# SQL: SELECT * FROM orders JOIN customers ON orders.customer_id = customers.customer_id
merged = pd.merge(orders, customers, on="customer_id")
```

Result:

```
   order_id  customer_id  amount   name region
0         1          101     250  Alice   East
1         3          101     300  Alice   East
2         2          102     150    Bob   West
3         4          103     450  Carol   East
```

### Types of Merges

```python
# Inner join (default) — only matching rows
pd.merge(orders, customers, on="customer_id", how="inner")

# Left join — all rows from left table
pd.merge(orders, customers, on="customer_id", how="left")

# Right join — all rows from right table
pd.merge(orders, customers, on="customer_id", how="right")

# Outer join — all rows from both tables
pd.merge(orders, customers, on="customer_id", how="outer")
```

!!! note "Same Logic as SQL JOINs"
    If you understood INNER JOIN, LEFT JOIN, and FULL OUTER JOIN in Chapter 4, you already understand pandas merges. The only difference is syntax.

## 5.10 Data Types and Conversion

pandas assigns data types automatically when reading files, but sometimes it gets them wrong.

```python
# Check current types
df.dtypes

# Common issue: numeric column read as string
df["zip_code"].dtype   # object (means string)
df["revenue"].dtype    # object (should be float!)

# Convert types
df["revenue"] = pd.to_numeric(df["revenue"], errors="coerce")
df["order_date"] = pd.to_datetime(df["order_date"])
df["is_active"] = df["is_active"].astype(bool)
```

| pandas dtype | Python Type | SQL Equivalent | Example |
|-------------|-------------|---------------|---------|
| `int64` | int | INT | 42, 1000 |
| `float64` | float | DECIMAL, FLOAT | 3.14, 99.99 |
| `object` | str | VARCHAR, TEXT | "Alice", "East" |
| `bool` | bool | BOOLEAN | True, False |
| `datetime64` | datetime | DATE, DATETIME | 2026-01-15 |

!!! warning "The 'object' Trap"
    When `df.dtypes` shows `object`, it almost always means string. If you expect a numeric column and see `object`, the column likely has non-numeric values (like "$1,200" or "N/A") that prevented automatic conversion. Clean those values first, then convert.

## 5.11 Handling Missing Data

Real-world datasets are messy. Missing values are the most common problem you will encounter.

### Detecting Missing Data

```python
# Count missing values per column
df.isnull().sum()

# Percentage of missing values
df.isnull().mean() * 100

# Show rows with any missing values
df[df.isnull().any(axis=1)]
```

### Strategies for Missing Data

```python
# Drop rows with any missing values
df_clean = df.dropna()

# Drop rows only if specific columns are missing
df_clean = df.dropna(subset=["revenue", "customer_id"])

# Fill missing values with a constant
df["region"] = df["region"].fillna("Unknown")

# Fill with the column mean (numeric columns)
df["revenue"] = df["revenue"].fillna(df["revenue"].mean())

# Fill with the column median (better for skewed data)
df["salary"] = df["salary"].fillna(df["salary"].median())

# Forward fill (use previous row's value)
df["status"] = df["status"].fillna(method="ffill")
```

!!! tip "Choosing a Strategy"
    - **Drop rows** when very few rows are missing and your dataset is large
    - **Fill with mean/median** for numeric columns where missing is random
    - **Fill with a category** (like "Unknown") for text columns
    - **Never silently ignore** missing data — it will distort your results

## 5.12 pandas vs SQL: A Comparison

You now know two ways to work with tabular data. This table maps common SQL operations to their pandas equivalents.

| Operation | SQL | pandas |
|-----------|-----|--------|
| Select columns | `SELECT name, price FROM products` | `df[["name", "price"]]` |
| Filter rows | `WHERE price > 100` | `df[df["price"] > 100]` |
| Sort | `ORDER BY price DESC` | `df.sort_values("price", ascending=False)` |
| Limit rows | `LIMIT 10` | `df.head(10)` |
| Count | `SELECT COUNT(*) FROM products` | `len(df)` or `df.shape[0]` |
| Unique values | `SELECT DISTINCT region FROM sales` | `df["region"].unique()` |
| Aggregation | `SELECT region, SUM(revenue) FROM sales GROUP BY region` | `df.groupby("region")["revenue"].sum()` |
| Join | `SELECT * FROM orders JOIN customers ON ...` | `pd.merge(orders, customers, on="customer_id")` |
| NULL check | `WHERE email IS NULL` | `df[df["email"].isnull()]` |
| Alias | `SELECT price * 0.9 AS discounted` | `df["discounted"] = df["price"] * 0.9` |

!!! note "When to Use Which"
    - **SQL**: Data lives in a database, you need to extract specific subsets, or the dataset is very large (millions+ rows)
    - **pandas**: Data is in files (CSV, Excel), you need to clean or reshape it, or you want to combine analysis with visualization and modeling
    - **Both**: Most real-world workflows start with SQL to extract data, then switch to pandas for analysis

## Key Takeaways

1. **Python is a tool, not a destination** — you need just enough to work with pandas and data libraries effectively
2. **Jupyter Notebooks are your data workspace** — they let you explore data interactively, one step at a time
3. **The DataFrame is the core abstraction** — it is the pandas equivalent of a SQL table or Excel spreadsheet
4. **pandas operations mirror SQL** — filtering, grouping, joining, and aggregation work the same conceptually
5. **Always inspect your data first** — use `head()`, `info()`, `dtypes`, and `isnull().sum()` before any analysis
6. **Missing data must be handled explicitly** — ignoring it leads to wrong results and broken pipelines
7. **SQL and pandas are complementary** — use SQL to get data out of databases, pandas to clean and analyze it

## Review Questions

1. What is the difference between a pandas Series and a DataFrame? How does each relate to a SQL table?
2. When would you use `loc` versus `iloc` to select data from a DataFrame?
3. Write pandas code to filter a DataFrame for rows where the `region` column is "East" and `revenue` is greater than 50000.
4. Explain three strategies for handling missing data in pandas, and when you would choose each one.
5. Translate this SQL query into pandas code: `SELECT department, AVG(salary) FROM employees WHERE is_active = TRUE GROUP BY department ORDER BY AVG(salary) DESC`

## Practical Exercise

You have a CSV file with monthly sales data. Load it into a Colab notebook and perform the following analysis:

```
sales_data.csv
+----------+------------+--------+---------+--------+
| order_id | order_date | region | product | amount |
+----------+------------+--------+---------+--------+
| 1001     | 2026-01-15 | East   | Laptop  | 999    |
| 1002     | 2026-01-22 | West   | Mouse   | 25     |
| 1003     | 2026-02-03 | East   | Monitor | 350    |
| 1004     | 2026-02-14 | Central| Laptop  | 999    |
| 1005     | 2026-03-01 | West   | NULL    | 75     |
| 1006     | 2026-03-10 | East   | Mouse   | 25     |
| ...      | ...        | ...    | ...     | ...    |
+----------+------------+--------+---------+--------+
```

Complete these tasks using pandas:

1. Load the CSV and inspect it with `head()`, `info()`, and `isnull().sum()`
2. Find all orders from the "East" region with an amount greater than 100
3. Calculate total revenue by region
4. Calculate the average order amount by product
5. Identify and handle any missing values in the product column
6. Merge this data with a `regions.csv` file that contains region manager names

## Next Steps

In [Chapter 6](06-etl-pipelines.md), we'll learn how to build ETL (Extract, Transform, Load) pipelines that combine SQL and pandas to move data from source systems into analytics-ready formats.

---

*Corresponds to Week 4 of BADM 554 — Python & pandas*
