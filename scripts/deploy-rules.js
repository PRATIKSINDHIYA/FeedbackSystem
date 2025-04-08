const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Path to the rules file
const rulesPath = path.join(__dirname, '..', 'firestore.rules');

// Check if the rules file exists
if (!fs.existsSync(rulesPath)) {
  console.error('Error: firestore.rules file not found!');
  process.exit(1);
}

console.log('Deploying Firestore security rules...');

try {
  // Deploy the rules using Firebase CLI
  execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' });
  console.log('Security rules deployed successfully!');
} catch (error) {
  console.error('Error deploying security rules:', error.message);
  process.exit(1);
} 