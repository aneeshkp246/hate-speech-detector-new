# Hate Speech Detection Project

A full-stack application that detects hate speech using Machine Learning.

## Project Structure
- `backend/`: Node.js Express server
- `ml-service/`: Python Flask ML service
- Root directory contains the React frontend

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)
- npm (Node.js package manager)

### Environment Setup
1. Clone the repository:
```bash
git clone https://github.com/aneeshkp246/hate-speech-detector-new.git
cd hate-speech-detector-new
```

2. Create and configure the `.env` file in the root directory:
```
GEMINI_API_KEY=your_gemini_api_key
BEARER_TOKEN=your_twitter_token
```

### Backend Setup
```bash
cd backend
npm install
npm start
```

### ML Service Setup
```bash
cd ml-service
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
python model.py
```
##Or

```bash
pip install -r requirements.txt
```

### Frontend Setup
```bash
npm install
npm start
```

## Running the Application
1. Start the ML service (will run on port 5001)
2. Start the backend service (will run on port 5000)
3. Start the frontend (will run on port 3000)

## Development
- Frontend: React app runs on http://localhost:3000
- Backend: Express server runs on http://localhost:5000
- ML Service: Flask server runs on http://localhost:5001