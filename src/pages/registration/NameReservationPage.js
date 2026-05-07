import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  Grid,
  Paper
} from '@mui/material';
import { businessAPI } from '../../services/api';

const NameReservationPage = () => {
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState('');
  const [alternativeNames, setAlternativeNames] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await businessAPI.reserveName({
        business_name: businessName,
        alternative_names: alternativeNames.split(',').map(n => n.trim()).filter(n => n)
      });
      
      setSuccess(`Business name "${businessName}" reserved successfully!`);
      
      // Store reservation info for next step
      localStorage.setItem('reservation_code', response.data.reservation_code);
      localStorage.setItem('business_name', businessName);
      
      // Navigate to next step after 2 seconds
      setTimeout(() => {
        navigate('/registration/business-info');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reserve business name');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Step 1: Reserve Business Name
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" paragraph>
          Reserve your business name. This reservation is valid for 30 days.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Proposed Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                placeholder="Enter your desired business name"
                helperText="This name will be checked for availability"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Alternative Names"
                value={alternativeNames}
                onChange={(e) => setAlternativeNames(e.target.value)}
                placeholder="Name 1, Name 2, Name 3"
                helperText="Enter alternative names separated by commas"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                size="large"
              >
                {loading ? 'Checking Availability...' : 'Reserve Name'}
              </Button>
            </Grid>
          </Grid>
        </form>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Note: Name reservation is free and valid for 30 days
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default NameReservationPage;
