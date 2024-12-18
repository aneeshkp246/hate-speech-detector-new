import React, { useState } from 'react';
import axios from 'axios';
import "./styles/xLink.css";

const TweetChecker = () => {
  const [xLink, setXLink] = useState('');
  const [tweetContent, setTweetContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Extract tweet ID from X (Twitter) link
  const extractTweetId = (url) => {
    try {
      const parts = url.split('/');
      const statusIndex = parts.findIndex(part => part === 'status');
      
      if (statusIndex === -1 || statusIndex + 1 >= parts.length) {
        throw new Error('Invalid link format');
      }
      return parts[statusIndex + 1];
    } catch (error) {
      throw new Error('Invalid link format');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tweetId = extractTweetId(xLink);
      if (!tweetId) throw new Error('Invalid Twitter/X link');

      const response = await axios.get(`http://localhost:5000/api/tweet/${tweetId}`);
      setTweetContent(response.data.text);
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching tweet:', error);
      setTweetContent('');
      setErrorMessage(
        error.response?.data?.message || 'Failed to fetch the tweet content'
      );
    }
  };

  return (
    <div className="tweet-checker">
      <div className="input-box">
        <input
          type="text"
          className="input-field"
          placeholder="Enter the X (Twitter) link of the tweet"
          value={xLink}
          onChange={(e) => setXLink(e.target.value)}
        />
        <button type="submit" className="submit-button" onClick={handleSubmit}>
          Check the Tweet!
        </button>
      </div>
      {tweetContent && (
        <div className="tweet-content">
          <h3>Tweet Content:</h3>
          <p>{tweetContent}</p>
        </div>
      )}
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default TweetChecker;
