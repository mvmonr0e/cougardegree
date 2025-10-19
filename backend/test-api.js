const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

async function testAPI() {
    console.log('🧪 Testing CougarDegree Backend API...\n');

    try {
        // Test health endpoint
        console.log('1. Testing health endpoint...');
        const healthResponse = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
        console.log('✅ Health check passed:', healthResponse.data);
        console.log('');

        // Test majors endpoint
        console.log('2. Testing majors endpoint...');
        const majorsResponse = await axios.get(`${API_BASE_URL}/majors`);
        console.log('✅ Majors loaded:', majorsResponse.data.data.length, 'majors available');
        console.log('');

        // Test degree plan generation
        console.log('3. Testing degree plan generation...');
        const degreePlanResponse = await axios.post(`${API_BASE_URL}/degree-plan`, {
            major: 'Computer Science',
            credits: 120,
            preferences: {
                focus: 'software development',
                difficulty: 'balanced',
                schedule: 'full-time'
            },
            currentCourses: ['MATH-101', 'ENG-101']
        });

        console.log('✅ Degree plan generated successfully!');
        console.log('📊 Plan details:');
        console.log(`   - Major: ${degreePlanResponse.data.data.degreePlan.major}`);
        console.log(`   - Total Credits: ${degreePlanResponse.data.data.degreePlan.totalCredits}`);
        console.log(`   - Semesters: ${degreePlanResponse.data.data.degreePlan.semesters.length}`);
        console.log(`   - Recommendations: ${degreePlanResponse.data.data.recommendations.length}`);
        console.log('');

        console.log('🎉 All tests passed! Backend is working correctly.');
        console.log('\n📝 Note: If you see fallback data, the AI model endpoint may need configuration.');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
        process.exit(1);
    }
}

// Run the test
testAPI();
