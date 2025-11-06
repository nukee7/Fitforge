const mongoose = require('mongoose');

// Database connection configuration
const connectDB = async () => {
  try {
    // Connection options for better performance and reliability
    const options = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      retryWrites: true, // Retry write operations
      retryReads: true, // Retry read operations
    };

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Connection State: ${getConnectionState(conn.connection.readyState)}`);
    
    // Set up connection event listeners
    setupConnectionListeners();
    
    return conn;
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

// Set up MongoDB connection event listeners
const setupConnectionListeners = () => {
  // Connection established
  mongoose.connection.on('connected', () => {
    console.log('🟢 Mongoose connected to MongoDB');
  });

  // Connection error
  mongoose.connection.on('error', (err) => {
    console.error('🔴 Mongoose connection error:', err);
  });

  // Connection disconnected
  mongoose.connection.on('disconnected', () => {
    console.log('🟡 Mongoose disconnected from MongoDB');
  });

  // Connection reconnected
  mongoose.connection.on('reconnected', () => {
    console.log('🟢 Mongoose reconnected to MongoDB');
  });

  // Connection timeout
  mongoose.connection.on('timeout', () => {
    console.log('⏰ Mongoose connection timeout');
  });

  // Connection close
  mongoose.connection.on('close', () => {
    console.log('🔴 Mongoose connection closed');
  });
};

// Get connection state description
const getConnectionState = (state) => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  return states[state] || 'unknown';
};

// Graceful shutdown
const gracefulShutdown = async () => {
  try {
    await mongoose.connection.close();
    console.log('🔴 MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// Handle different termination signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // For nodemon restart

// Database health check
const checkDatabaseHealth = async () => {
  try {
    const state = mongoose.connection.readyState;
    const isConnected = state === 1;
    
    if (isConnected) {
      // Ping the database
      await mongoose.connection.db.admin().ping();
      return {
        status: 'healthy',
        state: getConnectionState(state),
        host: mongoose.connection.host,
        database: mongoose.connection.name
      };
    } else {
      return {
        status: 'unhealthy',
        state: getConnectionState(state),
        error: 'Database not connected'
      };
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      state: 'error',
      error: error.message
    };
  }
};

// Get database statistics
const getDatabaseStats = async () => {
  try {
    const stats = await mongoose.connection.db.stats();
    return {
      collections: stats.collections,
      dataSize: stats.dataSize,
      storageSize: stats.storageSize,
      indexes: stats.indexes,
      objects: stats.objects
    };
  } catch (error) {
    console.error('Error getting database stats:', error);
    return null;
  }
};

module.exports = {
  connectDB,
  checkDatabaseHealth,
  getDatabaseStats,
  gracefulShutdown
};