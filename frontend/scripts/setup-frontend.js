#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

// Recreate __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const setupFrontend = async () => {
  console.log('🎨 Setting up FitForge Frontend...\n');

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
    console.log('📝 Let\'s configure your frontend environment:\n');

    // API Configuration
    console.log('🔗 API Configuration:');
    const apiUrl = await question(`Backend API URL (default: http://localhost:3000/api/v1): `);
    if (apiUrl.trim()) {
      envContent = envContent.replace('http://localhost:3000/api/v1', apiUrl.trim());
    }

    // App Configuration
    console.log('\n📱 App Configuration:');
    const appName = await question(`App Name (default: FitForge): `);
    if (appName.trim()) {
      envContent = envContent.replace('FitForge', appName.trim());
    }

    const appVersion = await question(`App Version (default: 1.0.0): `);
    if (appVersion.trim()) {
      envContent = envContent.replace('1.0.0', appVersion.trim());
    }

    // Development settings
    console.log('\n🛠️  Development Settings:');
    const devMode = await question(`Enable development mode? (Y/n): `);
    if (devMode.toLowerCase() === 'n' || devMode.toLowerCase() === 'no') {
      envContent = envContent.replace('VITE_DEV_MODE=true', 'VITE_DEV_MODE=false');
    }

    // Optional integrations
    console.log('\n🔧 Optional Integrations:');
    const setupIntegrations = await question('Setup external service integrations? (y/N): ');
    if (setupIntegrations.toLowerCase() === 'y' || setupIntegrations.toLowerCase() === 'yes') {
      console.log('\n📱 External Services:');
      
      const googleClientId = await question('Google Client ID (optional): ');
      if (googleClientId.trim()) {
        envContent = envContent.replace('# VITE_GOOGLE_CLIENT_ID=your_google_client_id', `VITE_GOOGLE_CLIENT_ID=${googleClientId.trim()}`);
      }

      const fitbitClientId = await question('Fitbit Client ID (optional): ');
      if (fitbitClientId.trim()) {
        envContent = envContent.replace('# VITE_FITBIT_CLIENT_ID=your_fitbit_client_id', `VITE_FITBIT_CLIENT_ID=${fitbitClientId.trim()}`);
      }
    }

    // Write the .env file
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Frontend environment file created successfully!');
    console.log(`📁 Location: ${envPath}`);

    // Display summary
    console.log('\n📋 Configuration Summary:');
    console.log(`🔗 API URL: ${apiUrl.trim() || 'http://localhost:3000/api/v1'}`);
    console.log(`📱 App Name: ${appName.trim() || 'FitForge'}`);
    console.log(`📦 Version: ${appVersion.trim() || '1.0.0'}`);
    console.log(`🛠️  Dev Mode: ${devMode.toLowerCase() === 'n' || devMode.toLowerCase() === 'no' ? 'Disabled' : 'Enabled'}`);

    console.log('\n🚀 Next steps:');
    console.log('   1. Make sure your backend is running: cd ../backend && npm run dev');
    console.log('   2. Start the frontend: npm run dev');
    console.log('   3. Test the connection at http://localhost:8080');
    console.log('   4. Visit the exercises page to see dynamic data');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
};

// Run setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupFrontend();
}

export default setupFrontend;
