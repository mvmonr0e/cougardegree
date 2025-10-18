# 🔧 PowerShell Quick Commands

## ⚠️ Important: PowerShell Syntax Different from CMD

In PowerShell, you need to use different syntax than Command Prompt.

---

## 🚀 Method 1: Start Backend in Separate Window (EASIEST)

```powershell
# This opens a new window for the backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; `$Env:GOOGLE_API_KEY='AIzaSyBpgdcnJ-FBfhgaUAqPnFiFRSQ_Jwj4ABU'; python -m uvicorn backend.app:app --reload"
```

Then wait 3 seconds and open your browser to:
```
http://127.0.0.1:8000/static/index.html
```

---

## 🚀 Method 2: Run Backend in Current Window

```powershell
cd c:\Users\ramir\OneDrive\Documents\GitHub\cougar-scheduler
$Env:GOOGLE_API_KEY = "AIzaSyBpgdcnJ-FBfhgaUAqPnFiFRSQ_Jwj4ABU"
python -m uvicorn backend.app:app --reload
```

Then open a **NEW** PowerShell window to test CLI or open your browser.

---

## 🚀 Method 3: Use the Launcher Scripts

**Option A: Double-click `start.ps1`**
- Right-click → "Run with PowerShell"

**Option B: Double-click `start.bat`**
- Just double-click (works in Command Prompt style)

---

## 💻 CLI Examples (Use AFTER Backend is Running)

Open a **second** PowerShell window:

```powershell
# Navigate to project
cd c:\Users\ramir\OneDrive\Documents\GitHub\cougar-scheduler

# Set API key
$Env:GOOGLE_API_KEY = "AIzaSyBpgdcnJ-FBfhgaUAqPnFiFRSQ_Jwj4ABU"

# Example 1: New student
python -m uh_grad_planner.cli --major CS_BS_2021_2022 --start Fall-2025 --max 15 --gemini-advice

# Example 2: With completed courses
python -m uh_grad_planner.cli --major CS_BS_2021_2022 --start Fall-2025 --completed "ENGL 1301,MATH 2413,COSC 1336" --max 15 --gemini-advice

# Example 3: Part-time student
python -m uh_grad_planner.cli --major CS_BS_2021_2022 --start Spring-2026 --completed "ENGL 1301" --max 12 --gemini-advice
```

---

## 🛑 How to Stop the Backend

If running in current window: Press `Ctrl+C`

If running in separate window: Close the window or press `Ctrl+C` in that window

---

## 🔍 Check if Backend is Running

```powershell
# Try to access the API
Invoke-WebRequest http://127.0.0.1:8000/api/majors
```

If it returns data, backend is running! ✅

---

## 🐛 Common Issues

**Error: "A parameter cannot be found that matches parameter name 'm'"**
- You're using CMD syntax in PowerShell
- Use the commands above instead

**Error: "Port already in use"**
- Backend is already running somewhere
- Close it first or use a different port:
  ```powershell
  python -m uvicorn backend.app:app --reload --port 8001
  ```

**Error: "Set GOOGLE_API_KEY in your environment"**
- Run this first:
  ```powershell
  $Env:GOOGLE_API_KEY = "AIzaSyBpgdcnJ-FBfhgaUAqPnFiFRSQ_Jwj4ABU"
  ```

---

## ✅ Recommended Workflow

1. **Start Backend:** Double-click `start.ps1` or use Method 1
2. **Wait 3 seconds** for it to start
3. **Open browser:** http://127.0.0.1:8000/static/index.html
4. **Use the web interface** - it's the easiest!

OR

1. **Open PowerShell Window 1:** Run backend with Method 2
2. **Open PowerShell Window 2:** Test CLI commands
3. **Keep Window 1 running** while you work

---

## 📝 One-Liner to Start Everything

```powershell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\ramir\OneDrive\Documents\GitHub\cougar-scheduler'; `$Env:GOOGLE_API_KEY='AIzaSyBpgdcnJ-FBfhgaUAqPnFiFRSQ_Jwj4ABU'; python -m uvicorn backend.app:app --reload"; Start-Sleep -Seconds 3; Start-Process "http://127.0.0.1:8000/static/index.html"
```

This will:
1. Start backend in new window
2. Wait 3 seconds
3. Open browser automatically

Copy and paste this into PowerShell! 🚀
