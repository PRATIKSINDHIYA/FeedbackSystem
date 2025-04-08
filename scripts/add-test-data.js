import fs from 'fs';
import path from 'path';
import os from 'os';

// Define the data directory and file path
const DATA_DIR = path.join(os.homedir(), 'feedback-data');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedbacks.json');

// Test data to add
const testData = [
  {
    id: Date.now(),
    full_name: "Test User",
    email: "test@example.com",
    message: "This is a test feedback message",
    created_at: new Date().toISOString()
  },
  {
    id: Date.now() + 1,
    full_name: "Another User",
    email: "another@example.com",
    message: "This is another test feedback message",
    created_at: new Date().toISOString()
  }
];

// Add test data to the file
try {
  // Create directory if it doesn't exist
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Read existing data or create empty array
  let data = [];
  if (fs.existsSync(FEEDBACK_FILE)) {
    const fileContent = fs.readFileSync(FEEDBACK_FILE, 'utf8');
    try {
      data = JSON.parse(fileContent);
      if (!Array.isArray(data)) {
        console.log('Existing data is not an array, resetting to empty array');
        data = [];
      }
    } catch (error) {
      console.log('Error parsing existing data, resetting to empty array');
      data = [];
    }
  }

  // Add test data
  data = [...data, ...testData];

  // Write back to file with proper formatting
  fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(data, null, 2), 'utf8');
  console.log('Test data added successfully!');
  console.log(`Data saved to ${FEEDBACK_FILE}`);
  console.log('Current data:', JSON.stringify(data, null, 2));
} catch (error) {
  console.error('Error adding test data:', error);
} 