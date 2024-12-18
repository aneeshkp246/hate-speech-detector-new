import React from 'react';
import './styles/Category.css'; 

const Category = () => {
  return (
    <div className="category-container">
      <h1>Upload Sample Here</h1>
      <div className="upload-section">
        <a href="xLink">
        <div className="x-link box">
          <h2>Upload X (Formerly Twitter) Link of the tweet</h2>
        </div>
        </a>
        
        <div className="or">
          <h2>OR</h2>
        </div>
        <a href="xContent">
        <div className="x-link box">
          <h2>Copy Paste the Tweet Content</h2>
        </div>
        </a>
      </div>
    </div>
  );
}

export default Category;
