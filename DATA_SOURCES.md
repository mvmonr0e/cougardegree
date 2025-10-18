# 📊 Data Sources & Flow Diagram

## Where Data Comes From

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA SOURCES                              │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│   UHin4 PDFs  │  │  UH Catalog   │  │ CougarGrades  │
│               │  │   Web Pages   │  │      API      │
│ • Course list │  │ • Prerequisites│  │ • Grade dist. │
│ • Sequence    │  │ • Descriptions│  │ • Difficulty  │
│ • Credits     │  │ • Corequisites│  │ • Professors  │
└───────┬───────┘  └───────┬───────┘  └───────┬───────┘
        │                   │                   │
        │ Parse             │ Scrape            │ API Call
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  PDF Parser   │  │    Web        │  │  CougarGrades │
│  (pdfplumber) │  │   Scraper     │  │   Client      │
│               │  │(beautifulsoup)│  │               │
└───────┬───────┘  └───────┬───────┘  └───────┬───────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                            ▼
                  ┌───────────────────┐
                  │   Gemini AI       │
                  │  (Optional)       │
                  │ • Parse messy text│
                  │ • Normalize data  │
                  └─────────┬─────────┘
                            │
                            ▼
                  ┌───────────────────┐
                  │  Data Validator   │
                  │                   │
                  │ • Check prereqs   │
                  │ • Verify credits  │
                  │ • Find conflicts  │
                  └─────────┬─────────┘
                            │
                            ▼
                  ┌───────────────────┐
                  │   JSON Files      │
                  │  data/maps/*.json │
                  │                   │
                  │ {                 │
                  │   "major_id": ... │
                  │   "courses": [...] │
                  │   "prereqs": [...] │
                  │ }                 │
                  └─────────┬─────────┘
                            │
                            ▼
                  ┌───────────────────┐
                  │   Scheduler       │
                  │   Algorithm       │
                  │                   │
                  │ • Apply constraints│
                  │ • Sequence courses│
                  │ • Generate plan   │
                  └─────────┬─────────┘
                            │
                            ▼
                  ┌───────────────────┐
                  │  Enhancement      │
                  │  (CougarGrades)   │
                  │                   │
                  │ • Add difficulty  │
                  │ • Balance load    │
                  │ • Suggest profs   │
                  └─────────┬─────────┘
                            │
                            ▼
                  ┌───────────────────┐
                  │   Final Plan      │
                  │                   │
                  │ Fall 2025: ...    │
                  │ Spring 2026: ...  │
                  │ ...               │
                  └───────────────────┘
```

---

## Priority Order

### 🔴 CRITICAL (Must Have)
1. **UHin4 Maps** → Course lists and sequences
2. **UH Catalog** → Prerequisites

### 🟡 IMPORTANT (Should Have)
3. **Class Schedule History** → Course offering patterns

### 🟢 NICE TO HAVE (Enhancement)
4. **CougarGrades** → Difficulty and recommendations

---

## Data Quality Comparison

| Source | Accuracy | Completeness | Ease of Access | Update Frequency |
|--------|----------|--------------|----------------|------------------|
| **UHin4 PDFs** | ⭐⭐⭐⭐⭐ Official | ⭐⭐⭐⭐ 80-90% | ⭐⭐⭐ Moderate | Yearly |
| **UH Catalog** | ⭐⭐⭐⭐⭐ Official | ⭐⭐⭐⭐⭐ Complete | ⭐⭐ Difficult | Yearly |
| **Class Schedule** | ⭐⭐⭐⭐ Reliable | ⭐⭐⭐ Varies | ⭐⭐⭐ Moderate | Every semester |
| **CougarGrades** | ⭐⭐⭐⭐ Crowdsourced | ⭐⭐⭐ 60-70% | ⭐⭐⭐⭐⭐ Easy API | Continuous |

---

## Example: How Data Flows for One Major

### Step 1: Get Course List (UHin4)
```
Input: CS_BS_2021-2022.pdf
Output: 
  - COSC 1336 (3 credits)
  - COSC 1437 (4 credits)
  - MATH 2413 (4 credits)
  - ...
```

### Step 2: Add Prerequisites (Catalog)
```
Input: http://publications.uh.edu/content.php?catoid=46&navoid=17447
Output:
  - COSC 1437 requires COSC 1336
  - MATH 2414 requires MATH 2413
  - COSC 2436 requires COSC 1437
  - ...
```

### Step 3: Add Offering Info (Class Schedule)
```
Input: Historical class schedule data
Output:
  - COSC 1336: Offered Fall, Spring, Summer
  - COSC 4351: Offered Fall only
  - COSC 4395: Offered every other Spring
  - ...
```

### Step 4: Enhance with CougarGrades (Optional)
```
Input: CougarGrades API
Output:
  - COSC 1336: Average GPA 2.8 (moderate difficulty)
  - COSC 3320: Average GPA 2.3 (hard)
  - MATH 2413: Average GPA 2.1 (very hard)
  - ...
```

### Step 5: Generate Plan
```
The scheduler uses all this data to:
1. Sequence courses properly (prerequisites)
2. Avoid impossible schedules (offering patterns)
3. Balance difficulty (CougarGrades)
4. Warn about issues
```

---

## What CougarGrades is GOOD for:

✅ **Grade Distributions**
- "COSC 3320 has a 2.3 average GPA - it's tough!"
- "75% of students get B or better in ENGL 1301"

✅ **Professor Comparisons**
- "Dr. Smith's COSC 1437 has 85% pass rate"
- "Dr. Jones's section averages 3.2 GPA"

✅ **Workload Balancing**
- "You're taking 3 courses with <2.5 GPA average this semester"
- "Consider swapping one for an easier course"

✅ **Historical Trends**
- "This course got easier after curriculum change in Fall 2023"
- "Summer sections tend to have higher GPAs"

---

## What CougarGrades is NOT good for:

❌ **Degree Requirements**
- Doesn't tell you what courses your major needs

❌ **Prerequisites**
- Doesn't have prerequisite information

❌ **Course Sequences**
- Doesn't know recommended ordering

❌ **Credit Hours**
- Doesn't track credit counts

---

## Recommended Approach

### Phase 1: Core Data (Do First!)
```python
# 1. Manually create 5 major JSON files from UHin4 PDFs
# 2. Build validation tools
# 3. Test the scheduler thoroughly
```

### Phase 2: Automate (Do Second!)
```python
# 1. Build PDF parser
# 2. Build catalog scraper
# 3. Add 20-30 more majors
```

### Phase 3: Enhance (Do Third!)
```python
# 1. Integrate CougarGrades
# 2. Add difficulty scoring
# 3. Improve recommendations
```

---

## Next Steps Checklist

- [ ] Pick 3-5 more majors to add manually
- [ ] Download their UHin4 PDFs
- [ ] Create JSON files using CS as template
- [ ] Test each one
- [ ] Document edge cases
- [ ] Then decide: automate or add more manually?

Would you like me to help you:
1. **Create JSON templates for new majors?**
2. **Build the PDF parser?**
3. **Show CougarGrades API usage?**
