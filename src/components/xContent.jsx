import React from "react";
import "./styles/TweetChecker.css";

function TweetCheckerInput() {
  return (
    <div className="tweet-container">
      <div className="tweet-card">
        <textarea
          placeholder="Enter the X (Twitter) Content here"
          className="tweet-textarea"
          rows="5" // Number of visible lines
        ></textarea>
        <button className="tweet-button">Check the Tweet!</button>
      </div>
    </div>
  );
}

export default TweetCheckerInput;
