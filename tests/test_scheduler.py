from uh_grad_planner.core.models import CourseDef, DegreeMap
from uh_grad_planner.core.scheduler import schedule_plan

def sample_degree():
    courses = {
        "ENGL 1301": CourseDef(code="ENGL 1301", credits=3, prereqs=[]),
        "ENGL 1302": CourseDef(code="ENGL 1302", credits=3, prereqs=["ENGL 1301"]),
        "MATH 2413": CourseDef(code="MATH 2413", credits=4, prereqs=[]),
        "MATH 2414": CourseDef(code="MATH 2414", credits=4, prereqs=["MATH 2413"]),
        "COSC 1336": CourseDef(code="COSC 1336", credits=3, prereqs=[]),
        "COSC 1437": CourseDef(code="COSC 1437", credits=4, prereqs=["COSC 1336"]),
        "COSC 2436": CourseDef(code="COSC 2436", credits=4, prereqs=["COSC 1437"]),
    }
    order = ["ENGL 1301","ENGL 1302","MATH 2413","MATH 2414","COSC 1336","COSC 1437","COSC 2436"]
    return DegreeMap(major_id="SAMPLE", catalog_year="TEST", courses=courses, recommended_order=order)

def test_basic_schedule():
    degree = sample_degree()
    res = schedule_plan(degree, "Fall-2025", completed=set(), max_credits=15)
    assert len(res.terms) == 8
    placed = [c.code for t in res.terms for c in t.courses]
    for code in degree.recommended_order:
        assert code in placed
