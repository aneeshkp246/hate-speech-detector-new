const express = require('express');
const needle = require('needle');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;
const ML_SERVICE_URL = 'http://127.0.0.1:5001/analyze';

const BEARER_TOKEN = process.env.BEARER_TOKEN;


if (!BEARER_TOKEN) {
    console.error('Error: Twitter Bearer Token is not set in the environment variables.');
    process.exit(1);
}

app.use(cors());
app.use(express.json());

const fetchTweet = async (tweetId) => {
    const endpointURL = `https://api.twitter.com/2/tweets/${tweetId}?tweet.fields=public_metrics`;

    try {
        const response = await needle('get', endpointURL, null, {
            headers: {
                'User-Agent': 'v2TweetLookupJS',
                Authorization: `Bearer ${BEARER_TOKEN}`,
            },
        });

        if (response.body && response.body.data) {
            return response.body;
        } else {
            throw new Error('Unsuccessful request or Tweet data not found');
        }
    } catch (error) {
        console.error('Error fetching tweet:', error.message);
        throw error;
    }
};

app.get('/api/analyze-tweet/:id', async (req, res) => {
    const tweetId = req.params.id;

    try {
        const tweetData = await fetchTweet(tweetId);

        if (!tweetData || !tweetData.data || !tweetData.data.text) {
            console.error('Tweet not found or text field is missing');
            return res.status(404).json({ message: 'Tweet not found or text field is missing' });
        }

        console.log('Tweet text:', tweetData.data.text);

        try {
            const mlResponse = await axios.post(ML_SERVICE_URL, {
                text: tweetData.data.text
            });

            const response = {
                tweet: tweetData.data.text,
                analysis: mlResponse.data
            };

            if (mlResponse.data.rephrased_text) {
                response.rephrased_text = mlResponse.data.rephrased_text;
            }

            console.log('ML Service Response:', JSON.stringify(mlResponse.data, null, 2));
            res.json(response);

        } catch (mlError) {
            console.error('ML Service Error:', mlError.message);
            console.error('ML Service Error Details:', mlError.response?.data || 'No additional details');
            
            res.status(500).json({ 
                message: 'Failed to analyze tweet',
                error: `ML Service Error: ${mlError.message}`,
                tweet: tweetData.data.text 
            });
        }

    } catch (tweetError) {
        console.error('Twitter API Error:', tweetError.message);
        res.status(500).json({ 
            message: 'Failed to fetch tweet',
            error: tweetError.message 
        });
    }
});

app.post('/api/analyze-text', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ message: "Text content is required" });
    }

    try {
        const mlResponse = await axios.post(ML_SERVICE_URL, { text });

        const response = mlResponse.data;

        if (response.rephrased_text) {
            response.rephrased_text = response.rephrased_text;
        }

        res.json(response);
    } catch (error) {
        console.error('ML Service Error:', error.message);
        res.status(500).json({ 
            message: 'Failed to analyze text',
            error: error.message,
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
