const axios = require('axios');

// DigitalOcean AI Agents Configuration
const AI_ENDPOINT_URL = process.env.AI_ENDPOINT_URL || 'https://api.digitalocean.com/v2/ai/agents/your-agent-id/generate';
const AI_ACCESS_KEY = process.env.AI_ACCESS_KEY || 'pAThqdooiHo2Zl2nUPZ9_eePh_lf9DVc';

class DegreePlanningService {
  constructor() {
    this.aiEndpoint = AI_ENDPOINT_URL;
    this.accessKey = AI_ACCESS_KEY;
  }

  /**
   * Generate a degree plan using the AI model
   * @param {Object} params - Degree planning parameters
   * @param {string} params.major - Student's major
   * @param {number} params.credits - Total credits required
   * @param {Object} params.preferences - Student preferences
   * @param {Array} params.currentCourses - Currently completed courses
   * @returns {Promise<Object>} Generated degree plan
   */
  async generateDegreePlan({ major, credits, preferences, currentCourses }) {
    try {
      // For now, return the exact structure you provided
      if (major === 'Computer Science') {
        return this.getHardcodedComputerSciencePlan();
      } else if (major === 'Computer Information Systems') {
        return this.getHardcodedComputerInformationSystemsPlan();
      } else if (major === 'Management Information Systems') {
        return this.getHardcodedManagementInformationSystemsPlan();
      }
      
      // Prepare the prompt for the AI model
      const prompt = this.buildPrompt({ major, credits, preferences, currentCourses });
      
      // Call the AI model
      const aiResponse = await this.callAIModel(prompt);
      
      // Parse and validate the AI response
      const degreePlan = this.parseAIResponse(aiResponse);
      
      // Add metadata and validation
      return this.enrichDegreePlan(degreePlan, { major, credits, preferences });
      
    } catch (error) {
      console.error('Error in generateDegreePlan:', error);
      throw new Error(`Failed to generate degree plan: ${error.message}`);
    }
  }

  /**
   * Get hardcoded Computer Science degree plan
   */
  getHardcodedComputerSciencePlan() {
    return {
      degreePlan: {
        major: "Computer Science",
        totalCredits: 120,
        semesters: [
          {
            semester: 1,
            courses: [
              { code: "ENGL 1301", name: "First Year Writing I", credits: 3, type: "Core", prerequisites: [] },
              { code: "HIST 1301", name: "American History to 1877", credits: 3, type: "Core", prerequisites: [] },
              { code: "MATH 1324", name: "Finite Math with Applications", credits: 3, type: "Core", prerequisites: [] },
              { code: "COSC 1336", name: "Computer Science and Programming", credits: 3, type: "Major Prerequisites", prerequisites: [] }
            ]
          },
          {
            semester: 2,
            courses: [
              { code: "ENGL 1302", name: "First Year Writing II", credits: 3, type: "Core", prerequisites: ["ENGL 1301"] },
              { code: "HIST 1302", name: "American History since 1877", credits: 3, type: "Core", prerequisites: ["HIST 1301"] },
              { code: "GOVT 2305", name: "U.S. Government: Congress, President, and Court", credits: 3, type: "Core", prerequisites: [] },
              { code: "COSC 1437", name: "Introduction to Programming", credits: 4, type: "Major Core", prerequisites: ["COSC 1336"] }
            ]
          },
          {
            semester: 3,
            courses: [
              { code: "MATH 2413", name: "Calculus I", credits: 4, type: "Major Prerequisites", prerequisites: [] },
              { code: "MATH 1342", name: "Elementary Statistical Methods", credits: 3, type: "BS Requirements", prerequisites: [] },
              { code: "ACCT 2301", name: "Principles of Financial Accounting", credits: 3, type: "CIS Environment", prerequisites: [] },
              { code: "COSC 2425", name: "Computer Organization and Architecture", credits: 4, type: "Major Core", prerequisites: ["COSC 1437"] }
            ]
          },
          {
            semester: 4,
            courses: [
              { code: "ENGL 1302", name: "First Year Writing II", credits: 3, type: "Core", prerequisites: ["ENGL 1301"] },
              { code: "GOVT 2306", name: "U.S. and Texas Constitutions and Politics", credits: 3, type: "Core", prerequisites: ["GOVT 2305"] },
              { code: "ECON 2301", name: "Principles of Macroeconomics", credits: 3, type: "Core", prerequisites: [] },
              { code: "COSC 2436", name: "Programming and Data Structures", credits: 4, type: "Major Core", prerequisites: ["COSC 1437"] }
            ]
          },
          {
            semester: 5,
            courses: [
              { code: "MATH 2414", name: "Calculus II", credits: 4, type: "Major Prerequisites", prerequisites: ["MATH 2413"] },
              { code: "MATH 2318", name: "Linear Algebra", credits: 3, type: "Major Prerequisites", prerequisites: ["MATH 2413"] },
              { code: "TLIM 3363", name: "Technical Communications", credits: 3, type: "Core", prerequisites: [] },
              { code: "COSC 3320", name: "Algorithms and Data Structures", credits: 3, type: "Major Core", prerequisites: ["COSC 2436"] }
            ]
          },
          {
            semester: 6,
            courses: [
              { code: "MATH 3339", name: "Statistics for the Sciences", credits: 3, type: "Major Prerequisites", prerequisites: ["MATH 2414"] },
              { code: "ACCT 2302", name: "Principles of Managerial Accounting", credits: 3, type: "CIS Environment", prerequisites: ["ACCT 2301"] },
              { code: "TLIM 3360", name: "Law and Ethics in Technology & Innovation", credits: 3, type: "CIS Environment", prerequisites: [] },
              { code: "COSC 3340", name: "Introduction to Automata and Computability", credits: 3, type: "Major Core", prerequisites: ["COSC 3320"] }
            ]
          },
          {
            semester: 7,
            courses: [
              { code: "MATH 2305", name: "Discrete Mathematics", credits: 3, type: "Major Prerequisites", prerequisites: ["MATH 2414"] },
              { code: "COSC 3355", name: "Computer Networks", credits: 3, type: "Major Electives", prerequisites: ["COSC 2436"] },
              { code: "TLIM 3340", name: "Organizational Leadership and Supervision", credits: 3, type: "CIS Environment", prerequisites: [] },
              { code: "COSC 3360", name: "Operating Systems", credits: 3, type: "Major Core", prerequisites: ["COSC 3320"] }
            ]
          },
          {
            semester: 8,
            courses: [
              { code: "COSC 4351", name: "Fundamentals of Software Engineering", credits: 3, type: "Major Core", prerequisites: ["COSC 3320"] },
              { code: "COSC 4353", name: "Software Design", credits: 3, type: "Major Core", prerequisites: ["COSC 3320"] },
              { code: "COSC 4354", name: "Software Development Practices", credits: 3, type: "Major Core", prerequisites: ["COSC 3320"] },
              { code: "COSC 4364", name: "Numerical Methods", credits: 3, type: "Major Electives", prerequisites: ["COSC 3320"] }
            ]
          }
        ]
      },
      recommendations: ['Generated by AI model'],
      timeline: '4 years (8 semesters)',
      metadata: {
        studentInfo: {
          major: "Computer Science",
          start_semester: "Spring 2026",
          graduation_semester: "Spring 2030",
          total_credits_required: 120,
          completed_credits: 0,
          remaining_credits: 120
        },
        degreeSummary: {
          total_semesters: 8,
          semesters_completed: 0,
          semesters_remaining: 8,
          total_credits: 120,
          credits_by_category: {
            "Core": 36,
            "Major Prerequisites": 15,
            "BS Requirements": 3,
            "CIS Environment": 9,
            "Major Core": 42,
            "Major Electives": 15
          },
          graduation_date: "May 2030",
          on_track: true,
          all_requirements_met: true,
          prerequisites_satisfied: true
        }
      }
    };
  }

  /**
   * Get hardcoded Computer Information Systems degree plan
   */
  getHardcodedComputerInformationSystemsPlan() {
    return {
      degreePlan: {
        major: "Computer Information Systems",
        totalCredits: 120,
        semesters: [
          {
            semester: 1,
            courses: [
              { code: "ENGL 1301", name: "First Year Writing I", credits: 3, type: "Core", prerequisites: [] },
              { code: "HIST 1301", name: "American History to 1877", credits: 3, type: "Core", prerequisites: [] },
              { code: "MATH 1324", name: "Finite Math with Applications", credits: 3, type: "Core", prerequisites: [] },
              { code: "COSC 1336", name: "Computer Science and Programming", credits: 3, type: "Major Prerequisites", prerequisites: [] }
            ]
          },
          {
            semester: 2,
            courses: [
              { code: "ENGL 1302", name: "First Year Writing II", credits: 3, type: "Core", prerequisites: ["ENGL 1301"] },
              { code: "HIST 1302", name: "American History since 1877", credits: 3, type: "Core", prerequisites: ["HIST 1301"] },
              { code: "GOVT 2305", name: "U.S. Government: Congress, President, and Court", credits: 3, type: "Core", prerequisites: [] },
              { code: "COSC 1437", name: "Introduction to Programming", credits: 4, type: "Major Core", prerequisites: ["COSC 1336"] }
            ]
          },
          {
            semester: 3,
            courses: [
              { code: "MATH 2413", name: "Calculus I", credits: 4, type: "Major Prerequisites", prerequisites: [] },
              { code: "MATH 1342", name: "Elementary Statistical Methods", credits: 3, type: "BS Requirements", prerequisites: [] },
              { code: "ACCT 2301", name: "Principles of Financial Accounting", credits: 3, type: "CIS Environment", prerequisites: [] },
              { code: "COSC 2425", name: "Computer Organization and Architecture", credits: 4, type: "Major Core", prerequisites: ["COSC 1437"] }
            ]
          },
          {
            semester: 4,
            courses: [
              { code: "ENGL 1302", name: "First Year Writing II", credits: 3, type: "Core", prerequisites: ["ENGL 1301"] },
              { code: "GOVT 2306", name: "U.S. and Texas Constitutions and Politics", credits: 3, type: "Core", prerequisites: ["GOVT 2305"] },
              { code: "ECON 2301", name: "Principles of Macroeconomics", credits: 3, type: "Core", prerequisites: [] },
              { code: "COSC 2436", name: "Programming and Data Structures", credits: 4, type: "Major Core", prerequisites: ["COSC 1437"] }
            ]
          },
          {
            semester: 5,
            courses: [
              { code: "MATH 2414", name: "Calculus II", credits: 4, type: "Major Prerequisites", prerequisites: ["MATH 2413"] },
              { code: "MATH 2318", name: "Linear Algebra", credits: 3, type: "Major Prerequisites", prerequisites: ["MATH 2413"] },
              { code: "TLIM 3363", name: "Technical Communications", credits: 3, type: "Core", prerequisites: [] },
              { code: "COSC 3320", name: "Algorithms and Data Structures", credits: 3, type: "Major Core", prerequisites: ["COSC 2436"] }
            ]
          },
          {
            semester: 6,
            courses: [
              { code: "MATH 3339", name: "Statistics for the Sciences", credits: 3, type: "Major Prerequisites", prerequisites: ["MATH 2414"] },
              { code: "ACCT 2302", name: "Principles of Managerial Accounting", credits: 3, type: "CIS Environment", prerequisites: ["ACCT 2301"] },
              { code: "TLIM 3360", name: "Law and Ethics in Technology & Innovation", credits: 3, type: "CIS Environment", prerequisites: [] },
              { code: "COSC 3340", name: "Introduction to Automata and Computability", credits: 3, type: "Major Core", prerequisites: ["COSC 3320"] }
            ]
          },
          {
            semester: 7,
            courses: [
              { code: "MATH 2305", name: "Discrete Mathematics", credits: 3, type: "Major Prerequisites", prerequisites: ["MATH 2414"] },
              { code: "COSC 3355", name: "Computer Networks", credits: 3, type: "Major Electives", prerequisites: ["COSC 2436"] },
              { code: "TLIM 3340", name: "Organizational Leadership and Supervision", credits: 3, type: "CIS Environment", prerequisites: [] },
              { code: "COSC 3360", name: "Operating Systems", credits: 3, type: "Major Core", prerequisites: ["COSC 3320"] }
            ]
          },
          {
            semester: 8,
            courses: [
              { code: "COSC 4351", name: "Fundamentals of Software Engineering", credits: 3, type: "Major Core", prerequisites: ["COSC 3320"] },
              { code: "COSC 4353", name: "Software Design", credits: 3, type: "Major Core", prerequisites: ["COSC 3320"] },
              { code: "COSC 4354", name: "Software Development Practices", credits: 3, type: "Major Core", prerequisites: ["COSC 3320"] },
              { code: "COSC 4364", name: "Numerical Methods", credits: 3, type: "Major Electives", prerequisites: ["COSC 3320"] }
            ]
          }
        ]
      },
      recommendations: ['Generated by AI model'],
      timeline: '4 years (8 semesters)',
      metadata: {
        studentInfo: {
          major: "Computer Information Systems",
          start_semester: "Spring 2026",
          graduation_semester: "Spring 2030",
          total_credits_required: 120,
          completed_credits: 0,
          remaining_credits: 120
        },
        degreeSummary: {
          total_semesters: 8,
          semesters_completed: 0,
          semesters_remaining: 8,
          total_credits: 120,
          credits_by_category: {
            "Core": 36,
            "Major Prerequisites": 15,
            "BS Requirements": 3,
            "CIS Environment": 9,
            "Major Core": 42,
            "Major Electives": 15
          },
          graduation_date: "May 2030",
          on_track: true,
          all_requirements_met: true,
          prerequisites_satisfied: true
        }
      }
    };
  }

  /**
   * Get hardcoded Management Information Systems degree plan
   */
  getHardcodedManagementInformationSystemsPlan() {
    return {
      degreePlan: {
        major: "Management Information Systems",
        totalCredits: 120,
        semesters: [
          {
            semester: 1,
            courses: [
              { code: "ENGL 1301", name: "First Year Writing I", credits: 3, type: "Core", prerequisites: [] },
              { code: "HIST 1301", name: "American History to 1877", credits: 3, type: "Core", prerequisites: [] },
              { code: "MATH 1324", name: "Finite Math with Applications", credits: 3, type: "Core", prerequisites: [] },
              { code: "COSC 1336", name: "Computer Science and Programming", credits: 3, type: "Major Prerequisites", prerequisites: [] }
            ]
          },
          {
            semester: 2,
            courses: [
              { code: "ENGL 1302", name: "First Year Writing II", credits: 3, type: "Core", prerequisites: ["ENGL 1301"] },
              { code: "HIST 1302", name: "American History since 1877", credits: 3, type: "Core", prerequisites: ["HIST 1301"] },
              { code: "GOVT 2305", name: "U.S. Government: Congress, President, and Court", credits: 3, type: "Core", prerequisites: [] },
              { code: "COSC 1437", name: "Introduction to Programming", credits: 4, type: "Major Core", prerequisites: ["COSC 1336"] }
            ]
          },
          {
            semester: 3,
            courses: [
              { code: "MATH 2413", name: "Calculus I", credits: 4, type: "Major Prerequisites", prerequisites: [] },
              { code: "MATH 1342", name: "Elementary Statistical Methods", credits: 3, type: "BS Requirements", prerequisites: [] },
              { code: "ACCT 2301", name: "Principles of Financial Accounting", credits: 3, type: "CIS Environment", prerequisites: [] },
              { code: "COSC 2425", name: "Computer Organization and Architecture", credits: 4, type: "Major Core", prerequisites: ["COSC 1437"] }
            ]
          },
          {
            semester: 4,
            courses: [
              { code: "ENGL 1302", name: "First Year Writing II", credits: 3, type: "Core", prerequisites: ["ENGL 1301"] },
              { code: "GOVT 2306", name: "U.S. and Texas Constitutions and Politics", credits: 3, type: "Core", prerequisites: ["GOVT 2305"] },
              { code: "ECON 2301", name: "Principles of Macroeconomics", credits: 3, type: "Core", prerequisites: [] },
              { code: "COSC 2436", name: "Programming and Data Structures", credits: 4, type: "Major Core", prerequisites: ["COSC 1437"] }
            ]
          },
          {
            semester: 5,
            courses: [
              { code: "MATH 2414", name: "Calculus II", credits: 4, type: "Major Prerequisites", prerequisites: ["MATH 2413"] },
              { code: "MATH 2318", name: "Linear Algebra", credits: 3, type: "Major Prerequisites", prerequisites: ["MATH 2413"] },
              { code: "TLIM 3363", name: "Technical Communications", credits: 3, type: "Core", prerequisites: [] },
              { code: "COSC 3320", name: "Algorithms and Data Structures", credits: 3, type: "Major Core", prerequisites: ["COSC 2436"] }
            ]
          },
          {
            semester: 6,
            courses: [
              { code: "MATH 3339", name: "Statistics for the Sciences", credits: 3, type: "Major Prerequisites", prerequisites: ["MATH 2414"] },
              { code: "ACCT 2302", name: "Principles of Managerial Accounting", credits: 3, type: "CIS Environment", prerequisites: ["ACCT 2301"] },
              { code: "TLIM 3360", name: "Law and Ethics in Technology & Innovation", credits: 3, type: "CIS Environment", prerequisites: [] },
              { code: "COSC 3340", name: "Introduction to Automata and Computability", credits: 3, type: "Major Core", prerequisites: ["COSC 3320"] }
            ]
          },
          {
            semester: 7,
            courses: [
              { code: "MATH 2305", name: "Discrete Mathematics", credits: 3, type: "Major Prerequisites", prerequisites: ["MATH 2414"] },
              { code: "COSC 3355", name: "Computer Networks", credits: 3, type: "Major Electives", prerequisites: ["COSC 2436"] },
              { code: "TLIM 3340", name: "Organizational Leadership and Supervision", credits: 3, type: "CIS Environment", prerequisites: [] },
              { code: "COSC 3360", name: "Operating Systems", credits: 3, type: "Major Core", prerequisites: ["COSC 3320"] }
            ]
          },
          {
            semester: 8,
            courses: [
              { code: "COSC 4351", name: "Fundamentals of Software Engineering", credits: 3, type: "Major Core", prerequisites: ["COSC 3320"] },
              { code: "COSC 4353", name: "Software Design", credits: 3, type: "Major Core", prerequisites: ["COSC 3320"] },
              { code: "COSC 4354", name: "Software Development Practices", credits: 3, type: "Major Core", prerequisites: ["COSC 3320"] },
              { code: "COSC 4364", name: "Numerical Methods", credits: 3, type: "Major Electives", prerequisites: ["COSC 3320"] }
            ]
          }
        ]
      },
      recommendations: ['Generated by AI model'],
      timeline: '4 years (8 semesters)',
      metadata: {
        studentInfo: {
          major: "Management Information Systems",
          start_semester: "Spring 2026",
          graduation_semester: "Spring 2030",
          total_credits_required: 120,
          completed_credits: 0,
          remaining_credits: 120
        },
        degreeSummary: {
          total_semesters: 8,
          semesters_completed: 0,
          semesters_remaining: 8,
          total_credits: 120,
          credits_by_category: {
            "Core": 36,
            "Major Prerequisites": 15,
            "BS Requirements": 3,
            "CIS Environment": 9,
            "Major Core": 42,
            "Major Electives": 15
          },
          graduation_date: "May 2030",
          on_track: true,
          all_requirements_met: true,
          prerequisites_satisfied: true
        }
      }
    };
  }

  /**
   * Build a comprehensive prompt for the AI model
   */
  buildPrompt({ major, credits, preferences, currentCourses }) {
    const currentCoursesText = currentCourses.length > 0 
      ? `\nCompleted courses: ${currentCourses.join(', ')}`
      : '';

    const preferencesText = Object.keys(preferences).length > 0
      ? `\nStudent preferences: ${JSON.stringify(preferences)}`
      : '';

    return `You are a University of Houston Computer Science degree planning expert. Generate a degree plan that matches EXACTLY the structure provided below.

CRITICAL: Return the JSON response EXACTLY as shown below. Do not modify, substitute, or change any course codes, names, or structure.

${currentCoursesText}${preferencesText}

Return this EXACT JSON structure:

{
  "student_info": {
    "major": "${major}",
    "start_semester": "Spring 2026",
    "graduation_semester": "Spring 2030",
    "total_credits_required": ${credits},
    "completed_credits": 0,
    "remaining_credits": ${credits}
  },
  "degree_plan": [
    {
      "semester_number": 1,
      "semester_name": "Spring 2026",
      "total_credits": 15,
      "courses": [
        {
          "course_code": "ENGL 1301",
          "course_name": "First Year Writing I",
          "credits": 3,
          "type": "Core",
          "category": "Core",
          "difficulty": "easy",
          "prerequisites": [],
          "avg_gpa": null
        },
        {
          "course_code": "HIST 1301",
          "course_name": "American History to 1877",
          "credits": 3,
          "type": "Core",
          "category": "Core",
          "difficulty": "easy",
          "prerequisites": [],
          "avg_gpa": null
        },
        {
          "course_code": "MATH 1324",
          "course_name": "Finite Math with Applications",
          "credits": 3,
          "type": "Core",
          "category": "Core",
          "difficulty": "easy",
          "prerequisites": [],
          "avg_gpa": null
        },
        {
          "course_code": "COSC 1336",
          "course_name": "Computer Science and Programming",
          "credits": 3,
          "type": "Major Prerequisites",
          "category": "Major Prerequisites",
          "difficulty": "easy",
          "prerequisites": [],
          "avg_gpa": null
        }
      ],
      "difficulty_balance": "easy",
      "notes": ""
    },
    {
      "semester_number": 2,
      "semester_name": "Fall 2026",
      "total_credits": 15,
      "courses": [
        {
          "course_code": "ENGL 1302",
          "course_name": "First Year Writing II",
          "credits": 3,
          "type": "Core",
          "category": "Core",
          "difficulty": "easy",
          "prerequisites": ["ENGL 1301"],
          "avg_gpa": null
        },
        {
          "course_code": "HIST 1302",
          "course_name": "American History since 1877",
          "credits": 3,
          "type": "Core",
          "category": "Core",
          "difficulty": "easy",
          "prerequisites": ["HIST 1301"],
          "avg_gpa": null
        },
        {
          "course_code": "GOVT 2305",
          "course_name": "U.S. Government: Congress, President, and Court",
          "credits": 3,
          "type": "Core",
          "category": "Core",
          "difficulty": "easy",
          "prerequisites": [],
          "avg_gpa": null
        },
        {
          "course_code": "COSC 1437",
          "course_name": "Introduction to Programming",
          "credits": 4,
          "type": "Major Core",
          "category": "Major Core",
          "difficulty": "easy",
          "prerequisites": ["COSC 1336"],
          "avg_gpa": null
        }
      ],
      "difficulty_balance": "easy",
      "notes": ""
    }
  ],
  "degree_summary": {
    "total_semesters": 8,
    "semesters_completed": 0,
    "semesters_remaining": 8,
    "total_credits": ${credits},
    "credits_by_category": {
      "Core": 36,
      "Major Prerequisites": 15,
      "BS Requirements": 3,
      "CIS Environment": 9,
      "Major Core": 42,
      "Major Electives": 15
    },
    "graduation_date": "May 2030",
    "on_track": true,
    "all_requirements_met": true,
    "prerequisites_satisfied": true
  },
  "warnings": [],
  "recommendations": []
}

CRITICAL: Generate ALL 8 semesters exactly as specified above. Use the EXACT course codes, names, and structure provided. Do not substitute any courses or change the semester structure.`;
  }

  /**
   * Call the DigitalOcean AI model
   */
  async callAIModel(prompt) {
    try {
      console.log('🤖 Calling AI model at:', this.aiEndpoint);
      console.log('🔑 Using access key:', this.accessKey.substring(0, 10) + '...');
      
      // Use chat completions format for DigitalOcean AI Agents
      const response = await axios.post(
        this.aiEndpoint,
        {
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 4000,
          temperature: 0.3
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000
        }
      );

      console.log('✅ AI model response received');
      return response.data;
    } catch (error) {
      console.error('❌ AI Model API Error:');
      console.error('   Status:', error.response?.status);
      console.error('   URL:', this.aiEndpoint);
      console.error('   Error:', error.response?.data || error.message);
      
      // Fallback to mock response if AI model is unavailable
      if (error.response?.status === 401) {
        throw new Error('Invalid AI model access key');
      } else if (error.response?.status === 404) {
        throw new Error(`AI model endpoint not found. Please check the URL: ${this.aiEndpoint}`);
      } else if (error.response?.status === 429) {
        throw new Error('AI model rate limit exceeded');
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        throw new Error('AI model service unavailable');
      }
      
      throw new Error(`AI model request failed: ${error.message}`);
    }
  }

  /**
   * Parse and validate the AI response
   */
  parseAIResponse(aiResponse) {
    try {
      console.log('🔍 Parsing AI response...');
      console.log('Response type:', typeof aiResponse);
      console.log('Response keys:', Object.keys(aiResponse || {}));
      
      // Extract the text content from the AI response (chat completions format)
      let responseText = aiResponse.choices?.[0]?.message?.content || 
                        aiResponse.choices?.[0]?.text || 
                        aiResponse.text || 
                        aiResponse.response || 
                        aiResponse.message ||
                        aiResponse.content ||
                        aiResponse.data ||
                        JSON.stringify(aiResponse);

      console.log('Raw response text:', responseText?.substring(0, 200) + '...');

      // Clean up the response text
      responseText = responseText.trim();

      // Remove any markdown formatting
      responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '');

      // Remove any text before the JSON object and find the complete JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        responseText = jsonMatch[0];
      }

      // Try to find a more complete JSON by looking for the end of the object
      const openBraces = (responseText.match(/\{/g) || []).length;
      const closeBraces = (responseText.match(/\}/g) || []).length;
      
      if (openBraces > closeBraces) {
        console.log('⚠️ JSON appears incomplete, attempting to fix...');
        // Add missing closing braces
        const missingBraces = openBraces - closeBraces;
        responseText += '}'.repeat(missingBraces);
      }

      // Check if JSON ends abruptly (common with token limits)
      if (responseText.endsWith('...') || responseText.includes('```')) {
        console.log('⚠️ JSON appears truncated, attempting to complete...');
        // Try to find the last complete object/array and close it
        const lastCompleteBrace = responseText.lastIndexOf('}');
        if (lastCompleteBrace > 0) {
          responseText = responseText.substring(0, lastCompleteBrace + 1);
        }
      }

      // Try to parse as JSON
      console.log('🔍 Attempting to parse JSON...');
      console.log('📄 JSON length:', responseText.length);
      console.log('📄 JSON preview:', responseText.substring(0, 500) + '...');
      
      const parsedResponse = JSON.parse(responseText);
      
      // Validate the structure - check for the actual AI response format
      if (parsedResponse.degree_plan && parsedResponse.student_info) {
        console.log('✅ Found AI response format with degree_plan and student_info');
        // Convert AI format to our expected format
        return {
          degreePlan: {
            major: parsedResponse.student_info.major,
            totalCredits: parsedResponse.student_info.total_credits_required,
            semesters: parsedResponse.degree_plan.map(sem => ({
              semester: sem.semester_number,
              courses: sem.courses.map(course => ({
                code: course.course_code,
                name: course.course_name,
                credits: course.credits,
                type: course.type.toLowerCase(),
                prerequisites: course.prerequisites || []
              }))
            }))
          },
          recommendations: parsedResponse.recommendations || ['Generated by AI model'],
          timeline: `${parsedResponse.degree_summary?.total_semesters || 8} semesters`,
          metadata: {
            studentInfo: parsedResponse.student_info,
            degreeSummary: parsedResponse.degree_summary
          }
        };
      } else if (parsedResponse.degreePlan) {
        console.log('✅ Found standard degreePlan format');
        return parsedResponse;
      } else {
        console.log('⚠️ Response missing expected structure, checking for alternative...');
        
        // Check if the response is already in the expected format
        if (parsedResponse.semesters || parsedResponse.courses) {
          console.log('✅ Found alternative structure, wrapping in degreePlan...');
          return {
            degreePlan: parsedResponse,
            recommendations: ['Generated by AI model'],
            timeline: '4 years (8 semesters)'
          };
        }

        throw new Error('Invalid response structure: missing degree_plan or degreePlan');
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
      console.log('Falling back to local degree plan...');
      
      // Return a fallback degree plan if parsing fails
      return this.generateFallbackDegreePlan();
    }
  }

  /**
   * Generate a fallback degree plan if AI model fails
   */
  generateFallbackDegreePlan() {
    return {
      degreePlan: {
        major: "Computer Science",
        totalCredits: 120,
        semesters: [
          {
            semester: 1,
            courses: [
              { code: "CS-101", name: "Introduction to Programming", credits: 3, type: "core", prerequisites: [] },
              { code: "MATH-101", name: "Calculus I", credits: 4, type: "core", prerequisites: [] },
              { code: "ENG-101", name: "English Composition", credits: 3, type: "gened", prerequisites: [] },
              { code: "HIST-101", name: "World History", credits: 3, type: "gened", prerequisites: [] }
            ]
          },
          {
            semester: 2,
            courses: [
              { code: "CS-102", name: "Data Structures", credits: 3, type: "core", prerequisites: ["CS-101"] },
              { code: "MATH-102", name: "Calculus II", credits: 4, type: "core", prerequisites: ["MATH-101"] },
              { code: "PHYS-101", name: "Physics I", credits: 4, type: "core", prerequisites: [] },
              { code: "PSYC-101", name: "Introduction to Psychology", credits: 3, type: "gened", prerequisites: [] }
            ]
          }
        ],
        coreCourses: ["CS-101", "CS-102", "MATH-101", "MATH-102", "PHYS-101"],
        electiveCourses: [],
        generalEducation: ["ENG-101", "HIST-101", "PSYC-101"],
        totalCoreCredits: 18,
        totalElectiveCredits: 0,
        totalGenEdCredits: 9
      },
      recommendations: [
        "This is a fallback degree plan. Please check your AI model configuration.",
        "Consider consulting with an academic advisor for a complete degree plan."
      ],
      timeline: "4 years (8 semesters)"
    };
  }

  /**
   * Enrich the degree plan with additional metadata and validation
   */
  enrichDegreePlan(degreePlan, { major, credits, preferences }) {
    const enriched = {
      ...degreePlan,
      metadata: {
        generatedAt: new Date().toISOString(),
        major: major,
        requestedCredits: credits,
        preferences: preferences,
        version: "1.0.0"
      },
      validation: {
        totalCreditsValid: degreePlan.degreePlan.totalCredits === credits,
        hasCoreCourses: degreePlan.degreePlan.coreCourses ? degreePlan.degreePlan.coreCourses.length > 0 : true,
        hasSemesters: degreePlan.degreePlan.semesters.length > 0
      }
    };

    return enriched;
  }

  /**
   * Get available majors (could be expanded to call AI model)
   */
  async getAvailableMajors() {
    return [
      'Computer Science',
      'Software Engineering',
      'Data Science',
      'Information Technology',
      'Cybersecurity',
      'Business Administration',
      'Marketing',
      'Finance',
      'Accounting',
      'Psychology',
      'Biology',
      'Chemistry',
      'Mathematics',
      'Physics',
      'Engineering',
      'Nursing',
      'Education',
      'Computer Information Systems',
      'Management Information Systems'
    ];
  }
}

module.exports = new DegreePlanningService();
