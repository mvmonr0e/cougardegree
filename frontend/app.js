// Configuration
const API_BASE_URL = 'http://localhost:8000/api';

// Generate plan by calling the backend API
async function generatePlan() {
    const major = document.getElementById('major').value;
    const startTerm = document.getElementById('startTerm').value;
    const completedInput = document.getElementById('completed').value;
    const maxCredits = parseInt(document.getElementById('maxCredits').value);
    const useGemini = document.getElementById('useGemini').checked;

    // Parse completed courses
    const completed = completedInput
        .split(',')
        .map(c => c.trim())
        .filter(c => c.length > 0);

    // Show loading
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('results').classList.add('hidden');

    try {
        // Call the backend API
        const response = await fetch(`${API_BASE_URL}/plan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                major: major,
                start_term: startTerm,
                completed: completed,
                max_credits: maxCredits,
                use_gemini: useGemini
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const plan = await response.json();
        displayResults(plan);
        document.getElementById('results').classList.remove('hidden');
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('results').innerHTML = `
            <div class="warning-box">
                <h3>⚠️ Error</h3>
                <p>Could not generate plan. Make sure the backend is running:</p>
                <pre style="background: #fff; padding: 10px; margin-top: 10px; border-radius: 4px;">
cd backend
uvicorn app:app --reload
                </pre>
                <p style="margin-top: 10px;">Error: ${error.message}</p>
            </div>
        `;
        document.getElementById('results').classList.remove('hidden');
    } finally {
        document.getElementById('loading').classList.add('hidden');
    }
}

// Display plan results
function displayResults(plan) {
    const resultsDiv = document.getElementById('results');
    
    let html = `<h2 style="color: #C8102E; margin-bottom: 20px;">Your Graduation Plan</h2>`;
    
    // Summary
    html += `
        <div class="summary-box">
            <h3>📊 Plan Summary</h3>
            <p><strong>Major:</strong> ${plan.major_id}</p>
            <p><strong>Catalog Year:</strong> ${plan.catalog_year}</p>
            <p><strong>Start Term:</strong> ${plan.start}</p>
            <p><strong>Total Credits:</strong> ${plan.total_credits}</p>
            <p><strong>Semesters:</strong> ${plan.terms.length}</p>
        </div>
    `;

    // Gemini advisor notes
    if (plan.advisor_notes) {
        html += `
            <div class="summary-box" style="border-left-color: #17a2b8;">
                <h3>🤖 AI Advisor Notes</h3>
                <p>${plan.advisor_notes.replace(/\n/g, '<br>')}</p>
            </div>
        `;
    }

    // Warnings
    if (plan.warnings && plan.warnings.length > 0) {
        html += `<div class="warning-box"><h3>⚠️ Important Notes</h3>`;
        plan.warnings.forEach(warning => {
            html += `<div class="warning-item">• ${warning}</div>`;
        });
        html += `</div>`;
    }

    // Semester cards
    plan.terms.forEach(term => {
        const totalCredits = term.courses.reduce((sum, c) => sum + c.credits, 0);
        
        // Skip empty semesters
        if (term.courses.length === 0) return;
        
        html += `
            <div class="semester-card">
                <div class="semester-header">
                    <div class="semester-title">${term.label}</div>
                    <div class="semester-credits">${totalCredits} Credits</div>
                </div>
                <ul class="course-list">
        `;
        
        term.courses.forEach(course => {
            html += `
                <li class="course-item">
                    <span class="course-code">${course.code}</span>
                    <span class="course-credits">${course.credits} credits</span>
                </li>
            `;
        });
        
        html += `</ul></div>`;
    });

    resultsDiv.innerHTML = html;
}

// Load available majors on page load
async function loadMajors() {
    try {
        const response = await fetch(`${API_BASE_URL}/majors`);
        const majors = await response.json();
        
        const select = document.getElementById('major');
        select.innerHTML = '';
        
        majors.forEach(major => {
            const option = document.createElement('option');
            option.value = major.id;
            option.textContent = `${major.id.replace(/_/g, ' ')} (${major.catalog_year})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Could not load majors:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadMajors();
});
