# 💾 Database Strategy: Do You Need One?

## Short Answer: **NO, not yet!** (and especially not for PDFs)

---

## What You Actually Need to Store

### ❌ DON'T Store:
- **PDFs themselves** - These are source materials, not runtime data
- **Raw HTML** - Just scrape when needed
- **Temporary data** - Process and discard

### ✅ DO Store:
- **Processed course data** (JSON files work great for now!)
- **Degree requirements** (JSON)
- **Prerequisites** (JSON)
- **User plans** (later, when you have users)

---

## Current Architecture (Simple & Effective)

```
📁 Project Structure
├── data/
│   ├── maps/                    ← Degree plan JSON files
│   │   ├── CS_BS_2021-2022.json
│   │   ├── BIOL_BS_2021-2022.json
│   │   └── PSYCH_BA_2021-2022.json
│   │
│   ├── raw/                     ← Source PDFs (git ignored)
│   │   ├── CS_UHin4_2021.pdf
│   │   └── BIOL_UHin4_2021.pdf
│   │
│   └── cache/                   ← Scraped data (git ignored)
│       ├── catalog_prereqs.json
│       └── class_offerings.json
│
├── src/uh_grad_planner/
│   └── ...                      ← Code reads JSON files
│
└── backend/app.py               ← API loads JSON on demand
```

---

## Why JSON Files Work Great For Now

### ✅ Advantages:
1. **Simple** - No database setup needed
2. **Version Control** - Track changes in git
3. **Fast** - Load instantly, no queries
4. **Portable** - Works anywhere Python runs
5. **Easy to Edit** - Can manually fix issues
6. **No Scaling Issues** - Even 100 majors = ~10MB total

### ⚠️ When It Becomes a Problem:
- 🔴 **NOT a problem now** with 1-50 majors
- 🟡 **Maybe a problem** with 100+ majors
- 🔴 **Definitely a problem** when you have:
  - Thousands of users
  - User accounts and saved plans
  - Real-time updates
  - Concurrent edits

---

## Storage Strategy by Data Type

### 1. PDFs (Source Materials)

**Where:** Local `data/raw/` folder (git ignored)

**Why:**
- Only used during data extraction
- Not needed at runtime
- Don't change often
- Can re-download if lost

```
data/
  raw/
    uhin4_pdfs/
      CS_BS_2021-2022.pdf
      BIOL_BS_2021-2022.pdf
    catalog_pages/
      saved_html_files...
```

### 2. Processed Course Data (JSON)

**Where:** `data/maps/` (committed to git)

**Why:**
- This IS your "database"
- Small files (~50KB each)
- Human-readable
- Version controlled
- Fast to load

```json
{
  "major_id": "CS_BS_2021_2022",
  "catalog_year": "2021-2022",
  "courses": [...],
  "recommended_order": [...]
}
```

### 3. Scraped Data (Cache)

**Where:** `data/cache/` (git ignored)

**Why:**
- Can regenerate by scraping again
- Changes frequently
- No need to version control

```json
{
  "COSC 1336": {
    "offered": ["Fall", "Spring", "Summer"],
    "last_updated": "2025-10-18"
  }
}
```

### 4. User Data (Future)

**Where:** PostgreSQL or similar (when you have users)

**What:**
- User accounts
- Saved plans
- Progress tracking
- Settings

---

## When You WILL Need a Database

### Phase 1 (Now): NO DATABASE ✅
```
- 1-50 majors
- JSON files
- No user accounts
- Read-only data
```

### Phase 2 (Soon): MAYBE DATABASE 🤔
```
- 50-200 majors
- Still JSON might work
- Consider SQLite for simplicity
```

### Phase 3 (Production): YES DATABASE 🔴
```
- User accounts
- Saved plans
- Real-time updates
- Multiple catalog years
- PostgreSQL recommended
```

---

## Recommended Approach

### Right Now (Weeks 1-4)

**Use JSON files:**
```python
# Load data
with open('data/maps/CS_BS_2021-2022.json') as f:
    cs_major = json.load(f)

# Use data
scheduler.plan(cs_major, ...)
```

**Store PDFs locally:**
```
data/raw/
  - Downloaded manually
  - Not in git (.gitignore them)
  - Delete after processing
```

### Later (Months 1-3)

**Add SQLite for caching:**
```python
# Cache scraped data
import sqlite3
conn = sqlite3.connect('data/cache.db')
# Store class schedules, prerequisites, etc.
```

**Still use JSON for core data:**
```python
# JSON files are still your "degree requirements database"
```

### Production (Months 3+)

**PostgreSQL for everything:**
```sql
-- majors table
-- courses table
-- prerequisites table
-- users table
-- plans table
```

---

## Database Decision Tree

```
Do you have users with accounts?
│
├─ NO → Use JSON files ✅ (You are here!)
│
└─ YES → Do you have <100 users?
    │
    ├─ YES → SQLite is fine
    │
    └─ NO → Do you have >1000 users?
        │
        ├─ YES → Use PostgreSQL
        │
        └─ NO → SQLite still okay
```

---

## What About PDFs Specifically?

### ❌ NEVER Store PDFs in Database
**Why:**
- Large file size (MBs each)
- Binary data
- Slow to query
- Hard to version control
- Not needed at runtime

### ✅ Instead:
1. **Download PDFs** → `data/raw/`
2. **Extract data** → Process with pdfplumber
3. **Save as JSON** → `data/maps/major.json`
4. **Delete PDF** (or keep for reference)
5. **Use JSON** at runtime

---

## Your Current Setup is Perfect!

```
✅ JSON files for degree data
✅ Git for version control
✅ No database needed
✅ Fast and simple
✅ Easy to debug
✅ Works offline
```

---

## When to Revisit This Decision

**Signs you need a database:**
- ⚠️ JSON files over 1MB each
- ⚠️ Loading data takes >1 second
- ⚠️ You have user accounts
- ⚠️ You need real-time updates
- ⚠️ Multiple people editing data simultaneously

**You'll know when you need it!**

---

## Practical Example: Adding a New Major

### Without Database (Current - Easy!)
```bash
# 1. Download PDF
curl -o data/raw/PSYCH_BA.pdf https://uh.edu/.../psych.pdf

# 2. Parse it (manually or with script)
python scripts/parse_pdf.py data/raw/PSYCH_BA.pdf

# 3. Creates data/maps/PSYCH_BA_2021-2022.json
# Done! It's automatically available in the app
```

### With Database (Future - More Steps)
```bash
# 1. Download PDF
# 2. Parse it
# 3. Connect to database
# 4. Write SQL INSERT statements
# 5. Run migrations
# 6. Update schema
# 7. Test queries
# 8. Deploy changes
```

**See? JSON is simpler for now!**

---

## .gitignore Recommendations

Add to your `.gitignore`:
```gitignore
# Raw data files (can re-download)
data/raw/
data/cache/

# Don't commit large PDFs
*.pdf

# But DO commit processed JSON
!data/maps/*.json
```

---

## Summary

### 📝 For PDFs:
- ❌ Don't store in database
- ❌ Don't commit to git
- ✅ Keep in local `data/raw/` folder
- ✅ Process and convert to JSON
- ✅ Delete or archive after processing

### 📦 For Degree Data:
- ✅ Use JSON files (perfect for now!)
- ✅ Commit to git
- ✅ Fast and simple
- ⏰ Add database later when you have users

### 🎯 Right Now:
**You don't need a database at all!** Your current JSON-based approach is ideal for this stage of development.

---

## What You Should Focus On Instead

Rather than setting up a database, focus on:
1. ✅ Adding more majors (JSON files)
2. ✅ Building the PDF parser
3. ✅ Improving the scheduler
4. ✅ Better prerequisites handling
5. ✅ Testing with real students

**Save database setup for when you have paying users! 🚀**
