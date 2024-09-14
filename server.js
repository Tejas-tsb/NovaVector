const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public')); // Serve static files

// API keys and external user ID (replace with actual values)
const apiKey = 'Xi5kTKJdo93e8DQrtZldA4iDbihzRAGQ';
const externalUserId = 'sengh';

// Route to create a chat session and submit query
app.post('/api/chat', async (req, res) => {
  const query = req.body.query;

  try {
    // Create Chat Session
    const sessionResponse = await axios.post(
      'https://api.on-demand.io/chat/v1/sessions',
      { pluginIds: [], externalUserId: externalUserId },
      { headers: { apikey: apiKey } }
    );
    const sessionId = sessionResponse.data.data.id;

    // Submit Query to the Session
    const queryResponse = await axios.post(
      `https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`,
      {
        endpointId: 'predefined-openai-gpt4o',
        query: query,
        pluginIds: ['plugin-1712327325', 'plugin-1713962163', 'plugin-1726273878'],
        responseMode: 'sync'
      },
      { headers: { apikey: apiKey } }
    );

    // Send the chatbot response to the frontend
    res.json({ response: queryResponse.data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process query' });
  }
});

// Server Listening
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

