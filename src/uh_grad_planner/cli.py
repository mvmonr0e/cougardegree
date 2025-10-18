import argparse
import json
from pathlib import Path
from typing import Set

from .core.models import CourseDef, DegreeMap
from .core.scheduler import schedule_plan
from .ai.gemini import advise_on_plan  # optional, requires GOOGLE_API_KEY

DATA_DIR = Path(__file__).parent.parent.parent / "data" / "maps"

def load_cs_sample() -> DegreeMap:
    p = DATA_DIR / "CS_BS_2021-2022.json"
    data = json.loads(p.read_text(encoding="utf-8"))
    courses = {c["code"]: CourseDef(**c) for c in data["courses"]}
    return DegreeMap(
        major_id=data["major_id"],
        catalog_year=data["catalog_year"],
        courses=courses,
        recommended_order=data["recommended_order"],
    )

def main():
    ap = argparse.ArgumentParser(description="UH Grad Planner - CLI")
    ap.add_argument("--major", required=True, help="Example: CS_BS_2021_2022")
    ap.add_argument("--start", required=True, help="Start term label, e.g., Fall-2025 or Spring-2026")
    ap.add_argument("--completed", default="", help="Comma-separated course codes")
    ap.add_argument("--max", type=int, default=15, help="Max credits per term, default 15")
    ap.add_argument("--gemini-advice", action="store_true", help="Use Gemini to explain the plan")
    args = ap.parse_args()

    if args.major != "CS_BS_2021_2022":
        print("Only CS_BS_2021_2022 sample is included in MVP. Using CS sample.")
    degree = load_cs_sample()

    completed: Set[str] = set([c.strip() for c in args.completed.split(",") if c.strip()])

    result = schedule_plan(degree, args.start, completed, max_credits=args.max)

    # Print the plan
    print(f"Plan for {degree.major_id} {degree.catalog_year}, start {args.start}")
    print("=" * 60)
    total = 0
    pretty_terms = []
    for term in result.terms:
        term_sum = sum(c.credits for c in term.courses)
        total += term_sum
        pretty_terms.append({"label": term.term_label, "courses": [{"code": c.code, "credits": c.credits} for c in term.courses]})
        print(f"{term.term_label}: {term_sum} credits")
        for c in term.courses:
            print(f"  - {c.code} ({c.credits})")
    print("=" * 60)
    print(f"Planned credits: {total}")
    if result.warnings:
        print("Warnings:")
        for w in result.warnings:
            print(f"  * {w}")

    if args.gemini_advice:
        try:
            plan_dict = {"start": args.start, "terms": pretty_terms, "warnings": result.warnings}
            print("\nAdvisor notes:")
            print(advise_on_plan(plan_dict))
        except Exception as e:
            print(f"(Gemini error) {e}")

if __name__ == "__main__":
    main()
