const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const degreePlanningService = require('./services/degreePlanningService');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'CougarDegree Backend'
  });
});

// Degree planning endpoints
app.post('/api/degree-plan', async (req, res) => {
  try {
    const { major, credits, preferences, currentCourses } = req.body;
    
    // Validate required fields
    if (!major) {
      return res.status(400).json({ 
        error: 'Major is required' 
      });
    }

    const degreePlan = await degreePlanningService.generateDegreePlan({
      major,
      credits: credits || 120,
      preferences: preferences || {},
      currentCourses: currentCourses || []
    });

    res.json({
      success: true,
      data: degreePlan,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating degree plan:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate degree plan',
      message: error.message
    });
  }
});

// Get available majors
app.get('/api/majors', (req, res) => {
  const majors = degreePlanningService.getAvailableMajors();
  
  res.json({
    success: true,
    data: majors
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 CougarDegree Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🎓 Degree planning: http://localhost:${PORT}/api/degree-plan`);
});

module.exports = app;
