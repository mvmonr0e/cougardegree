#!/usr/bin/env node

/**
 * Data Validation Script
 * Checks all degree JSON files for completeness and accuracy
 */

const fs = require('fs');
const path = require('path');

const degreesPath = path.join(__dirname, 'degrees');

console.log('🔍 CougarDegree Data Validation Tool\n');
console.log('=' .repeat(70));

// Track issues
let totalIssues = 0;
const issuesByFile = {};

// Validate a single degree file
function validateDegreeFile(filename) {
  const filePath = path.join(degreesPath, filename);
  const issues = [];
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Check required fields
    if (!data.major) issues.push('❌ Missing "major" field');
    if (!data.total_credit_hours) issues.push('❌ Missing "total_credit_hours" field');
    if (!data.courses || !Array.isArray(data.courses)) {
      issues.push('❌ Missing or invalid "courses" array');
      return issues;
    }
    
    // Validate total credits
    const totalCredits = data.courses.reduce((sum, c) => sum + (c.credits || 0), 0);
    if (Math.abs(totalCredits - data.total_credit_hours) > 10) {
      issues.push(`⚠️  Credit mismatch: Listed ${data.total_credit_hours}, Found ${totalCredits}`);
    }
    
    // Validate each course
    const courseIds = new Set();
    data.courses.forEach((course, idx) => {
      if (!course.id) {
        issues.push(`❌ Course ${idx}: Missing course ID`);
      } else {
        // Check for duplicates
        if (courseIds.has(course.id)) {
          issues.push(`❌ Duplicate course: ${course.id}`);
        }
        courseIds.add(course.id);
      }
      
      if (!course.name) issues.push(`❌ Course ${course.id || idx}: Missing name`);
      if (!course.credits) issues.push(`❌ Course ${course.id || idx}: Missing credits`);
      if (!course.requirement_type) issues.push(`⚠️  Course ${course.id}: Missing requirement_type`);
      
      // Validate prerequisites
      if (course.prerequisites && Array.isArray(course.prerequisites)) {
        course.prerequisites.forEach(prereq => {
          // Check if prerequisite exists in this degree
          const prereqExists = data.courses.some(c => c.id === prereq || prereq.includes(c.id));
          if (!prereqExists && !prereq.includes('or')) {
            issues.push(`⚠️  Course ${course.id}: Prerequisite "${prereq}" not found in degree`);
          }
        });
      }
    });
    
    // Check for orphaned prerequisites (courses that can never be taken)
    const canBeTaken = new Set();
    let changed = true;
    let iterations = 0;
    
    // Start with courses that have no prerequisites
    data.courses.forEach(course => {
      if (!course.prerequisites || course.prerequisites.length === 0) {
        canBeTaken.add(course.id);
      }
    });
    
    // Iteratively add courses whose prerequisites are met
    while (changed && iterations < 100) {
      changed = false;
      iterations++;
      
      data.courses.forEach(course => {
        if (canBeTaken.has(course.id)) return;
        
        if (course.prerequisites && course.prerequisites.length > 0) {
          const allPrereqsMet = course.prerequisites.every(prereq => {
            if (prereq.includes(' or ')) {
              return prereq.split(' or ').some(p => canBeTaken.has(p.trim()));
            }
            return canBeTaken.has(prereq);
          });
          
          if (allPrereqsMet) {
            canBeTaken.add(course.id);
            changed = true;
          }
        }
      });
    }
    
    // Check for unreachable courses
    const unreachable = data.courses.filter(c => !canBeTaken.has(c.id));
    if (unreachable.length > 0) {
      issues.push(`❌ ${unreachable.length} unreachable courses (prerequisite chain broken):`);
      unreachable.forEach(c => {
        issues.push(`   - ${c.id}: ${c.name} (prereqs: ${c.prerequisites?.join(', ') || 'none'})`);
      });
    }
    
  } catch (error) {
    issues.push(`❌ JSON Parse Error: ${error.message}`);
  }
  
  return issues;
}

// Validate all files
const files = fs.readdirSync(degreesPath).filter(f => f.endsWith('.json') && f !== 'uh_core.json');

console.log(`\n📚 Found ${files.length} degree programs to validate\n`);

files.forEach(filename => {
  const issues = validateDegreeFile(filename);
  
  if (issues.length > 0) {
    console.log(`\n📄 ${filename}`);
    console.log('-'.repeat(70));
    issues.forEach(issue => console.log(`  ${issue}`));
    issuesByFile[filename] = issues;
    totalIssues += issues.length;
  }
});

// Summary
console.log('\n' + '='.repeat(70));
console.log('\n📊 VALIDATION SUMMARY\n');
console.log(`Total files checked: ${files.length}`);
console.log(`Files with issues: ${Object.keys(issuesByFile).length}`);
console.log(`Total issues found: ${totalIssues}`);

if (totalIssues === 0) {
  console.log('\n✅ All degree data is valid!\n');
} else {
  console.log('\n⚠️  Issues found - review above for details\n');
  console.log('💡 To fix these issues:');
  console.log('   1. Check official UH degree plans');
  console.log('   2. Update the JSON files');
  console.log('   3. Run this script again to verify\n');
}

// Provide links to official sources
console.log('📚 Official UH Degree Plan Sources:');
console.log('   Computer Science: https://www.uh.edu/nsm/computer-science/undergraduate/curriculum/');
console.log('   Engineering: https://www.egr.uh.edu/undergraduate');
console.log('   Business: https://www.bauer.uh.edu/undergraduate/');
console.log('   Liberal Arts: https://www.uh.edu/class/');
console.log('   All Catalogs: https://publications.uh.edu/index.php\n');
