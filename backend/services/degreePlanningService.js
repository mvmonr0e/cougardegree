const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

class DegreePlanningService {
  constructor() {
    this.degreesPath = path.join(__dirname, '..', 'degrees');
    // Load all available degree files dynamically
    this.majorMapping = this.loadAllDegreeFiles();
    // Load UH core courses
    this.uhCoreCourses = this.loadUHCoreCourses();
    console.log(`📚 Loaded ${Object.keys(this.majorMapping).length} degree programs`);
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
   * Generate a degree plan using Gemini AI
   */
  async generateDegreePlan({ major, credits, preferences, currentCourses, startSemester }) {
    try {
      console.log(`🎓 Generating degree plan for ${major} using Gemini AI...`);
      
      // Load the degree data for this major
      const degreeData = this.loadDegreeData(major);
      if (!degreeData) {
        throw new Error(`No degree data found for ${major}`);
      }

      // For now, return a working template while we debug Gemini
      return this.generateTemplatePlan(degreeData, currentCourses, startSemester);
      
    } catch (error) {
      console.error('Error in generateDegreePlan:', error);
      throw new Error(`Failed to generate degree plan: ${error.message}`);
    }
  }

  /**
   * Generate a template-based degree plan (working solution)
   */
  generateTemplatePlan(degreeData, currentCourses, startSemester) {
    console.log('📋 Generating template-based degree plan...');
    
    // Get all courses organized by type
    const coreCourses = degreeData.courses.filter(c => c.requirement_type === 'Core');
    const majorCourses = degreeData.courses.filter(c => 
      c.requirement_type === 'Major Core' || c.requirement_type === 'Major Prerequisites'
    );
    const electiveCourses = degreeData.courses.filter(c => 
      c.requirement_type === 'Major Electives' || c.requirement_type?.includes('Elective')
    );
    
    // Add science courses from UH core
    const scienceCourses = this.uhCoreCourses?.science || [];
    console.log(`🧪 Including ${scienceCourses.length} science courses`);
    
    // Track used courses
    const usedCourseIds = new Set();
    
    // Generate semester names based on start semester
    const semesterNames = this.generateSemesterNames(startSemester || 'Fall 2025');
    
    // Create 8 semesters
    const semesters = [];
    
    for (let i = 0; i < 8; i++) {
      const semesterNumber = i + 1;
      const semesterName = semesterNames[i];
      
      // Select courses for this semester
      const semesterCourses = this.selectCoursesForSemester(
        semesterNumber, 
        coreCourses, 
        majorCourses,
        electiveCourses,
        scienceCourses,
        degreeData.courses,
        usedCourseIds
      );
      
      // Mark courses as used
      semesterCourses.forEach(course => usedCourseIds.add(course.id));
      
      const totalCredits = semesterCourses.reduce((sum, course) => sum + course.credits, 0);
      
      semesters.push({
        semester: semesterNumber,
        semesterName: semesterName,
        totalCredits: totalCredits,
        courses: semesterCourses.map(course => ({
          code: course.id,
          name: course.name,
          credits: course.credits,
          type: course.requirement_type,
          prerequisites: course.prerequisites || []
        }))
      });
    }
    
    return {
      degreePlan: {
        major: degreeData.major,
        totalCredits: degreeData.total_credit_hours,
        semesters: semesters
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        aiProvider: 'CougarDegree AI',
        major: degreeData.major,
        totalSemesters: 8
      }
    };
  }

  /**
   * Select courses for a specific semester
   */
  selectCoursesForSemester(semesterNumber, coreCourses, majorCourses, electiveCourses, scienceCourses, allCourses, usedCourseIds) {
    const courses = [];
    let totalCredits = 0;
    const minCredits = 12;
    const targetCredits = 15;
    const maxCourses = 5; // Limit to 5 courses per semester
    
    // Helper to check if course is available
    const isAvailable = (course) => !usedCourseIds.has(course.id);
    
    // Helper to check if we can add more courses
    const canAddMore = () => courses.length < maxCourses && totalCredits < targetCredits;
    
    // Semester 1: Foundation courses
    if (semesterNumber === 1) {
      const english1 = coreCourses.find(c => c.id === 'ENGL 1301' && isAvailable(c));
      const history1 = coreCourses.find(c => c.id === 'HIST 1301' && isAvailable(c));
      const math1 = allCourses.find(c => c.id === 'MATH 2413' && isAvailable(c));
      const cosc1 = allCourses.find(c => c.id === 'COSC 1336' && isAvailable(c));
      
      [english1, history1, math1, cosc1].forEach(course => {
        if (course && canAddMore() && totalCredits + course.credits <= targetCredits) {
          courses.push(course);
          totalCredits += course.credits;
        }
      });
    }
    
    // Semester 2: Continue foundation
    else if (semesterNumber === 2) {
      const english2 = coreCourses.find(c => c.id === 'ENGL 1302' && isAvailable(c));
      const history2 = coreCourses.find(c => c.id === 'HIST 1302' && isAvailable(c));
      const govt1 = coreCourses.find(c => c.id === 'GOVT 2305' && isAvailable(c));
      const cosc2 = allCourses.find(c => c.id === 'COSC 1437' && isAvailable(c));
      
      [english2, history2, govt1, cosc2].forEach(course => {
        if (course && canAddMore() && totalCredits + course.credits <= targetCredits) {
          courses.push(course);
          totalCredits += course.credits;
        }
      });
    }
    
    // Semester 3-4: Core + Lower level major courses + Science
    else if (semesterNumber <= 4) {
      // Add available core courses
      const availableCore = coreCourses.filter(c => isAvailable(c) && c.level <= 2000);
      for (const course of availableCore.slice(0, 1)) {
        if (canAddMore() && totalCredits + course.credits <= targetCredits) {
          courses.push(course);
          totalCredits += course.credits;
        }
      }
      
      // Add science courses (Physics/Chemistry for CS/Engineering)
      const availableScience = scienceCourses.filter(c => 
        isAvailable(c) && (c.id.includes('PHYS') || c.id.includes('CHEM'))
      );
      for (const course of availableScience.slice(0, 1)) {
        if (canAddMore() && totalCredits + course.credits <= targetCredits) {
          courses.push(course);
          totalCredits += course.credits;
        }
      }
      
      // Add lower-level major courses
      const availableMajor = majorCourses.filter(c => isAvailable(c) && c.level <= 2000);
      for (const course of availableMajor.slice(0, 2)) {
        if (canAddMore() && totalCredits + course.credits <= targetCredits) {
          courses.push(course);
          totalCredits += course.credits;
        }
      }
    }
    
    // Semester 5-6: Mix of core, science labs, and mid-level major courses
    else if (semesterNumber <= 6) {
      // Add any remaining core courses
      const availableCore = coreCourses.filter(c => isAvailable(c));
      for (const course of availableCore.slice(0, 1)) {
        if (canAddMore() && totalCredits + course.credits <= targetCredits) {
          courses.push(course);
          totalCredits += course.credits;
        }
      }
      
      // Add more science courses or labs
      const availableScience = scienceCourses.filter(c => isAvailable(c));
      for (const course of availableScience.slice(0, 1)) {
        if (canAddMore() && totalCredits + course.credits <= targetCredits) {
          courses.push(course);
          totalCredits += course.credits;
        }
      }
      
      // Add 3000-level major courses
      const available3000 = majorCourses.filter(c => isAvailable(c) && c.level === 3000);
      for (const course of available3000.slice(0, 2)) {
        if (canAddMore() && totalCredits + course.credits <= targetCredits) {
          courses.push(course);
          totalCredits += course.credits;
        }
      }
    }
    
    // Semester 7-8: Advanced major courses
    else {
      const advancedCourses = majorCourses.filter(c => isAvailable(c) && c.level >= 3000);
      for (const course of advancedCourses.slice(0, 4)) {
        if (canAddMore() && totalCredits + course.credits <= targetCredits) {
          courses.push(course);
          totalCredits += course.credits;
        }
      }
    }
    
    // Fill with electives if below minimum credits
    if (totalCredits < minCredits && electiveCourses && electiveCourses.length > 0) {
      const availableElectives = electiveCourses.filter(c => isAvailable(c));
      for (const elective of availableElectives) {
        if (!canAddMore() || totalCredits >= targetCredits) break;
        if (totalCredits + elective.credits <= targetCredits) {
          courses.push(elective);
          totalCredits += elective.credits;
        }
      }
    }
    
    // If still below minimum, add any remaining available courses
    if (totalCredits < minCredits) {
      const remainingCourses = allCourses.filter(c => isAvailable(c));
      for (const course of remainingCourses) {
        if (!canAddMore() || totalCredits >= minCredits) break;
        if (totalCredits + course.credits <= targetCredits) {
          courses.push(course);
          totalCredits += course.credits;
        }
      }
    }
    
    return courses;
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
        semesterNames.push(`Spring ${year + 1}`);
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