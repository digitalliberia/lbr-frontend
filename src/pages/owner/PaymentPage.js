import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import { paymentAPI, businessAPI } from '../../services/api';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';

const PaymentPage = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');

  useEffect(() => {
    fetchPaymentDetails();
  }, [businessId]);

  const fetchPaymentDetails = async () => {
    try {
      // Fetch business details
      const businesses = await businessAPI.getMyBusinesses();
      const found = businesses.data.data.find(b => b.id === parseInt(businessId));
      setBusiness(found);
      
      // For now, show sample payment info
      setPayment({
        amount: 150.00,
        registration_fee: 50.00,
        processing_fee: 25.00,
        annual_tax: 75.00,
        invoice_number: `INV-${Date.now()}`,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });
    } catch (err) {
      setError('Failed to load payment details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    setError('');
    
    try {
      const response = await paymentAPI.initiatePayment(businessId);
      setPaymentUrl(response.data.payment_url);
      
      // In a real implementation, this would redirect to LibPay
      window.open(response.data.payment_url, '_blank');
      
      // Show success message
      setTimeout(() => {
        navigate('/owner/applications');
      }, 3000);
    } catch (err) {
      setError('Payment initiation failed. Please try again.');
      console.error(err);
    } finally {
      setProcessing(false);
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
        <Typography variant="h4" gutterBottom align="center">
          Payment Details
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" paragraph>
          Complete your payment to finalize business registration
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {business && (
          <Card sx={{ mb: 3 }}>
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
              </Grid>
            </CardContent>
          </Card>
        )}

        <Card sx={{ mb: 3, bgcolor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Fee Breakdown</Typography>
            <Box sx={{ mb: 2 }}>
              <Grid container justifyContent="space-between">
                <Typography>Registration Fee:</Typography>
                <Typography>${payment?.registration_fee?.toFixed(2)}</Typography>
              </Grid>
              <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
                <Typography>Processing Fee:</Typography>
                <Typography>${payment?.processing_fee?.toFixed(2)}</Typography>
              </Grid>
              <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
                <Typography>Annual Tax:</Typography>
                <Typography>${payment?.annual_tax?.toFixed(2)}</Typography>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Grid container justifyContent="space-between">
                <Typography variant="h6">Total Amount:</Typography>
                <Typography variant="h6" color="primary">${payment?.amount?.toFixed(2)}</Typography>
              </Grid>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="body2" color="textSecondary">Invoice Number</Typography>
            <Typography variant="h6" gutterBottom>{payment?.invoice_number}</Typography>
            
            <Typography variant="body2" color="textSecondary">Due Date</Typography>
            <Typography variant="body1" gutterBottom>
              {payment?.due_date?.toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>

        <Box display="flex" gap={2} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            startIcon={<PaymentIcon />}
            onClick={handlePayment}
            disabled={processing}
          >
            {processing ? 'Processing...' : 'Pay with LibPay'}
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/owner/applications')}
          >
            Cancel
          </Button>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            You will be redirected to LibPay to complete your payment securely.
            After payment, your certificate will be generated automatically.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentPage;
