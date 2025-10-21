const service = require('./services/degreePlanningService');

async function test() {
  const result = await service.generateDegreePlan({
    major: 'B.S. in Computer Science',
    credits: 120,
    preferences: {},
    currentCourses: [],
    startSemester: 'Fall 2025'
  });

  console.log('\n=== ALL SEMESTERS ===');
  result.degreePlan.semesters.forEach(s => {
    console.log(`\n${s.semesterName} (${s.totalCredits} cr):`);
    s.courses.forEach(c => console.log(`  ${c.code}: ${c.name} (${c.credits} cr)`));
  });

  console.log(`\n📊 Total credits scheduled: ${result.metadata.creditsScheduled}`);
  console.log(`🎯 Target credits: ${result.degreePlan.totalCredits}`);
  console.log(`📝 Credits remaining: ${result.degreePlan.totalCredits - result.metadata.creditsScheduled}`);
}

test().catch(console.error);
