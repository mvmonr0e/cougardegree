# 🚀 Quick Try-It-Out Guide

## Web Interface (Recommended)

### Step 1: Make sure backend is running
```powershell
# If not already running, start it:
$Env:GOOGLE_API_KEY="AIzaSyBpgdcnJ-FBfhgaUAqPnFiFRSQ_Jwj4ABU"
cd c:\Users\ramir\OneDrive\Documents\GitHub\cougar-scheduler
python -m uvicorn backend.app:app --reload --host 127.0.0.1 --port 8000
```

### Step 2: Open in browser
Open your browser and go to:
```
http://127.0.0.1:8000/static/index.html
```

### Step 3: Try different scenarios

**Scenario 1: Brand New Student**
- Major: Computer Science BS (2021-2022)
- Start Term: Fall-2025
- Completed Courses: (leave empty)
- Max Credits: 15
- AI Advisor: ✅ Checked

**Scenario 2: Sophomore Starting**
- Major: Computer Science BS (2021-2022)
- Start Term: Fall-2025
- Completed Courses: `COSC 1336, ENGL 1301, HIST 1377, GOVT 2306, MATH 2413`
- Max Credits: 15
- AI Advisor: ✅ Checked

**Scenario 3: Part-Time Student**
- Major: Computer Science BS (2021-2022)
- Start Term: Spring-2026
- Completed Courses: `ENGL 1301, MATH 2413`
- Max Credits: 12
- AI Advisor: ✅ Checked

---

## Command Line Interface

### Basic Plan (No AI)
```powershell
python -m uh_grad_planner.cli --major CS_BS_2021_2022 --start Fall-2025 --max 15
```

### With Completed Courses
```powershell
python -m uh_grad_planner.cli --major CS_BS_2021_2022 --start Fall-2025 --completed "ENGL 1301,MATH 2413,COSC 1336" --max 15
```

### With AI Advisor (Recommended!)
```powershell
$Env:GOOGLE_API_KEY="AIzaSyBpgdcnJ-FBfhgaUAqPnFiFRSQ_Jwj4ABU"
python -m uh_grad_planner.cli --major CS_BS_2021_2022 --start Fall-2025 --completed "ENGL 1301,MATH 2413" --max 15 --gemini-advice
```

### Part-Time Student (12 credits)
```powershell
python -m uh_grad_planner.cli --major CS_BS_2021_2022 --start Spring-2026 --completed "COSC 1336,ENGL 1301" --max 12 --gemini-advice
```

### Starting Spring Semester
```powershell
python -m uh_grad_planner.cli --major CS_BS_2021_2022 --start Spring-2026 --max 15 --gemini-advice
```

---

## What You'll See

### In the Web Interface:
- 🎨 Beautiful UH red-themed interface
- 📋 Form to enter your information
- 📊 Visual semester cards showing each term
- 🤖 AI-generated advice (if enabled)
- ⚠️ Warnings about issues

### In the Command Line:
```
Plan for CS_BS_2021_2022 2021-2022, start Fall-2025
============================================================
Fall-2025: 13 credits
  - COSC 1336 (3)
  - HIST 1377 (3)
  - GOVT 2306 (3)
  - COSC 1437 (4)
Spring-2026: 13 credits
  - ENGL 1302 (3)
  - HIST 1378 (3)
  ...

Advisor notes:
[AI-generated analysis of your plan]
```

---

## Tips for Best Results

### ✅ Do's:
- ✅ Check "Use AI Advisor" for detailed feedback
- ✅ Enter completed courses accurately
- ✅ Try different start terms to see flexibility
- ✅ Experiment with different credit loads (12, 15, 18)
- ✅ Look at the warnings - they're important!

### ❌ Don'ts:
- ❌ Don't forget to start the backend server
- ❌ Don't ignore prerequisite warnings
- ❌ Don't set max credits below 6 or above 18

---

## Troubleshooting

**"Could not generate plan" error in web interface:**
```powershell
# Make sure backend is running:
cd c:\Users\ramir\OneDrive\Documents\GitHub\cougar-scheduler
python -m uvicorn backend.app:app --reload
```

**"Set GOOGLE_API_KEY in your environment" error:**
```powershell
$Env:GOOGLE_API_KEY="AIzaSyBpgdcnJ-FBfhgaUAqPnFiFRSQ_Jwj4ABU"
```

**Port already in use:**
```powershell
# Try a different port:
python -m uvicorn backend.app:app --reload --port 8001
# Then open: http://localhost:8001/static/index.html
```

---

## Advanced: API Endpoints

You can also test the raw API:

### Get available majors:
```
http://127.0.0.1:8000/api/majors
```

### API Documentation:
```
http://127.0.0.1:8000/docs
```

### Test with curl or Postman:
```powershell
curl -X POST "http://127.0.0.1:8000/api/plan" `
  -H "Content-Type: application/json" `
  -d '{
    "major": "CS_BS_2021_2022",
    "start_term": "Fall-2025",
    "completed": ["ENGL 1301", "MATH 2413"],
    "max_credits": 15,
    "use_gemini": true
  }'
```

---

## 🎓 Ready to Try?

1. **Web Interface:** Already open in your browser!
2. **Command Line:** Copy any command above and run it!

**Have fun planning your graduation!** 🚀
