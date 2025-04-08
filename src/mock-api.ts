// Import fs promises API for file operations
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

interface Feedback {
  id: number;
  full_name: string;
  email: string;
  message: string;
  rating: number; // 1-5 star rating
  created_at: string;
}

// Use a permanent file path outside the project directory
// This ensures the data persists between server restarts
const DATA_DIR = path.join(os.homedir(), 'feedback-data');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedbacks.json');

// Ensure the data file exists
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

// Mock API handler
export const mockApiHandler = async (req: Request) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 200, headers });
  }

  try {
    // Ensure the data file exists
    await ensureDataFile();

    if (req.method === 'GET') {
      const feedbacks = await readFeedbacks();
      return new Response(JSON.stringify(feedbacks), { status: 200, headers });
    }

    if (req.method === 'POST') {
      console.log('Received POST request');
      
      let body;
      try {
        body = await req.json();
        console.log('Request body:', body);
      } catch (error) {
        console.error('Error parsing request body:', error);
        return new Response(
          JSON.stringify({ error: 'Invalid JSON in request body' }),
          { status: 400, headers }
        );
      }
      
      const { full_name, email, message, rating } = body;
      
      if (!full_name || !email || !message) {
        return new Response(
          JSON.stringify({ 
            error: 'Missing required fields',
            details: {
              full_name: !full_name ? 'Full name is required' : null,
              email: !email ? 'Email is required' : null,
              message: !message ? 'Message is required' : null
            }
          }),
          { status: 400, headers }
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return new Response(
          JSON.stringify({ error: 'Invalid email format' }),
          { status: 400, headers }
        );
      }
      
      // Validate rating if provided
      if (rating !== undefined && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
        return new Response(
          JSON.stringify({ error: 'Rating must be a number between 1 and 5' }),
          { status: 400, headers }
        );
      }

      // Read existing feedbacks
      const feedbacks = await readFeedbacks();

      const newFeedback: Feedback = {
        id: Date.now(),
        full_name,
        email,
        message,
        rating: rating || 0,
        created_at: new Date().toISOString(),
      };

      feedbacks.push(newFeedback);
      
      // Write updated feedbacks back to file
      await writeFeedbacks(feedbacks);
      
      console.log('Feedback submitted:', newFeedback);
      console.log('All feedbacks:', feedbacks);

      return new Response(
        JSON.stringify(newFeedback),
        { status: 200, headers }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  } catch (error) {
    console.error('Error in mock API handler:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      }),
      { status: 500, headers }
    );
  }
}; 