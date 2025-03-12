# Fire Detection API

A Flask-based API for the YOLOv5 Fire Detection system.

## Features

- Image upload endpoint for fire detection
- Returns detection results with bounding boxes and confidence scores
- Serves processed images with bounding boxes

## Prerequisites

- Python 3.8 or later
- YOLOv5 installed in the parent directory
- Pretrained model file (`yolov5s_best.pt`) in the `models` directory

## Installation

1. Navigate to the backend directory:
```
cd backend
```

2. Install dependencies:
```
pip install -r requirements.txt
```

## Running the API

1. Start the Flask server:
```
python app.py
```

Or use the provided shell script:
```
./run.sh
```

2. The API will be available at:
```
http://localhost:5000
```

## API Endpoints

### POST /api/detect

Upload an image for fire detection.

**Request:**
- Form data with a file field named 'file'

**Response:**
```json
{
  "detections": [
    {
      "class": "fire",
      "confidence": 0.95,
      "bbox": [x1, y1, x2, y2]
    }
  ],
  "result_image": "/api/images/result_filename.jpg"
}
```

### GET /api/images/{filename}

Get a processed image with bounding boxes.

## Integration with YOLOv5

This API integrates with YOLOv5 by:
1. Loading the pretrained model
2. Processing uploaded images
3. Running inference to detect fire
4. Drawing bounding boxes on detected regions
5. Returning the results and processed images

Make sure the YOLOv5 repository is properly installed in the parent directory. 