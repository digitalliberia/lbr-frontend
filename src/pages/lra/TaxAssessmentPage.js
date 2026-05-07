import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  MenuItem
} from '@mui/material';
import { lraAPI, businessAPI } from '../../services/api';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';

const TaxAssessmentPage = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    business_category: '',
    expected_revenue: '',
    tax_class: 'Standard',
    registration_fee: 50,
    processing_fee: 25,
    annual_tax: 75,
    sector_fees: 0
  });

  const businessCategories = [
    'Small Enterprise',
    'Medium Enterprise',
    'Large Enterprise',
    'Micro Enterprise'
  ];

  const taxClasses = ['Standard', 'Reduced', 'Zero Rated', 'Exempt'];

  useEffect(() => {
    fetchBusinessDetails();
  }, [businessId]);

  const fetchBusinessDetails = async () => {
    try {
      // Fetch business details from API
      const response = await businessAPI.getMyBusinesses();
      const found = response.data.data.find(b => b.id === parseInt(businessId));
      setBusiness(found);
      
      // Auto-populate based on business type
      if (found) {
        let suggestedFee = 50;
        if (found.business_type === 'Corporation') suggestedFee = 100;
        if (found.business_type === 'Limited Liability Company (LLC)') suggestedFee = 75;
        
        setFormData(prev => ({
          ...prev,
          business_category: found.business_type || 'Small Enterprise',
          registration_fee: suggestedFee
        }));
      }
    } catch (error) {
      console.error('Error fetching business:', error);
      setError('Failed to load business details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateTotal = () => {
    return Number(formData.registration_fee) + 
           Number(formData.processing_fee) + 
           Number(formData.annual_tax) + 
           Number(formData.sector_fees);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      await lraAPI.submitAssessment({
        business_id: businessId,
        ...formData,
        total_amount: calculateTotal()
      });
      // Navigate back to LRA dashboard on success
      setTimeout(() => {
        navigate('/lra');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit assessment');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error && !business) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate('/lra')} sx={{ mt: 2 }}>Back to Dashboard</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Tax Assessment
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" paragraph>
          Calculate and assign taxes for business registration
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {business && (
          <Card sx={{ mb: 3, bgcolor: '#f0f7ff' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Business Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="textSecondary">Business Name</Typography>
                  <Typography variant="body1"><strong>{business.business_name}</strong></Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="textSecondary">Registration Number</Typography>
                  <Typography variant="body1"><strong>{business.registration_number}</strong></Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="textSecondary">Business Type</Typography>
                  <Typography>{business.business_type || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="textSecondary">Sector</Typography>
                  <Typography>{business.sector || 'N/A'}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Business Category"
                name="business_category"
                value={formData.business_category}
                onChange={handleChange}
                required
              >
                {businessCategories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Expected Annual Revenue (USD)"
                name="expected_revenue"
                type="number"
                value={formData.expected_revenue}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: <AttachMoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Tax Class"
                name="tax_class"
                value={formData.tax_class}
                onChange={handleChange}
                required
              >
                {taxClasses.map(tc => (
                  <MenuItem key={tc} value={tc}>{tc}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Registration Fee (USD)"
                name="registration_fee"
                type="number"
                value={formData.registration_fee}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Processing Fee (USD)"
                name="processing_fee"
                type="number"
                value={formData.processing_fee}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Annual Tax (USD)"
                name="annual_tax"
                type="number"
                value={formData.annual_tax}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sector Fees (USD)"
                name="sector_fees"
                type="number"
                value={formData.sector_fees}
                onChange={handleChange}
                helperText="Additional fees specific to business sector"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Card sx={{ bgcolor: '#e8f5e9' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    <ReceiptIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Total Amount Due
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Includes all fees and taxes
                  </Typography>
                </Box>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  ${calculateTotal().toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Box display="flex" gap={2} sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              size="large"
              fullWidth
            >
              {submitting ? 'Submitting Assessment...' : 'Submit Tax Assessment'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/lra')}
              size="large"
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default TaxAssessmentPage;
