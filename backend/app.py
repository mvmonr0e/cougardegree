"""
FastAPI backend for UH Grad Planner
Provides REST API endpoints for the web frontend
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import json
from pathlib import Path

from uh_grad_planner.core.models import CourseDef, DegreeMap
from uh_grad_planner.core.scheduler import schedule_plan
from uh_grad_planner.ai.gemini import advise_on_plan

app = FastAPI(title="UH Grad Planner API", version="0.2.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files
try:
    app.mount("/static", StaticFiles(directory="frontend"), name="static")
except:
    pass  # Frontend directory might not exist yet

DATA_DIR = Path(__file__).parent.parent / "data" / "maps"


class PlanRequest(BaseModel):
    major: str
    start_term: str
    completed: List[str] = []
    max_credits: int = 15
    use_gemini: bool = False


class CourseResponse(BaseModel):
    code: str
    credits: int


class TermResponse(BaseModel):
    label: str
    courses: List[CourseResponse]


class PlanResponse(BaseModel):
    major_id: str
    catalog_year: str
    start: str
    terms: List[TermResponse]
    total_credits: int
    warnings: List[str]
    advisor_notes: Optional[str] = None


def load_degree_map(major_id: str) -> DegreeMap:
    """Load a degree map from JSON file"""
    p = DATA_DIR / f"{major_id}.json"
    if not p.exists():
        raise HTTPException(status_code=404, detail=f"Major {major_id} not found")
    
    data = json.loads(p.read_text(encoding="utf-8"))
    courses = {c["code"]: CourseDef(**c) for c in data["courses"]}
    return DegreeMap(
        major_id=data["major_id"],
        catalog_year=data["catalog_year"],
        courses=courses,
        recommended_order=data["recommended_order"],
    )


@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "UH Grad Planner API",
        "version": "0.2.0",
        "docs": "/docs",
        "frontend": "/static/index.html"
    }


@app.get("/api/majors")
async def get_majors():
    """Get list of available majors"""
    majors = []
    if DATA_DIR.exists():
        for file in DATA_DIR.glob("*.json"):
            try:
                data = json.loads(file.read_text(encoding="utf-8"))
                majors.append({
                    "id": data["major_id"],
                    "catalog_year": data["catalog_year"],
                    "name": data.get("name", data["major_id"])
                })
            except:
                pass
    return majors


@app.post("/api/plan", response_model=PlanResponse)
async def create_plan(request: PlanRequest):
    """Generate a graduation plan"""
    try:
        # Load degree map
        degree = load_degree_map(request.major)
        
        # Generate plan
        completed = set(request.completed)
        result = schedule_plan(degree, request.start_term, completed, request.max_credits)
        
        # Convert to response format
        terms = []
        for term in result.terms:
            courses = [CourseResponse(code=c.code, credits=c.credits) for c in term.courses]
            terms.append(TermResponse(label=term.term_label, courses=courses))
        
        # Get Gemini advice if requested
        advisor_notes = None
        if request.use_gemini:
            try:
                plan_dict = {
                    "start": request.start_term,
                    "terms": [
                        {
                            "label": t.label,
                            "courses": [{"code": c.code, "credits": c.credits} for c in t.courses]
                        }
                        for t in terms
                    ],
                    "warnings": result.warnings
                }
                advisor_notes = advise_on_plan(plan_dict)
            except Exception as e:
                advisor_notes = f"Gemini API error: {str(e)}"
        
        return PlanResponse(
            major_id=degree.major_id,
            catalog_year=degree.catalog_year,
            start=request.start_term,
            terms=terms,
            total_credits=result.total_credits,
            warnings=result.warnings,
            advisor_notes=advisor_notes
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/courses/{major_id}")
async def get_courses(major_id: str):
    """Get all courses for a major"""
    try:
        degree = load_degree_map(major_id)
        return {
            "major_id": degree.major_id,
            "catalog_year": degree.catalog_year,
            "courses": [
                {
                    "code": code,
                    "name": course.name,
                    "credits": course.credits,
                    "prereqs": course.prereqs,
                    "category": course.category
                }
                for code, course in degree.courses.items()
            ]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
