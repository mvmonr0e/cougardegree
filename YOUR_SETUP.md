# ✅ Your UH Grad Planner is Ready!

## 🔑 Your Gemini API Key
```
AIzaSyBpgdcnJ-FBfhgaUAqPnFiFRSQ_Jwj4ABU
```
**Status:** ✅ Configured and Working!

## 🌐 Web Interface
**URL:** http://127.0.0.1:8000/static/index.html
**Status:** ✅ Running (opened in Simple Browser)

### How to Use:
1. Fill in the form:
   - Major: Computer Science BS (2021-2022)
   - Start Term: Fall-2025 or Spring-2026
   - Completed Courses: `ENGL 1301, MATH 2413` (comma-separated)
   - Max Credits: 15 (or adjust)
   - ✅ Check "Use AI Advisor" for Gemini advice

2. Click **"Generate My Plan"**

3. See your 8-semester graduation plan with:
   - Courses organized by semester
   - Credit counts
   - AI-generated advisor notes
   - Warnings about prerequisites

## 💻 Command Line Interface
```powershell
# Set API key (if not already set)
$Env:GOOGLE_API_KEY="AIzaSyBpgdcnJ-FBfhgaUAqPnFiFRSQ_Jwj4ABU"

# Generate plan without AI
python -m uh_grad_planner.cli --major CS_BS_2021_2022 --start Fall-2025 --completed "ENGL 1301,MATH 2413" --max 15

# Generate plan WITH AI advice
python -m uh_grad_planner.cli --major CS_BS_2021_2022 --start Fall-2025 --completed "ENGL 1301,MATH 2413" --max 15 --gemini-advice
```

## 🚀 Backend Server
**Status:** ✅ Running on http://127.0.0.1:8000
**API Docs:** http://127.0.0.1:8000/docs

### To Stop/Restart:
```powershell
# Press Ctrl+C in the terminal to stop

# To restart with API key:
$Env:GOOGLE_API_KEY="AIzaSyBpgdcnJ-FBfhgaUAqPnFiFRSQ_Jwj4ABU"
cd c:\Users\ramir\OneDrive\Documents\GitHub\cougar-scheduler
python -m uvicorn backend.app:app --reload --host 127.0.0.1 --port 8000
```

## 🧪 Tested & Working

✅ CLI without Gemini
✅ CLI with Gemini AI advisor
✅ Web frontend
✅ Backend API
✅ Gemini API integration

### Example AI Feedback You'll Get:
The AI analyzes your plan and provides:
- Credit load balance assessment
- Prerequisite progression validation
- Red flags (missing prerequisites, sequencing errors)
- Actionable recommendations
- Total credits analysis

## 📁 Project Files

```
cougar-scheduler/
├── frontend/
│   ├── index.html        ← Web UI (UH themed)
│   └── app.js           ← JavaScript API calls
├── backend/
│   └── app.py           ← FastAPI server
├── src/uh_grad_planner/
│   ├── cli.py           ← Command-line tool
│   ├── core/            ← Scheduler logic
│   └── ai/gemini.py     ← Gemini integration
├── data/maps/
│   └── CS_BS_2021-2022.json  ← Course data
└── tests/               ← Test suite
```

## 🎯 What's Next?

1. **Try the web interface** - It's already open!
2. **Add more majors** - Create JSON files in `data/maps/`
3. **Customize the UI** - Edit `frontend/index.html`
4. **Deploy it** - Use Vercel (frontend) + Railway (backend)

## 🆘 Troubleshooting

**"Set GOOGLE_API_KEY in your environment"**
```powershell
$Env:GOOGLE_API_KEY="AIzaSyBpgdcnJ-FBfhgaUAqPnFiFRSQ_Jwj4ABU"
```

**Backend not responding**
- Make sure it's running (check terminal)
- Restart if needed (see commands above)

**Frontend can't connect**
- Check that backend is on port 8000
- Look at browser console for errors

## 📚 Documentation

- `README.md` - Project overview
- `QUICKSTART.md` - CLI usage
- `FRONTEND_GUIDE.md` - Web interface setup
- `setup_gemini.md` - Gemini API details
- `BACKLOG.md` - Future features

---

**Your graduation planner is fully functional!** 🎓🚀

Go Coogs! 🐾
