import React from 'react';
import { Typography, Box, Button, Grid, Card, CardContent, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import VerifiedIcon from '@mui/icons-material/Verified';

const HomePage = () => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
        LBR Business Registry System
      </Typography>
      <Typography variant="h6" align="center" color="textSecondary" paragraph sx={{ mb: 6 }}>
        Liberia's Official Business Registration and Verification Portal
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <SearchIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Search Business
              </Typography>
              <Typography color="textSecondary">
                Verify business registration status, check compliance, and access public records
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
              <Button component={Link} to="/search" variant="contained" size="large">
                Search Now
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <AppRegistrationIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Register Business
              </Typography>
              <Typography color="textSecondary">
                Start your business registration process online. Simple, fast, and secure
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
              <Button component={Link} to="/register" variant="contained" size="large">
                Register Now
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <VerifiedIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Verify Certificate
              </Typography>
              <Typography color="textSecondary">
                Verify business certificates using QR code or registration number
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
              <Button component={Link} to="/verify" variant="contained" size="large">
                Verify Now
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 8, textAlign: 'center', bgcolor: '#f5f5f5', p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Already have an account?
        </Typography>
        <Button component={Link} to="/login" variant="outlined" size="large" sx={{ mr: 2 }}>
          Login
        </Button>
        <Button component={Link} to="/register" variant="contained" size="large">
          Create Account
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
