#!/usr/bin/env node

/**
 * Find DigitalOcean AI Agent Endpoint
 * This script helps you find the correct endpoint URL for your AI agent
 */

require('dotenv').config();
const axios = require('axios');

const ACCESS_KEY = process.env.AI_ACCESS_KEY;

async function findAgentEndpoint() {
  console.log('🔍 Finding your DigitalOcean AI Agent endpoint...\n');
  
  try {
    // First, let's try to list your agents
    console.log('1. Trying to list your AI agents...');
    try {
      const agentsResponse = await axios.get('https://api.digitalocean.com/v2/ai/agents', {
        headers: {
          'Authorization': `Bearer ${ACCESS_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Found agents:', agentsResponse.data.agents?.length || 0);
      if (agentsResponse.data.agents && agentsResponse.data.agents.length > 0) {
        console.log('\n📋 Your AI Agents:');
        agentsResponse.data.agents.forEach((agent, index) => {
          console.log(`   ${index + 1}. ${agent.name} (ID: ${agent.id})`);
          console.log(`      Status: ${agent.status}`);
          console.log(`      Endpoint: https://api.digitalocean.com/v2/ai/agents/${agent.id}/generate`);
        });
        
        // Test the first agent
        const firstAgent = agentsResponse.data.agents[0];
        const endpoint = `https://api.digitalocean.com/v2/ai/agents/${firstAgent.id}/generate`;
        
        console.log(`\n🧪 Testing endpoint: ${endpoint}`);
        await testAgentEndpoint(endpoint);
        
        return endpoint;
      }
    } catch (error) {
      console.log('❌ Could not list agents:', error.response?.status, error.message);
    }
    
    // If listing fails, try common endpoint patterns
    console.log('\n2. Trying common endpoint patterns...');
    
    const commonPatterns = [
      'https://api.digitalocean.com/v2/ai/agents/cougardegreedigitaloceankey/generate',
      'https://api.digitalocean.com/v2/ai/agents/cougardegree/generate',
      'https://api.digitalocean.com/v2/ai/agents/cougar-degree/generate',
      'https://api.digitalocean.com/v2/ai/agents/degree-planning/generate',
      'https://api.digitalocean.com/v2/ai/agents/degree-planner/generate'
    ];
    
    for (const endpoint of commonPatterns) {
      console.log(`\n🧪 Testing: ${endpoint}`);
      const result = await testAgentEndpoint(endpoint);
      if (result) {
        console.log(`\n🎉 Found working endpoint: ${endpoint}`);
        return endpoint;
      }
    }
    
    console.log('\n❌ Could not find a working endpoint automatically.');
    console.log('\n💡 Manual steps:');
    console.log('1. Go to your DigitalOcean dashboard');
    console.log('2. Navigate to AI Agents section');
    console.log('3. Find your "cougardegreedigitaloceankey" agent');
    console.log('4. Copy the endpoint URL (should look like: https://api.digitalocean.com/v2/ai/agents/AGENT_ID/generate)');
    console.log('5. Update the .env file with: AI_ENDPOINT_URL=YOUR_ACTUAL_ENDPOINT');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function testAgentEndpoint(endpoint) {
  try {
    const response = await axios.post(endpoint, {
      message: 'Test message for degree planning',
      max_tokens: 100,
      temperature: 0.7,
      stream: false
    }, {
      headers: {
        'Authorization': `Bearer ${ACCESS_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log(`   ✅ SUCCESS! Status: ${response.status}`);
    console.log(`   Response keys: ${Object.keys(response.data).join(', ')}`);
    
    if (response.data.response || response.data.message || response.data.text) {
      console.log(`   🎉 This looks like a working AI agent endpoint!`);
      return true;
    }
    
    return false;
  } catch (error) {
    if (error.response) {
      console.log(`   ❌ Failed: ${error.response.status} - ${error.response.statusText}`);
      if (error.response.data) {
        console.log(`   Error details: ${JSON.stringify(error.response.data)}`);
      }
    } else {
      console.log(`   ❌ Failed: ${error.message}`);
    }
    return false;
  }
}

// Run the search
findAgentEndpoint().catch(console.error);
