import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the data directory and file path
// Use a permanent file path outside the project directory
const DATA_DIR = path.join(os.homedir(), 'feedback-data');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedbacks.json');

// Create the data directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
  console.log('Creating data directory...');
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Create or reset the feedbacks.json file with proper encoding
console.log('Initializing feedbacks.json file...');
try {
  // Write with UTF-8 encoding and proper formatting
  fs.writeFileSync(FEEDBACK_FILE, JSON.stringify([], null, 2), 'utf8');
  console.log(`Successfully initialized feedbacks.json at ${FEEDBACK_FILE}`);
} catch (error) {
  console.error('Error initializing feedbacks.json:', error);
}

console.log('Data initialization complete!'); 