# Learning Graph

## Overview

The Database Management learning graph is a structured knowledge representation of all 200 key concepts in BADM 350, organized by prerequisite relationships and taxonomic categories.

## What is a Learning Graph?

A **learning graph** is a directed acyclic graph (DAG) where:

- **Nodes** represent concepts (e.g., "Primary Key", "INNER JOIN", "Normalization")
- **Edges** represent learning dependencies (prerequisites)
- **Groups** organize concepts into taxonomic categories

The graph helps students:

- Understand prerequisite relationships between concepts
- Find recommended learning paths
- Visualize connections across different database topics
- Identify foundational vs. advanced concepts

## Learning Graph Statistics

- **Total Concepts**: 200
- **Taxonomy Categories**: 15
- **Dependency Edges**: 241
- **Foundational Concepts**: 1 (Data)
- **Maximum Dependency Chain**: 14 levels
- **Average Dependencies per Concept**: 1.21

## Taxonomy Categories

The 200 concepts are organized into 15 categories:

1. **Database Foundations** (DBFND) - 11 concepts (5.5%)
2. **Relational Model** (RELMD) - 13 concepts (6.5%)
3. **Table Structure** (TBLST) - 8 concepts (4.0%)
4. **Keys and Constraints** (KEYCT) - 8 concepts (4.0%)
5. **SQL Fundamentals** (SQLFN) - 20 concepts (10.0%)
6. **SQL Queries** (SQLQY) - 7 concepts (3.5%)
7. **SQL Aggregation** (SQLAG) - 8 concepts (4.0%)
8. **SQL Joins** (SQLJN) - 10 concepts (5.0%)
9. **Advanced SQL** (SQLAD) - 29 concepts (14.5%)
10. **JSON and APIs** (JSNAP) - 21 concepts (10.5%)
11. **Data Modeling** (DMDEL) - 17 concepts (8.5%)
12. **Normalization** (NORML) - 20 concepts (10.0%)
13. **Data Warehousing** (DWHOU) - 15 concepts (7.5%)
14. **ETL and Data Integration** (ETLDI) - 5 concepts (2.5%)
15. **NoSQL Databases** (NOSQL) - 8 concepts (4.0%)

## Learning Graph Files

- **[Course Description](../course-description.md)** - Comprehensive course overview (Quality Score: 100/100)
- **[Course Description Assessment](./course-description-assessment.md)** - Quality evaluation report
- **[Concept List](./concept-list.md)** - All 200 concept labels
- **[Concept Taxonomy](./concept-taxonomy.md)** - Taxonomy category definitions
- **[Learning Graph CSV](./learning-graph.csv)** - Concepts with dependencies and taxonomy IDs
- **[Learning Graph JSON](./learning-graph.json)** - Complete graph in JSON format
- **[Graph Quality Analysis](./graph-quality-analysis.md)** - DAG validation and metrics
- **[Taxonomy Distribution Report](./taxonomy-distribution-report.md)** - Category balance analysis

## Using the Learning Graph

### For Students

The learning graph helps you:

- **Find Prerequisites**: See what concepts you need to learn before tackling advanced topics
- **Plan Learning Paths**: Identify efficient sequences through course material
- **Understand Connections**: Discover how different database concepts relate
- **Self-Assess**: Identify foundational gaps in your knowledge

### For Instructors

The learning graph supports:

- **Curriculum Design**: Organize lessons based on dependency chains
- **Assessment Creation**: Test foundational concepts before advanced ones
- **Personalized Learning**: Create custom paths for students with different backgrounds
- **Topic Sequencing**: Ensure logical progression through material

## Graph Visualization

To visualize this learning graph interactively, you can:

1. Install the **Learning Graph Viewer** (coming soon)
2. Explore the graph with:
   - Node search functionality
   - Category filtering
   - Dependency path highlighting
   - Statistics display

## Quality Metrics

### Course Description Quality: 100/100

- ✅ All required elements present
- ✅ Comprehensive Bloom's taxonomy coverage
- ✅ Clear scope and boundaries
- ✅ Strong real-world context

### Graph Structure Quality: 78/100

- ✅ Valid DAG structure (no cycles)
- ✅ No self-dependencies
- ✅ Fully connected graph
- ✅ Reasonable dependency chains (max 14 levels)
- ℹ️ 124 orphaned nodes (terminal concepts - acceptable)
- ℹ️ Opportunity for more cross-dependencies

### Taxonomy Balance: Excellent

- ✅ 15 categories evenly distributed
- ✅ No category exceeds 30% threshold
- ✅ Average 13.3 concepts per category
- ✅ Spread: 12.0% (very balanced)

## Foundational Learning Path

The learning graph starts with one foundational concept:

1. **Data** → Information → Database → ...

From this foundation, the graph branches into multiple learning pathways covering:

- **Structural Path**: Data → Database → Table → Keys → Constraints
- **Theoretical Path**: Data → Relational Model → Relational Algebra → Operations
- **SQL Path**: Database → DBMS → SQL → Queries → Joins → Advanced SQL
- **Modern Data Path**: Data → JSON → REST APIs → NoSQL
- **Design Path**: Table → Entity → ER Diagrams → Relationships → Normalization

## Most Important Concepts

Based on indegree analysis (concepts that are prerequisites for many others):

| Rank | Concept | Indegree | Category |
|------|---------|----------|----------|
| 1 | SELECT Statement | 19 | SQL Queries |
| 2 | Table | 11 | Table Structure |
| 3 | CREATE TABLE Statement | 11 | SQL Fundamentals |
| 4 | Database | 8 | Database Foundations |
| 5 | Column | 8 | Table Structure |
| 6 | INNER JOIN | 8 | SQL Joins |
| 7 | Relational Algebra | 7 | Relational Model |
| 8 | Window Function | 7 | Advanced SQL |

These concepts are critical building blocks - master them first!

## Next Steps

1. Review the [Course Description Assessment](./course-description-assessment.md) to understand scope
2. Explore the [Concept Taxonomy](./concept-taxonomy.md) to see how topics are organized
3. Study the [Taxonomy Distribution Report](./taxonomy-distribution-report.md) for category details
4. Use the [Learning Graph JSON](./learning-graph.json) for interactive visualization
5. Check the [Graph Quality Analysis](./graph-quality-analysis.md) for structural insights

---

**Version**: 1.0
**Date**: 2025-11-22
**Creator**: Vishal Sachdev
**License**: CC BY-NC-SA 4.0 DEED
