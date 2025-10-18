from dataclasses import dataclass, field
from typing import List, Dict, Optional

@dataclass
class CourseDef:
    code: str
    name: Optional[str] = None
    credits: int = 0
    prereqs: List[str] = field(default_factory=list)
    category: str = "major"  # "core", "elective", "major"

@dataclass
class DegreeMap:
    major_id: str
    catalog_year: str
    courses: Dict[str, CourseDef]      # by course code
    recommended_order: List[str]       # flattened list in suggested order

@dataclass
class PlacedCourse:
    code: str
    credits: int

@dataclass
class TermPlan:
    term_label: str  # e.g., "Fall-2025"
    courses: List[PlacedCourse] = field(default_factory=list)

@dataclass
class PlanResult:
    terms: List[TermPlan]
    total_credits: int
    warnings: List[str] = field(default_factory=list)
