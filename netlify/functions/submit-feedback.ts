import { Handler } from '@netlify/functions';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';

interface Feedback {
  id: string;
  full_name: string;
  email: string;
  message: string;
  created_at: string;
}

const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { full_name, email, message } = body;

    // Validate required fields
    if (!full_name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    // Create new feedback object
    const newFeedback: Feedback = {
      id: uuidv4(),
      full_name,
      email,
      message,
      created_at: new Date().toISOString()
    };

    // Ensure data directory exists
    const dataDir = path.join(os.homedir(), 'feedback-data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Read existing feedbacks
    const feedbackFile = path.join(dataDir, 'feedbacks.json');
    let feedbacks: Feedback[] = [];
    if (fs.existsSync(feedbackFile)) {
      const data = fs.readFileSync(feedbackFile, 'utf8');
      feedbacks = JSON.parse(data);
    }

    // Add new feedback
    feedbacks.push(newFeedback);

    // Write updated feedbacks to file
    fs.writeFileSync(feedbackFile, JSON.stringify(feedbacks, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify(newFeedback)
    };
  } catch (error) {
    console.error('Error in submit-feedback function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to submit feedback' })
    };
  }
};

export { handler }; 