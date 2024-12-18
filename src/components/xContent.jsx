import React from 'react';
import './styles/TweetChecker.css';

function TweetCheckerInput() {
  return (
    <div className="tweet-container">
      <div className="tweet-card">
        <input
          type="text"
          placeholder="Enter the X (Twitter) Content here"
          className="tweet-input"
        />
        <button className="tweet-button">Check the Tweet!</button>
      </div>
    </div>
  );
}

export default TweetCheckerInput;
