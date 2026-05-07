import Dashboard from './Dashboard';
export default Dashboard;
EOF

# Create TaxAssessmentPage
cat > src/pages/lra/TaxAssessmentPage.js << 'EOF'
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
  Divider
} from '@mui/material';
import { lraAPI } from '../../services/api';

const TaxAssessmentPage = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    business_category: '',
    expected_revenue: '',
    tax_class: '',
    registration_fee: 50,
    processing_fee: 25,
    annual_tax: 75,
    sector_fees: 0
  });

  useEffect(() => {
    fetchBusiness();
  }, [businessId]);

  const fetchBusiness = async () => {
    setLoading(false);
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
    try {
      await lraAPI.submitAssessment({
        business_id: businessId,
        ...formData,
        total_amount: calculateTotal()
      });
      navigate('/lra');
    } catch (err) {
      setError('Failed to submit assessment');
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

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Tax Assessment</Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Business Category"
                name="business_category"
                value={formData.business_category}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Expected Annual Revenue"
                name="expected_revenue"
                type="number"
                value={formData.expected_revenue}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tax Class"
                name="tax_class"
                value={formData.tax_class}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Registration Fee"
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
                label="Processing Fee"
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
                label="Annual Tax"
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
                label="Sector Fees"
                name="sector_fees"
                type="number"
                value={formData.sector_fees}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Card sx={{ mt: 3, bgcolor: '#f5f5f5' }}>
            <CardContent>
              <Typography variant="h6">Total Amount Due</Typography>
              <Typography variant="h3" color="primary">
                ${calculateTotal().toFixed(2)}
              </Typography>
            </CardContent>
          </Card>

          <Box display="flex" gap={2} sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              size="large"
            >
              {submitting ? 'Submitting...' : 'Submit Assessment'}
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
