import { Handler } from '@netlify/functions';
import fs from 'fs';
import path from 'path';
import os from 'os';

interface Feedback {
  id: string;
  full_name: string;
  email: string;
  message: string;
  rating: number;
  created_at: string;
}

const handler: Handler = async (event) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    const dataDir = path.join(os.homedir(), 'feedback-data');
    const feedbackFile = path.join(dataDir, 'feedbacks.json');

    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log('Created feedback data directory:', dataDir);
    }

    // Read feedbacks from file
    let feedbacks: Feedback[] = [];
    if (fs.existsSync(feedbackFile)) {
      const data = fs.readFileSync(feedbackFile, 'utf8');
      feedbacks = JSON.parse(data);
      console.log(`Successfully loaded ${feedbacks.length} feedbacks`);
    } else {
      console.log('No feedback file found, returning empty array');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(feedbacks),
    };
  } catch (error) {
    console.error('Error in get-feedbacks function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch feedbacks',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

export { handler }; 