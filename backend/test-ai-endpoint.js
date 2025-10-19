#!/usr/bin/env node

/**
 * Test Different AI Endpoint Formats
 * This script tests various API formats to find the correct one for your AI model
 */

require('dotenv').config();
const axios = require('axios');

const ACCESS_KEY = process.env.AI_ACCESS_KEY;

// Common DigitalOcean AI endpoint patterns
const ENDPOINT_PATTERNS = [
  'https://api.digitalocean.com/v2/ai/models/{model-id}/predict',
  'https://api.digitalocean.com/v2/ai/models/{model-id}/generate',
  'https://api.digitalocean.com/v2/ai/models/{model-id}/completions',
  'https://api.digitalocean.com/v2/ai/models/{model-id}/chat/completions',
  'https://api.digitalocean.com/v2/ai/models/{model-id}',
  'https://api.digitalocean.com/v2/ai/models/{model-id}/inference',
  'https://api.digitalocean.com/v2/ai/models/{model-id}/query'
];

// Different request body formats
const REQUEST_FORMATS = [
  {
    name: 'OpenAI Style',
    body: {
      prompt: 'Generate a degree plan for Computer Science',
      max_tokens: 1000,
      temperature: 0.7
    }
  },
  {
    name: 'Anthropic Style',
    body: {
      prompt: 'Generate a degree plan for Computer Science',
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 0.9
    }
  },
  {
    name: 'Simple Prompt',
    body: {
      prompt: 'Generate a degree plan for Computer Science'
    }
  },
  {
    name: 'Messages Format',
    body: {
      messages: [
        { role: 'user', content: 'Generate a degree plan for Computer Science' }
      ],
      max_tokens: 1000
    }
  },
  {
    name: 'Input Format',
    body: {
      input: 'Generate a degree plan for Computer Science',
      max_tokens: 1000
    }
  }
];

// Different header formats
const HEADER_FORMATS = [
  {
    name: 'Bearer Token',
    headers: {
      'Authorization': `Bearer ${ACCESS_KEY}`,
      'Content-Type': 'application/json'
    }
  },
  {
    name: 'API Key',
    headers: {
      'X-API-Key': ACCESS_KEY,
      'Content-Type': 'application/json'
    }
  },
  {
    name: 'Authorization Header',
    headers: {
      'Authorization': ACCESS_KEY,
      'Content-Type': 'application/json'
    }
  }
];

async function testEndpoint(endpoint, requestFormat, headerFormat) {
  try {
    console.log(`\n🧪 Testing: ${endpoint}`);
    console.log(`   Request: ${requestFormat.name}`);
    console.log(`   Headers: ${headerFormat.name}`);
    
    const response = await axios.post(endpoint, requestFormat.body, {
      headers: headerFormat.headers,
      timeout: 10000
    });
    
    console.log(`   ✅ SUCCESS! Status: ${response.status}`);
    console.log(`   Response keys: ${Object.keys(response.data).join(', ')}`);
    
    if (response.data.choices || response.data.text || response.data.response) {
      console.log(`   🎉 This looks like a working AI endpoint!`);
      return {
        endpoint,
        requestFormat: requestFormat.name,
        headerFormat: headerFormat.name,
        response: response.data
      };
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
  console.log('🔍 Testing different AI endpoint formats...\n');
  console.log('Note: Replace {model-id} with your actual model ID\n');
  
  const workingEndpoints = [];
  
  for (const endpointPattern of ENDPOINT_PATTERNS) {
    for (const requestFormat of REQUEST_FORMATS) {
      for (const headerFormat of HEADER_FORMATS) {
        const result = await testEndpoint(endpointPattern, requestFormat, headerFormat);
        if (result) {
          workingEndpoints.push(result);
        }
      }
    }
  }
  
  if (workingEndpoints.length > 0) {
    console.log('\n🎉 Found working endpoints:');
    workingEndpoints.forEach((endpoint, index) => {
      console.log(`\n${index + 1}. ${endpoint.endpoint}`);
      console.log(`   Request Format: ${endpoint.requestFormat}`);
      console.log(`   Header Format: ${endpoint.headerFormat}`);
    });
    
    console.log('\n📝 To use the first working endpoint:');
    console.log(`   AI_ENDPOINT_URL=${workingEndpoints[0].endpoint}`);
    console.log(`   Request Format: ${workingEndpoints[0].requestFormat}`);
    console.log(`   Header Format: ${workingEndpoints[0].headerFormat}`);
  } else {
    console.log('\n❌ No working endpoints found.');
    console.log('\n💡 Please check:');
    console.log('1. Your model ID is correct');
    console.log('2. Your access key has the right permissions');
    console.log('3. The model is deployed and running');
    console.log('4. The endpoint URL format is correct');
  }
}

// Run the test
findWorkingEndpoint().catch(console.error);
