# Ember Eye Fire Detection

A real-time fire detection system using YOLOv5 and React, capable of detecting fires in both images and videos.

## Features

- Real-time fire detection using YOLOv5
- Photo capture from webcam
- Video recording and analysis
- Modern React UI with Material-UI components
- Flask backend for image and video processing

## Project Structure

```
yolov5-fire-detection/
├── backend/               # Flask backend for fire detection
│   ├── app.py             # Main Flask application
│   ├── requirements.txt   # Python dependencies
│   └── run.sh             # Script to run the backend
├── frontend/              # React frontend
│   └── fire-detection-ui/ # React application
├── model/                 # YOLOv5 model files
│   └── yolov5s_best.pt    # Trained YOLOv5 model (included)
└── yolov5/                # YOLOv5 repository (included)
```

## Prerequisites

- Python 3.x
- Node.js and npm

## Setup and Installation

### Clone the Repository

```bash
git clone https://github.com/Autonomous-Fire-Detection-Drone-Team/Model1.git
cd Model1
```

### Backend Setup

Install Python dependencies:

```bash
cd backend
pip install -r requirements.txt
```

### Frontend Setup

Install Node.js dependencies:

```bash
cd frontend/fire-detection-ui
npm install
```

## Running the Application

### Start the Backend

```bash
cd backend
python3 app.py
```

The backend server will start on http://localhost:5001

### Start the Frontend

```bash
cd frontend/fire-detection-ui
npm start
```

The frontend development server will start on http://localhost:3000

## Usage

1. Open your browser and navigate to http://localhost:3000
2. Allow camera access when prompted
3. Choose between Photo or Video mode using the toggle buttons
4. For Photo mode:
   - Click "CAPTURE IMAGE" to take a photo
   - Click "DETECT FIRE" to analyze the image
5. For Video mode:
   - Click "START RECORDING" to begin recording
   - Click "STOP RECORDING" when finished
   - Click "DETECT FIRE" to analyze the video

## Troubleshooting

- If you encounter issues with the backend, check that:
  - All Python dependencies are installed correctly
  - Port 5001 is not being used by another application

- If you encounter issues with the frontend, check that:
  - All Node.js dependencies are installed correctly
  - The backend server is running and accessible at http://localhost:5001

## License

[MIT License](LICENSE)
