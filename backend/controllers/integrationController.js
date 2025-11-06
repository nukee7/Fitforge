const User = require('../models/User');
const Workout = require('../models/Workout');
const axios = require('axios');

// @desc    Connect Apple Health integration
// @route   POST /api/v1/integrations/apple-health/connect
// @access  Private
const connectAppleHealth = async (req, res) => {
  try {
    const { healthKitData } = req.body;
    const userId = req.user.id;

    // In a real implementation, you would:
    // 1. Validate the HealthKit data
    // 2. Store the user's HealthKit permissions
    // 3. Set up webhook endpoints for data sync

    // For now, we'll simulate the connection
    const integrationData = {
      provider: 'apple-health',
      connected: true,
      permissions: healthKitData.permissions || [],
      lastSync: new Date(),
      webhookUrl: `${process.env.API_BASE_URL}/api/v1/integrations/apple-health/webhook`
    };

    // Update user with integration data
    await User.findByIdAndUpdate(userId, {
      $set: { 'integrations.appleHealth': integrationData }
    });

    res.status(200).json({
      status: 'success',
      message: 'Apple Health connected successfully',
      data: {
        integration: integrationData
      }
    });
  } catch (error) {
    console.error('Apple Health connection error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to connect Apple Health'
    });
  }
};

// @desc    Sync Apple Health data
// @route   POST /api/v1/integrations/apple-health/sync
// @access  Private
const syncAppleHealthData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.body;

    // In a real implementation, you would:
    // 1. Make API calls to Apple Health
    // 2. Process the health data
    // 3. Convert to your workout format
    // 4. Store in your database

    // Simulate Apple Health data processing
    const appleHealthData = await processAppleHealthData(userId, startDate, endDate);

    // Convert Apple Health data to workout format
    const workouts = await convertAppleHealthToWorkouts(appleHealthData, userId);

    // Store workouts in database
    const savedWorkouts = await Workout.insertMany(workouts);

    res.status(200).json({
      status: 'success',
      message: 'Apple Health data synced successfully',
      data: {
        syncedWorkouts: savedWorkouts.length,
        workouts: savedWorkouts
      }
    });
  } catch (error) {
    console.error('Apple Health sync error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to sync Apple Health data'
    });
  }
};

// @desc    Connect Google Fit integration
// @route   POST /api/v1/integrations/google-fit/connect
// @access  Private
const connectGoogleFit = async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.body;
    const userId = req.user.id;

    // Store Google Fit tokens
    const integrationData = {
      provider: 'google-fit',
      connected: true,
      accessToken,
      refreshToken,
      lastSync: new Date()
    };

    await User.findByIdAndUpdate(userId, {
      $set: { 'integrations.googleFit': integrationData }
    });

    res.status(200).json({
      status: 'success',
      message: 'Google Fit connected successfully',
      data: {
        integration: integrationData
      }
    });
  } catch (error) {
    console.error('Google Fit connection error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to connect Google Fit'
    });
  }
};

// @desc    Sync Google Fit data
// @route   POST /api/v1/integrations/google-fit/sync
// @access  Private
const syncGoogleFitData = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user.integrations?.googleFit?.accessToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Google Fit not connected'
      });
    }

    const { startDate, endDate } = req.body;
    
    // Fetch data from Google Fit API
    const googleFitData = await fetchGoogleFitData(
      user.integrations.googleFit.accessToken,
      startDate,
      endDate
    );

    // Convert Google Fit data to workouts
    const workouts = await convertGoogleFitToWorkouts(googleFitData, userId);
    
    // Store workouts
    const savedWorkouts = await Workout.insertMany(workouts);

    res.status(200).json({
      status: 'success',
      message: 'Google Fit data synced successfully',
      data: {
        syncedWorkouts: savedWorkouts.length,
        workouts: savedWorkouts
      }
    });
  } catch (error) {
    console.error('Google Fit sync error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to sync Google Fit data'
    });
  }
};

// @desc    Get integration status
// @route   GET /api/v1/integrations/status
// @access  Private
const getIntegrationStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('integrations');

    const integrations = {
      appleHealth: {
        connected: !!user.integrations?.appleHealth?.connected,
        lastSync: user.integrations?.appleHealth?.lastSync,
        permissions: user.integrations?.appleHealth?.permissions || []
      },
      googleFit: {
        connected: !!user.integrations?.googleFit?.connected,
        lastSync: user.integrations?.googleFit?.lastSync
      },
      fitbit: {
        connected: !!user.integrations?.fitbit?.connected,
        lastSync: user.integrations?.fitbit?.lastSync
      }
    };

    res.status(200).json({
      status: 'success',
      data: {
        integrations
      }
    });
  } catch (error) {
    console.error('Get integration status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get integration status'
    });
  }
};

// @desc    Disconnect integration
// @route   DELETE /api/v1/integrations/:provider
// @access  Private
const disconnectIntegration = async (req, res) => {
  try {
    const { provider } = req.params;
    const userId = req.user.id;

    const validProviders = ['apple-health', 'google-fit', 'fitbit'];
    if (!validProviders.includes(provider)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid integration provider'
      });
    }

    // Remove integration data
    const updateField = `integrations.${provider.replace('-', '')}`;
    await User.findByIdAndUpdate(userId, {
      $unset: { [updateField]: 1 }
    });

    res.status(200).json({
      status: 'success',
      message: `${provider} disconnected successfully`
    });
  } catch (error) {
    console.error('Disconnect integration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to disconnect integration'
    });
  }
};

// Helper function to process Apple Health data
const processAppleHealthData = async (userId, startDate, endDate) => {
  // This would typically involve:
  // 1. Making API calls to Apple Health
  // 2. Processing health data
  // 3. Converting to standardized format
  
  // For demo purposes, return mock data
  return {
    workouts: [
      {
        type: 'running',
        duration: 30,
        distance: 5.2,
        calories: 350,
        startTime: new Date(),
        endTime: new Date(Date.now() + 30 * 60000)
      }
    ],
    activities: [
      {
        type: 'steps',
        count: 8500,
        date: new Date()
      }
    ]
  };
};

// Helper function to convert Apple Health data to workouts
const convertAppleHealthToWorkouts = async (healthData, userId) => {
  const workouts = [];

  for (const workout of healthData.workouts) {
    const workoutData = {
      user: userId,
      exerciseName: mapAppleHealthTypeToExercise(workout.type),
      category: mapAppleHealthTypeToCategory(workout.type),
      sets: 1,
      reps: Math.floor(workout.duration / 60), // Convert minutes to reps
      weight: 0,
      calories: workout.calories,
      duration: workout.duration,
      date: workout.startTime,
      notes: `Synced from Apple Health - ${workout.type}`
    };

    workouts.push(workoutData);
  }

  return workouts;
};

// Helper function to fetch Google Fit data
const fetchGoogleFitData = async (accessToken, startDate, endDate) => {
  try {
    // Google Fit API endpoints
    const baseUrl = 'https://www.googleapis.com/fitness/v1';
    
    // Get sessions (workouts)
    const sessionsResponse = await axios.get(`${baseUrl}/users/me/sessions`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        startTime: new Date(startDate).toISOString(),
        endTime: new Date(endDate).toISOString()
      }
    });

    // Get aggregated data (steps, calories, etc.)
    const aggregateResponse = await axios.post(`${baseUrl}/users/me/dataset:aggregate`, {
      aggregateBy: [
        { dataTypeName: 'com.google.step_count.delta' },
        { dataTypeName: 'com.google.calories.expended' }
      ],
      bucketByTime: { durationMillis: 86400000 }, // Daily buckets
      startTimeMillis: new Date(startDate).getTime(),
      endTimeMillis: new Date(endDate).getTime()
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return {
      sessions: sessionsResponse.data.session,
      aggregates: aggregateResponse.data.bucket
    };
  } catch (error) {
    console.error('Google Fit API error:', error);
    throw error;
  }
};

// Helper function to convert Google Fit data to workouts
const convertGoogleFitToWorkouts = async (fitData, userId) => {
  const workouts = [];

  for (const session of fitData.sessions) {
    const workoutData = {
      user: userId,
      exerciseName: session.activityType || 'Unknown Activity',
      category: mapGoogleFitActivityToCategory(session.activityType),
      sets: 1,
      reps: Math.floor(session.endTimeMillis - session.startTimeMillis) / 60000, // Duration in minutes
      weight: 0,
      calories: session.calories || 0,
      duration: (session.endTimeMillis - session.startTimeMillis) / 60000,
      date: new Date(session.startTimeMillis),
      notes: `Synced from Google Fit - ${session.activityType}`
    };

    workouts.push(workoutData);
  }

  return workouts;
};

// Mapping functions
const mapAppleHealthTypeToExercise = (type) => {
  const mapping = {
    'running': 'Running',
    'walking': 'Walking',
    'cycling': 'Cycling',
    'swimming': 'Swimming',
    'strength_training': 'Strength Training',
    'yoga': 'Yoga',
    'dancing': 'Dancing'
  };
  return mapping[type] || 'Unknown Exercise';
};

const mapAppleHealthTypeToCategory = (type) => {
  const mapping = {
    'running': 'Cardio',
    'walking': 'Cardio',
    'cycling': 'Cardio',
    'swimming': 'Cardio',
    'strength_training': 'Strength',
    'yoga': 'Flexibility',
    'dancing': 'Cardio'
  };
  return mapping[type] || 'Cardio';
};

const mapGoogleFitActivityToCategory = (activityType) => {
  const mapping = {
    'running': 'Cardio',
    'walking': 'Cardio',
    'cycling': 'Cardio',
    'swimming': 'Cardio',
    'strength_training': 'Strength',
    'yoga': 'Flexibility'
  };
  return mapping[activityType] || 'Cardio';
};

module.exports = {
  connectAppleHealth,
  syncAppleHealthData,
  connectGoogleFit,
  syncGoogleFitData,
  getIntegrationStatus,
  disconnectIntegration
};

