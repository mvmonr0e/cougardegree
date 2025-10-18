# 🗺️ Development Roadmap: Step-by-Step Guide

## Current Status ✅
- ✅ Basic scheduler algorithm working
- ✅ CLI interface functional
- ✅ Web frontend with API
- ✅ Gemini AI integration
- ✅ One sample major (CS BS 2021-2022)

---

## 🎯 PHASE 1: Data Collection & Validation (START HERE!)

### Step 1.1: Understand the Data Sources

**What data do we need for each major?**
1. **List of all required courses** (with course codes, names, credit hours)
2. **Prerequisites** (which courses must be taken before others)
3. **Recommended semester sequence** (UHin4 maps)
4. **Core curriculum requirements** (Texas common core)
5. **Electives and options**

**Where to get it:**

#### Option A: UHin4 Academic Maps (BEST STARTING POINT)
- **URL:** https://www.uh.edu/uhin4/academic-maps/
- **What:** Official 4-year plans for each major
- **Format:** PDFs with semester-by-semester layouts
- **Pros:** Official, comprehensive, already sequenced
- **Cons:** Need to parse PDFs

#### Option B: UH Course Catalog
- **URL:** http://publications.uh.edu/index.php
- **What:** Detailed course descriptions with prerequisites
- **Format:** Web pages
- **Pros:** Detailed prerequisite info
- **Cons:** Need to scrape/parse HTML

#### Option C: CougarGrades (SECONDARY DATA)
- **URL:** https://cougargrades.io
- **What:** Historical grade distributions, professor ratings
- **Format:** JSON API available
- **Pros:** Great for recommendations, not for requirements
- **Cons:** Doesn't have prerequisite or major requirement data
- **Use Case:** Add LATER for "this course is hard" warnings

---

### Step 1.2: Manual Data Collection (Do First!)

**Start with 3-5 popular majors manually:**

```
Priority Majors to Add:
1. Computer Science BS (already done ✅)
2. Biology BS
3. Psychology BA
4. Mechanical Engineering BS
5. Business Administration BBA
```

**Manual Process:**
1. Download UHin4 PDF for the major
2. Open the JSON template: `data/maps/CS_BS_2021-2022.json`
3. Copy the structure
4. Fill in courses from the PDF
5. Add prerequisites by cross-referencing the catalog
6. Test with the planner

**Let me create a template and helper script...**

---

### Step 1.3: Automated Data Extraction (Do Second!)

**Build scrapers/parsers:**

1. **PDF Parser for UHin4 Maps**
   - Tool: `pdfplumber` (already installed)
   - Input: UHin4 PDF files
   - Output: Structured JSON
   - Optional: Use Gemini AI to help parse messy text

2. **Catalog Scraper for Prerequisites**
   - Tool: `beautifulsoup4` (already installed)
   - Input: UH catalog course pages
   - Output: Prerequisite mappings
   - Challenge: Prerequisites are written in English, need to parse

3. **Validation Tool**
   - Check for circular prerequisites
   - Verify credit hour totals (should be ~120)
   - Ensure all prerequisites are in the course list

---

## 🎯 PHASE 2: Enhanced Scheduling Logic

### Step 2.1: Improve Prerequisite Handling
- Handle corequisites (courses taken together)
- Support "OR" prerequisites (MATH 1313 OR MATH 1314)
- Handle prerequisite chains better
- Validate that 120 credits are actually planned

### Step 2.2: Add Constraints
- Mark courses as "Fall only" or "Spring only"
- Handle course rotations (offered every other year)
- Add capacity planning (popular courses fill up)
- Support minor requirements

### Step 2.3: Course Offering Data
- Scrape historical class schedule data
- Build a model: "COSC 3320 is offered every Fall and Spring"
- Add warnings: "This course may not be available in Spring"

---

## 🎯 PHASE 3: Smarter Planning

### Step 3.1: Optimization
- Balance difficulty across semesters (using CougarGrades data!)
- Minimize time-to-graduation
- Optimize for specific goals (finish prereqs ASAP, spread out hard courses)

### Step 3.2: CougarGrades Integration (NOW THIS IS WHERE COUGARGRADES HELPS!)
- **Grade Distributions:** "This course has a 2.4 average GPA"
- **Professor Ratings:** "Prof. Smith has higher pass rates"
- **Difficulty Scores:** Balance hard and easy courses
- **Section Recommendations:** Suggest best sections

### Step 3.3: Smart Recommendations
- "You're taking 3 hard courses this semester - consider spreading them out"
- "COSC 3320 with Dr. Johnson has a 92% pass rate"
- "This schedule has you taking all your hardest courses in one semester"

---

## 🎯 PHASE 4: User Experience

### Step 4.1: Better Frontend
- Drag-and-drop course scheduling
- Visual prerequisite graph (use networkx!)
- Course search and filtering
- Save/load plans
- Compare multiple plan options

### Step 4.2: Personalization
- Import unofficial transcripts
- Transfer credit evaluation
- Multiple major/minor support
- Part-time vs full-time optimization

### Step 4.3: Collaboration
- Share plans with advisors
- Advisor approval workflow
- Comments and notes
- Version history

---

## 🎯 PHASE 5: Production Ready

### Step 5.1: Data Management
- Database instead of JSON files (PostgreSQL)
- Automated data updates (scrape catalog quarterly)
- Version control for catalog years
- Data validation and testing

### Step 5.2: Deployment
- Deploy backend (Railway, Heroku, or AWS)
- Deploy frontend (Vercel, Netlify)
- Set up monitoring and logging
- Create user accounts and authentication

### Step 5.3: Scale
- Handle many majors and catalog years
- Performance optimization
- Caching frequently-used plans
- Rate limiting for Gemini API

---

## 📋 RECOMMENDED NEXT STEPS (In Order)

### Week 1: Manual Data Collection
```
[ ] Download 5 UHin4 PDFs for different majors
[ ] Create JSON files manually for each
[ ] Test each major with the planner
[ ] Document any issues or edge cases
```

### Week 2: Basic Automation
```
[ ] Build PDF parser for UHin4 maps
[ ] Use Gemini to help parse course text
[ ] Create validation script for JSON files
[ ] Add 10 more majors
```

### Week 3: Prerequisites
```
[ ] Scrape prerequisite data from catalog
[ ] Build prerequisite validator
[ ] Handle OR prerequisites
[ ] Add corequisites support
```

### Week 4: Course Offerings
```
[ ] Scrape class schedule for past 3 semesters
[ ] Build offering frequency model
[ ] Add "likely offered" flags
[ ] Add warnings for rarely-offered courses
```

### Week 5: CougarGrades Integration
```
[ ] Connect to CougarGrades API
[ ] Add grade distribution display
[ ] Add difficulty balancing
[ ] Show professor recommendations
```

### Week 6: Frontend Polish
```
[ ] Improve UI/UX
[ ] Add drag-and-drop
[ ] Add prerequisite visualization
[ ] Mobile responsive design
```

---

## 🤔 ANSWER TO YOUR QUESTION

**Should we first figure out how we get the data for each major from CougarGrades?**

**Short Answer:** No, start with **UHin4 maps** first, then catalog, then CougarGrades last.

**Why this order?**

1. **UHin4 Maps** = Required courses and sequence (MUST HAVE)
2. **UH Catalog** = Prerequisites (MUST HAVE)
3. **CougarGrades** = Helpful suggestions (NICE TO HAVE)

**CougarGrades doesn't tell you:**
- ❌ What courses are required for a major
- ❌ What prerequisites exist
- ❌ The recommended sequence

**CougarGrades tells you:**
- ✅ How hard a course is (average GPA)
- ✅ Which professors are better
- ✅ Historical grade distributions

**So CougarGrades is for ENHANCEMENT, not core functionality.**

---

## 🎯 YOUR IMMEDIATE NEXT STEP

**I recommend: Start with Step 1.2 - Manual Data Collection**

Let me create a helper script to make adding new majors easy...

Would you like me to:
1. **Create a script to help you add new majors manually?** (Quick wins)
2. **Build the PDF parser to automate UHin4 extraction?** (More scalable)
3. **Create the catalog scraper for prerequisites?** (Most complex)
4. **Show you how to integrate CougarGrades API?** (For later)

Which direction interests you most?
