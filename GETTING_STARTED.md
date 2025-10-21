# 🚀 Quick Start Guide

## Installation & Running (Windows PowerShell)

### Step 1: Start Backend Server

```powershell
# Open PowerShell in the project root directory
cd backend

# Install dependencies (first time only)
npm install

# Start the backend server
npm start
```

You should see:
```
🚀 CougarDegree Backend running on port 3001
📊 Health check: http://localhost:3001/health
🎓 Degree planning: http://localhost:3001/api/degree-plan
📚 Loaded 40+ degree programs
```

**Keep this PowerShell window open!**

### Step 2: Start Frontend Server

Open a **NEW** PowerShell window:

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies (first time only)
npm install

# Start the frontend server
npm start
```

The frontend will automatically open in your browser at `http://localhost:3000`

### Step 3: Use the Application

1. Select your major from the dropdown
2. Choose your start semester
3. Enter any courses you've already completed (comma-separated)
   - Example: `ENGL 1301, MATH 2413, COSC 1336`
4. Click "Generate My Degree Plan"
5. View your personalized 4-year schedule!

---

## Testing the Scheduler

To verify the scheduling algorithm works correctly:

```powershell
cd backend
node test-scheduler.js
```

This will run automated tests and show:
- ✅ Schedule generation for new students
- ✅ Schedule with completed courses
- ✅ Prerequisite validation
- ✅ Credit distribution across semesters

---

## Troubleshooting

### Backend won't start
- **Error**: `Cannot find module 'express'`
  - **Fix**: Run `npm install` in the backend directory

- **Error**: `Port 3001 is already in use`
  - **Fix**: Close any other app using port 3001, or change the PORT in `.env`

### Frontend won't start
- **Error**: `Cannot find module 'express'`
  - **Fix**: Run `npm install` in the frontend directory

- **Error**: `Port 3000 is already in use`
  - **Fix**: The frontend server will offer to use a different port, press Y

### Cannot connect to backend
- **Error**: `Failed to fetch` or `Network Error`
  - **Fix**: Make sure backend server is running on port 3001
  - **Check**: Visit http://localhost:3001/health in your browser

### No majors showing in dropdown
- **Issue**: Dropdown shows "Select your major" but no options
  - **Fix**: Check backend console for errors loading JSON files
  - **Check**: Ensure `backend/degrees/` folder has JSON files

---

## Available Majors

The system currently supports 40+ degree programs including:

**College of Natural Sciences & Mathematics:**
- B.S. in Computer Science
- B.S. in Computer Information Systems
- B.S. in Mathematics
- B.S. in Physics
- B.S. in Chemistry
- B.S. in Biology
- And more...

**College of Engineering:**
- B.S. in Computer Engineering
- B.S. in Electrical Engineering
- B.S. in Mechanical Engineering
- B.S. in Civil Engineering
- B.S. in Chemical Engineering
- And more...

**Bauer College of Business:**
- BBA in Accounting
- BBA in Finance
- BBA in Marketing
- BBA in Management
- BBA in Supply Chain Management

**College of Liberal Arts & Social Sciences:**
- B.A. in English
- B.A. in History
- B.A. in Political Science
- B.A. in Communication
- B.S. in Social Work

And many more! Check the full list in the application dropdown.

---

## Tips for Best Results

1. **Enter courses exactly as they appear**: Use format like `COSC 1336`, not `cosc1336`
2. **Separate multiple courses with commas**: `MATH 2413, ENGL 1301, HIST 1301`
3. **Include all completed courses**: The more info you provide, the better the schedule
4. **Review prerequisites**: Hover over courses to see prerequisite requirements
5. **Consult an advisor**: This tool is for planning only - always verify with your advisor

---

## Next Steps

- ✅ Generate your degree plan
- 📋 Save/screenshot your schedule
- 🎓 Discuss with academic advisor
- 📚 Register for courses based on the plan

**Questions?** Check the main README.md or open an issue on GitHub!
