# Quick Start Guide

## Installation

```powershell
# Install the package in editable mode with dev dependencies
python -m pip install -e ".[dev]"
```

## Run Tests

```powershell
pytest -q
```

## Basic Usage (Without Gemini)

```powershell
python -m uh_grad_planner.cli --major CS_BS_2021_2022 --start Fall-2025 --completed "ENGL 1301,MATH 2413" --max 15
```

## Usage with Gemini AI Advisor (Optional)

First, set your Gemini API key:

```powershell
# Get your API key from https://aistudio.google.com/apikey
$Env:GOOGLE_API_KEY="YOUR_GEMINI_API_KEY"
```

Then run with the `--gemini-advice` flag:

```powershell
python -m uh_grad_planner.cli --major CS_BS_2021_2022 --start Fall-2025 --completed "ENGL 1301,MATH 2413" --max 15 --gemini-advice
```

## CLI Options

- `--major` (required): Major identifier (currently only `CS_BS_2021_2022` is included)
- `--start` (required): Starting term (e.g., `Fall-2025`, `Spring-2026`)
- `--completed`: Comma-separated list of completed courses (e.g., `"ENGL 1301,MATH 2413"`)
- `--max`: Maximum credits per term (default: 15)
- `--gemini-advice`: Enable Gemini AI advisor explanation (requires `GOOGLE_API_KEY`)

## Example Output

```
Plan for CS_BS_2021_2022 2021-2022, start Fall-2025
============================================================
Fall-2025: 13 credits
  - COSC 1336 (3)
  - HIST 1377 (3)
  - GOVT 2306 (3)
  - COSC 1437 (4)
Spring-2026: 13 credits
  - ENGL 1302 (3)
  - HIST 1378 (3)
  - GOVT 2305 (3)
  - MATH 2414 (4)
...
============================================================
Planned credits: 58
```

## Project Structure

```
cougar-scheduler/
├── src/uh_grad_planner/
│   ├── core/              # Core models and scheduler logic
│   ├── ai/                # Gemini API integration
│   ├── integrations/      # Future integrations (CougarGrades, etc.)
│   ├── scrapers/          # PDF and web scrapers (placeholders)
│   └── cli.py            # Command-line interface
├── data/maps/             # Degree plan JSON files
├── tests/                 # Test suite
├── pyproject.toml         # Project configuration
├── README.md              # Project overview
└── BACKLOG.md            # Development backlog
```

## Next Steps

1. **Add More Majors**: Create additional JSON files in `data/maps/` for other majors
2. **Set Up Gemini API**: Get your free API key from [Google AI Studio](https://aistudio.google.com/apikey)
3. **Implement PDF Parsing**: Use the `parse_map_text_to_courses()` function to automate degree map creation
4. **Scrape Prerequisites**: Build a catalog scraper to enrich prerequisite data

See `BACKLOG.md` for the full development roadmap.
