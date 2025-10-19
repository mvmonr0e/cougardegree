#!/usr/bin/env node

/**
 * Setup AI Agent Configuration
 * This script helps you configure the correct AI agent endpoint
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

require('dotenv').config();

console.log('🤖 CougarDegree AI Agent Setup\n');
console.log('Using access key from environment variables');
console.log('Now we need to find your agent endpoint URL.\n');

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupAgent() {
  try {
    console.log('📋 Steps to find your agent endpoint:');
    console.log('1. Go to https://cloud.digitalocean.com');
    console.log('2. Navigate to AI section (or look for "Agents")');
    console.log('3. Find your agent "cougardegreedigitaloceankey"');
    console.log('4. Copy the endpoint URL (looks like: https://api.digitalocean.com/v2/ai/agents/ABC123-DEF456-GHI789/generate)\n');
    
    const endpointUrl = await question('Enter your AI agent endpoint URL: ');
    
    if (!endpointUrl || endpointUrl.includes('YOUR_AGENT_ID')) {
      console.log('❌ Please provide a valid endpoint URL');
      process.exit(1);
    }
    
    console.log('\n🔍 Testing the endpoint...');
    
    // Test the endpoint
    const axios = require('axios');
    try {
      const testResponse = await axios.post(
        endpointUrl,
        {
          message: 'Test message for degree planning',
          max_tokens: 100,
          temperature: 0.7,
          stream: false
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.AI_ACCESS_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );
      
      console.log('✅ Endpoint is working!');
      console.log('Response status:', testResponse.status);
      console.log('Response keys:', Object.keys(testResponse.data).join(', '));
      
    } catch (error) {
      console.log('⚠️  Endpoint test failed, but we\'ll continue with configuration');
      console.log('Error:', error.response?.status, error.message);
    }
    
    // Create .env file
    const envContent = `# DigitalOcean AI Agents Configuration
AI_ENDPOINT_URL=${endpointUrl}
AI_ACCESS_KEY=${process.env.AI_ACCESS_KEY}

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
`;
    
    const envPath = path.join(__dirname, '.env');
    fs.writeFileSync(envPath, envContent);
    
    console.log('\n✅ Configuration saved to .env file');
    console.log('\n📝 Next steps:');
    console.log('1. Restart the backend server: npm start');
    console.log('2. Test the API: node test-api.js');
    console.log('3. Open the frontend and test degree planning');
    console.log('\n🎉 Your AI agent should now generate real courses from your training data!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

// Run setup
setupAgent();
