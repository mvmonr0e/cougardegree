# Setting Up Gemini API

## Step 1: Get Your Free API Key

1. Go to: **https://aistudio.google.com/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API Key"**
4. Copy the key (it will look like: `AIzaSy...`)

## Step 2: Set the API Key in PowerShell

**Option A: Set for current session only** (temporary)
```powershell
$Env:GOOGLE_API_KEY="AIzaSy_YOUR_KEY_HERE"
```

**Option B: Set permanently** (recommended)
```powershell
# Add to your PowerShell profile
[System.Environment]::SetEnvironmentVariable('GOOGLE_API_KEY', 'AIzaSy_YOUR_KEY_HERE', 'User')

# Refresh current session
$Env:GOOGLE_API_KEY = [System.Environment]::GetEnvironmentVariable('GOOGLE_API_KEY', 'User')
```

## Step 3: Verify It's Set

```powershell
echo $Env:GOOGLE_API_KEY
# Should display: AIzaSy_YOUR_KEY_HERE
```

## Step 4: Test with Gemini Advice

```powershell
python -m uh_grad_planner.cli --major CS_BS_2021_2022 --start Fall-2025 --completed "ENGL 1301,MATH 2413" --max 15 --gemini-advice
```

You should see an "Advisor notes:" section with AI-generated advice!

## Troubleshooting

If you get an error:
- **"Set GOOGLE_API_KEY in your environment"** → API key not set, repeat Step 2
- **Authentication error** → Check that your API key is valid
- **Network error** → Check your internet connection

## What Gemini Does

The planner uses Gemini for two features:

1. **`advise_on_plan()`** - Generates friendly advisor-style explanations of your schedule
   - Analyzes credit balance across semesters
   - Points out prerequisite progression
   - Flags potential issues

2. **`parse_map_text_to_courses()`** - Converts raw degree plan text to JSON
   - Can parse messy PDF text into structured course data
   - Useful for adding new majors to the system

## Free Tier Limits

Google's Gemini API has a generous free tier:
- 15 requests per minute
- 1 million tokens per minute
- 1,500 requests per day

This is more than enough for the planner!
