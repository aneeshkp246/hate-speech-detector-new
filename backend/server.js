const express = require('express'); 
const needle = require('needle');
const cors = require('cors');

const app = express();
const PORT = 5000;

const BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAABn2wwEAAAAA%2Bwu6qLnA1RVArE5Rm%2FxThuAE8yg%3DAshDtkP7JTMnvG1oVMupe2EabqTc9k5DCE7Ictb6hDsdhXtAwQ';

if (!BEARER_TOKEN) {
  console.error('Error: Twitter Bearer Token is not set in the environment variables.');
  process.exit(1);
}

app.use(cors());

const fetchTweet = async (tweetId) => {
  const endpointURL = `https://api.x.com/2/tweets/${tweetId}?tweet.fields=public_metrics`;

  try {
    const response = await needle('get', endpointURL, null, {
      headers: {
        'User-Agent': 'v2TweetLookupJS',
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });

    if (response.body) {
      return response.body;
    } else {
      throw new Error('Unsuccessful request');
    }
  } catch (error) {
    console.error('Error fetching tweet:', error.message);
    throw error;
  }
};

app.get('/api/tweet/:id', async (req, res) => {
  const tweetId = req.params.id;

  try {
    const tweetData = await fetchTweet(tweetId);

    if (tweetData && tweetData.data && tweetData.data.text) {
      res.json({
        text: tweetData.data.text,
      });
    } else {
      res.status(404).json({ message: 'Tweet not found or text field is missing' });
    }
  } catch (error) {
    console.error('Error fetching tweet:', error.message);
    res.status(500).json({ message: 'Failed to fetch tweet content' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
