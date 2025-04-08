import { Handler } from '@netlify/functions';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

interface Feedback {
  id: number;
  full_name: string;
  email: string;
  message: string;
  created_at: string;
}

// Use a permanent file path outside the project directory
// This ensures the data persists between server restarts
const DATA_DIR = path.join(os.homedir(), 'feedback-data');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedbacks.json');

const ensureDataFile = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(FEEDBACK_FILE);
    } catch {
      // Write with proper formatting
      await fs.writeFile(FEEDBACK_FILE, JSON.stringify([], null, 2), 'utf8');
    }
  } catch (error) {
    console.error('Error ensuring data file exists:', error);
    throw new Error('Failed to initialize storage');
  }
};

// Read feedbacks from file with error handling
const readFeedbacks = async (): Promise<Feedback[]> => {
  try {
    const data = await fs.readFile(FEEDBACK_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading feedbacks file:', error);
    // If there's an error reading the file, reset it
    await fs.writeFile(FEEDBACK_FILE, JSON.stringify([], null, 2), 'utf8');
    return [];
  }
};

// Write feedbacks to file with error handling
const writeFeedbacks = async (feedbacks: Feedback[]): Promise<void> => {
  try {
    await fs.writeFile(FEEDBACK_FILE, JSON.stringify(feedbacks, null, 2), 'utf8');
    console.log(`Data saved to ${FEEDBACK_FILE}`);
  } catch (error) {
    console.error('Error writing feedbacks file:', error);
    throw new Error('Failed to save feedback');
  }
};

const handler: Handler = async (event) => {
  // Set CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    await ensureDataFile();

    if (event.httpMethod === 'GET') {
      const feedbacks = await readFeedbacks();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(feedbacks),
      };
    }

    if (event.httpMethod === 'POST' && event.body) {
      const { full_name, email, message } = JSON.parse(event.body);
      
      if (!full_name || !email || !message) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Missing required fields',
            details: {
              full_name: !full_name ? 'Full name is required' : null,
              email: !email ? 'Email is required' : null,
              message: !message ? 'Message is required' : null
            }
          }),
        };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid email format' }),
        };
      }

      const feedbacks = await readFeedbacks();

      const newFeedback: Feedback = {
        id: Date.now(),
        full_name,
        email,
        message,
        created_at: new Date().toISOString(),
      };

      feedbacks.push(newFeedback);
      await writeFeedbacks(feedbacks);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(newFeedback),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      }),
    };
  }
};

export { handler };