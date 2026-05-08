import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Tabs,
  Tab,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField as MuiTextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import PaymentIcon from '@mui/icons-material/Payment';
import { publicAPI } from '../../services/api';

const SearchPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  
  // Payment modal states
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [dssn, setDssn] = useState('');
  const [paymentRequestId, setPaymentRequestId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [paymentMessage, setPaymentMessage] = useState('');
  let paymentPollingInterval = null;

  const searchTypes = ['Business Name', 'Registration Number', 'Tax ID (TIN)', 'Owner Name'];

  // Get API base URL from environment or use default
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.liberiabusinessregistry.com/api';

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    // Open payment modal first
    setPaymentModalOpen(true);
  };

  const handlePaymentConfirmation = async () => {
    if (!dssn.trim()) {
      setPaymentMessage('Please enter your DSSN');
      return;
    }

    setPaymentStatus('processing');
    setPaymentMessage('Creating payment request...');

    try {
      // Create payment request through your own backend
      const response = await fetch(`${API_BASE_URL}/payments/create-search-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dssn: dssn,
          amount: 1.00,
          currency: 'USD',
          purpose: 'business_search',
          search_query: searchQuery,
          search_type: searchTypes[tabValue].toLowerCase().replace(/ /g, '_')
        })
      });

      const result = await response.json();

      if (result.success) {
        setPaymentRequestId(result.data.paymentRequestId);
        setPaymentMessage('Payment request sent to your mobile device. Please approve on Digital Liberia app...');
        
        // Start polling for payment status
        startPollingPaymentStatus(result.data.paymentRequestId);
      } else {
        setPaymentStatus('error');
        setPaymentMessage(result.message || 'Payment request failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setPaymentStatus('error');
      setPaymentMessage('Failed to create payment request. Please try again.');
    }
  };

  const startPollingPaymentStatus = (requestId) => {
    let attempts = 0;
    const maxAttempts = 60; // 60 seconds timeout
    
    if (paymentPollingInterval) clearInterval(paymentPollingInterval);
    
    paymentPollingInterval = setInterval(async () => {
      attempts++;
      
      try {
        const statusResponse = await fetch(`${API_BASE_URL}/payments/payment-request-status/${requestId}`);
        const statusResult = await statusResponse.json();
        
        if (statusResult.success) {
          const status = statusResult.data.status;
          
          if (status === 'completed') {
            clearInterval(paymentPollingInterval);
            setPaymentStatus('completed');
            setPaymentMessage('Payment successful! Performing search...');
            
            // Execute the actual search after payment
            await performSearch();
            
            // Close modal after 1.5 seconds
            setTimeout(() => {
              handleClosePaymentModal();
            }, 1500);
          } else if (status === 'denied') {
            clearInterval(paymentPollingInterval);
            setPaymentStatus('error');
            setPaymentMessage('Payment was denied on your mobile device.');
          } else if (status === 'expired') {
            clearInterval(paymentPollingInterval);
            setPaymentStatus('error');
            setPaymentMessage('Payment request expired. Please try again.');
          }
        }
      } catch (err) {
        console.error('Status check error:', err);
      }
      
      if (attempts >= maxAttempts) {
        clearInterval(paymentPollingInterval);
        setPaymentStatus('error');
        setPaymentMessage('Payment timeout. Please try again.');
      }
    }, 1000);
  };

  const performSearch = async () => {
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const type = searchTypes[tabValue].toLowerCase().replace(/ /g, '_');
      const response = await publicAPI.search(searchQuery, type);
      setResults(response.data.data);
      if (response.data.data.length === 0) {
        setError('No businesses found matching your search criteria');
      }
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePaymentModal = () => {
    if (paymentPollingInterval) {
      clearInterval(paymentPollingInterval);
    }
    setPaymentModalOpen(false);
    setDssn('');
    setPaymentRequestId(null);
    setPaymentStatus('idle');
    setPaymentMessage('');
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'success',
      pending: 'warning',
      suspended: 'error',
      expired: 'default',
      revoked: 'error',
      approved: 'success'
    };
    return colors[status] || 'info';
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Business Registry Search
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" paragraph>
          Search for registered businesses, verify registration status, and check compliance
        </Typography>

        <Paper elevation={3} sx={{ mb: 4, p: 3 }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
            {searchTypes.map((type, idx) => (
              <Tab key={idx} label={type} />
            ))}
          </Tabs>

          <Grid container spacing={2}>
            <Grid item xs={12} md={9}>
              <TextField
                fullWidth
                label={`Enter ${searchTypes[tabValue]}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSearch}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
              >
                Search ($1)
              </Button>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="textSecondary">
              <PaymentIcon sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.5 }} />
              Each search costs $1. You will receive a notification on your Digital Liberia mobile app to approve the payment.
            </Typography>
          </Box>
        </Paper>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {results.length > 0 && (
          <Typography variant="h6" sx={{ mb: 2 }}>
            Found {results.length} result(s)
          </Typography>
        )}

        <Grid container spacing={3}>
          {results.map((business, idx) => (
            <Grid item xs={12} key={idx}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <BusinessIcon color="primary" />
                        <Typography variant="h5">
                          {business.business_name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Registration Number: {business.registration_number}
                      </Typography>
                      {business.tax_id && (
                        <Typography variant="body2" color="textSecondary">
                          TIN: {business.tax_id}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
                      <Chip
                        label={business.registration_status?.toUpperCase() || 'PENDING'}
                        color={getStatusColor(business.registration_status)}
                        size="medium"
                      />
                      {business.is_blacklisted && (
                        <Chip
                          label="BLACKLISTED"
                          color="error"
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2">
                        Registered: {business.date_registered ? new Date(business.date_registered).toLocaleDateString() : 'N/A'}
                      </Typography>
                      <Typography variant="body2">
                        Business Type: {business.business_type || 'Not specified'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {results.length === 0 && searchQuery && !loading && !error && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="textSecondary">
              No businesses found matching your search criteria
            </Typography>
          </Box>
        )}
      </Container>

      {/* Payment Modal */}
      <Dialog 
        open={paymentModalOpen} 
        onClose={handleClosePaymentModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(15,15,25,0.98), rgba(10,10,20,0.98))',
            backdropFilter: 'blur(20px)',
            borderRadius: '32px',
            border: '1px solid rgba(16,185,129,0.3)',
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <PaymentIcon sx={{ fontSize: 48, color: '#10b981', mb: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
            Search Fee: $1.00
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 1 }}>
            Pay via Digital Liberia Mobile App
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          {paymentStatus === 'idle' && (
            <>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, textAlign: 'center' }}>
                You are searching for: <strong>"{searchQuery}"</strong>
              </Typography>
              <MuiTextField
                fullWidth
                label="DSSN (Digital Social Security Number)"
                value={dssn}
                onChange={(e) => setDssn(e.target.value)}
                placeholder="Enter your DSSN"
                sx={{ mb: 2 }}
                InputProps={{
                  sx: {
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    '& input': { color: 'white' },
                    '& label': { color: 'rgba(255,255,255,0.6)' }
                  }
                }}
              />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', textAlign: 'center' }}>
                A payment request will be sent to your Digital Liberia mobile app for approval
              </Typography>
            </>
          )}
          
          {paymentStatus === 'processing' && (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <CircularProgress sx={{ color: '#8b5cf6', mb: 2 }} />
              <Typography variant="body1" sx={{ color: 'white', mb: 1 }}>
                {paymentMessage}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                Please check your mobile device and approve the payment
              </Typography>
            </Box>
          )}
          
          {paymentStatus === 'completed' && (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Box sx={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <PaymentIcon sx={{ fontSize: 32, color: '#10b981' }} />
              </Box>
              <Typography variant="body1" sx={{ color: '#10b981', fontWeight: 600, mb: 1 }}>
                Payment Successful!
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {paymentMessage}
              </Typography>
            </Box>
          )}
          
          {paymentStatus === 'error' && (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Box sx={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <PaymentIcon sx={{ fontSize: 32, color: '#ef4444' }} />
              </Box>
              <Typography variant="body1" sx={{ color: '#ef4444', fontWeight: 600, mb: 1 }}>
                Payment Failed
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {paymentMessage}
              </Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {paymentStatus === 'idle' && (
            <>
              <Button onClick={handleClosePaymentModal} sx={{ color: 'rgba(255,255,255,0.6)' }}>
                Cancel
              </Button>
              <Button 
                onClick={handlePaymentConfirmation}
                variant="contained"
                disabled={!dssn.trim()}
                sx={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  '&:hover': { transform: 'translateY(-2px)' }
                }}
              >
                Pay $1 & Search
              </Button>
            </>
          )}
          
          {(paymentStatus === 'completed' || paymentStatus === 'error') && (
            <Button 
              onClick={handleClosePaymentModal}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                '&:hover': { transform: 'translateY(-2px)' }
              }}
            >
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SearchPage;
