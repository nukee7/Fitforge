#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const setupEnvironment = async () => {
  console.log('🔧 Setting up FitForge Environment Variables...\n');

  try {
    const envPath = path.join(__dirname, '..', '.env');
    const examplePath = path.join(__dirname, '..', 'env.example');

    // Check if .env already exists
    if (fs.existsSync(envPath)) {
      const overwrite = await question('⚠️  .env file already exists. Overwrite? (y/N): ');
      if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
        console.log('❌ Setup cancelled.');
        process.exit(0);
      }
    }

    // Read the example file
    if (!fs.existsSync(examplePath)) {
      console.error('❌ env.example file not found!');
      process.exit(1);
    }

    const exampleContent = fs.readFileSync(examplePath, 'utf8');
    let envContent = exampleContent;

    // Interactive setup
    console.log('📝 Let\'s configure your environment variables:\n');

    // Database configuration
    console.log('🗄️  Database Configuration:');
    const mongoUri = await question(`MongoDB URI (default: mongodb://localhost:27017/fitforge): `);
    if (mongoUri.trim()) {
      envContent = envContent.replace('mongodb://localhost:27017/fitforge', mongoUri.trim());
    }

    // Server configuration
    console.log('\n🖥️  Server Configuration:');
    const port = await question(`Server Port (default: 3000): `);
    if (port.trim()) {
      envContent = envContent.replace('PORT=3000', `PORT=${port.trim()}`);
    }

    const frontendUrl = await question(`Frontend URL (default: http://localhost:8080): `);
    if (frontendUrl.trim()) {
      envContent = envContent.replace('http://localhost:8080', frontendUrl.trim());
    }

    // JWT configuration
    console.log('\n🔐 JWT Configuration:');
    const jwtSecret = await question(`JWT Secret (default: auto-generated): `);
    if (jwtSecret.trim()) {
      envContent = envContent.replace('your-super-secret-jwt-key-here', jwtSecret.trim());
    } else {
      // Generate a random JWT secret
      const crypto = require('crypto');
      const randomSecret = crypto.randomBytes(64).toString('hex');
      envContent = envContent.replace('your-super-secret-jwt-key-here', randomSecret);
      console.log(`✅ Generated JWT secret: ${randomSecret.substring(0, 20)}...`);
    }

    // Optional configurations
    console.log('\n🔧 Optional Configurations:');
    const setupIntegrations = await question('Setup external API integrations? (y/N): ');
    if (setupIntegrations.toLowerCase() === 'y' || setupIntegrations.toLowerCase() === 'yes') {
      console.log('\n📱 Integration APIs:');
      
      const googleClientId = await question('Google Client ID (optional): ');
      if (googleClientId.trim()) {
        envContent = envContent.replace('# GOOGLE_CLIENT_ID=your_google_client_id', `GOOGLE_CLIENT_ID=${googleClientId.trim()}`);
      }

      const googleClientSecret = await question('Google Client Secret (optional): ');
      if (googleClientSecret.trim()) {
        envContent = envContent.replace('# GOOGLE_CLIENT_SECRET=your_google_client_secret', `GOOGLE_CLIENT_SECRET=${googleClientSecret.trim()}`);
      }

      const fitbitClientId = await question('Fitbit Client ID (optional): ');
      if (fitbitClientId.trim()) {
        envContent = envContent.replace('# FITBIT_CLIENT_ID=your_fitbit_client_id', `FITBIT_CLIENT_ID=${fitbitClientId.trim()}`);
      }

      const fitbitClientSecret = await question('Fitbit Client Secret (optional): ');
      if (fitbitClientSecret.trim()) {
        envContent = envContent.replace('# FITBIT_CLIENT_SECRET=your_fitbit_client_secret', `FITBIT_CLIENT_SECRET=${fitbitClientSecret.trim()}`);
      }
    }

    // Write the .env file
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Environment file created successfully!');
    console.log(`📁 Location: ${envPath}`);

    // Display summary
    console.log('\n📋 Configuration Summary:');
    console.log(`🗄️  Database: ${mongoUri.trim() || 'mongodb://localhost:27017/fitforge'}`);
    console.log(`🖥️  Server Port: ${port.trim() || '3000'}`);
    console.log(`🌐 Frontend URL: ${frontendUrl.trim() || 'http://localhost:8080'}`);
    console.log(`🔐 JWT Secret: ${jwtSecret.trim() ? 'Custom' : 'Auto-generated'}`);

    console.log('\n🚀 Next steps:');
    console.log('   1. Run "npm run dev" to start the server');
    console.log('   2. Run "npm run seed" to populate the database');
    console.log('   3. Test the API at http://localhost:3000/api/health');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  setupEnvironment();
}

module.exports = setupEnvironment;
