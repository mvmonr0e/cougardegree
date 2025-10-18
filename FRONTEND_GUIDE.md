# 🌐 Frontend Setup Guide

## What's Included

You now have a **working web frontend** for the UH Grad Planner!

- **Frontend:** Modern HTML/CSS/JavaScript interface (`frontend/`)
- **Backend:** FastAPI REST API (`backend/app.py`)
- **Integration:** Frontend calls Python backend via HTTP

## 🚀 Quick Start

### Step 1: Install Backend Dependencies

```powershell
pip install fastapi uvicorn[standard]
```

Or reinstall with updated dependencies:
```powershell
pip install -e ".[dev]"
```

### Step 2: Start the Backend Server

```powershell
cd backend
uvicorn app:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
```

### Step 3: Open the Frontend

Open your web browser and go to:
```
http://localhost:8000/static/index.html
```

Or just double-click `frontend/index.html` to open it directly (will need backend running for functionality).

## 🎨 What You'll See

1. **UH-themed interface** with Cougar Red colors (#C8102E)
2. **Form to input:**
   - Major (currently only CS available)
   - Start term (Fall/Spring)
   - Completed courses
   - Max credits per semester
   - AI Advisor checkbox (for Gemini integration)

3. **Results showing:**
   - 8-semester graduation plan
   - Courses organized by semester
   - Credit counts
   - Warnings and prerequisites
   - Optional AI advisor notes

## 🔧 How It Works

```
┌─────────────┐         ┌─────────────┐         ┌──────────────┐
│  Frontend   │  HTTP   │   FastAPI   │  calls  │   Python     │
│  (Browser)  │────────>│   Backend   │────────>│   Planner    │
│             │<────────│             │<────────│              │
└─────────────┘  JSON   └─────────────┘         └──────────────┘
```

1. User fills form in browser
2. JavaScript sends POST request to `/api/plan`
3. FastAPI backend calls Python scheduler
4. Results returned as JSON
5. Frontend displays beautiful schedule

## 📡 API Endpoints

### GET `/api/majors`
Returns list of available majors
```json
[
  {
    "id": "CS_BS_2021_2022",
    "catalog_year": "2021-2022",
    "name": "CS_BS_2021_2022"
  }
]
```

### POST `/api/plan`
Generate a graduation plan
```json
{
  "major": "CS_BS_2021_2022",
  "start_term": "Fall-2025",
  "completed": ["ENGL 1301", "MATH 2413"],
  "max_credits": 15,
  "use_gemini": false
}
```

Returns:
```json
{
  "major_id": "CS_BS_2021_2022",
  "catalog_year": "2021-2022",
  "start": "Fall-2025",
  "terms": [...],
  "total_credits": 120,
  "warnings": [...],
  "advisor_notes": "..." 
}
```

### GET `/api/courses/{major_id}`
Get all courses for a major

## 🎓 Using with Gemini

To enable AI Advisor:

1. Set your Gemini API key:
   ```powershell
   $Env:GOOGLE_API_KEY="your-api-key"
   ```

2. Restart the backend server

3. Check the "Use AI Advisor" checkbox in the frontend

4. Generate your plan - you'll see AI-generated advice!

## 🛠️ Development

### Backend Development
```powershell
# Auto-reload on code changes
cd backend
uvicorn app:app --reload --port 8000
```

### Frontend Development
Just edit the files in `frontend/` and refresh your browser!

### API Documentation
With the backend running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 📁 File Structure

```
cougar-scheduler/
├── frontend/
│   ├── index.html        # Main UI
│   └── app.js           # JavaScript API calls
├── backend/
│   └── app.py           # FastAPI server
├── src/uh_grad_planner/  # Python core logic
└── data/maps/           # Degree plan data
```

## 🐛 Troubleshooting

**Error: "Could not generate plan"**
- Make sure backend is running: `uvicorn backend.app:app --reload`
- Check the console for errors

**CORS errors**
- Backend has CORS enabled for all origins in development
- In production, update `allow_origins` in `backend/app.py`

**Port already in use**
```powershell
# Use a different port
uvicorn backend.app:app --reload --port 8001
# Then update API_BASE_URL in app.js
```

## 🚀 Next Steps

1. **Add more majors** - Create JSON files in `data/maps/`
2. **Improve UI** - Add drag-and-drop, visual prerequisite graph
3. **Deploy** - Use Vercel (frontend) + Railway (backend)
4. **Mobile app** - React Native or Flutter wrapper

Enjoy your new graduation planner! 🎉
