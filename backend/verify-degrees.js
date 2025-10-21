/**
 * Degree Verification Script
 * Compares degree files against official UH catalog requirements
 */

const fs = require('fs');
const path = require('path');

const degreesPath = path.join(__dirname, 'degrees');
const verificationLog = [];

console.log('🔍 DEGREE FILE VERIFICATION SYSTEM\n');
console.log('='.repeat(80));

// Load all degree files
const degreeFiles = fs.readdirSync(degreesPath)
  .filter(f => f.endsWith('.json') && f !== 'uh_core.json')
  .sort();

console.log(`\nFound ${degreeFiles.length} degree files to verify\n`);

degreeFiles.forEach((filename, index) => {
  const filePath = path.join(degreesPath, filename);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  console.log(`${index + 1}. ${filename}`);
  console.log(`   Major: ${data.major}`);
  console.log(`   Total Credits: ${data.total_credit_hours}`);
  console.log(`   Source: ${data.source || 'NOT SPECIFIED'}`);
  console.log(`   Last Updated: ${data.last_updated || 'NOT SPECIFIED'}`);
  
  // Count courses
  const totalCourses = data.courses ? data.courses.length : 0;
  const totalCoursesCredits = data.courses 
    ? data.courses.reduce((sum, c) => sum + c.credits, 0)
    : 0;
  
  console.log(`   Required Courses: ${totalCourses} (${totalCoursesCredits} credits)`);
  
  // Check for elective requirements
  if (data.elective_requirements) {
    const electiveCredits = data.elective_requirements.reduce((sum, e) => sum + e.credits_needed, 0);
    console.log(`   Elective Requirements: ${data.elective_requirements.length} categories (${electiveCredits} credits)`);
    console.log(`   TOTAL: ${totalCoursesCredits + electiveCredits} credits`);
    
    if (totalCoursesCredits + electiveCredits !== data.total_credit_hours) {
      console.log(`   ⚠️  WARNING: Credits don't match! Expected ${data.total_credit_hours}, got ${totalCoursesCredits + electiveCredits}`);
      verificationLog.push({
        file: filename,
        major: data.major,
        issue: 'Credit mismatch',
        expected: data.total_credit_hours,
        actual: totalCoursesCredits + electiveCredits
      });
    }
  } else {
    console.log(`   ⚠️  No elective_requirements array`);
    if (totalCoursesCredits !== data.total_credit_hours) {
      console.log(`   ⚠️  WARNING: Credits don't match! Expected ${data.total_credit_hours}, got ${totalCoursesCredits}`);
      verificationLog.push({
        file: filename,
        major: data.major,
        issue: 'Credit mismatch (no electives)',
        expected: data.total_credit_hours,
        actual: totalCoursesCredits
      });
    }
  }
  
  // Check for placeholder courses
  const placeholders = data.courses ? data.courses.filter(c => 
    c.id.includes('ELECTIVE') || c.name.includes('Elective')
  ) : [];
  
  if (placeholders.length > 0) {
    console.log(`   ⚠️  Found ${placeholders.length} placeholder elective courses`);
    verificationLog.push({
      file: filename,
      major: data.major,
      issue: 'Has placeholder electives',
      count: placeholders.length
    });
  }
  
  console.log('');
});

console.log('\n' + '='.repeat(80));
console.log('\n📊 VERIFICATION SUMMARY\n');

if (verificationLog.length === 0) {
  console.log('✅ All degree files passed basic validation!');
} else {
  console.log(`⚠️  Found ${verificationLog.length} issues:\n`);
  verificationLog.forEach((log, i) => {
    console.log(`${i + 1}. ${log.file} - ${log.major}`);
    console.log(`   Issue: ${log.issue}`);
    if (log.expected) console.log(`   Expected: ${log.expected}, Actual: ${log.actual}`);
    if (log.count) console.log(`   Count: ${log.count}`);
    console.log('');
  });
}

console.log('\n📝 NEXT STEPS:');
console.log('1. Check each degree file against official UH Publications catalog');
console.log('2. Update catalog sources to current year (catoid=49 or 52)');
console.log('3. Verify all course codes, names, and prerequisites');
console.log('4. Add missing elective_requirements arrays where needed');
console.log('5. Remove all placeholder elective courses');
console.log('6. Ensure credit totals match official requirements\n');
