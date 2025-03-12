import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardMedia,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ReplayIcon from '@mui/icons-material/Replay';

const API_URL = 'http://localhost:5001';

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detections, setDetections] = useState([]);
  const [cameraDevices, setCameraDevices] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');

  // Get available camera devices
  React.useEffect(() => {
    async function getDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setCameraDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId);
        }
      } catch (err) {
        console.error('Error accessing media devices:', err);
        setError('Could not access camera devices');
      }
    }
    
    getDevices();
  }, []);

  const handleCameraChange = (event) => {
    setSelectedCamera(event.target.value);
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setResultImage(null);
      setDetections([]);
      setError(null);
    }
  }, [webcamRef]);

  const reset = () => {
    setCapturedImage(null);
    setResultImage(null);
    setDetections([]);
    setError(null);
  };

  const detectFire = async () => {
    if (!capturedImage) {
      setError('Please capture an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert base64 to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], 'webcam-capture.jpg', { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('file', file);

      const apiResponse = await axios.post(`${API_URL}/api/detect`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResultImage(`${API_URL}${apiResponse.data.result_image}`);
      setDetections(apiResponse.data.detections);
      setLoading(false);
    } catch (err) {
      console.error('Error processing image:', err);
      setError('Error processing image. Please try again.');
      setLoading(false);
    }
  };

  const videoConstraints = {
    width: 640,
    height: 480,
    deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Fire Detection - Webcam
        </Typography>
        <Typography variant="body1" paragraph align="center">
          Use your webcam to capture images for fire detection
        </Typography>

        {cameraDevices.length > 1 && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="camera-select-label">Camera</InputLabel>
            <Select
              labelId="camera-select-label"
              id="camera-select"
              value={selectedCamera}
              label="Camera"
              onChange={handleCameraChange}
            >
              {cameraDevices.map((device) => (
                <MenuItem key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${cameraDevices.indexOf(device) + 1}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {!capturedImage ? (
              <>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  style={{ width: '100%', maxWidth: '640px', marginBottom: '16px' }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={capture}
                  startIcon={<CameraAltIcon />}
                >
                  Capture Photo
                </Button>
              </>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <Button
                  variant="outlined"
                  onClick={reset}
                  startIcon={<ReplayIcon />}
                  sx={{ mb: 2 }}
                >
                  Take Another Photo
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={detectFire}
                  disabled={loading}
                  sx={{ mb: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Detect Fire'}
                </Button>
              </Box>
            )}
            {error && (
              <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                {error}
              </Alert>
            )}
          </Box>
        </Paper>

        {(capturedImage || resultImage) && (
          <Grid container spacing={2}>
            {capturedImage && (
              <Grid item xs={12} md={resultImage ? 6 : 12}>
                <Card>
                  <CardMedia
                    component="img"
                    image={capturedImage}
                    alt="Captured"
                    sx={{ maxHeight: '500px', objectFit: 'contain' }}
                  />
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6">Captured Image</Typography>
                  </Box>
                </Card>
              </Grid>
            )}
            {resultImage && (
              <Grid item xs={12} md={6}>
                <Card>
                  <CardMedia
                    component="img"
                    image={resultImage}
                    alt="Detection Result"
                    sx={{ maxHeight: '500px', objectFit: 'contain' }}
                  />
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6">Detection Result</Typography>
                    {detections.length > 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        {detections.length} fire instance(s) detected
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No fire detected
                      </Typography>
                    )}
                  </Box>
                </Card>
              </Grid>
            )}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default WebcamCapture; 