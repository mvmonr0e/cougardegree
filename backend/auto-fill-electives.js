#!/usr/bin/env node

/**
 * Auto-fill missing credits with generic electives
 */

const fs = require('fs');
const path = require('path');

const degreesPath = path.join(__dirname, 'degrees');

console.log('🔧 Auto-filling missing credits with electives...\n');

const files = fs.readdirSync(degreesPath).filter(f => f.endsWith('.json') && f !== 'uh_core.json');

let filesUpdated = 0;

files.forEach(filename => {
  const filePath = path.join(degreesPath, filename);
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Calculate current credits
    const currentCredits = data.courses.reduce((sum, c) => sum + (c.credits || 0), 0);
    const targetCredits = data.total_credit_hours || 120;
    const missingCredits = targetCredits - currentCredits;
    
    if (missingCredits > 0) {
      console.log(`📄 ${filename}: Adding ${missingCredits} credits`);
      
      // Add general electives to fill the gap
      let creditsToAdd = missingCredits;
      let electiveNum = 1;
      
      while (creditsToAdd > 0) {
        const credits = Math.min(3, creditsToAdd); // 3-credit electives
        
        data.courses.push({
          "id": `ELECTIVE ${electiveNum}`,
          "name": `Elective - Choose from approved list`,
          "credits": credits,
          "prerequisites": [],
          "requirement_type": "Free Elective",
          "level": 3000
        });
        
        creditsToAdd -= credits;
        electiveNum++;
      }
      
      // Write back to file
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      filesUpdated++;
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
  }
});

console.log(`\n✅ Updated ${filesUpdated} files with electives\n`);
