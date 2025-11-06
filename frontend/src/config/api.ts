// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    UPDATE_PASSWORD: '/auth/update-password',
  },
  
  // Users
  USERS: {
    PROFILE: '/users/profile',
    STATS: '/users/stats',
  },
  
  // Workouts
  WORKOUTS: {
    LIST: '/workouts',
    CREATE: '/workouts',
    STATS: '/workouts/stats',
    BY_ID: (id: string) => `/workouts/${id}`,
  },
  
  // Exercises
  EXERCISES: {
    LIST: '/exercises',
    BY_ID: (id: string) => `/exercises/${id}`,
    CATEGORIES: '/exercises/categories',
    POPULAR: '/exercises/popular',
  },
  
  // Daily
  DAILY: {
    TODAY: '/daily/today',
    STREAK: '/daily/streak',
    RANGE: '/daily/range',
    BY_DATE: (date: string) => `/daily/${date}`,
  },
  
  // Integrations
  INTEGRATIONS: {
    STATUS: '/integrations/status',
    APPLE_HEALTH: {
      CONNECT: '/integrations/apple-health/connect',
      SYNC: '/integrations/apple-health/sync',
    },
    GOOGLE_FIT: {
      CONNECT: '/integrations/google-fit/connect',
      SYNC: '/integrations/google-fit/sync',
    },
    DISCONNECT: (provider: string) => `/integrations/${provider}`,
  },
};

// Request configuration
export const REQUEST_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_CONFIG.TIMEOUT,
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized. Please log in again.',
  FORBIDDEN: 'Access denied. You do not have permission.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TIMEOUT: 'Request timed out. Please try again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Welcome back!',
  REGISTER: 'Account created successfully!',
  LOGOUT: 'Logged out successfully',
  WORKOUT_CREATED: 'Workout logged successfully!',
  WORKOUT_UPDATED: 'Workout updated successfully!',
  WORKOUT_DELETED: 'Workout deleted successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_UPDATED: 'Password updated successfully!',
  INTEGRATION_CONNECTED: 'Integration connected successfully!',
  INTEGRATION_SYNCED: 'Data synced successfully!',
};
