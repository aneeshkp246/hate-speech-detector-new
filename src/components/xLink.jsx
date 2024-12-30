import React, { useState } from "react";
import axios from "axios";
import "./styles/xLink.css";

const TweetChecker = () => {
  const [xLink, setXLink] = useState("");
  const [tweetContent, setTweetContent] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [rephrasedText, setRephrasedText] = useState(null); 
  const [errorMessage, setErrorMessage] = useState("");

  // Extract tweet ID from X (Twitter) link
  const extractTweetId = (url) => {
    try {
      const parts = url.split("/");
      const statusIndex = parts.findIndex((part) => part === "status");

      if (statusIndex === -1 || statusIndex + 1 >= parts.length) {
        throw new Error("Invalid link format");
      }
      return parts[statusIndex + 1];
    } catch (error) {
      throw new Error("Invalid link format");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTweetContent("");
    setAnalysis(null);
    setRephrasedText(null); 
    setErrorMessage("");

    try {
      const tweetId = extractTweetId(xLink);
      if (!tweetId) throw new Error("Invalid Twitter/X link");

      const response = await axios.get(`http://localhost:5000/api/analyze-tweet/${tweetId}`);
      setTweetContent(response.data.tweet);
      setAnalysis(response.data.analysis);
      setRephrasedText(response.data.rephrased_text || null); 
      setErrorMessage("");
    } catch (error) {
      console.error("Error analyzing tweet:", error);
      setTweetContent("");
      setAnalysis(null);
      setRephrasedText(null); 
      setErrorMessage(
        error.response?.data?.message || "Failed to analyze the tweet"
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
          Analyze Tweet
        </button>
      </div>

      {tweetContent && (
        <div className="tweet-content">
          <h3>Original Tweet:</h3>
          <p>{tweetContent}</p>

          {analysis && (
            <div className="analysis-results">
              <h3>Analysis Results:</h3>
              <p>
                <strong>Classification:</strong> {analysis.classification}
              </p>
              <div className="confidence-bar">
                <div
                  className="confidence-fill"
                  style={{ width: `${analysis.confidence * 10}%` }}
                ></div>
              </div>
              <p>
                <strong>Confidence:</strong> {analysis.confidence * 10}%
              </p>
            </div>
          )}

          {rephrasedText && (
            <div className="rephrased-text">
              <h3>Rephrased Tweet:</h3> <br />
              <p className="rephrased-content">{rephrasedText}</p>
            </div>
          )}
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
