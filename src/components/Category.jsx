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
        
        {/* <div className="or">
          <h2>OR</h2>
        </div> */}
        {/* <div className="audio box">
          <h2>Upload an Audio Sample</h2>
        </div> */}
      </div>
    </div>
  );
}

export default Category;
