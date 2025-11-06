#!/usr/bin/env node

const mongoose = require('mongoose');
const { connectDB, checkDatabaseHealth, getDatabaseStats } = require('../config/database');
require('dotenv').config();

const setupDatabase = async () => {
  console.log('🚀 Setting up FitForge Database...\n');

  try {
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      console.log('📝 Please create a .env file with your MongoDB connection string:');
      console.log('   MONGODB_URI=mongodb://localhost:27017/fitforge');
      process.exit(1);
    }

    console.log('🔗 Connecting to MongoDB...');
    console.log(`📍 URI: ${process.env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);

    // Connect to database
    await connectDB();

    // Check database health
    console.log('\n🏥 Checking database health...');
    const health = await checkDatabaseHealth();
    
    if (health.status === 'healthy') {
      console.log('✅ Database is healthy');
      console.log(`📊 State: ${health.state}`);
      console.log(`🏠 Host: ${health.host}`);
      console.log(`🗄️ Database: ${health.database}`);
    } else {
      console.log('❌ Database is unhealthy');
      console.log(`📊 State: ${health.state}`);
      console.log(`🔴 Error: ${health.error}`);
      process.exit(1);
    }

    // Get database statistics
    console.log('\n📈 Getting database statistics...');
    const stats = await getDatabaseStats();
    
    if (stats) {
      console.log(`📚 Collections: ${stats.collections}`);
      console.log(`💾 Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`🗃️ Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`📇 Indexes: ${stats.indexes}`);
      console.log(`📄 Objects: ${stats.objects}`);
    }

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Run "npm run seed" to populate with sample data');
    console.log('   2. Run "npm run dev" to start the server');
    console.log('   3. Test the API at http://localhost:3000/api/health');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure MongoDB is running');
    console.log('   2. Check your connection string');
    console.log('   3. Verify network connectivity');
    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
