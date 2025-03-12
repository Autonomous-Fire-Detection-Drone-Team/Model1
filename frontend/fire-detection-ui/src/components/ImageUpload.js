import React, { useState } from 'react';
import axios from 'axios';
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
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const API_URL = 'http://localhost:5001';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detections, setDetections] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResultImage(null);
      setError(null);
      setDetections([]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(`${API_URL}/api/detect`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResultImage(`${API_URL}${response.data.result_image}`);
      setDetections(response.data.detections);
      setLoading(false);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Error processing image. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Fire Detection - Image Upload
        </Typography>
        <Typography variant="body1" paragraph align="center">
          Upload an image to detect fire using our YOLOv5 model
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="contained-button-file"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="contained-button-file">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 2 }}
              >
                Select Image
              </Button>
            </label>
            {preview && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={loading}
                sx={{ mt: 2, mb: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Detect Fire'}
              </Button>
            )}
            {error && (
              <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                {error}
              </Alert>
            )}
          </Box>
        </Paper>

        {(preview || resultImage) && (
          <Grid container spacing={2}>
            {preview && (
              <Grid item xs={12} md={resultImage ? 6 : 12}>
                <Card>
                  <CardMedia
                    component="img"
                    image={preview}
                    alt="Preview"
                    sx={{ maxHeight: '500px', objectFit: 'contain' }}
                  />
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6">Original Image</Typography>
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

export default ImageUpload; 