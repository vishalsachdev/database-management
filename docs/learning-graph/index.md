# Learning Graph

## Overview

The BADM 554 Database Management learning graph is a comprehensive knowledge structure containing **231 concepts** organized into **13 taxonomic categories**. This graph represents the complete conceptual framework for the course, showing how concepts build upon each other through a **Directed Acyclic Graph (DAG)** structure.

## Purpose

The learning graph serves multiple purposes:

1. **Curriculum Design**: Provides a complete roadmap of concepts to be covered
2. **Learning Paths**: Enables personalized learning sequences based on prerequisites
3. **Content Generation**: Guides the creation of textbook chapters and sections
4. **Assessment Planning**: Identifies foundational vs. advanced concepts for quizzes and projects
5. **Dependency Tracking**: Ensures students learn prerequisites before advanced topics

## Key Metrics

- **Total Concepts**: 231
- **Foundational Concepts** (no prerequisites): 2 (Data, Information)
- **Total Dependencies**: 243
- **Average Dependencies per Concept**: 1.06
- **Longest Learning Path**: 12 concepts (Data → ... → RFM Analysis)
- **Taxonomy Categories**: 13
- **Connected Graph**: ✅ Yes (all concepts are connected)
- **Valid DAG Structure**: ✅ Yes (no circular dependencies)

## Taxonomy Categories

The 231 concepts are organized into 13 categories:

| Category | Count | Percentage | Description |
|----------|-------|------------|-------------|
| **ASQL** - Advanced SQL | 38 | 16.5% | Complex joins, subqueries, CTEs, window functions |
| **SQL** - SQL Fundamentals | 34 | 14.7% | Basic SQL, DDL, DML, SELECT, joins, aggregates |
| **RELAT** - Relational Model | 21 | 9.1% | Tables, keys, relationships, relational algebra |
| **PYTHON** - Python Integration | 21 | 9.1% | Database connectivity, Pandas, visualization |
| **JSON** - JSON & APIs | 19 | 8.2% | JSON structure, API integration |
| **NOSQL** - NoSQL Databases | 18 | 7.8% | MongoDB, CAP theorem, document databases |
| **DW** - Data Warehousing | 15 | 6.5% | Star schema, ETL, OLTP vs OLAP |
| **DESIGN** - Database Design | 14 | 6.1% | ER modeling, ER diagrams, cardinality |
| **NORM** - Normalization | 14 | 6.1% | Normal forms, functional dependencies |
| **BASIC** - Basic Concepts | 11 | 4.8% | DBMS, users, roles, data models |
| **BIZ** - Business Applications | 11 | 4.8% | Marketing analytics, BI dashboards |
| **TOOLS** - Tools & Environment | 10 | 4.3% | MySQL, PostgreSQL, Jupyter, MongoDB Compass |
| **FOUND** - Foundation | 5 | 2.2% | Data, Information, Database fundamentals |

## Quality Validation

The learning graph has been validated using automated quality checks:

✅ **Valid DAG Structure** - No circular dependencies detected
✅ **Connected Graph** - All concepts are part of a single connected component
✅ **Balanced Distribution** - No category exceeds 20% of concepts
✅ **Clear Prerequisites** - 2 foundational concepts with zero dependencies
✅ **Reasonable Depth** - Maximum learning path of 12 concepts

See [Quality Metrics Report](./quality-metrics.md) for detailed analysis.

## Graph Files

### Primary Files

- **[learning-graph.csv](./learning-graph.csv)** - CSV format with columns: ConceptID, ConceptLabel, Dependencies, TaxonomyID
- **[learning-graph.json](./learning-graph.json)** - JSON format for vis-network.js visualization (34KB)
- **[metadata.json](./metadata.json)** - Course metadata (title, description, creator, version)
- **[color-config.json](./color-config.json)** - Taxonomy color scheme for visualization

### Documentation Files

- **[concept-list.md](./concept-list.md)** - Numbered list of all 231 concepts
- **[concept-taxonomy.md](./concept-taxonomy.md)** - Detailed taxonomy category descriptions
- **[quality-metrics.md](./quality-metrics.md)** - Graph validation and quality analysis
- **[taxonomy-distribution-report.md](./taxonomy-distribution-report.md)** - Category distribution statistics
- **[course-description.md](./course-description.md)** - Original course description used to generate the graph

## Visualization

The learning graph can be visualized using the interactive graph viewer (powered by vis-network.js). The visualization shows:

- **Nodes**: Concepts color-coded by taxonomy category
- **Edges**: Dependency relationships (arrows point from prerequisite to dependent concept)
- **Interactive Features**:
  - Zoom and pan
  - Node search
  - Taxonomy filtering
  - Dependency highlighting
  - Path finding between concepts

## Learning Paths

### Example Learning Paths

**Path 1: SQL Fundamentals** (Concepts 1-71)
```
Data → Database → Relational Model → SQL → SELECT Statement →
WHERE Clause → Aggregate Functions → GROUP BY → Joins
```

**Path 2: NoSQL & Modern Data** (Concepts 110-192)
```
Database → NoSQL → CAP Theorem → MongoDB → CRUD Operations
```

**Path 3: Business Applications** (Concepts 221-231)
```
SQL → Aggregate Functions → GROUP BY → Python → Pandas →
Data Visualization → Customer Segmentation → Marketing Analytics
```

## Usage Guidelines

### For Students

1. Start with foundational concepts (Data, Information)
2. Follow prerequisite dependencies (check incoming arrows)
3. Use taxonomy categories to focus on specific areas
4. Track progress through the graph
5. Identify gaps in your knowledge by finding unconnected concepts

### For Instructors

1. Use the graph to design course modules
2. Create assessment items aligned with concept dependencies
3. Generate learning paths for different student goals
4. Identify which concepts require more teaching time (high indegree)
5. Design capstone projects that integrate multiple taxonomy areas

### For Content Creators

1. Generate chapters based on taxonomy categories
2. Ensure prerequisites are covered before dependent concepts
3. Create cross-references using concept IDs
4. Design interactive simulations for high-centrality concepts
5. Write exercises that test concept dependencies

## Technical Details

**CSV Schema**:
```csv
ConceptID,ConceptLabel,Dependencies,TaxonomyID
1,Data,,FOUND
3,Database,1,FOUND
18,Tables,16,RELAT
```

**JSON Schema**: Conforms to learning-graph-schema.json (vis-network format)

**Validation Tools**:
- `analyze-graph.py` - Validates DAG structure and calculates metrics
- `csv-to-json.py` - Converts CSV to JSON format with metadata
- `taxonomy-distribution.py` - Generates category distribution reports

## Next Steps

After reviewing and validating the learning graph:

1. ✅ **Review Concept List** - Verify all 231 concepts are appropriate
2. ✅ **Check Dependencies** - Ensure prerequisite relationships are accurate
3. ✅ **Validate Taxonomy** - Confirm concepts are in correct categories
4. ⏭️ **Generate Content** - Use the graph to create textbook chapters
5. ⏭️ **Create Visualizations** - Build interactive graph viewer
6. ⏭️ **Design Assessments** - Create quizzes aligned with concept levels

## References

- Course: BADM 554 - Database Management
- Institution: University of Illinois
- Instructor: Vishal Sachdev
- Course Identifier: badm_350_120255_247989
- Generated: 2025-11-24
- Version: 1.0

## Tools Used

- **analyze-graph.py** (v0.02) - Graph quality validation
- **csv-to-json.py** (v0.02) - CSV to JSON conversion
- **taxonomy-distribution.py** - Distribution analysis
- **learning-graph-generator skill** - Concept generation workflow

---

*This learning graph was generated using the learning-graph-generator skill from the [Claude Skills](https://github.com/dmccreary/claude-skills) repository.*
