# Digital Ocean Gradient AI Agent Version
## What Makes This Branch Special?

This branches introduces an AI-powered degree planning system that balances course difficulty across semesters using real grade distribution data.

### AI Agent on Digital Ocean's Gradient AI Platform

- Deployed using DigitalOcean's Gradient AI infrastructure with the llama3-8b-instruct model
- RESTful API integration with Bearer token authentication
- Automated agent discovery and configuration scripts

### CougarGrades.io Integration for Course Difficulty 
The system leverages cougargrades.io's public grade distribution data to:
- Calculate average GPA per course
- Classify course difficulty levels based on historical performance
- Make data-driven decisions about course combinations

### Smart Semester-by-Semester Difficulty Balancing The implementation uses a sophisticated balancing algorithm that:

- Targets 15 credits per semester using bin-packing logic
- Automatically resolves prerequisite dependency chains before course placement
- Evaluates each semester's overall difficulty and redistributes courses to prevent overwhelming workloads
- Generates complete 8-semester degree paths from start to graduation

### Technical Architecture

- Node.js/Express backend with rate limiting and security middleware
- 130+ line structured AI prompt engineering that guides the model to consider workload balance, prerequisites, and course categories
- Vanilla JavaScript frontend with real-time plan visualization
- RESTful API design with health checks, major listings, and plan generation

### The Innovation Unlike traditional course planners that only check prerequisites, this AI agent considers:

- Historical course difficulty from real grade distributions
- Cognitive load balancing across semesters
- Prerequisites and course sequencing
- Credit hour optimization

The result: Students get personalized degree plans that are not just feasible, but manageable, preventing burnout semesters while maintaining steady graduation progress.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Optional: DigitalOcean AI Agent (or any compatible endpoint) and access key

### Repository Layout

- `frontend/` Static HTML/CSS/JS app served with a tiny Express server
- `backend/` Node.js/Express API that calls the AI agent and parses responses

### Environment Variables

Create a `.env` file inside `backend/` (gitignored):

```
AI_ENDPOINT_URL=<your-ai-endpoint-url>
AI_ACCESS_KEY=<your-access-key>

# Server config
PORT=3001
NODE_ENV=development

# CORS origin for local frontend
FRONTEND_URL=http://localhost:3000
```

Notes:
- No secrets are committed to the repo; values are read from environment variables.
- You can also set variables in your shell instead of using `.env`.

### Install Dependencies

From the project root, install frontend and backend:

```bash
cd frontend && npm install
cd ../backend && npm install
```

### Run Locally

In two terminals:

1) Frontend (serves `index.html` at http://localhost:3000)

```bash
cd frontend
node server.js
```

2) Backend API (runs at http://localhost:3001)

```bash
cd backend
npm start
```

### Configure AI Endpoint (optional helper)

There are two helper scripts in `backend/`:

- `configure-ai.js` prompts for your endpoint and writes `backend/.env`.
- `find-agent-endpoint.js` tries common paths to discover a working "generate/chat" endpoint.

Run one of these from `backend/` after setting `AI_ACCESS_KEY` in your environment:

```bash
node configure-ai.js
# or
node find-agent-endpoint.js
```

### Test the API

With the backend running:

```bash
cd backend
node test-api.js
```

### Security

- Keep `AI_ACCESS_KEY` only in environment variables or `backend/.env`.
- Avoid logging keys. If present, remove any logs that print key prefixes.

### Troubleshooting

- CORS errors: Ensure `FRONTEND_URL` matches the frontend origin and restart backend.
- 401 from AI agent: Verify `AI_ACCESS_KEY` and `AI_ENDPOINT_URL`.
- Connection errors: The helper scripts can validate and suggest endpoints.