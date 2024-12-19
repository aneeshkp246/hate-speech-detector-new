from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import re
import logging

# Configure Flask app
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Text preprocessing function
def preprocess_text(text):
    # Remove URLs
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    # Remove newlines and extra whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove mentions
    text = re.sub(r'@\w+', '', text)
    # Remove hashtags
    text = re.sub(r'#\w+', '', text)
    # Remove special characters
    text = re.sub(r'[^\w\s]', '', text)
    return text.strip().lower()

# Train model and pipeline
try:
    # Load the dataset
    data_df = pd.read_csv('cleaned_labeled_data.csv')
    
    # Preprocess the text data
    data_df['cleaned_text'] = data_df['text'].apply(preprocess_text)
    
    # Create label mappings
    label_mapping = {'neutral': 0, 'offensive': 1, 'hate_speech': 2}
    data_df['label_encoded'] = data_df['label'].map(label_mapping)
    
    # Create and train the pipeline
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=5000)),
        ('classifier', LogisticRegression(max_iter=1000))
    ])
    
    # Split and train
    X_train, X_test, y_train, y_test = train_test_split(
        data_df['cleaned_text'], 
        data_df['label_encoded'],
        test_size=0.2, 
        random_state=42
    )
    
    pipeline.fit(X_train, y_train)
    logger.info("Model trained successfully!")
    
except Exception as e:
    logger.error(f"Error during model training: {str(e)}")
    raise

# Classification function
def classify_text(input_text):
    try:
        # Preprocess input text
        cleaned_text = preprocess_text(input_text)
        
        # Get prediction probability
        proba = pipeline.predict_proba([cleaned_text])[0]
        predicted_class = np.argmax(proba)
        confidence = proba[predicted_class] * 10
        
        # Map back to categories
        categories = ['neutral', 'offensive', 'hate_speech']
        category = categories[predicted_class]
        
        return {
            "classification": category,
            "confidence": round(float(confidence), 2),
            "cleaned_text": cleaned_text
        }
    except Exception as e:
        logger.error(f"Error during classification: {str(e)}")
        return {
            "error": f"Classification failed: {str(e)}"
        }

# Route to analyze text
@app.route('/analyze', methods=['POST'])
def analyze_text():
    try:
        data = request.get_json()
        text = data.get('text', '')
        if not text:
            logger.warning("Received request with no text")
            return jsonify({"error": "No text provided"}), 400
            
        logger.info(f"Received text for analysis: {text[:50]}...")  # Log first 50 chars
        result = classify_text(text)
        logger.info(f"Analysis result: {result}")
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Run the app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
