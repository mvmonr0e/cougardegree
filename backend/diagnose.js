const service = require('./services/degreePlanningService');
const fs = require('fs');
const path = require('path');

async function diagnose() {
  // Load the Computer Science degree file
  const degreeData = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'degrees', 'cosc_bs.json'), 'utf8')
  );

  console.log('\n=== DEGREE FILE ANALYSIS ===');
  console.log(`Total required courses: ${degreeData.courses.length}`);
  
  let totalCreditsDirect = 0;
  degreeData.courses.forEach(c => {
    totalCreditsDirect += c.credits;
  });
  console.log(`Total credits from required courses: ${totalCreditsDirect}`);

  // Check elective requirements
  if (degreeData.elective_requirements) {
    console.log('\n=== ELECTIVE REQUIREMENTS ===');
    let totalElectiveCredits = 0;
    degreeData.elective_requirements.forEach(req => {
      console.log(`- ${req.category}: ${req.credits_needed} credits (${req.courses_needed || '?'} courses)`);
      totalElectiveCredits += req.credits_needed;
    });
    console.log(`Total elective credits: ${totalElectiveCredits}`);
    console.log(`\nExpected total: ${totalCreditsDirect} + ${totalElectiveCredits} = ${totalCreditsDirect + totalElectiveCredits}`);
  }

  // Now test the scheduler
  const result = await service.generateDegreePlan({
    major: 'B.S. in Computer Science',
    credits: 120,
    preferences: {},
    currentCourses: [],
    startSemester: 'Fall 2025'
  });

  console.log('\n=== SCHEDULER RESULTS ===');
  console.log(`Semesters generated: ${result.degreePlan.semesters.length}`);
  console.log(`Credits scheduled: ${result.metadata.creditsScheduled}`);
  console.log(`Target credits: ${result.degreePlan.totalCredits}`);
  console.log(`Gap: ${result.degreePlan.totalCredits - result.metadata.creditsScheduled} credits`);
}

diagnose().catch(console.error);
