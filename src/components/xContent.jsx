import React, { useState } from "react";
import axios from "axios";
import "./styles/TweetChecker.css";

function TweetCheckerInput() {
  const [tweetText, setTweetText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setTweetText(e.target.value);
  };

  const analyzeText = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/analyze-text", {
        text: tweetText,
      });

      setResult(response.data);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error analyzing text:", err);
      setError(err.response?.data?.message || "An error occurred while analyzing the text.");
      setResult(null); // Clear any previous results
    }
  };

  return (
    <div className="tweet-container">
      <div className="tweet-card">
        <textarea
          placeholder="Enter the X (Twitter) Content here"
          className="tweet-textarea"
          rows="5"
          value={tweetText}
          onChange={handleInputChange}
        ></textarea>
        <button className="tweet-button" onClick={analyzeText}>
          Check the Tweet!
        </button>
        {result && (
          <div className="tweet-result">
            <h4>Analysis Result</h4>
            <p>
              <strong>Classification:</strong> {result.classification}
            </p>
            <div className="confidence-bar">
              <div
                className="confidence-fill"
                style={{ width: `${result.confidence*10}%` }}
              ></div>
            </div>
            <p>
              <strong>Confidence:</strong> {result.confidence*10}%
            </p>
          </div>
        )}
        {error && <div className="tweet-error">Error: {error}</div>}
      </div>
    </div>
  );
}

export default TweetCheckerInput;
