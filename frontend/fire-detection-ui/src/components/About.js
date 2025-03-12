import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
} from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          About YOLOv5 Fire Detection
        </Typography>
        <Typography variant="body1" paragraph align="center">
          Learn more about our fire detection system and how it works
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Project Overview
          </Typography>
          <Typography variant="body1" paragraph>
            This fire detection system uses YOLOv5, a state-of-the-art object detection model, to identify fire and flames in images and video streams. The model has been trained on a dataset of fire images to accurately detect fire in various environments.
          </Typography>
          <Typography variant="body1" paragraph>
            The system can be used for early fire detection in surveillance systems, industrial safety monitoring, forest fire detection, and other applications where rapid fire detection is critical.
          </Typography>
        </Paper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  How It Works
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" paragraph>
                  Our fire detection system uses YOLOv5 (You Only Look Once), a real-time object detection algorithm that processes images in a single pass through a neural network.
                </Typography>
                <Typography variant="body1" paragraph>
                  The model has been trained on a dataset of fire images, allowing it to recognize patterns and features associated with fire and flames. When an image is uploaded or captured, the model analyzes it and identifies regions that contain fire, drawing bounding boxes around them.
                </Typography>
                <Typography variant="body1">
                  The system provides information about the confidence level of each detection, helping users understand the reliability of the results.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Technical Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" paragraph>
                  <strong>Model:</strong> YOLOv5s trained on a fire dataset
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Input Size:</strong> 640x640 pixels
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Backend:</strong> Flask API for model inference
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Frontend:</strong> React with Material UI
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Detection Confidence Threshold:</strong> 0.25
                </Typography>
                <Typography variant="body1">
                  <strong>Non-Maximum Suppression IoU Threshold:</strong> 0.45
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Applications
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image="/placeholder-surveillance.jpg"
                  alt="Surveillance"
                  sx={{ bgcolor: 'grey.300' }}
                />
                <CardContent>
                  <Typography variant="h6">Surveillance Systems</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Early fire detection in security camera feeds
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image="/placeholder-industrial.jpg"
                  alt="Industrial"
                  sx={{ bgcolor: 'grey.300' }}
                />
                <CardContent>
                  <Typography variant="h6">Industrial Safety</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monitoring industrial environments for fire hazards
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image="/placeholder-forest.jpg"
                  alt="Forest"
                  sx={{ bgcolor: 'grey.300' }}
                />
                <CardContent>
                  <Typography variant="h6">Forest Monitoring</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Early detection of wildfires in forest areas
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image="/placeholder-home.jpg"
                  alt="Home"
                  sx={{ bgcolor: 'grey.300' }}
                />
                <CardContent>
                  <Typography variant="h6">Home Safety</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Integration with smart home systems for fire detection
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default About; 