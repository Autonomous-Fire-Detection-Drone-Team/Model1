import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardMedia,
  FormControl,
  Select,
  MenuItem,
  Container,
  AppBar,
  Toolbar,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ReplayIcon from '@mui/icons-material/Replay';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import VideocamIcon from '@mui/icons-material/Videocam';
import StopIcon from '@mui/icons-material/Stop';
import UploadIcon from '@mui/icons-material/Upload';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

const API_URL = 'http://localhost:5001';

const EmberEyeFireDetection = () => {
  const theme = useTheme();
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detections, setDetections] = useState([]);
  const [cameraDevices, setCameraDevices] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [captureMode, setCaptureMode] = useState('photo');

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

  const handleCaptureModeChange = (event, newMode) => {
    if (newMode !== null) {
      setCaptureMode(newMode);
      reset();
    }
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

  const handleStartRecording = useCallback(() => {
    setRecordedChunks([]);
    setIsRecording(true);
    setRecordedVideo(null);
    setResultImage(null);
    setDetections([]);
    setError(null);
    
    if (webcamRef.current && webcamRef.current.stream) {
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: "video/webm"
      });
      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        handleDataAvailable
      );
      mediaRecorderRef.current.start();
    }
  }, [webcamRef, setRecordedChunks]);

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [mediaRecorderRef, setIsRecording]);

  React.useEffect(() => {
    if (recordedChunks.length > 0 && !isRecording) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm"
      });
      const url = URL.createObjectURL(blob);
      setRecordedVideo(url);
    }
  }, [recordedChunks, isRecording]);

  const reset = () => {
    setCapturedImage(null);
    setRecordedVideo(null);
    setRecordedChunks([]);
    setResultImage(null);
    setDetections([]);
    setError(null);
    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const detectFire = async () => {
    if (!capturedImage && !recordedVideo) {
      setError('Please capture an image or record a video first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let formData = new FormData();
      
      if (captureMode === 'photo' && capturedImage) {
        // Convert base64 to blob
        const response = await fetch(capturedImage);
        const blob = await response.blob();
        const file = new File([blob], 'webcam-capture.jpg', { type: 'image/jpeg' });
        formData.append('file', file);
      } else if (captureMode === 'video' && recordedVideo) {
        // Convert video blob
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const file = new File([blob], 'webcam-recording.webm', { type: 'video/webm' });
        formData.append('file', file);
      }

      const apiResponse = await axios.post(`${API_URL}/api/detect`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResultImage(`${API_URL}${apiResponse.data.result_image}`);
      setDetections(apiResponse.data.detections);
      setLoading(false);
    } catch (err) {
      console.error('Error processing media:', err);
      setError('Error processing media. Please try again.');
      setLoading(false);
    }
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom, #000000, #121212)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
      {/* Header */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Toolbar>
          <LocalFireDepartmentIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 300, letterSpacing: '1px' }}>
            EMBER EYE FIRE DETECTION
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Main Content */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #FF5722 30%, #FFC107 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              mb: 4,
              display: 'inline-block'
            }}
          >
            Ember Eye Fire Detection
          </Typography>
          <Typography variant="h6" sx={{ color: '#CCCCCC', maxWidth: '800px', mx: 'auto', mb: 4, fontWeight: 300 }}>
            Advanced AI-powered fire detection using your device's camera
          </Typography>
        </Box>

        {/* Capture Mode Selection */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <ToggleButtonGroup
            value={captureMode}
            exclusive
            onChange={handleCaptureModeChange}
            aria-label="capture mode"
            sx={{
              '& .MuiToggleButton-root': {
                color: '#CCCCCC',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                  backgroundColor: 'rgba(255, 87, 34, 0.1)',
                },
              },
            }}
          >
            <ToggleButton value="photo" aria-label="photo mode">
              <PhotoCameraIcon sx={{ mr: 1 }} />
              Photo
            </ToggleButton>
            <ToggleButton value="video" aria-label="video mode">
              <VideocamIcon sx={{ mr: 1 }} />
              Video
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Camera Selection */}
        {cameraDevices.length > 1 && (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              mb: 4, 
              background: 'rgba(18, 18, 18, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <FormControl fullWidth variant="outlined" size="small">
              <Select
                value={selectedCamera}
                onChange={handleCameraChange}
                displayEmpty
                sx={{ 
                  color: '#FFFFFF',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                <MenuItem disabled value="">
                  <em>Select Camera</em>
                </MenuItem>
                {cameraDevices.map((device) => (
                  <MenuItem key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${cameraDevices.indexOf(device) + 1}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        )}

        {/* Webcam/Capture Area */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 4, 
            background: 'rgba(18, 18, 18, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {!capturedImage && !recordedVideo ? (
              <>
                <Box 
                  sx={{ 
                    width: '100%', 
                    maxWidth: '1280px', 
                    mb: 3,
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      border: `2px solid ${theme.palette.primary.main}`,
                      pointerEvents: 'none',
                    },
                    ...(isRecording && {
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        width: '15px',
                        height: '15px',
                        borderRadius: '50%',
                        backgroundColor: 'red',
                        animation: 'pulse 1.5s infinite',
                      },
                    }),
                    '@keyframes pulse': {
                      '0%': {
                        opacity: 1,
                      },
                      '50%': {
                        opacity: 0.5,
                      },
                      '100%': {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <Webcam
                    audio={captureMode === 'video'}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    style={{ width: '100%', display: 'block' }}
                  />
                </Box>
                {captureMode === 'photo' ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={capture}
                    startIcon={<CameraAltIcon />}
                    size="large"
                    sx={{ 
                      px: 4, 
                      py: 1.5,
                      fontSize: '1.1rem',
                      boxShadow: '0 4px 20px rgba(255, 87, 34, 0.5)',
                    }}
                  >
                    CAPTURE IMAGE
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {!isRecording ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleStartRecording}
                        startIcon={<VideocamIcon />}
                        size="large"
                        sx={{ 
                          px: 4, 
                          py: 1.5,
                          fontSize: '1.1rem',
                          boxShadow: '0 4px 20px rgba(255, 87, 34, 0.5)',
                        }}
                      >
                        START RECORDING
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleStopRecording}
                        startIcon={<StopIcon />}
                        size="large"
                        sx={{ 
                          px: 4, 
                          py: 1.5,
                          fontSize: '1.1rem',
                          boxShadow: '0 4px 20px rgba(255, 0, 0, 0.5)',
                        }}
                      >
                        STOP RECORDING
                      </Button>
                    )}
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={reset}
                    startIcon={<ReplayIcon />}
                    sx={{ 
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: '#FFFFFF',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      }
                    }}
                  >
                    NEW {captureMode === 'photo' ? 'CAPTURE' : 'RECORDING'}
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={detectFire}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LocalFireDepartmentIcon />}
                    sx={{ 
                      background: 'linear-gradient(45deg, #CC0000 30%, #FF3300 90%)',
                      boxShadow: '0 3px 5px 2px rgba(255, 0, 0, .3)',
                    }}
                  >
                    {loading ? 'ANALYZING' : 'DETECT FIRE'}
                  </Button>
                </Box>
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mt: 2, 
                      width: '100%',
                      background: 'rgba(211, 47, 47, 0.2)',
                      color: '#ff8a80',
                    }}
                  >
                    {error}
                  </Alert>
                )}
              </Box>
            )}
          </Box>
        </Paper>

        {/* Results Area */}
        {(capturedImage || recordedVideo || resultImage) && (
          <Grid container spacing={3}>
            {capturedImage && (
              <Grid item xs={12} md={resultImage ? 6 : 12}>
                <Card 
                  elevation={0} 
                  sx={{ 
                    background: 'rgba(18, 18, 18, 0.7)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    height: '100%',
                  }}
                >
                  <CardMedia
                    component="img"
                    image={capturedImage}
                    alt="Captured"
                    sx={{ height: 400, objectFit: 'contain' }}
                  />
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 300 }}>
                      CAPTURED IMAGE
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            )}
            {recordedVideo && (
              <Grid item xs={12} md={resultImage ? 6 : 12}>
                <Card 
                  elevation={0} 
                  sx={{ 
                    background: 'rgba(18, 18, 18, 0.7)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    height: '100%',
                  }}
                >
                  <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <video 
                      src={recordedVideo} 
                      controls 
                      style={{ maxHeight: '100%', maxWidth: '100%' }}
                    />
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 300 }}>
                      RECORDED VIDEO
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            )}
            {resultImage && (
              <Grid item xs={12} md={6}>
                <Card 
                  elevation={0} 
                  sx={{ 
                    background: 'rgba(18, 18, 18, 0.7)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    height: '100%',
                  }}
                >
                  <CardMedia
                    component="img"
                    image={resultImage}
                    alt="Detection Result"
                    sx={{ height: 400, objectFit: 'contain' }}
                  />
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 300 }}>
                      DETECTION RESULT
                    </Typography>
                    {detections.length > 0 ? (
                      <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                        <LocalFireDepartmentIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
                        <Typography variant="body1" sx={{ color: theme.palette.secondary.main }}>
                          {detections.length} fire {detections.length === 1 ? 'instance' : 'instances'} detected
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body1" sx={{ color: '#CCCCCC', mt: 1 }}>
                        No fire detected
                      </Typography>
                    )}
                  </Box>
                </Card>
              </Grid>
            )}
          </Grid>
        )}
      </Container>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          textAlign: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          mt: 4,
        }}
      >
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          © {new Date().getFullYear()} Ember Eye Fire Detection System
        </Typography>
      </Box>
    </Box>
  );
};

export default EmberEyeFireDetection; 