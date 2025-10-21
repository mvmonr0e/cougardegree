# CougarDegree - AI-Powered Degree Planning

This project is a full-stack web application that helps UH students plan their degree. It allows users to input the classes they have taken so far and the semester they started. It then builds a balanced degree plan based on degree requirement data with proper prerequisite validation.

## 🎯 Features

- **Smart Course Scheduling**: Automatically schedules courses based on prerequisites
- **40+ Degree Programs**: Supports Computer Science, Engineering, Business, and more
- **Prerequisite Validation**: Ensures all prerequisites are met before scheduling courses
- **Co-requisite Handling**: Schedules labs with their corresponding lectures
- **Progress Tracking**: Shows completed credits and remaining requirements
- **Flexible Start Dates**: Start from any Fall or Spring semester
- **Credit Balancing**: Targets 15 credits per semester (12-18 range)

## 📋 Inputs
- Student Major (40+ options available)
- Start Semester  
- Classes taken so far (comma-separated course codes)

## 🎓 Assumptions
- Graduate in 4 years (8 semesters)
- Full-time student (12-18 credits per semester)
- No summer classes
- Target 15 credit hours per semester

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Modern web browser

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file** (optional - Gemini AI not currently used)
   ```bash
   cp .env.example .env
   ```

4. **Start the backend server**
   ```bash
   npm start
   ```

   The backend will run on `http://localhost:3001`

5. **Test the scheduler** (optional)
   ```bash
   node test-scheduler.js
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the frontend server**
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`

4. **Open in browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
cougar-scheduler/
├── backend/
│   ├── services/
│   │   └── degreePlanningService.js  # Core scheduling logic
│   ├── degrees/                      # Degree requirement JSONs
│   │   ├── cosc_bs.json             # Computer Science
│   │   ├── cis_bs.json              # CIS
│   │   ├── math_bs.json             # Mathematics
│   │   └── ... (40+ more)
│   ├── server.js                     # Express API server
│   ├── test-scheduler.js            # Test suite
│   └── package.json
├── frontend/
│   ├── index.html                    # Main UI
│   ├── script.js                     # Frontend logic
│   ├── styles.css                    # Styling
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### GET `/health`
Health check endpoint
```json
{
  "status": "OK",
  "timestamp": "2025-10-20T12:00:00Z",
  "service": "CougarDegree Backend"
}
```

### GET `/api/majors`
Get list of available majors
```json
{
  "success": true,
  "data": [
    "B.S. in Computer Science",
    "B.S. in Computer Information Systems",
    ...
  ]
}
```

### POST `/api/degree-plan`
Generate degree plan

**Request:**
```json
{
  "major": "B.S. in Computer Science",
  "credits": 120,
  "preferences": {},
  "currentCourses": ["ENGL 1301", "MATH 2413"],
  "startSemester": "Fall 2025"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "degreePlan": {
      "major": "B.S. in Computer Science",
      "totalCredits": 120,
      "semesters": [
        {
          "semester": 1,
          "semesterName": "Fall 2025",
          "totalCredits": 15,
          "courses": [...]
        }
      ]
    },
    "metadata": {
      "generatedAt": "2025-10-20T12:00:00Z",
      "creditsScheduled": 105,
      "creditsCompleted": 7,
      "creditsRemaining": 113
    }
  }
}
```

## 🧪 Testing

Run the test suite to verify the scheduler:

```bash
cd backend
node test-scheduler.js
```

This will:
- Test new student scheduling
- Test with completed courses
- Verify prerequisite enforcement
- Check credit distribution

## 🎨 Key Features Explained

### Prerequisite Validation
The scheduler ensures all prerequisites are met before scheduling a course:
- COSC 1437 requires COSC 1336
- COSC 2436 requires COSC 1437
- Handles "OR" prerequisites (e.g., "MATH 2413 or MATH 2313")

### Co-requisite Handling
Automatically pairs lectures with labs:
- PHYS 1301 (lecture) + PHYS 1101 (lab)
- CHEM 1331 (lecture) + CHEM 1111 (lab)

### Course Priority System
1. **Required courses** before electives
2. **Lower-level courses** (1000-2000) before upper-level
3. **Critical path courses** (with many prerequisites) scheduled early
4. **Alphabetical** as tiebreaker

### Credit Balancing
- Minimum: 12 credits per semester
- Target: 15 credits per semester
- Maximum: 18 credits per semester

## 🐛 Known Issues & Future Improvements

### Current Limitations
- No semester-specific availability (assumes all courses offered every semester)
- No consideration of course difficulty balance
- No integration with real-time UH course catalog
- Gemini AI integration commented out (using deterministic algorithm)

### Future Enhancements
- [ ] Add summer semester support
- [ ] Integrate with UH course catalog API
- [ ] Add course difficulty ratings
- [ ] Support for minors and certificates
- [ ] Export to PDF/Calendar
- [ ] Mobile app version
- [ ] Re-enable Gemini AI for personalized recommendations

## 📊 Degree Data

Degree requirements are stored in JSON format in `backend/degrees/`. Each file contains:
- Major name
- Total credit hours
- Graduation rules
- All required courses with:
  - Course ID (e.g., "COSC 3320")
  - Course name
  - Credits
  - Prerequisites
  - Requirement type
  - Level (1000, 2000, 3000, 4000)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add/update degree JSON files or improve scheduling logic
4. Test with `test-scheduler.js`
5. Submit a pull request

## 📝 License

MIT License - feel free to use this project for educational purposes!

## 👥 Authors

CougarDegree Team - University of Houston Hackathon 2025

---

**Note**: This tool is for planning purposes only. Always consult with an academic advisor before making course registration decisions.