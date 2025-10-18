# 🚀 How to Start the Backend

## Quick Start (Copy-Paste This!)

### Open PowerShell in your project folder and run:

```powershell
# Navigate to project
cd c:\Users\ramir\OneDrive\Documents\GitHub\cougar-scheduler

# Set your Gemini API key
$Env:GOOGLE_API_KEY="AIzaSyBpgdcnJ-FBfhgaUAqPnFiFRSQ_Jwj4ABU"

# Start the backend
python -m uvicorn backend.app:app --reload
```

That's it! 🎉

---

## What You'll See:

```
INFO:     Will watch for changes in these directories: ['C:\\Users\\ramir\\...']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using WatchFiles
INFO:     Started server process [67890]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

---

## Then Open Your Browser:

Go to: **http://127.0.0.1:8000/static/index.html**

Or try the API docs: **http://127.0.0.1:8000/docs**

---

## Alternative: One-Liner to Start Everything

```powershell
$Env:GOOGLE_API_KEY="AIzaSyBpgdcnJ-FBfhgaUAqPnFiFRSQ_Jwj4ABU"; python -m uvicorn backend.app:app --reload; Start-Sleep 3; Start-Process "http://127.0.0.1:8000/static/index.html"
```

This will:
1. Set the API key
2. Start the backend
3. Wait 3 seconds
4. Open your browser automatically

---

## To Stop the Backend:

Press **`Ctrl+C`** in the terminal

---

## Troubleshooting

### "Module not found" error?
```powershell
# Make sure you're in the right directory
cd c:\Users\ramir\OneDrive\Documents\GitHub\cougar-scheduler

# Make sure dependencies are installed
pip install -e ".[dev]"
```

### "Port already in use" error?
```powershell
# Either close the other process, or use a different port:
python -m uvicorn backend.app:app --reload --port 8001
# Then open: http://127.0.0.1:8001/static/index.html
```

### "Set GOOGLE_API_KEY" error?
```powershell
# Set it first:
$Env:GOOGLE_API_KEY="AIzaSyBpgdcnJ-FBfhgaUAqPnFiFRSQ_Jwj4ABU"
```

---

## Using the Launcher Scripts

### Option 1: PowerShell Script
Right-click **`start.ps1`** → Run with PowerShell

### Option 2: Batch File
Double-click **`start.bat`**

Both will:
- Start the backend automatically
- Open your browser
- Keep running until you close the window

---

## Development Workflow

```
Terminal 1 (Backend):
├─ cd cougar-scheduler
├─ $Env:GOOGLE_API_KEY="..."
└─ python -m uvicorn backend.app:app --reload
   (Keep this running!)

Browser:
└─ http://127.0.0.1:8000/static/index.html
   (Use the web interface)

Terminal 2 (Optional - for CLI testing):
├─ cd cougar-scheduler  
├─ $Env:GOOGLE_API_KEY="..."
└─ python -m uh_grad_planner.cli --major CS_BS_2021_2022 --start Fall-2025 --gemini-advice
```

---

## Pro Tip: Create a Shortcut

Create a `.ps1` file with this content:

```powershell
Set-Location "c:\Users\ramir\OneDrive\Documents\GitHub\cougar-scheduler"
$Env:GOOGLE_API_KEY="AIzaSyBpgdcnJ-FBfhgaUAqPnFiFRSQ_Jwj4ABU"
python -m uvicorn backend.app:app --reload
```

Save it as `start-backend.ps1` and double-click to run!

---

## Summary

**Simplest command:**
```powershell
python -m uvicorn backend.app:app --reload
```

**From anywhere:**
```powershell
cd c:\Users\ramir\OneDrive\Documents\GitHub\cougar-scheduler
python -m uvicorn backend.app:app --reload
```

**With Gemini:**
```powershell
$Env:GOOGLE_API_KEY="AIzaSyBpgdcnJ-FBfhgaUAqPnFiFRSQ_Jwj4ABU"
python -m uvicorn backend.app:app --reload
```

That's all you need! 🚀
