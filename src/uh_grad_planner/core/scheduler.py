import re
from typing import Dict, List, Set
from .models import DegreeMap, TermPlan, PlacedCourse, PlanResult

COURSE_CODE_RE = re.compile(r"^[A-Z]{3,4}\s*\d{4}$")

def next_terms(start: str, n: int = 8) -> List[str]:
    season, year = start.split("-")
    year = int(year)
    order = []
    current = season
    y = year
    for _ in range(n):
        order.append(f"{current}-{y}")
        if current == "Fall":
            current = "Spring"
            y += 1
        else:
            current = "Fall"
    return order

def schedule_plan(
    degree: DegreeMap,
    start_term: str,
    completed: Set[str],
    max_credits: int = 15
) -> PlanResult:
    remaining = [c for c in degree.recommended_order if c not in completed and COURSE_CODE_RE.match(c)]
    courses = degree.courses

    placed: Dict[str, str] = {}
    credits_taken = 0
    warnings: List[str] = []

    terms = [TermPlan(t) for t in next_terms(start_term, 8)]

    prereq_map: Dict[str, Set[str]] = {code: set(courses[code].prereqs) if code in courses else set() for code in remaining}

    def prereqs_satisfied(code: str, done: Set[str]) -> bool:
        needed = prereq_map.get(code, set())
        return needed.issubset(done)

    done = set(completed)

    for term in terms:
        term_credits = 0
        for code in list(remaining):
            if code in placed or code not in courses:
                continue
            c = courses[code]
            if prereqs_satisfied(code, done) and term_credits + c.credits <= max_credits:
                term.courses.append(PlacedCourse(code=code, credits=c.credits))
                term_credits += c.credits
                placed[code] = term.term_label
                done.add(code)
        credits_taken += term_credits

    leftovers = [c for c in remaining if c not in placed]
    if leftovers:
        warnings.append(f"{len(leftovers)} course(s) not placed within 8 terms: {', '.join(leftovers[:6])}...")

    for code, data in courses.items():
        if code in placed:
            for p in data.prereqs:
                # Basic sanity check
                if p in placed and terms_index(terms, placed[p]) > terms_index(terms, placed[code]):
                    warnings.append(f"Prerequisite order issue: {p} should be before {code}.")

    return PlanResult(terms=terms, total_credits=credits_taken, warnings=warnings)

def terms_index(terms: List[TermPlan], label: str) -> int:
    for i, t in enumerate(terms):
        if t.term_label == label:
            return i
    return -1
