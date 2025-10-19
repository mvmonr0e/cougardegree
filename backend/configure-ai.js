#!/usr/bin/env node

/**
 * AI Model Configuration Helper
 * This script helps you configure the correct DigitalOcean AI model endpoint
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

require('dotenv').config();

console.log('🤖 CougarDegree AI Model Configuration\n');
console.log('This will help you configure the correct DigitalOcean AI model endpoint.\n');

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function configureAI() {
  try {
    console.log('Current configuration:');
    console.log('Access Key: (using environment variable)');
    console.log('Endpoint URL: https://api.digitalocean.com/v2/ai/models/your-model-id (PLACEHOLDER)\n');
    
    console.log('Please provide the following information:');
    
    const endpointUrl = await question('Enter your DigitalOcean AI model endpoint URL: ');
    
    if (!endpointUrl || endpointUrl.includes('your-model-id')) {
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
          prompt: 'Test prompt',
          max_tokens: 100
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
      
    } catch (error) {
      console.log('⚠️  Endpoint test failed, but we\'ll continue with configuration');
      console.log('Error:', error.response?.status, error.message);
    }
    
    // Create .env file
    const envContent = `# DigitalOcean AI Model Configuration
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
    
  } catch (error) {
    console.error('❌ Configuration failed:', error.message);
  } finally {
    rl.close();
  }
}

// Run configuration
configureAI();
