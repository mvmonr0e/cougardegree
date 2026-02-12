# CougarDegree

This project is a full-stack web application powered by the Google Gemini API that helps UH students plan their degree. It allows the user to input the classes they have taken so far and the semester they started. It then takes that input and builds a balanced degree plan based on public data provided by cougargrades.io

## Features
- 49 UH degree programs supported
- AI-powered course sequencing
- Dynamic semester planning based on start date
- Visual progress tracking with completed course indicators
- Science course integration (Physics, Chemistry, Biology)
- Smart course distribution (max 5 courses per semester)

## Inputs
- Student Major (49 options)
- Start Semester (Fall 2024 - Spring 2030)
- Classes taken so far, if any

## Assumptions
- Graduate in 4 years (8 semesters)
- Full-time student
- No summer classes
- Target 12-15 credit hours per semester

## Usage
1. Start backend: `cd backend && node server.js`
2. Start frontend: `cd frontend && node server.js`
3. Open `http://localhost:3000` in your browser
