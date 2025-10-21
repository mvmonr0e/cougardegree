const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

class DegreePlanningService {
  constructor() {
    this.degreesPath = path.join(__dirname, '..', 'degrees');
    this.electivesPath = path.join(__dirname, '..', 'electives');
    // Load all available degree files dynamically
    this.majorMapping = this.loadAllDegreeFiles();
    // Load UH core courses
    this.uhCoreCourses = this.loadUHCoreCourses();
    // Load elective pools
    this.electivePools = this.loadElectivePools();
    console.log(`📚 Loaded ${Object.keys(this.majorMapping).length} degree programs`);
    console.log(`🎯 Loaded ${Object.keys(this.electivePools).length} elective pools`);
  }

  /**
   * Load all degree files from the degrees directory
   */
  loadAllDegreeFiles() {
    try {
      const files = fs.readdirSync(this.degreesPath);
      const degreeFiles = files.filter(f => f.endsWith('.json') && f !== 'uh_core.json');
      
      const mapping = {};
      degreeFiles.forEach(filename => {
        try {
          const filePath = path.join(this.degreesPath, filename);
          const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          if (data.major) {
            mapping[data.major] = filename;
          }
        } catch (error) {
          console.error(`Error loading ${filename}:`, error.message);
        }
      });
      
      return mapping;
    } catch (error) {
      console.error('Error loading degree files:', error);
      return {
        'B.S. in Computer Science': 'cosc_bs.json',
        'B.S. in Computer Information Systems': 'cis_bs.json',
        'B.S. in Physics': 'phys_bs.json',
        'B.S. in Mathematics': 'math_bs.json',
        'B.S. in Chemistry': 'chem_bs.json'
      };
    }
  }

  /**
   * Load UH core courses from uh_core.json
   */
  loadUHCoreCourses() {
    try {
      const filePath = path.join(this.degreesPath, 'uh_core.json');
      const data = fs.readFileSync(filePath, 'utf8');
      
      // Try to parse JSON
      let coreData;
      try {
        coreData = JSON.parse(data);
      } catch (parseError) {
        console.log('⚠️ JSON parse error, using fallback science courses');
        return this.getFallbackScienceCourses();
      }
      
      // Extract science courses
      const scienceCourses = [];
      if (coreData.UH_Core_Requirements?.Life_and_Physical_Sciences?.courses) {
        coreData.UH_Core_Requirements.Life_and_Physical_Sciences.courses.forEach(course => {
          scienceCourses.push({
            id: course.code,
            name: course.title,
            credits: course.credits,
            requirement_type: 'Science',
            level: parseInt(course.code.match(/\d{4}/)?.[0] || '1000'),
            prerequisites: []
          });
        });
      }
      
      if (scienceCourses.length === 0) {
        console.log('⚠️ No science courses found, using fallback');
        return this.getFallbackScienceCourses();
      }
      
      console.log(`📚 Loaded ${scienceCourses.length} science courses from UH core`);
      return { science: scienceCourses };
    } catch (error) {
      console.error('Error loading UH core courses:', error.message);
      return this.getFallbackScienceCourses();
    }
  }

  /**
   * Load elective pools from the electives directory
   */
  loadElectivePools() {
    const pools = {};
    try {
      if (!fs.existsSync(this.electivesPath)) {
        console.log('⚠️ Electives directory not found');
        return pools;
      }

      const files = fs.readdirSync(this.electivesPath);
      const electiveFiles = files.filter(f => f.endsWith('.json'));
      
      electiveFiles.forEach(filename => {
        try {
          const filePath = path.join(this.electivesPath, filename);
          const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          pools[filename] = data;
        } catch (error) {
          console.error(`Error loading elective pool ${filename}:`, error.message);
        }
      });
      
      return pools;
    } catch (error) {
      console.error('Error loading elective pools:', error);
      return pools;
    }
  }

  /**
   * Get fallback science courses if JSON fails
   */
  getFallbackScienceCourses() {
    const scienceCourses = [
      { id: 'PHYS 1301', name: 'General Physics I', credits: 3, requirement_type: 'Science', level: 1301, prerequisites: [] },
      { id: 'PHYS 1101', name: 'General Physics I Lab', credits: 1, requirement_type: 'Science', level: 1101, prerequisites: ['PHYS 1301'] },
      { id: 'PHYS 1302', name: 'General Physics II', credits: 3, requirement_type: 'Science', level: 1302, prerequisites: ['PHYS 1301'] },
      { id: 'PHYS 1102', name: 'General Physics II Lab', credits: 1, requirement_type: 'Science', level: 1102, prerequisites: ['PHYS 1302'] },
      { id: 'CHEM 1331', name: 'General Chemistry I', credits: 3, requirement_type: 'Science', level: 1331, prerequisites: [] },
      { id: 'CHEM 1111', name: 'General Chemistry I Lab', credits: 1, requirement_type: 'Science', level: 1111, prerequisites: [] },
      { id: 'CHEM 1332', name: 'General Chemistry II', credits: 3, requirement_type: 'Science', level: 1332, prerequisites: ['CHEM 1331'] },
      { id: 'CHEM 1112', name: 'General Chemistry II Lab', credits: 1, requirement_type: 'Science', level: 1112, prerequisites: ['CHEM 1331'] },
      { id: 'BIOL 1306', name: 'Biology for Science Majors I', credits: 3, requirement_type: 'Science', level: 1306, prerequisites: [] },
      { id: 'BIOL 1106', name: 'Biology for Science Majors I Lab', credits: 1, requirement_type: 'Science', level: 1106, prerequisites: [] },
      { id: 'BIOL 1307', name: 'Biology for Science Majors II', credits: 3, requirement_type: 'Science', level: 1307, prerequisites: ['BIOL 1306'] },
      { id: 'BIOL 1107', name: 'Biology for Science Majors II Lab', credits: 1, requirement_type: 'Science', level: 1107, prerequisites: ['BIOL 1306'] }
    ];
    console.log(`📚 Using ${scienceCourses.length} fallback science courses`);
    return { science: scienceCourses };
  }

  /**
   * Generate a degree plan using the JSON course data
   */
  async generateDegreePlan({ major, credits, preferences, currentCourses, startSemester }) {
    try {
      console.log(`🎓 Generating degree plan for ${major}...`);
      console.log(`📝 Current courses taken:`, currentCourses);
      console.log(`📅 Start semester:`, startSemester);
      
      // Load the degree data for this major
      const degreeData = this.loadDegreeData(major);
      if (!degreeData) {
        throw new Error(`No degree data found for ${major}`);
      }

      // Normalize current courses to uppercase
      const takenCourseIds = new Set(
        (currentCourses || []).map(courseId => courseId.trim().toUpperCase())
      );

      // Get all courses that need to be taken
      let allCourses = degreeData.courses.filter(course => 
        !takenCourseIds.has(course.id)
      );

      // Add electives from pools if elective_requirements exists
      if (degreeData.elective_requirements) {
        const selectedElectives = this.selectElectivesFromPools(
          degreeData.elective_requirements,
          takenCourseIds
        );
        allCourses = [...allCourses, ...selectedElectives];
      }

      console.log(`📊 Total courses in degree: ${degreeData.courses.length}`);
      console.log(`✅ Courses already taken: ${takenCourseIds.size}`);
      console.log(`📝 Courses remaining: ${allCourses.length}`);

      // Generate 8 semesters with proper prerequisite handling
      const semesters = this.generateOptimalSchedule(
        allCourses,
        takenCourseIds,
        startSemester
      );

      // Calculate completion statistics
      const totalCreditsScheduled = semesters.reduce((sum, sem) => 
        sum + sem.courses.reduce((s, c) => s + c.credits, 0), 0
      );
      const creditsAlreadyTaken = degreeData.courses
        .filter(c => takenCourseIds.has(c.id))
        .reduce((sum, c) => sum + c.credits, 0);

      return {
        degreePlan: {
          major: degreeData.major,
          totalCredits: degreeData.total_credit_hours,
          semesters: semesters
        },
        metadata: {
          generatedAt: new Date().toISOString(),
          aiProvider: 'CougarDegree Scheduler',
          major: degreeData.major,
          totalSemesters: semesters.length,
          creditsScheduled: totalCreditsScheduled,
          creditsCompleted: creditsAlreadyTaken,
          creditsRemaining: degreeData.total_credit_hours - creditsAlreadyTaken
        }
      };
      
    } catch (error) {
      console.error('Error in generateDegreePlan:', error);
      throw new Error(`Failed to generate degree plan: ${error.message}`);
    }
  }

  /**
   * Select electives from elective pools based on requirements
   */
  selectElectivesFromPools(electiveRequirements, takenCourseIds) {
    const selectedElectives = [];
    
    for (const requirement of electiveRequirements) {
      const { category, pool_file, credits_needed, courses_needed, min_level, advanced_credits_needed, description } = requirement;
      
      // Load the elective pool
      const pool = this.electivePools[pool_file];
      if (!pool || !pool.courses) {
        console.warn(`⚠️ Elective pool ${pool_file} not found`);
        continue;
      }

      console.log(`🎯 Selecting ${courses_needed || 'multiple'} courses from ${category} (${credits_needed} credits)`);
      
      // Filter available courses (not already taken)
      let availableElectives = pool.courses.filter(course => 
        !takenCourseIds.has(course.id)
      );

      // Filter by minimum level if specified
      if (min_level) {
        availableElectives = availableElectives.filter(course => course.level >= min_level);
      }

      // Prioritize advanced courses if needed
      if (advanced_credits_needed) {
        availableElectives.sort((a, b) => {
          const aAdvanced = (a.advanced || a.level >= 4000) ? 1 : 0;
          const bAdvanced = (b.advanced || b.level >= 4000) ? 1 : 0;
          return bAdvanced - aAdvanced; // Advanced courses first
        });
      }

      // Select courses to meet requirements
      let creditsSelected = 0;
      let coursesSelected = 0;
      let advancedCreditsSelected = 0;
      
      for (const course of availableElectives) {
        if (creditsSelected >= credits_needed) break;
        if (courses_needed && coursesSelected >= courses_needed) break;
        
        // Convert elective format to course format
        const electiveCourse = {
          id: course.id,
          name: course.name,
          credits: course.credits,
          prerequisites: course.prerequisites || [],
          requirement_type: description || category,
          level: course.level
        };
        
        selectedElectives.push(electiveCourse);
        creditsSelected += course.credits;
        coursesSelected++;
        
        if (course.advanced || course.level >= 4000) {
          advancedCreditsSelected += course.credits;
        }
      }

      console.log(`✅ Selected ${coursesSelected} courses (${creditsSelected} credits) from ${category}`);
      if (advanced_credits_needed) {
        console.log(`   └─ ${advancedCreditsSelected} advanced credits (need ${advanced_credits_needed})`);
      }
    }
    
    return selectedElectives;
  }

  /**
   * Generate optimal schedule with proper prerequisite handling
   */
  generateOptimalSchedule(allCourses, takenCourseIds, startSemester) {
    const semesters = [];
    const scheduledCourses = new Set();
    const completedCourses = new Set(takenCourseIds);
    
    // Generate semester names
    const semesterNames = this.generateSemesterNames(startSemester || 'Fall 2025');
    
    // Target 15 credits per semester, 12 minimum
    const TARGET_CREDITS = 15;
    const MIN_CREDITS = 12;
    const MAX_CREDITS = 18;
    
    // Generate up to 10 semesters (5 years) to accommodate all courses
    for (let semesterIndex = 0; semesterIndex < 10 && scheduledCourses.size < allCourses.length; semesterIndex++) {
      const semesterCourses = [];
      let semesterCredits = 0;
      
      // Get courses that are available this semester
      const availableCourses = allCourses.filter(course => {
        // Already scheduled?
        if (scheduledCourses.has(course.id)) return false;
        
        // Prerequisites met?
        if (!this.arePrerequisitesMet(course, completedCourses)) return false;
        
        return true;
      });
      
      // Sort courses by priority
      const sortedCourses = this.sortCoursesByPriority(
        availableCourses,
        semesterIndex,
        completedCourses
      );
      
      // Add courses to semester
      for (const course of sortedCourses) {
        // Check if we can add this course
        if (semesterCredits + course.credits <= MAX_CREDITS) {
          semesterCourses.push(course);
          semesterCredits += course.credits;
          scheduledCourses.add(course.id);
          completedCourses.add(course.id);
          
          // Check for co-requisites (labs that go with lectures)
          const coRequisite = this.findCoRequisite(course, availableCourses, scheduledCourses);
          if (coRequisite && semesterCredits + coRequisite.credits <= MAX_CREDITS) {
            semesterCourses.push(coRequisite);
            semesterCredits += coRequisite.credits;
            scheduledCourses.add(coRequisite.id);
            completedCourses.add(coRequisite.id);
          }
          
          // Stop if we've hit target credits
          if (semesterCredits >= TARGET_CREDITS) break;
        }
      }
      
      // Create semester object
      if (semesterCourses.length > 0) {
        semesters.push({
          semester: semesterIndex + 1,
          semesterName: semesterNames[semesterIndex],
          totalCredits: semesterCredits,
          courses: semesterCourses.map(course => ({
            code: course.id,
            name: course.name,
            credits: course.credits,
            type: course.requirement_type,
            prerequisites: course.prerequisites || []
          }))
        });
      }
    }
    
    return semesters;
  }

  /**
   * Check if all prerequisites for a course are met
   */
  arePrerequisitesMet(course, completedCourses) {
    if (!course.prerequisites || course.prerequisites.length === 0) {
      return true;
    }
    
    // Check if all prerequisites are completed
    for (const prereq of course.prerequisites) {
      // Handle "or" prerequisites (e.g., "MATH 2413 or MATH 2313")
      if (prereq.includes(' or ')) {
        const options = prereq.split(' or ').map(p => p.trim());
        const anyCompleted = options.some(opt => completedCourses.has(opt));
        if (!anyCompleted) return false;
      } else {
        if (!completedCourses.has(prereq.trim())) return false;
      }
    }
    
    return true;
  }

  /**
   * Sort courses by priority for scheduling
   */
  sortCoursesByPriority(courses, semesterIndex, completedCourses) {
    return courses.sort((a, b) => {
      // Priority 1: Required courses before electives
      const aIsRequired = a.requirement_type?.includes('Core') || 
                         a.requirement_type?.includes('Prerequisites');
      const bIsRequired = b.requirement_type?.includes('Core') || 
                         b.requirement_type?.includes('Prerequisites');
      if (aIsRequired && !bIsRequired) return -1;
      if (!aIsRequired && bIsRequired) return 1;
      
      // Priority 2: Lower level courses first
      const aLevel = this.getCourseLevel(a.id);
      const bLevel = this.getCourseLevel(b.id);
      if (aLevel !== bLevel) return aLevel - bLevel;
      
      // Priority 3: Courses with more prerequisites first (they're on the critical path)
      const aPrereqCount = a.prerequisites?.length || 0;
      const bPrereqCount = b.prerequisites?.length || 0;
      if (aPrereqCount !== bPrereqCount) return bPrereqCount - aPrereqCount;
      
      // Priority 4: Alphabetical by course code
      return a.id.localeCompare(b.id);
    });
  }

  /**
   * Extract course level from course ID (e.g., "COSC 3335" -> 3000)
   */
  getCourseLevel(courseId) {
    const match = courseId.match(/(\d)\d{3}/);
    if (match) {
      return parseInt(match[1]) * 1000;
    }
    return 0;
  }

  /**
   * Find co-requisite for a course (e.g., lab for a lecture)
   */
  findCoRequisite(course, availableCourses, scheduledCourses) {
    // Extract course prefix and number (e.g., "PHYS 1301" -> "PHYS", "1301")
    const match = course.id.match(/([A-Z]+)\s*(\d{4})/);
    if (!match) return null;
    
    const [, prefix, number] = match;
    const baseNumber = number.substring(0, 3); // "1301" -> "130"
    
    // Look for lab course (typically X1YZ for lecture XZYZ)
    // e.g., PHYS 1301 lecture -> PHYS 1101 lab
    const labNumber = `${baseNumber.substring(0, 2)}0${number[3]}`;
    const lectureNumber = `${baseNumber}${number[3]}`;
    
    for (const availableCourse of availableCourses) {
      if (scheduledCourses.has(availableCourse.id)) continue;
      
      const availableMatch = availableCourse.id.match(/([A-Z]+)\s*(\d{4})/);
      if (!availableMatch) continue;
      
      const [, availablePrefix, availableNumber] = availableMatch;
      
      // Same prefix?
      if (availablePrefix !== prefix) continue;
      
      // Is this the lab for the lecture or vice versa?
      if ((course.id.includes(lectureNumber) && availableCourse.id.includes(labNumber)) ||
          (course.id.includes(labNumber) && availableCourse.id.includes(lectureNumber))) {
        return availableCourse;
      }
    }
    
    return null;
  }

  /**
   * Load degree data from JSON file
   */
  loadDegreeData(major) {
    try {
      const filename = this.majorMapping[major];
      if (!filename) {
        console.log(`⚠️ No mapping found for ${major}, available majors:`, Object.keys(this.majorMapping));
        return null;
      }

      const filePath = path.join(this.degreesPath, filename);
      console.log(`📂 Loading degree data from: ${filePath}`);
      
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error loading degree data for ${major}:`, error);
      return null;
    }
  }

  /**
   * Generate semester names based on start semester
   */
  generateSemesterNames(startSemester) {
    // Parse the start semester (e.g., "Fall 2025")
    const [season, yearStr] = startSemester.split(' ');
    let year = parseInt(yearStr);
    let isFall = season.toLowerCase() === 'fall';
    
    const semesterNames = [];
    
    for (let i = 0; i < 8; i++) {
      if (isFall) {
        semesterNames.push(`Fall ${year}`);
        isFall = false; // Next is spring
      } else {
        semesterNames.push(`Spring ${year}`);
        isFall = true; // Next is fall
        year++; // Increment year after spring
      }
    }
    
    return semesterNames;
  }

  /**
   * Get list of available majors
   */
  getAvailableMajors() {
    return Object.keys(this.majorMapping);
  }
}

module.exports = new DegreePlanningService();