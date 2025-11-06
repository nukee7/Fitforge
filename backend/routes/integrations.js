const express = require('express');
const {
  connectAppleHealth,
  syncAppleHealthData,
  connectGoogleFit,
  syncGoogleFitData,
  getIntegrationStatus,
  disconnectIntegration
} = require('../controllers/integrationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Integration status
router.get('/status', getIntegrationStatus);

// Apple Health integration
router.post('/apple-health/connect', connectAppleHealth);
router.post('/apple-health/sync', syncAppleHealthData);

// Google Fit integration
router.post('/google-fit/connect', connectGoogleFit);
router.post('/google-fit/sync', syncGoogleFitData);

// Disconnect integration
router.delete('/:provider', disconnectIntegration);

module.exports = router;

