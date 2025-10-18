# UH Grad Planner - Development Backlog

## High Priority Features

### 1. PDF Parsing for UHin4 Maps
- **Goal**: Automatically parse UHin4 academic map PDFs into structured JSON
- **Approach**: 
  - Use `pdfplumber` to extract raw text from PDF files
  - Feed extracted text to `parse_map_text_to_courses()` in `ai/gemini.py` for normalization
  - Store normalized JSON in `data/maps/` directory
- **Benefits**: Eliminates manual JSON creation, supports all majors automatically

### 2. Catalog Scraper for Prerequisites
- **Goal**: Enrich course prerequisite data by scraping the UH course catalog
- **Approach**:
  - Use `beautifulsoup4` and `requests` to scrape catalog program pages
  - Extract prerequisite relationships and corequisites
  - Update `DegreeMap` courses with complete prerequisite chains
- **Benefits**: More accurate prerequisite enforcement, better schedule validation

### 3. Class Offering Integration
- **Goal**: Mark courses as "likely offered" based on historical data
- **Approach**:
  - Cache public class search snapshots for past semesters
  - Build a frequency model for each course by term (Fall/Spring)
  - Add an `offered_terms` field to `CourseDef`
  - Update scheduler to prefer courses likely to be offered
- **Benefits**: More realistic schedules, avoids planning courses that may not be available

### 4. CougarGrades Integration
- **Goal**: Display grade distribution data to help students make informed decisions
- **Approach**:
  - Integrate with CougarGrades dataset/API
  - Show average GPA, pass rates, and instructor ratings for each course
  - Add optional `--show-grades` flag to CLI
- **Benefits**: Helps students understand course difficulty and plan workload

## Medium Priority Enhancements

### 5. Summer Term Support
- **Goal**: Allow students to include summer terms in their plan
- **Approach**:
  - Extend `next_terms()` to support Fall/Spring/Summer rotation
  - Add `--include-summer` flag to CLI
  - Handle reduced summer course offerings

### 6. Part-Time Student Support
- **Goal**: Support students taking fewer credits per term
- **Approach**:
  - Already supports `--max` credits per term
  - Extend term generation beyond 8 terms if needed
  - Add flexible graduation timeline

### 7. Transfer Credit Import
- **Goal**: Import transfer credits from other institutions
- **Approach**:
  - Add `--transfer-file` option to read CSV of transferred courses
  - Map transfer courses to UH equivalents
  - Mark as completed in the initial state

### 8. Multiple Major/Minor Support
- **Goal**: Plan schedules for double majors or majors with minors
- **Approach**:
  - Support loading multiple `DegreeMap` objects
  - Merge course requirements with overlap detection
  - Optimize shared courses

## Low Priority / Future Ideas

### 9. Web Interface
- **Goal**: Create a user-friendly web UI for the planner
- **Technology**: FastAPI backend + React/Vue frontend
- **Features**: Drag-and-drop course reordering, visual prerequisite graph

### 10. Schedule Export
- **Goal**: Export to calendar formats (iCal, Google Calendar)
- **Benefits**: Easy integration with personal calendars

### 11. Advisor Collaboration
- **Goal**: Allow advisors to review and approve student plans
- **Approach**: Multi-user system with permissions

### 12. Real-Time Class Search Integration
- **Goal**: Direct integration with UH's live class search
- **Challenges**: May require official API access or partnership

---

## Setup Reminders

To run with Gemini integration:

**Windows PowerShell:**
```powershell
$Env:GOOGLE_API_KEY="YOUR_GEMINI_API_KEY"
python -m uh_grad_planner.cli --major CS_BS_2021_2022 --start Fall-2025 --completed "ENGL 1301,MATH 2413" --max 15 --gemini-advice
```

**Linux/macOS:**
```bash
export GOOGLE_API_KEY="YOUR_GEMINI_API_KEY"
python -m uh_grad_planner.cli --major CS_BS_2021_2022 --start Fall-2025 --completed "ENGL 1301,MATH 2413" --max 15 --gemini-advice
```
