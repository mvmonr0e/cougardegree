import json
import os
from typing import Any, Dict, List

from google import genai
from google.genai import types

MODEL_DEFAULT = "gemini-2.5-flash"

def _client() -> genai.Client:
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise RuntimeError("Set GOOGLE_API_KEY in your environment")
    return genai.Client(api_key=api_key)

def advise_on_plan(plan: Dict[str, Any]) -> str:
    """
    plan: dict with keys { 'start': str, 'terms': [ {'label': str, 'courses': [{'code': str, 'credits': int}]} ], 'warnings': [...] }
    Returns a short natural language explanation of the schedule.
    """
    client = _client()
    system = "You are an academic advisor for University of Houston students. Keep it concise and practical."
    prompt = {
        "start": plan.get("start"),
        "warnings": plan.get("warnings", []),
        "terms": [
            {"label": t["label"], "courses": [c["code"] for c in t.get("courses", [])], "credits": sum(c["credits"] for c in t.get("courses", []))}
            for t in plan.get("terms", [])
        ],
    }
    resp = client.models.generate_content(
        model=MODEL_DEFAULT,
        contents=[
            system,
            "Explain this 8-term plan in simple language. Mention credit balance, obvious prereq progression, and any red flags.",
            json.dumps(prompt),
        ],
    )
    return resp.text or ""

def parse_map_text_to_courses(text: str) -> Dict[str, Any]:
    """
    Given raw text copied from a UHin4 PDF or catalog page, return a normalized JSON with courses.
    Schema:
      { "courses": [ { "code": "COSC 1336", "name": "Title", "credits": 3, "prereqs": [] }, ... ],
        "recommended_order": ["COSC 1336", "ENGL 1301", ...] }
    """
    client = _client()
    schema = {
        "type": "OBJECT",
        "properties": {
            "courses": {
                "type": "ARRAY",
                "items": {
                    "type": "OBJECT",
                    "properties": {
                        "code": {"type": "STRING"},
                        "name": {"type": "STRING"},
                        "credits": {"type": "INTEGER"},
                        "prereqs": {"type": "ARRAY", "items": {"type": "STRING"}},
                    },
                    "required": ["code", "credits"],
                },
            },
            "recommended_order": {
                "type": "ARRAY",
                "items": {"type": "STRING"}
            },
        },
        "required": ["courses", "recommended_order"],
    }
    resp = client.models.generate_content(
        model=MODEL_DEFAULT,
        contents=[
            "Extract University of Houston course data from this text. Use only course codes that look like ABCD 1234 and integers for credits. If credits absent, guess 3.",
            text,
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=schema,
        ),
    )
    return json.loads(resp.text)
