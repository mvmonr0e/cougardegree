// CougarDegree Frontend JavaScript
class CougarDegreePlanner {
    constructor() {
        this.form = document.getElementById('degreeForm');
        this.resultsSection = document.getElementById('resultsSection');
        this.degreePlan = document.getElementById('degreePlan');
        this.editBtn = document.getElementById('editPlanBtn');
        
        this.initializeEventListeners();
        this.initializeSampleData();
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

            // Generate degree plan
            const degreePlan = this.generateDegreePlan(major, startSemester, takenClasses);
            
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
            alert('Error generating degree plan. Please try again.');
        }
    }

    showLoading() {
        this.resultsSection.style.display = 'block';
        this.degreePlan.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                <p>Generating your personalized degree plan...</p>
            </div>
        `;
    }

    generateDegreePlan(major, startSemester, takenClasses) {
        const majorData = this.degreeRequirements[major];
        if (!majorData) {
            throw new Error('Invalid major selected');
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
        
        const semesterNames = this.getSemesterNames(degreePlan.startSemester);
        
        // Group semesters by year
        const years = this.groupSemestersByYear(degreePlan.semesters, semesterNames);
        
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
                                        <div class="course-item">
                                            <span class="course-code">${course.code}: ${course.name}</span>
                                            <span class="course-credits">${course.credits} Cr.</span>
                                        </div>
                                    `).join('')}
                                </div>
                                <div class="semester-total">Total: ${semester.totalCredits} Credits</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        this.degreePlan.innerHTML = html;
    }

    groupSemestersByYear(semesters, semesterNames) {
        const years = [];
        let currentYear = [];
        
        semesters.forEach((semester, index) => {
            const semesterName = semesterNames[index] || `Semester ${semester.number}`;
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
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CougarDegreePlanner();
});
