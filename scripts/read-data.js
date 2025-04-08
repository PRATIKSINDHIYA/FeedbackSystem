import fs from 'fs';
import path from 'path';
import os from 'os';

// Define the data directory and file path
const DATA_DIR = path.join(os.homedir(), 'feedback-data');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedbacks.json');

// Read and display the content of the file
try {
  if (fs.existsSync(FEEDBACK_FILE)) {
    const data = fs.readFileSync(FEEDBACK_FILE, 'utf8');
    console.log('Content of feedbacks.json:');
    console.log(data);
  } else {
    console.log('File does not exist:', FEEDBACK_FILE);
  }
} catch (error) {
  console.error('Error reading file:', error);
} 