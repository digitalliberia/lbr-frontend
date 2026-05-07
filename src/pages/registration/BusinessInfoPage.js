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
  MenuItem,
  Paper,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { businessAPI } from '../../services/api';

const BusinessInfoPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    business_type: '',
    sector: '',
    physical_address: '',
    county: '',
    gps_coordinates: '',
    contact_phone: '',
    contact_email: '',
    tax_id: ''
  });

  const businessTypes = [
    'Sole Proprietorship',
    'Partnership',
    'Limited Liability Company (LLC)',
    'Corporation',
    'Non-Profit Organization',
    'Cooperative'
  ];

  const sectors = [
    'Agriculture',
    'Manufacturing',
    'Services',
    'Technology',
    'Trade',
    'Construction',
    'Healthcare',
    'Education',
    'Finance',
    'Transportation'
  ];

  const counties = [
    'Montserrado',
    'Margibi',
    'Bong',
    'Nimba',
    'Grand Bassa',
    'Lofa',
    'Cape Mount',
    'Bomi',
    'Grand Gedeh',
    'River Cess'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const reservation_code = localStorage.getItem('reservation_code');
    if (!reservation_code) {
      setError('Please reserve a business name first');
      setLoading(false);
      return;
    }

    try {
      const response = await businessAPI.submitApplication({
        ...formData,
        reservation_code
      });
      
      localStorage.setItem('registration_number', response.data.registration_number);
      navigate('/registration/complete');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Step 2: Business Information
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" paragraph>
          Provide detailed information about your business
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Business Type"
                name="business_type"
                value={formData.business_type}
                onChange={handleChange}
                required
              >
                {businessTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Sector"
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                required
              >
                {sectors.map(sector => (
                  <MenuItem key={sector} value={sector}>{sector}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Physical Address"
                name="physical_address"
                value={formData.physical_address}
                onChange={handleChange}
                required
                multiline
                rows={2}
                placeholder="Street address, building name, etc."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="County"
                name="county"
                value={formData.county}
                onChange={handleChange}
                required
              >
                {counties.map(county => (
                  <MenuItem key={county} value={county}>{county}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="GPS Coordinates"
                name="gps_coordinates"
                value={formData.gps_coordinates}
                onChange={handleChange}
                placeholder="6.3131° N, 10.8014° W"
                helperText="Optional - Latitude, Longitude"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Phone"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                required
                placeholder="+231 XXX XXX XXX"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Email"
                name="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={handleChange}
                required
                placeholder="business@example.com"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tax Identification Number (TIN)"
                name="tax_id"
                value={formData.tax_id}
                onChange={handleChange}
                required
                placeholder="Enter your TIN from LRA"
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
                {loading ? 'Submitting Application...' : 'Submit Application'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default BusinessInfoPage;
