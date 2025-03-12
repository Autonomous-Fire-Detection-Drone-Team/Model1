# Fire Detection UI

A React-based user interface for the YOLOv5 Fire Detection system.

## Features

- Upload images for fire detection
- Capture images from webcam for real-time fire detection
- View detection results with bounding boxes
- Responsive design for desktop and mobile devices

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Installation

1. Navigate to the frontend directory:
```
cd frontend/fire-detection-ui
```

2. Install dependencies:
```
npm install
```

## Running the Application

1. Start the development server:
```
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

## Building for Production

To create a production build:
```
npm run build
```

The build files will be located in the `build` directory.

## API Connection

The UI connects to a Flask backend API running on `http://localhost:5000`. Make sure the backend server is running before using the UI.

## Technologies Used

- React
- Material UI
- Axios for API requests
- React Webcam for webcam integration 