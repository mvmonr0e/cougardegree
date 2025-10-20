// CougarDegree Frontend JavaScript
class CougarDegreePlanner {
    constructor() {
        this.form = document.getElementById('degreeForm');
        this.resultsSection = document.getElementById('resultsSection');
        this.degreePlan = document.getElementById('degreePlan');
        this.editBtn = document.getElementById('editPlanBtn');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        
        // Backend API configuration
        this.apiBaseUrl = 'http://localhost:3001/api';
        
        this.initializeEventListeners();
        this.initializeSampleData();
        this.loadAvailableMajors();
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.editBtn.addEventListener('click', () => this.editPlan());
        
        // Connect Get Started button to scroll to form
        const getStartedBtn = document.querySelector('.get-started-btn');
        if (getStartedBtn) {
            getStartedBtn.addEventListener('click', () => {
                document.querySelector('.input-section').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        }
    }

    initializeSampleData() {
        // Sample degree requirements for different majors
        this.degreeRequirements = {
            cs: {
                name: 'Bachelor of Science in Computer Science',
                totalCredits: 120,
                required: [
                    { code: 'COSC 1306', name: 'Programming I', credits: 3, prerequisites: [], type: 'required' },
                    { code: 'COSC 1307', name: 'Programming II', credits: 3, prerequisites: ['COSC 1306'], type: 'required' },
                    { code: 'COSC 2325', name: 'Computer Organization', credits: 3, prerequisites: ['COSC 1307'], type: 'required' },
                    { code: 'COSC 2326', name: 'Computer Organization Lab', credits: 1, prerequisites: ['COSC 2325'], type: 'required' },
                    { code: 'COSC 3335', name: 'Data Structures', credits: 3, prerequisites: ['COSC 1307'], type: 'required' },
                    { code: 'COSC 3336', name: 'Data Structures Lab', credits: 1, prerequisites: ['COSC 3335'], type: 'required' },
                    { code: 'COSC 3340', name: 'Introduction to Automata', credits: 3, prerequisites: ['COSC 3335', 'MATH 3339'], type: 'required' },
                    { code: 'COSC 3360', name: 'Fundamentals of Software Engineering', credits: 3, prerequisites: ['COSC 3335'], type: 'required' },
                    { code: 'COSC 3380', name: 'Design of File and Database Systems', credits: 3, prerequisites: ['COSC 3335'], type: 'required' },
                    { code: 'COSC 4351', name: 'Computer Networks', credits: 3, prerequisites: ['COSC 2325'], type: 'required' },
                    { code: 'COSC 4352', name: 'Computer Networks Lab', credits: 1, prerequisites: ['COSC 4351'], type: 'required' },
                    { code: 'COSC 4353', name: 'Operating Systems', credits: 3, prerequisites: ['COSC 2325', 'COSC 3335'], type: 'required' },
                    { code: 'COSC 4354', name: 'Operating Systems Lab', credits: 1, prerequisites: ['COSC 4353'], type: 'required' },
                    { code: 'COSC 4365', name: 'Senior Design Project I', credits: 3, prerequisites: ['COSC 3360', 'COSC 3380'], type: 'required' },
                    { code: 'COSC 4366', name: 'Senior Design Project II', credits: 3, prerequisites: ['COSC 4365'], type: 'required' },
                    { code: 'MATH 2413', name: 'Calculus I', credits: 4, prerequisites: [], type: 'required' },
                    { code: 'MATH 2414', name: 'Calculus II', credits: 4, prerequisites: ['MATH 2413'], type: 'required' },
                    { code: 'MATH 2318', name: 'Linear Algebra', credits: 3, prerequisites: ['MATH 2414'], type: 'required' },
                    { code: 'MATH 3339', name: 'Statistics for the Sciences', credits: 3, prerequisites: ['MATH 2414'], type: 'required' },
                    { code: 'PHYS 1301', name: 'General Physics I', credits: 3, prerequisites: [], type: 'required' },
                    { code: 'PHYS 1101', name: 'General Physics I Lab', credits: 1, prerequisites: ['PHYS 1301'], type: 'required' },
                    { code: 'PHYS 1302', name: 'General Physics II', credits: 3, prerequisites: ['PHYS 1301'], type: 'required' },
                    { code: 'PHYS 1102', name: 'General Physics II Lab', credits: 1, prerequisites: ['PHYS 1302'], type: 'required' },
                    { code: 'ENGL 1301', name: 'First Year Writing I', credits: 3, prerequisites: [], type: 'required' },
                    { code: 'ENGL 1302', name: 'First Year Writing II', credits: 3, prerequisites: ['ENGL 1301'], type: 'required' },
                    { code: 'HIST 1301', name: 'History of the United States to 1877', credits: 3, prerequisites: [], type: 'required' },
                    { code: 'HIST 1302', name: 'History of the United States since 1877', credits: 3, prerequisites: [], type: 'required' },
                    { code: 'POLS 1336', name: 'U.S. and Texas Constitutions', credits: 3, prerequisites: [], type: 'required' },
                    { code: 'POLS 1337', name: 'U.S. Government: Congress, President, and Courts', credits: 3, prerequisites: [], type: 'required' },
                    { code: 'COMM 1333', name: 'Fundamentals of Speech Communication', credits: 3, prerequisites: [], type: 'required' }
                ],
                electives: [
                    { code: 'COSC 4336', name: 'Computer Graphics', credits: 3, prerequisites: ['COSC 3335'], type: 'elective' },
                    { code: 'COSC 4355', name: 'Artificial Intelligence', credits: 3, prerequisites: ['COSC 3335'], type: 'elective' },
                    { code: 'COSC 4357', name: 'Machine Learning', credits: 3, prerequisites: ['COSC 3335', 'MATH 3339'], type: 'elective' },
                    { code: 'COSC 4360', name: 'Computer Security', credits: 3, prerequisites: ['COSC 4353'], type: 'elective' },
                    { code: 'COSC 4370', name: 'Mobile App Development', credits: 3, prerequisites: ['COSC 3335'], type: 'elective' }
                ]
            },
            engineering: {
                name: 'Bachelor of Science in Engineering',
                totalCredits: 120,
                required: [
                    { code: 'ENGR 1301', name: 'Introduction to Engineering', credits: 3, prerequisites: [], type: 'required' },
                    { code: 'MATH 2413', name: 'Calculus I', credits: 4, prerequisites: [], type: 'required' },
                    { code: 'MATH 2414', name: 'Calculus II', credits: 4, prerequisites: ['MATH 2413'], type: 'required' },
                    { code: 'MATH 2318', name: 'Linear Algebra', credits: 3, prerequisites: ['MATH 2414'], type: 'required' },
                    { code: 'PHYS 1301', name: 'General Physics I', credits: 3, prerequisites: [], type: 'required' },
                    { code: 'PHYS 1101', name: 'General Physics I Lab', credits: 1, prerequisites: ['PHYS 1301'], type: 'required' },
                    { code: 'PHYS 1302', name: 'General Physics II', credits: 3, prerequisites: ['PHYS 1301'], type: 'required' },
                    { code: 'PHYS 1102', name: 'General Physics II Lab', credits: 1, prerequisites: ['PHYS 1302'], type: 'required' },
                    { code: 'CHEM 1331', name: 'General Chemistry I', credits: 3, prerequisites: [], type: 'required' },
                    { code: 'CHEM 1111', name: 'General Chemistry I Lab', credits: 1, prerequisites: ['CHEM 1331'], type: 'required' },
                    { code: 'ENGL 1301', name: 'First Year Writing I', credits: 3, prerequisites: [], type: 'required' },
                    { code: 'ENGL 1302', name: 'First Year Writing II', credits: 3, prerequisites: ['ENGL 1301'], type: 'required' },
                    { code: 'HIST 1301', name: 'History of the United States to 1877', credits: 3, prerequisites: [], type: 'required' },
                    { code: 'HIST 1302', name: 'History of the United States since 1877', credits: 3, prerequisites: [], type: 'required' },
                    { code: 'POLS 1336', name: 'U.S. and Texas Constitutions', credits: 3, prerequisites: [], type: 'required' },
                    { code: 'POLS 1337', name: 'U.S. Government: Congress, President, and Courts', credits: 3, prerequisites: [], type: 'required' },
                    { code: 'COMM 1333', name: 'Fundamentals of Speech Communication', credits: 3, prerequisites: [], type: 'required' }
                ],
                electives: [
                    { code: 'ENGR 2301', name: 'Engineering Mechanics', credits: 3, prerequisites: ['MATH 2414', 'PHYS 1301'], type: 'elective' },
                    { code: 'ENGR 2302', name: 'Engineering Thermodynamics', credits: 3, prerequisites: ['MATH 2414', 'PHYS 1302'], type: 'elective' },
                    { code: 'ENGR 2303', name: 'Engineering Materials', credits: 3, prerequisites: ['CHEM 1331'], type: 'elective' }
                ]
            },
            business: {
                name: 'Bachelor of Business Administration',
                totalCredits: 120,
                required: [
                    { code: 'ACCT 2301', name: 'Principles of Financial Accounting', credits: 3, prerequisites: [], type: 'required' },
                    { code: 'ACCT 2302', name: 'Principles of Managerial Accounting', credits: 3, prerequisites: ['ACCT 2301'], type: 'required' },
                    { code: 'ECON 2301', name: 'Principles of Macroeconomics', credits: 3, prerequisites: [], type: 'required' },
                    { code: 'ECON 2302', name: 'Principles of Microeconomics', credits: 3, prerequisites: [], type: 'required' },
                    { code: 'MATH 1313', name: 'Finite Mathematics', credits: 3, prerequisites: [], type: 'required' },
                    { code: 'MATH 1314', name: 'College Algebra', credits: 3, prerequisites: [], type: 'required' },
                    { code: 'STAT 3331', name: 'Statistics for Business', credits: 3, prerequisites: ['MATH 1314'], type: 'required' },
                    { code: 'ENGL 1301', name: 'First Year Writing I', credits: 3, prerequisites: [], type: 'required' },
                    { code: 'ENGL 1302', name: 'First Year Writing II', credits: 3, prerequisites: ['ENGL 1301'], type: 'required' },
                    { code: 'HIST 1301', name: 'History of the United States to 1877', credits: 3, prerequisites: [], type: 'required' },
                    { code: 'HIST 1302', name: 'History of the United States since 1877', credits: 3, prerequisites: [], type: 'required' },
                    { code: 'POLS 1336', name: 'U.S. and Texas Constitutions', credits: 3, prerequisites: [], type: 'required' },
                    { code: 'POLS 1337', name: 'U.S. Government: Congress, President, and Courts', credits: 3, prerequisites: [], type: 'required' },
                    { code: 'COMM 1333', name: 'Fundamentals of Speech Communication', credits: 3, prerequisites: [], type: 'required' }
                ],
                electives: [
                    { code: 'MKTG 3301', name: 'Principles of Marketing', credits: 3, prerequisites: ['ACCT 2301'], type: 'elective' },
                    { code: 'MGMT 3301', name: 'Principles of Management', credits: 3, prerequisites: ['ACCT 2301'], type: 'elective' },
                    { code: 'FINA 3330', name: 'Principles of Finance', credits: 3, prerequisites: ['ACCT 2302'], type: 'elective' }
                ]
            }
        };
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const major = formData.get('major');
        const startSemester = formData.get('startSemester');
        const classesTaken = formData.get('classesTaken').trim();

        if (!major || !startSemester) {
            alert('Please fill in all required fields.');
            return;
        }

        // Show loading state
        this.showLoading();

        try {
            // Parse classes taken
            const takenClasses = classesTaken ? 
                classesTaken.split(',').map(code => code.trim().toUpperCase()) : [];

            // Try to generate degree plan using AI backend first
            let degreePlan;
            try {
                console.log('🚀 Attempting to generate degree plan with AI...');
                console.log('📝 Major:', major);
                console.log('📝 Start Semester:', startSemester);
                console.log('📝 Taken classes:', takenClasses);
                degreePlan = await this.generateDegreePlanWithAI(major, takenClasses, startSemester);
                console.log('✅ AI degree plan generated successfully!');
                console.log('📊 AI degree plan:', degreePlan);
            } catch (aiError) {
                console.error('❌ AI backend failed:', aiError);
                console.error('❌ AI Error details:', aiError.message);
                console.error('❌ AI Error stack:', aiError.stack);
                
                // Show user-friendly error message based on error type
                let errorMessage = 'Failed to generate degree plan. Please try again.';
                
                if (aiError.message.includes('timeout') || aiError.message.includes('timed out')) {
                    errorMessage = 'AI request timed out. The AI model is taking too long to respond (>2 minutes). Please try again.';
                } else if (aiError.message.includes('Failed to fetch') || aiError.message.includes('Network')) {
                    errorMessage = 'Cannot connect to the AI service. Please check if the backend server is running.';
                } else if (aiError.message.includes('Invalid') || aiError.message.includes('parse')) {
                    errorMessage = 'AI returned invalid data. Please try again.';
                }
                
                this.showError(errorMessage);
                return;
            }
            
            // Display results
            this.displayDegreePlan(degreePlan);
            
            // Scroll to results section
            setTimeout(() => {
                document.getElementById('resultsSection').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
            
        } catch (error) {
            console.error('Error generating degree plan:', error);
            this.showError(`Error generating degree plan: ${error.message}. Please try again.`);
        }
    }

    showLoading() {
        this.resultsSection.style.display = 'block';
        this.degreePlan.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                <h3>Generating your personalized degree plan...</h3>
                <p class="loading-text">🤖 AI is analyzing course requirements and creating your 4-year plan</p>
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <p class="loading-subtext">This may take 30-60 seconds</p>
            </div>
        `;
    }

    generateDegreePlan(major, startSemester, takenClasses) {
        // Map full major names to keys
        const majorMapping = {
            'Computer Science': 'cs',
            'Software Engineering': 'cs',
            'Data Science': 'cs',
            'Information Technology': 'cs',
            'Cybersecurity': 'cs',
            'Computer Information Systems': 'cs',
            'Management Information Systems': 'cs',
            'Engineering': 'engineering',
            'Business Administration': 'business',
            'Marketing': 'business',
            'Finance': 'business',
            'Accounting': 'business',
            'Psychology': 'psychology',
            'Biology': 'biology',
            'Chemistry': 'chemistry',
            'Mathematics': 'mathematics',
            'Physics': 'physics',
            'Nursing': 'nursing',
            'Education': 'education'
        };
        
        // Handle both full names and old lowercase values
        let majorKey;
        if (majorMapping[major]) {
            majorKey = majorMapping[major];
        } else if (major.toLowerCase() === 'computerscience' || major.toLowerCase() === 'cs') {
            majorKey = 'cs';
        } else {
            majorKey = major.toLowerCase();
        }
        const majorData = this.degreeRequirements[majorKey];
        if (!majorData) {
            throw new Error(`Invalid major selected: ${major}. Available majors: ${Object.keys(majorMapping).join(', ')}`);
        }

        const allCourses = [...majorData.required, ...majorData.electives];

        // Filter out taken classes
        const remainingCourses = allCourses.filter(course => 
            !takenClasses.includes(course.code)
        );

        // Calculate progress
        const takenCourses = allCourses.filter(course => 
            takenClasses.includes(course.code)
        );
        const completedCredits = takenCourses.reduce((sum, course) => sum + course.credits, 0);
        const progressPercentage = Math.round((completedCredits / majorData.totalCredits) * 100);

        // Simple semester distribution (15 credits per semester)
        const semesters = [];
        let currentSemester = 1;
        let currentCredits = 0;
        let semesterCourses = [];

        // Sort courses by prerequisites and difficulty (simplified)
        const sortedCourses = this.sortCoursesByPrerequisites(remainingCourses, takenClasses);

        for (const course of sortedCourses) {
            if (currentCredits + course.credits > 15) {
                // Start new semester
                semesters.push({
                    number: currentSemester,
                    courses: [...semesterCourses],
                    totalCredits: currentCredits
                });
                currentSemester++;
                currentCredits = 0;
                semesterCourses = [];
            }

            semesterCourses.push(course);
            currentCredits += course.credits;
        }

        // Add remaining courses to last semester
        if (semesterCourses.length > 0) {
            semesters.push({
                number: currentSemester,
                courses: [...semesterCourses],
                totalCredits: currentCredits
            });
        }

        return {
            major,
            majorName: majorData.name,
            startSemester,
            takenClasses,
            semesters,
            completedCredits,
            totalCredits: majorData.totalCredits,
            progressPercentage
        };
    }

    sortCoursesByPrerequisites(courses, takenClasses) {
        // Simple sorting - prioritize courses with no prerequisites or satisfied prerequisites
        return courses.sort((a, b) => {
            const aPrereqsMet = a.prerequisites.every(prereq => takenClasses.includes(prereq));
            const bPrereqsMet = b.prerequisites.every(prereq => takenClasses.includes(prereq));
            
            if (aPrereqsMet && !bPrereqsMet) return -1;
            if (!aPrereqsMet && bPrereqsMet) return 1;
            
            // If both have same prerequisite status, sort by course code
            return a.code.localeCompare(b.code);
        });
    }

    displayDegreePlan(degreePlan) {
        // Update progress bar
        this.updateProgressBar(degreePlan);
        
        // Group semesters by year (semester names are already in each semester object)
        const years = this.groupSemestersByYear(degreePlan.semesters);
        
        let html = '';
        
        years.forEach((year, yearIndex) => {
            html += `
                <div class="year-section">
                    <h2 class="year-title">Year ${yearIndex + 1}</h2>
                    <div class="semesters-container">
                        ${year.semesters.map(semester => `
                            <div class="semester-card">
                                <div class="semester-header">
                                    <h3 class="semester-title">${semester.name}</h3>
                                    <div class="red-line"></div>
                                </div>
                                <div class="courses-list">
                                    ${semester.courses.map(course => `
                                        <div class="course-item ${course.completed ? 'completed' : ''}">
                                            <span class="course-code">
                                                ${course.completed ? '✓ ' : ''}${course.code}: ${course.name}
                                            </span>
                                            <span class="course-credits">${course.credits} Cr.</span>
                                        </div>
                                    `).join('')}
                                </div>
                                <div class="semester-total">Total: ${semester.courses.reduce((sum, course) => sum + course.credits, 0)} Credits</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        this.degreePlan.innerHTML = html;
    }

    groupSemestersByYear(semesters) {
        const years = [];
        let currentYear = [];
        
        semesters.forEach((semester, index) => {
            // Use the semester name from the backend (already set in convertAIDegreePlan)
            const semesterName = semester.name || `Semester ${semester.semester || index + 1}`;
            const isFall = semesterName.toLowerCase().includes('fall');
            
            currentYear.push({
                ...semester,
                name: semesterName,
                isFall: isFall
            });
            
            // If we have 2 semesters (Fall and Spring) or this is the last semester, complete the year
            if (currentYear.length === 2 || index === semesters.length - 1) {
                // Sort so Fall comes first, then Spring
                currentYear.sort((a, b) => {
                    if (a.isFall && !b.isFall) return -1;
                    if (!a.isFall && b.isFall) return 1;
                    return 0;
                });
                years.push({ semesters: [...currentYear] });
                currentYear = [];
            }
        });
        
        return years;
    }

    updateProgressBar(degreePlan) {
        const progressPercentage = document.getElementById('progressPercentage');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        progressPercentage.textContent = `${degreePlan.progressPercentage}%`;
        progressFill.style.width = `${degreePlan.progressPercentage}%`;
        progressText.textContent = `${degreePlan.completedCredits} of ${degreePlan.totalCredits} credits completed`;
    }

    getSemesterNames(startSemester) {
        const semesterMap = {
            'fall2024': ['Fall 2024', 'Spring 2025', 'Fall 2025', 'Spring 2026', 'Fall 2026', 'Spring 2027', 'Fall 2027', 'Spring 2028'],
            'spring2025': ['Spring 2025', 'Fall 2025', 'Spring 2026', 'Fall 2026', 'Spring 2027', 'Fall 2027', 'Spring 2028', 'Fall 2028'],
            'fall2025': ['Fall 2025', 'Spring 2026', 'Fall 2026', 'Spring 2027', 'Fall 2027', 'Spring 2028', 'Fall 2028', 'Spring 2029'],
            'spring2026': ['Spring 2026', 'Fall 2026', 'Spring 2027', 'Fall 2027', 'Spring 2028', 'Fall 2028', 'Spring 2029', 'Fall 2029']
        };
        
        return semesterMap[startSemester] || [];
    }

    editPlan() {
        this.resultsSection.style.display = 'none';
        document.querySelector('.input-section').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }

    // API Integration Methods
    async loadAvailableMajors() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/majors`);
            const data = await response.json();
            
            if (data.success) {
                this.populateMajorDropdown(data.data);
            }
        } catch (error) {
            console.warn('Failed to load majors from API, using local data:', error);
        }
    }

    populateMajorDropdown(majors) {
        const majorSelect = document.getElementById('major');
        if (majorSelect) {
            // Clear existing options except the first one
            majorSelect.innerHTML = '<option value="">Select your major</option>';
            
            // Sort majors to put Computer Science first
            const sortedMajors = [...majors].sort((a, b) => {
                // Put "B.S. in Computer Science" first
                if (a === 'B.S. in Computer Science') return -1;
                if (b === 'B.S. in Computer Science') return 1;
                
                // Keep other majors in alphabetical order
                return a.localeCompare(b);
            });
            
            sortedMajors.forEach(major => {
                const option = document.createElement('option');
                option.value = major; // Use full major name as value
                option.textContent = major;
                majorSelect.appendChild(option);
            });
        }
    }

    async generateDegreePlanWithAI(major, currentCourses = [], startSemester = 'Fall 2025') {
        try {
            console.log('🤖 Calling AI backend...', `${this.apiBaseUrl}/degree-plan`);
            console.log('📝 Request data:', { major, currentCourses, startSemester });
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout

            const response = await fetch(`${this.apiBaseUrl}/degree-plan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    major: major,
                    credits: 120,
                    preferences: {
                        focus: 'general',
                        difficulty: 'balanced',
                        schedule: 'full-time'
                    },
                    currentCourses: currentCourses,
                    startSemester: startSemester
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            console.log('📡 Response status:', response.status);
            console.log('📡 Response ok:', response.ok);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('📊 AI Response data:', data);
            
            if (data.success) {
                console.log('✅ AI data converted successfully');
                return this.convertAIDegreePlan(data.data);
            } else {
                throw new Error(data.message || 'Failed to generate degree plan');
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error('❌ AI API Timeout: Request took too long (>30s)');
                throw new Error('AI request timed out. Please try again.');
            }
            console.error('❌ AI API Error:', error);
            throw error;
        }
    }

    convertAIDegreePlan(aiData) {
        console.log('🔄 Converting AI data...', aiData);
        
        // Convert AI response format to our local format
        const degreePlan = aiData.degreePlan || aiData;
        console.log('📋 Degree plan data:', degreePlan);
        
        // Calculate progress based on taken classes
        const takenClasses = this.getTakenClasses();
        const allCourses = degreePlan.semesters.flatMap(sem => sem.courses);
        const takenCourses = allCourses.filter(course => 
            takenClasses.includes(course.code)
        );
        const completedCredits = takenCourses.reduce((sum, course) => sum + course.credits, 0);
        const progressPercentage = Math.round((completedCredits / degreePlan.totalCredits) * 100);
        
        const converted = {
            major: degreePlan.major,
            totalCredits: degreePlan.totalCredits,
            semesters: degreePlan.semesters.map(sem => ({
                name: sem.semesterName || `Semester ${sem.semester}`,
                courses: sem.courses.map(course => ({
                    code: course.code,
                    name: course.name,
                    credits: course.credits,
                    prerequisites: course.prerequisites || [],
                    type: course.type === 'major prerequisites' ? 'required' : 
                          course.type === 'general education' ? 'general' : 
                          course.type === 'major core' ? 'required' : 'elective',
                    completed: takenClasses.includes(course.code)
                }))
            })),
            required: degreePlan.coreCourses || [],
            electives: degreePlan.electiveCourses || [],
            general: degreePlan.generalEducation || [],
            completedCredits: completedCredits,
            progressPercentage: progressPercentage,
            recommendations: aiData.recommendations || [],
            timeline: aiData.timeline || '4 years (8 semesters)',
            metadata: aiData.metadata || {}
        };
        
        console.log('✅ Converted data:', converted);
        return converted;
    }

    getTakenClasses() {
        const classesTakenInput = document.getElementById('classesTaken');
        if (classesTakenInput && classesTakenInput.value.trim()) {
            return classesTakenInput.value.split(',').map(code => code.trim().toUpperCase());
        }
        return [];
    }

    showError(message) {
        this.resultsSection.style.display = 'block';
        this.degreePlan.innerHTML = `
            <div class="error-message">
                <h3>⚠️ Error</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="retry-btn">Try Again</button>
            </div>
        `;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CougarDegreePlanner();
});
