#!/usr/bin/env node

/**
 * Test the new scheduling system
 */

const degreePlanningService = require('./services/degreePlanningService');

async function testScheduler() {
  console.log('🧪 Testing CougarDegree Scheduler\n');
  
  try {
    // Test 1: New student, no courses taken
    console.log('Test 1: New Computer Science student starting Fall 2025');
    console.log('─'.repeat(60));
    
    const result1 = await degreePlanningService.generateDegreePlan({
      major: 'B.S. in Computer Science',
      credits: 120,
      preferences: {},
      currentCourses: [],
      startSemester: 'Fall 2025'
    });
    
    console.log('✅ Test 1 Passed');
    console.log(`📊 Scheduled ${result1.degreePlan.semesters.length} semesters`);
    console.log(`💯 Total credits: ${result1.metadata.creditsScheduled}`);
    
    // Show first semester
    const firstSemester = result1.degreePlan.semesters[0];
    console.log(`\n📚 ${firstSemester.semesterName} (${firstSemester.totalCredits} credits):`);
    firstSemester.courses.forEach(course => {
      console.log(`  - ${course.code}: ${course.name} (${course.credits} cr)`);
    });
    
    // Test 2: Student with some courses completed
    console.log('\n\nTest 2: Student with completed courses');
    console.log('─'.repeat(60));
    
    const result2 = await degreePlanningService.generateDegreePlan({
      major: 'B.S. in Computer Science',
      credits: 120,
      preferences: {},
      currentCourses: ['ENGL 1301', 'HIST 1301', 'MATH 2413', 'COSC 1336'],
      startSemester: 'Spring 2026'
    });
    
    console.log('✅ Test 2 Passed');
    console.log(`📊 Scheduled ${result2.degreePlan.semesters.length} semesters`);
    console.log(`✅ Credits completed: ${result2.metadata.creditsCompleted}`);
    console.log(`💯 Credits scheduled: ${result2.metadata.creditsScheduled}`);
    console.log(`📝 Credits remaining: ${result2.metadata.creditsRemaining}`);
    
    // Show first semester
    const firstSemester2 = result2.degreePlan.semesters[0];
    console.log(`\n📚 ${firstSemester2.semesterName} (${firstSemester2.totalCredits} credits):`);
    firstSemester2.courses.forEach(course => {
      console.log(`  - ${course.code}: ${course.name} (${course.credits} cr)`);
      if (course.prerequisites.length > 0) {
        console.log(`    Prerequisites: ${course.prerequisites.join(', ')}`);
      }
    });
    
    // Test 3: Verify prerequisite chain
    console.log('\n\nTest 3: Checking prerequisite enforcement');
    console.log('─'.repeat(60));
    
    let prereqViolations = 0;
    const allScheduledCourses = new Set();
    
    for (const semester of result1.degreePlan.semesters) {
      for (const course of semester.courses) {
        // Check if prerequisites were met before this course
        for (const prereq of course.prerequisites) {
          if (!allScheduledCourses.has(prereq)) {
            console.log(`❌ Violation: ${course.code} scheduled before prerequisite ${prereq}`);
            prereqViolations++;
          }
        }
        allScheduledCourses.add(course.code);
      }
    }
    
    if (prereqViolations === 0) {
      console.log('✅ No prerequisite violations found!');
    } else {
      console.log(`❌ Found ${prereqViolations} prerequisite violations`);
    }
    
    // Test 4: Check credit distribution
    console.log('\n\nTest 4: Credit distribution across semesters');
    console.log('─'.repeat(60));
    
    result1.degreePlan.semesters.forEach(semester => {
      const bar = '█'.repeat(Math.floor(semester.totalCredits / 2));
      console.log(`${semester.semesterName.padEnd(15)} ${semester.totalCredits.toString().padStart(2)} cr ${bar}`);
    });
    
    console.log('\n\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run tests
testScheduler();
