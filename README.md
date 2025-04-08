# Feedback Collector

A simple application for collecting and displaying user feedback.

## Features

- Submit feedback with name, email, and message
- View all submitted feedback
- Permanent JSON file storage for data persistence

## Data Storage

This application uses permanent JSON file storage for data persistence:

- Data is stored in `~/feedback-data/feedbacks.json` (in your home directory)
- The file is automatically created when the application starts
- Both development and production environments use the same storage mechanism
- Data persists between server restarts and deployments

## Development

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Access the application at http://localhost:5173 (or the URL shown in the terminal)

## Production Deployment

1. Build the application:
   ```
   npm run build
   ```

2. Deploy to Netlify:
   - Connect your GitHub repository to Netlify
   - Configure build settings in Netlify
   - Deploy your application

## Data Structure

The feedback data is stored in the following format:

```json
[
  {
    "id": 1234567890,
    "full_name": "John Doe",
    "email": "john@example.com",
    "message": "This is a feedback message",
    "created_at": "2023-01-01T12:00:00.000Z"
  }
]
```

## Troubleshooting

If you encounter issues with data storage:

1. Check that the `~/feedback-data` directory exists
2. Ensure `feedbacks.json` is properly formatted
3. Run `npm run init-data` to reinitialize the data storage 