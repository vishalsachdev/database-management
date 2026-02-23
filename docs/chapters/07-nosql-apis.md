# Chapter 7: NoSQL & APIs

## Learning Objectives

After completing this chapter, you will be able to:

- Explain what REST APIs are and how they work
- Use Python's `requests` library to fetch data from web APIs
- Parse and navigate JSON data structures including nested objects and arrays
- Describe why NoSQL databases exist and when to use them instead of SQL
- Apply the CAP theorem to evaluate database trade-offs
- Perform CRUD operations in MongoDB using `pymongo`
- Implement API security best practices including key management and rate limiting

## 7.1 Introduction to APIs

### What is an API?

An **API (Application Programming Interface)** is a set of rules that allows one software application to communicate with another. When you check the weather on your phone, the app sends a request to a weather service's API, which returns the current conditions as structured data.

For data professionals, APIs are the primary way to acquire data from external sources: social media platforms, financial markets, government databases, SaaS tools, and more.

### REST APIs

**REST (Representational State Transfer)** is the most common API architecture on the web. A REST API exposes data through **endpoints** --- URLs that represent resources.

| Concept | Description | Example |
|---------|-------------|---------|
| **Base URL** | The root address of the API | `https://api.openweathermap.org` |
| **Endpoint** | A specific resource path | `/data/2.5/weather` |
| **Parameters** | Filters or options for the request | `?q=Chicago&units=imperial` |
| **Full URL** | Base + Endpoint + Parameters | `https://api.openweathermap.org/data/2.5/weather?q=Chicago&units=imperial` |

### HTTP Methods

REST APIs use standard HTTP methods to define the type of operation:

| Method | Purpose | Example |
|--------|---------|---------|
| **GET** | Retrieve data | Fetch current weather for Chicago |
| **POST** | Create new data | Submit a new customer record |
| **PUT** | Update existing data (full replace) | Replace a customer's entire profile |
| **PATCH** | Update existing data (partial) | Change only a customer's email |
| **DELETE** | Remove data | Delete a customer record |

In analytics work, you will use **GET** for the vast majority of API calls --- you are reading data, not writing it.

### HTTP Status Codes

Every API response includes a status code that tells you what happened:

| Code | Meaning | What to Do |
|------|---------|------------|
| **200** | OK - Success | Process the returned data |
| **201** | Created | Resource was successfully created |
| **400** | Bad Request | Check your parameters |
| **401** | Unauthorized | Check your API key or credentials |
| **403** | Forbidden | You don't have permission |
| **404** | Not Found | Check the endpoint URL |
| **429** | Too Many Requests | You hit the rate limit - slow down |
| **500** | Internal Server Error | The server has a problem - try again later |

!!! tip "The 2xx/4xx/5xx Pattern"
    Status codes starting with **2** mean success. Codes starting with **4** mean you made an error (bad URL, missing credentials). Codes starting with **5** mean the server has an issue. Memorize this pattern and you can diagnose most API problems quickly.

## 7.2 JSON: The Language of APIs

### What is JSON?

**JSON (JavaScript Object Notation)** is the standard data format for APIs. It is lightweight, human-readable, and maps naturally to Python dictionaries and lists.

### JSON Objects

A JSON object is a collection of key-value pairs enclosed in curly braces:

```json
{
    "name": "Chicago",
    "state": "IL",
    "population": 2697000,
    "is_capital": false
}
```

This maps directly to a Python dictionary:

```python
city = {
    "name": "Chicago",
    "state": "IL",
    "population": 2697000,
    "is_capital": False   # Note: Python uses True/False, JSON uses true/false
}
print(city["name"])       # "Chicago"
```

### JSON Arrays

A JSON array is an ordered list enclosed in square brackets:

```json
["Chicago", "Champaign", "Springfield"]
```

This maps to a Python list:

```python
cities = ["Chicago", "Champaign", "Springfield"]
print(cities[0])  # "Chicago"
```

### Nested JSON

Real API responses are almost always nested --- objects inside objects, arrays inside objects, and so on:

```json
{
    "city": "Chicago",
    "weather": {
        "temperature": 72,
        "description": "partly cloudy",
        "wind": {
            "speed": 12,
            "direction": "NW"
        }
    },
    "forecast": [
        {"day": "Monday", "high": 75, "low": 60},
        {"day": "Tuesday", "high": 68, "low": 55}
    ]
}
```

Navigating nested JSON in Python:

```python
data = response.json()

# Access nested object
wind_speed = data["weather"]["wind"]["speed"]       # 12

# Access item in an array
monday_high = data["forecast"][0]["high"]            # 75

# Loop through array
for day in data["forecast"]:
    print(f"{day['day']}: High {day['high']}°F")
```

!!! warning "KeyError and Safe Access"
    If a key does not exist, Python raises a `KeyError`. Use `.get()` for safe access:

    ```python
    # Risky - crashes if "humidity" key is missing
    humidity = data["weather"]["humidity"]

    # Safe - returns None if key is missing
    humidity = data["weather"].get("humidity")

    # Safe with a default value
    humidity = data["weather"].get("humidity", "N/A")
    ```

## 7.3 Fetching API Data with Python

### The requests Library

Python's `requests` library is the standard tool for making HTTP calls:

```python
import requests

url = "https://api.openweathermap.org/data/2.5/weather"
params = {
    "q": "Champaign,IL,US",
    "appid": "YOUR_API_KEY",
    "units": "imperial"
}

response = requests.get(url, params=params)

print(response.status_code)   # 200
data = response.json()        # Parse JSON into a Python dict
print(data["main"]["temp"])   # Current temperature
```

!!! note "Always Pass Parameters as a Dictionary"
    Using the `params` argument is cleaner and safer than building the URL string yourself. The `requests` library handles URL encoding (spaces, special characters) automatically.

### Checking for Errors

Always check the status code before processing the response:

```python
response = requests.get(url, params=params)

if response.status_code == 200:
    data = response.json()
    print(f"Temperature: {data['main']['temp']}°F")
elif response.status_code == 401:
    print("Invalid API key. Check your credentials.")
elif response.status_code == 429:
    print("Rate limit exceeded. Wait before retrying.")
else:
    print(f"Error: {response.status_code}")
```

### From API to DataFrame

A common pattern: fetch data from an API, then load it into pandas for analysis:

```python
import requests
import pandas as pd

# Fetch a list of universities from a public API
url = "http://universities.hipolabs.com/search"
params = {"country": "United States", "name": "Illinois"}

response = requests.get(url, params=params)
data = response.json()  # Returns a list of dictionaries

# Convert to DataFrame
df = pd.DataFrame(data)
print(df[["name", "web_pages"]].head())
```

!!! example "Paginated APIs"
    Many APIs return results in pages. You need to loop through them:

    ```python
    all_results = []
    page = 1

    while True:
        response = requests.get(url, params={"page": page, "per_page": 50})
        data = response.json()

        if not data["results"]:  # Empty page means we're done
            break

        all_results.extend(data["results"])
        page += 1

    df = pd.DataFrame(all_results)
    ```

## 7.4 API Authentication and Security

### API Keys

Most APIs require an **API key** --- a unique string that identifies your application. The API provider uses it to track usage and enforce limits.

```python
# Method 1: API key as a query parameter
params = {
    "q": "Chicago",
    "appid": "abc123def456"
}
response = requests.get(url, params=params)

# Method 2: API key in the request header (more secure)
headers = {
    "Authorization": "Bearer abc123def456"
}
response = requests.get(url, headers=headers)
```

### Credential Management

!!! warning "Never Hard-Code API Keys"
    Putting API keys directly in your code is a security risk. If you push the file to GitHub, anyone can steal your key and run up charges on your account.

**Best practice: Use environment variables.**

```python
import os

api_key = os.environ.get("WEATHER_API_KEY")
if not api_key:
    raise ValueError("Set the WEATHER_API_KEY environment variable")

params = {"q": "Chicago", "appid": api_key}
```

Set the variable in your terminal before running:

```bash
export WEATHER_API_KEY="abc123def456"
python my_script.py
```

Alternatively, use a `.env` file with the `python-dotenv` package:

```python
from dotenv import load_dotenv
import os

load_dotenv()  # Reads .env file in the current directory
api_key = os.environ.get("WEATHER_API_KEY")
```

!!! tip "Add .env to .gitignore"
    Always add `.env` to your `.gitignore` file so your keys are never committed to version control.

### OAuth 2.0

Some APIs (Google, Twitter/X, Spotify) use **OAuth 2.0**, a more complex authentication flow where:

1. Your application redirects the user to the provider's login page
2. The user grants permission
3. The provider returns an **access token**
4. Your application uses the token in subsequent requests

OAuth is common when accessing data on behalf of a user (e.g., reading someone's Spotify playlists). For this course, most of your work will use simpler API key authentication.

### Rate Limiting

APIs limit how many requests you can make in a given time window to prevent abuse and ensure fair access.

| API | Free Tier Limit |
|-----|----------------|
| OpenWeatherMap | 60 calls/minute |
| Yelp Fusion | 5,000 calls/day |
| Twitter/X API | 100 reads/15 minutes |
| Google Maps | 100 requests/second |

Handle rate limits gracefully:

```python
import time

cities = ["Chicago", "Champaign", "Springfield", "Peoria", "Rockford"]

for city in cities:
    response = requests.get(url, params={"q": city, "appid": api_key})

    if response.status_code == 429:
        print("Rate limited. Waiting 60 seconds...")
        time.sleep(60)
        response = requests.get(url, params={"q": city, "appid": api_key})

    data = response.json()
    print(f"{city}: {data['main']['temp']}°F")

    time.sleep(1)  # Be polite: wait 1 second between requests
```

## 7.5 NoSQL Databases: Motivation

### Why Not Just Use SQL for Everything?

Relational databases are excellent for structured, well-defined data. But modern applications often deal with:

- **Unstructured data**: Social media posts, sensor readings, log files
- **Variable schemas**: Each record may have different fields (e.g., product catalogs where a laptop has "RAM" but a shirt has "size")
- **Massive scale**: Billions of rows that need to be distributed across many servers
- **High write throughput**: Thousands of writes per second (IoT sensors, click streams)

!!! example "When SQL Becomes Difficult"
    Imagine storing Yelp restaurant data. Each restaurant has a different number of reviews, different attributes (some have "outdoor_seating", others don't), and photos of varying quantities. In a relational database, you would need multiple tables with complex joins. In a document database, each restaurant is a single, self-contained document.

### What is NoSQL?

**NoSQL** ("Not Only SQL") refers to a broad category of databases that store data in formats other than traditional tables with rows and columns. The term does not mean "no SQL at all" --- many NoSQL databases have their own query languages.

### Types of NoSQL Databases

| Type | How Data is Stored | Best For | Examples |
|------|-------------------|----------|----------|
| **Document** | JSON-like documents | Content management, catalogs, user profiles | MongoDB, CouchDB |
| **Key-Value** | Simple key-value pairs | Caching, session storage, shopping carts | Redis, DynamoDB |
| **Column-Family** | Columns grouped into families | Time-series data, analytics at scale | Cassandra, HBase |
| **Graph** | Nodes and edges (relationships) | Social networks, recommendation engines | Neo4j, Amazon Neptune |

In this course, we focus on **document databases** (MongoDB) because they are the most common NoSQL choice for business applications and pair naturally with JSON data from APIs.

## 7.6 The CAP Theorem

The **CAP theorem** states that a distributed database can guarantee at most **two** of these three properties at the same time:

| Property | Meaning |
|----------|---------|
| **Consistency** | Every read receives the most recent write. All nodes see the same data at the same time. |
| **Availability** | Every request gets a response (success or failure), even if some nodes are down. |
| **Partition Tolerance** | The system continues to work even if network communication between nodes is lost. |

Since network partitions are inevitable in real distributed systems, the practical choice is between **CP** (consistent but may be unavailable during a partition) and **AP** (always available but may return stale data during a partition).

!!! note "CAP in Plain English"
    Think of a chain of coffee shops that share inventory data. A network outage between two locations means you must choose: (a) **stop taking orders** until the connection is restored so inventory counts stay accurate (consistency), or (b) **keep taking orders** at both locations and reconcile the counts later (availability). You cannot have both during the outage.

| Database | CAP Choice | Why |
|----------|-----------|-----|
| MySQL, PostgreSQL | CP | Prioritize data correctness |
| MongoDB (default) | CP | Strong consistency within replica sets |
| Cassandra | AP | Always writable, eventual consistency |
| DynamoDB | AP (configurable) | High availability by default |

## 7.7 MongoDB Fundamentals

### Why MongoDB?

**MongoDB** is the most popular document database. It stores data as **BSON** (Binary JSON) documents, which look and behave like Python dictionaries.

### MongoDB vs SQL Terminology

| SQL Concept | MongoDB Equivalent |
|-------------|-------------------|
| Database | Database |
| Table | Collection |
| Row | Document |
| Column | Field |
| Primary Key | `_id` field (auto-generated) |
| JOIN | Embedded documents or `$lookup` |

### Setting Up pymongo

```python
from pymongo import MongoClient

# Connect to a local MongoDB instance
client = MongoClient("mongodb://localhost:27017/")

# Access (or create) a database
db = client["badm554"]

# Access (or create) a collection
restaurants = db["restaurants"]
```

!!! tip "MongoDB Creates on First Use"
    You do not need to create a database or collection in advance. MongoDB creates them automatically the first time you insert data.

## 7.8 MongoDB CRUD Operations

### Create: Inserting Documents

```python
# Insert a single document
restaurant = {
    "name": "Timpone's",
    "cuisine": "Italian",
    "city": "Urbana",
    "rating": 4.5,
    "tags": ["pasta", "wine", "date night"],
    "address": {
        "street": "710 S Goodwin Ave",
        "zip": "61801"
    }
}
result = restaurants.insert_one(restaurant)
print(f"Inserted document ID: {result.inserted_id}")

# Insert multiple documents
more_restaurants = [
    {"name": "Black Dog", "cuisine": "BBQ", "city": "Urbana", "rating": 4.3},
    {"name": "Nando Milano", "cuisine": "Italian", "city": "Champaign", "rating": 4.6},
    {"name": "Kohinoor", "cuisine": "Indian", "city": "Champaign", "rating": 4.4}
]
result = restaurants.insert_many(more_restaurants)
print(f"Inserted {len(result.inserted_ids)} documents")
```

### Read: Querying Documents

```python
# Find one document
doc = restaurants.find_one({"name": "Timpone's"})
print(doc)

# Find all Italian restaurants
for doc in restaurants.find({"cuisine": "Italian"}):
    print(doc["name"], doc["rating"])

# Find restaurants with rating >= 4.5
for doc in restaurants.find({"rating": {"$gte": 4.5}}):
    print(doc["name"], doc["rating"])
```

### MongoDB Query Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| `$eq` | Equal | `{"rating": {"$eq": 4.5}}` |
| `$gt` / `$gte` | Greater than / greater than or equal | `{"rating": {"$gte": 4.0}}` |
| `$lt` / `$lte` | Less than / less than or equal | `{"rating": {"$lt": 3.0}}` |
| `$ne` | Not equal | `{"cuisine": {"$ne": "Fast Food"}}` |
| `$in` | Matches any value in array | `{"city": {"$in": ["Champaign", "Urbana"]}}` |
| `$and` | Logical AND | `{"$and": [{"rating": {"$gte": 4}}, {"city": "Champaign"}]}` |
| `$or` | Logical OR | `{"$or": [{"city": "Champaign"}, {"city": "Urbana"}]}` |

### Update: Modifying Documents

```python
# Update one document
restaurants.update_one(
    {"name": "Black Dog"},                    # Filter
    {"$set": {"rating": 4.5, "verified": True}}  # Update
)

# Update many documents - add a "region" field to all Champaign restaurants
restaurants.update_many(
    {"city": "Champaign"},
    {"$set": {"region": "Central IL"}}
)

# Increment a numeric field
restaurants.update_one(
    {"name": "Kohinoor"},
    {"$inc": {"review_count": 1}}
)
```

### Delete: Removing Documents

```python
# Delete one document
restaurants.delete_one({"name": "Closed Restaurant"})

# Delete all restaurants with rating below 3.0
result = restaurants.delete_many({"rating": {"$lt": 3.0}})
print(f"Deleted {result.deleted_count} documents")
```

!!! warning "delete_many with an Empty Filter"
    Calling `restaurants.delete_many({})` deletes **every document** in the collection. Always double-check your filter before running delete operations.

## 7.9 SQL vs NoSQL: When to Use Each

| Factor | SQL (Relational) | NoSQL (Document) |
|--------|-------------------|-------------------|
| **Data structure** | Fixed schema, structured data | Flexible schema, semi-structured data |
| **Relationships** | Strong (foreign keys, JOINs) | Weak (embedded documents or manual references) |
| **Query language** | Standardized SQL | Database-specific (MQL for MongoDB) |
| **Transactions** | Full ACID support | Limited (document-level in MongoDB) |
| **Scaling** | Vertical (bigger server) | Horizontal (add more servers) |
| **Best for** | Financial data, ERP, CRM, anything requiring strict consistency | Content management, IoT, real-time analytics, API data storage |

!!! note "It's Not Either/Or"
    Most modern organizations use **both** SQL and NoSQL databases. A company might store transactional data in PostgreSQL and cache user sessions in Redis. Choosing the right tool depends on the specific requirements of each use case.

### Decision Framework

Choose **SQL** when:

- Your data has a well-defined, stable schema
- You need complex joins across many related tables
- Data integrity and ACID transactions are critical (e.g., banking)

Choose **NoSQL** when:

- Your data is semi-structured or varies between records
- You need to store JSON from APIs without extensive transformation
- You need to scale horizontally across many servers
- Write throughput is more important than complex queries

## 7.10 Putting It Together: API to MongoDB Pipeline

A common real-world workflow is to fetch data from an API and store it in MongoDB for later analysis:

```python
import requests
import time
from pymongo import MongoClient

# --- Configuration ---
API_KEY = os.environ.get("YELP_API_KEY")
HEADERS = {"Authorization": f"Bearer {API_KEY}"}
BASE_URL = "https://api.yelp.com/v3/businesses/search"

# --- MongoDB connection ---
client = MongoClient("mongodb://localhost:27017/")
db = client["badm554"]
collection = db["yelp_restaurants"]

# --- Fetch and store ---
cities = ["Champaign, IL", "Chicago, IL", "Springfield, IL"]

for city in cities:
    params = {
        "location": city,
        "categories": "restaurants",
        "limit": 50
    }

    response = requests.get(BASE_URL, headers=HEADERS, params=params)

    if response.status_code == 200:
        businesses = response.json()["businesses"]
        if businesses:
            collection.insert_many(businesses)
            print(f"Inserted {len(businesses)} restaurants from {city}")
    elif response.status_code == 429:
        print("Rate limited. Waiting...")
        time.sleep(60)
    else:
        print(f"Error for {city}: {response.status_code}")

    time.sleep(1)  # Respect rate limits

# --- Query the stored data ---
print("\nTop-rated restaurants:")
for doc in collection.find({"rating": {"$gte": 4.5}}).sort("rating", -1).limit(10):
    print(f"  {doc['name']} ({doc['location']['city']}): {doc['rating']} stars")
```

!!! example "Why This Pattern Matters"
    Fetching API data and storing it locally means you can:

    - Analyze the data offline without making repeated API calls
    - Combine data from multiple API sources in one database
    - Build dashboards and reports on top of the stored data
    - Avoid hitting rate limits during exploratory analysis

## Key Takeaways

1. **REST APIs** are the standard way to fetch data from external services using HTTP methods (GET, POST, PUT, DELETE) and structured URLs
2. **JSON** is the lingua franca of APIs and maps directly to Python dictionaries and lists --- mastering nested JSON navigation is essential
3. **The `requests` library** makes API calls straightforward: pass parameters as a dictionary, check the status code, and parse the response with `.json()`
4. **NoSQL databases** solve problems that relational databases struggle with: flexible schemas, horizontal scaling, and high-volume semi-structured data
5. **The CAP theorem** explains the fundamental trade-off in distributed databases: you can have at most two of consistency, availability, and partition tolerance
6. **MongoDB CRUD** operations (`insert_one`, `find`, `update_one`, `delete_one`) use Python dictionaries for both data and queries, making them intuitive for Python developers
7. **SQL and NoSQL complement each other** --- the right choice depends on your data structure, query patterns, and scaling needs

## Review Questions

1. Explain the difference between a `GET` request and a `POST` request. When would you use each in a data analytics context?
2. Given a nested JSON object representing a student record, write the Python expression to access the grade in the student's second course.
3. Why should API keys never be hard-coded in your Python scripts? Describe two methods for managing credentials securely.
4. A startup needs a database for a product catalog where each item has a different set of attributes. Would you recommend SQL or NoSQL? Justify your answer using the concepts from this chapter.
5. Explain the CAP theorem in your own words. Why is partition tolerance usually considered non-negotiable in distributed systems?

## Practical Exercise

Build a small **API-to-MongoDB pipeline**:

1. Sign up for a free API key at [OpenWeatherMap](https://openweathermap.org/api)
2. Write a Python script that:
    - Fetches current weather for 5 cities of your choice using the `requests` library
    - Stores each response as a document in a MongoDB collection called `weather_data`
    - Queries the collection to find the warmest and coldest cities
    - Prints a summary table using `pandas`
3. Add proper error handling:
    - Check status codes before processing responses
    - Handle missing keys with `.get()`
    - Store your API key in an environment variable, not in the code
4. Include a 1-second delay between API calls to respect rate limits

**Bonus**: Extend the script to fetch a 5-day forecast and store each daily forecast as a separate document with a `city` field, so you can later query forecasts across all cities.

## Next Steps

In [Chapter 8](08-cloud-databases-optimization.md), we'll explore cloud-hosted databases and performance optimization techniques including indexing, query tuning, and scaling strategies.

---

*Corresponds to Week 6 of BADM 554 — NoSQL & APIs*
