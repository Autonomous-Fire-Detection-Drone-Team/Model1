import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import VideocamIcon from '@mui/icons-material/Videocam';
import InfoIcon from '@mui/icons-material/Info';

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          YOLOv5 Fire Detection
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          A powerful deep learning system for detecting fire in images and video streams
        </Typography>
        <Box sx={{ mt: 4, mb: 6 }}>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/upload"
            startIcon={<UploadFileIcon />}
            sx={{ mx: 1, mb: 2 }}
          >
            Upload Image
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={RouterLink}
            to="/webcam"
            startIcon={<VideocamIcon />}
            sx={{ mx: 1, mb: 2 }}
          >
            Use Webcam
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="img"
              height="200"
              image="/placeholder-fire.jpg"
              alt="Fire detection"
              sx={{ objectFit: 'cover', bgcolor: 'grey.300' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2">
                Upload Images
              </Typography>
              <Typography>
                Upload your own images to detect fire. Our model will analyze the image and highlight any fire detected.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={RouterLink} to="/upload">
                Try it
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="img"
              height="200"
              image="/placeholder-webcam.jpg"
              alt="Webcam detection"
              sx={{ objectFit: 'cover', bgcolor: 'grey.300' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2">
                Webcam Detection
              </Typography>
              <Typography>
                Use your webcam for real-time fire detection. Perfect for monitoring or demonstration purposes.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={RouterLink} to="/webcam">
                Try it
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="img"
              height="200"
              image="/placeholder-about.jpg"
              alt="About the project"
              sx={{ objectFit: 'cover', bgcolor: 'grey.300' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2">
                About the Project
              </Typography>
              <Typography>
                Learn more about the YOLOv5 fire detection model, how it works, and the technology behind it.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={RouterLink} to="/about">
                Learn More
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home; 