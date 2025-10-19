# CougarDegree Backend

AI-powered degree planning backend service integrated with DigitalOcean AI models.

## Features

- 🤖 **AI-Powered Degree Planning**: Uses DigitalOcean AI model to generate personalized degree plans
- 🎯 **Smart Course Sequencing**: Automatically handles prerequisites and course scheduling
- 📊 **Comprehensive Planning**: Includes core courses, electives, and general education requirements
- 🔄 **Fallback System**: Graceful fallback to local data if AI model is unavailable
- 🛡️ **Security**: Rate limiting, CORS protection, and input validation
- 📈 **Monitoring**: Health checks and error handling

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
# DigitalOcean AI Model Configuration
AI_ENDPOINT_URL=https://api.digitalocean.com/v2/ai/models/your-model-id
AI_ACCESS_KEY=your_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. Update AI Endpoint

Replace `your-model-id` in the `AI_ENDPOINT_URL` with your actual DigitalOcean AI model endpoint.

### 4. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
```
GET /health
```
Returns server status and timestamp.

### Get Available Majors
```
GET /api/majors
```
Returns list of available majors for degree planning.

### Generate Degree Plan
```
POST /api/degree-plan
```

**Request Body:**
```json
{
  "major": "Computer Science",
  "credits": 120,
  "preferences": {
    "focus": "software development",
    "difficulty": "balanced",
    "schedule": "full-time"
  },
  "currentCourses": ["MATH-101", "ENG-101"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "degreePlan": {
      "major": "Computer Science",
      "totalCredits": 120,
      "semesters": [...],
      "coreCourses": [...],
      "electiveCourses": [...],
      "generalEducation": [...]
    },
    "recommendations": [...],
    "timeline": "4 years (8 semesters)",
    "metadata": {...}
  }
}
```

## Testing

Run the test script to verify the API:

```bash
node test-api.js
```

This will test all endpoints and verify the AI integration.

## AI Model Integration

The backend integrates with DigitalOcean AI models using:

- **Access Key**: Configured via `AI_ACCESS_KEY` environment variable
- **Endpoint**: Configurable via `AI_ENDPOINT_URL` environment variable
- **Fallback**: Local degree planning if AI model is unavailable

### AI Model Configuration

1. Update the `AI_ENDPOINT_URL` in your `.env` file
2. Ensure the access key has proper permissions
3. The service will automatically handle authentication and error cases

## Error Handling

The service includes comprehensive error handling:

- **401**: Invalid access key
- **429**: Rate limit exceeded
- **Timeout**: Connection timeout (30s)
- **Parse Errors**: Invalid AI response format
- **Fallback**: Local degree plan generation

## Development

### Project Structure
```
backend/
├── services/
│   └── degreePlanningService.js  # AI integration service
├── server.js                     # Main server file
├── package.json                  # Dependencies
├── test-api.js                   # API test script
└── README.md                     # This file
```

### Adding New Features

1. **New API Endpoints**: Add routes in `server.js`
2. **AI Model Updates**: Modify `degreePlanningService.js`
3. **Validation**: Add Joi schemas for request validation
4. **Testing**: Update `test-api.js` with new test cases

## Troubleshooting

### Common Issues

1. **AI Model Not Responding**
   - Check endpoint URL and access key
   - Verify network connectivity
   - Check DigitalOcean service status

2. **CORS Errors**
   - Update `FRONTEND_URL` in `.env`
   - Check frontend URL configuration

3. **Rate Limiting**
   - Adjust rate limit settings in `server.js`
   - Check AI model rate limits

### Logs

Check console output for detailed error messages and API responses.

## Security Notes

- Access keys are stored in environment variables
- Rate limiting prevents abuse
- Input validation prevents malicious requests
- CORS is properly configured
- Helmet provides additional security headers
