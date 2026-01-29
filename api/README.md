# Adaptive Learning Agent API

## Setup

```bash
cd api
pip install -r requirements.txt
python learning_agent.py
```

The learning agent will run on http://localhost:5001

## How it works

1. Student clicks quiz answers in the textbook
2. JavaScript sends response to `/api/learning-agent` 
3. Agent analyzes response against curriculum graph
4. Updates student profile with mastery scores and learning patterns
5. Returns adaptive feedback (hints, difficulty adjustments, review suggestions)
6. Student profiles stored in `profiles/{student_id}.json`

## Integration with Curriculum

- Uses `curriculum/knowledge_graph.json` for concept mapping
- Maps quiz questions to specific nodes in the learning graph
- Implements remediation (subnodes) and refresher logic from pathfinding spec
- Updates mastery scores and learning preferences in real-time

## API Endpoints

- `POST /api/learning-agent` - Process quiz response
- `GET /api/student-profile/{student_id}` - Get student profile