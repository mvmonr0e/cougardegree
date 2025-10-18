# 🎯 SIMPLE GUIDE: Try It Out NOW

## Fastest Way (2 Steps):

### 1. Double-click this file:
```
start.ps1
```
OR
```
start.bat
```

This will:
- ✅ Start the backend server
- ✅ Open your browser automatically
- ✅ Load the web interface

### 2. Fill out the form and click "Generate My Plan"

That's it! 🎉

---

## OR Use Commands:

### Open TWO PowerShell windows:

**Window 1 - Start Backend:**
```powershell
cd c:\Users\ramir\OneDrive\Documents\GitHub\cougar-scheduler
$Env:GOOGLE_API_KEY="AIzaSyBpgdcnJ-FBfhgaUAqPnFiFRSQ_Jwj4ABU"
python -m uvicorn backend.app:app --reload
```
(Leave this running - don't close it!)

**Window 2 - Try CLI:**
```powershell
cd c:\Users\ramir\OneDrive\Documents\GitHub\cougar-scheduler
$Env:GOOGLE_API_KEY="AIzaSyBpgdcnJ-FBfhgaUAqPnFiFRSQ_Jwj4ABU"

# Try this:
python -m uh_grad_planner.cli --major CS_BS_2021_2022 --start Fall-2025 --completed "ENGL 1301,MATH 2413" --max 15 --gemini-advice
```

---

## OR Just Open Your Browser:

If the backend is already running, just go to:
```
http://127.0.0.1:8000/static/index.html
```

---

## What to Try:

### Example 1: New Student
- Completed Courses: (leave empty)
- Start: Fall-2025
- Max Credits: 15
- ✅ Check AI Advisor

### Example 2: Transfer Student  
- Completed Courses: `ENGL 1301, ENGL 1302, MATH 2413, HIST 1377, HIST 1378`
- Start: Fall-2025
- Max Credits: 15
- ✅ Check AI Advisor

### Example 3: Part-Time
- Completed Courses: `COSC 1336`
- Start: Spring-2026
- Max Credits: 9
- ✅ Check AI Advisor

---

## That's All! 

The web interface is the easiest way. Just fill out the form and see your plan! 🚀
