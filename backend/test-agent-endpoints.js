#!/usr/bin/env node

/**
 * Test Different Agent Endpoint Patterns
 * This script tests various endpoint patterns to find the correct one
 */

const axios = require('axios');

const BASE_URL = 'https://dpwzdzydkud22zbtppvlqntp.agents.do-ai.run';
const ACCESS_KEY = 'pAThqdooiHo2Zl2nUPZ9_eePh_lf9DVc';

const ENDPOINT_PATTERNS = [
  '/api/v1/generate',
  '/api/v1/chat',
  '/api/v1/completions',
  '/api/generate',
  '/api/chat',
  '/api/completions',
  '/generate',
  '/chat',
  '/completions',
  '/v1/generate',
  '/v1/chat',
  '/v1/completions',
  '/agent/generate',
  '/agent/chat',
  '/agent/completions'
];

async function testEndpoint(endpoint) {
  try {
    console.log(`\n🧪 Testing: ${endpoint}`);
    
    const response = await axios.post(
      BASE_URL + endpoint,
      {
        prompt: 'Generate a degree plan for Computer Science',
        max_tokens: 100,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    
    console.log(`   ✅ SUCCESS! Status: ${response.status}`);
    console.log(`   Response type: ${typeof response.data}`);
    console.log(`   Response keys: ${Object.keys(response.data || {}).join(', ')}`);
    
    // Check if it looks like an AI response
    const responseText = JSON.stringify(response.data);
    if (responseText.includes('degree') || responseText.includes('course') || responseText.includes('semester')) {
      console.log(`   🎉 This looks like a working AI agent endpoint!`);
      console.log(`   Sample response: ${responseText.substring(0, 200)}...`);
      return endpoint;
    }
    
    return null;
  } catch (error) {
    if (error.response) {
      console.log(`   ❌ Failed: ${error.response.status} - ${error.response.statusText}`);
    } else {
      console.log(`   ❌ Failed: ${error.message}`);
    }
    return null;
  }
}

async function findWorkingEndpoint() {
  console.log('🔍 Testing different agent endpoint patterns...\n');
  console.log(`Base URL: ${BASE_URL}\n`);
  
  const workingEndpoints = [];
  
  for (const endpoint of ENDPOINT_PATTERNS) {
    const result = await testEndpoint(endpoint);
    if (result) {
      workingEndpoints.push(result);
    }
  }
  
  if (workingEndpoints.length > 0) {
    console.log('\n🎉 Found working endpoints:');
    workingEndpoints.forEach((endpoint, index) => {
      console.log(`\n${index + 1}. ${BASE_URL}${endpoint}`);
    });
    
    console.log('\n📝 To use the first working endpoint:');
    console.log(`   AI_ENDPOINT_URL=${BASE_URL}${workingEndpoints[0]}`);
    
    // Update the .env file
    const fs = require('fs');
    const envContent = `# DigitalOcean AI Agents Configuration
AI_ENDPOINT_URL=${BASE_URL}${workingEndpoints[0]}
AI_ACCESS_KEY=${ACCESS_KEY}

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
`;
    
    fs.writeFileSync('.env', envContent);
    console.log('\n✅ Updated .env file with working endpoint!');
    
  } else {
    console.log('\n❌ No working endpoints found.');
    console.log('\n💡 Please check your DigitalOcean dashboard for the correct endpoint URL.');
    console.log('Look for something like:');
    console.log('- Agent API endpoint');
    console.log('- Generate endpoint');
    console.log('- Chat endpoint');
    console.log('- Completions endpoint');
  }
}

// Run the test
findWorkingEndpoint().catch(console.error);
