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
  InputAdornment,
  alpha,
  Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import PaymentIcon from '@mui/icons-material/Payment';
import VerifiedIcon from '@mui/icons-material/Verified';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
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
    const maxAttempts = 60;
    
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
            await performSearch();
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

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active':
      case 'approved':
        return <CheckCircleIcon sx={{ fontSize: 16 }} />;
      case 'suspended':
      case 'revoked':
        return <CancelIcon sx={{ fontSize: 16 }} />;
      default:
        return <WarningIcon sx={{ fontSize: 16 }} />;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(139,92,246,0.15) 0%, transparent 50%)',
          pointerEvents: 'none'
        }
      }}
    >
      <Container maxWidth="lg" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              p: 2,
              borderRadius: '50%',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(102,126,234,0.7)' },
                '70%': { transform: 'scale(1.05)', boxShadow: '0 0 0 20px rgba(102,126,234,0)' },
                '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(102,126,234,0)' }
              }
            }}
          >
            <SearchIcon sx={{ fontSize: 48, color: 'white' }} />
          </Box>
          <Typography 
            variant="h2" 
            sx={{ 
              color: 'white', 
              fontWeight: 800,
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              letterSpacing: '-0.02em',
              mb: 2,
              background: 'linear-gradient(135deg, #fff, #a78bfa)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Business Registry Search
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: alpha('#fff', 0.8),
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Search for registered businesses, verify registration status, and check compliance
          </Typography>
        </Box>

        {/* Search Panel */}
        <Paper
          elevation={0}
          sx={{
            mb: 5,
            p: 4,
            borderRadius: 4,
            background: alpha('#1a1a2e', 0.8),
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(139,92,246,0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: 'rgba(139,92,246,0.6)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }
          }}
        >
          <Tabs 
            value={tabValue} 
            onChange={(e, v) => setTabValue(v)} 
            sx={{ 
              mb: 4,
              '& .MuiTab-root': {
                color: alpha('#fff', 0.7),
                fontWeight: 600,
                '&.Mui-selected': {
                  color: '#a78bfa'
                }
              },
              '& .MuiTabs-indicator': {
                background: 'linear-gradient(90deg, #667eea, #764ba2)',
                height: 3
              }
            }}
          >
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: alpha('#fff', 0.05),
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: alpha('#a78bfa', 0.3)
                    },
                    '&:hover fieldset': {
                      borderColor: '#a78bfa'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#8b5cf6'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: alpha('#fff', 0.7),
                    '&.Mui-focused': {
                      color: '#a78bfa'
                    }
                  },
                  '& input': {
                    color: 'white'
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: alpha('#fff', 0.5) }} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSearch}
                disabled={loading}
                sx={{
                  height: 56,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 15px rgba(139,92,246,0.3)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(139,92,246,0.4)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Search ($1)'}
              </Button>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: alpha('#fff', 0.5), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <PaymentIcon sx={{ fontSize: 16 }} />
              Each search costs $1. Payment request sent to your Digital Liberia mobile app
            </Typography>
          </Box>
        </Paper>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              background: alpha('#ef4444', 0.1),
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(239,68,68,0.3)',
              '& .MuiAlert-message': { color: '#fca5a5' }
            }}
          >
            {error}
          </Alert>
        )}

        {results.length > 0 && (
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
              Found {results.length} Result{results.length !== 1 ? 's' : ''}
            </Typography>
            <Chip 
              label={`${results.length} Businesses`}
              sx={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                fontWeight: 600
              }}
            />
          </Box>
        )}

        <Grid container spacing={3}>
          {results.map((business, idx) => (
            <Grid item xs={12} key={idx}>
              <Card
                sx={{
                  background: alpha('#1a1a2e', 0.9),
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: '1px solid rgba(139,92,246,0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: 'rgba(139,92,246,0.5)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                        <Avatar sx={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                          <BusinessIcon />
                        </Avatar>
                        <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                          {business.business_name}
                        </Typography>
                      </Box>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ mb: 1.5 }}>
                            <Typography variant="caption" sx={{ color: alpha('#fff', 0.5), display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <ReceiptIcon sx={{ fontSize: 14 }} />
                              REGISTRATION NUMBER
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#a78bfa', fontWeight: 600, fontFamily: 'monospace' }}>
                              {business.registration_number}
                            </Typography>
                          </Box>
                        </Grid>
                        {business.tax_id && (
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ mb: 1.5 }}>
                              <Typography variant="caption" sx={{ color: alpha('#fff', 0.5), display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <PaymentIcon sx={{ fontSize: 14 }} />
                                TAX ID (TIN)
                              </Typography>
                              <Typography variant="body1" sx={{ color: '#a78bfa', fontWeight: 600, fontFamily: 'monospace' }}>
                                {business.tax_id}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                        <Grid item xs={12} sm={6}>
                          <Box>
                            <Typography variant="caption" sx={{ color: alpha('#fff', 0.5), display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <CalendarTodayIcon sx={{ fontSize: 14 }} />
                              REGISTERED DATE
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'white' }}>
                              {business.date_registered ? new Date(business.date_registered).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              }) : 'N/A'}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box>
                            <Typography variant="caption" sx={{ color: alpha('#fff', 0.5), display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <CategoryIcon sx={{ fontSize: 14 }} />
                              BUSINESS TYPE
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'white' }}>
                              {business.business_type || 'Not specified'}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                    
                    <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                        <Chip
                          icon={getStatusIcon(business.registration_status)}
                          label={business.registration_status?.toUpperCase() || 'PENDING'}
                          color={getStatusColor(business.registration_status)}
                          size="medium"
                          sx={{ fontWeight: 600, fontSize: '0.85rem' }}
                        />
                        {business.is_blacklisted && (
                          <Chip
                            icon={<WarningIcon />}
                            label="BLACKLISTED"
                            color="error"
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        )}
                        {business.registration_status === 'active' && (
                          <Chip
                            icon={<VerifiedIcon />}
                            label="VERIFIED"
                            color="success"
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {results.length === 0 && searchQuery && !loading && !error && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Box sx={{ width: 80, height: 80, borderRadius: '50%', background: alpha('#a78bfa', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <SearchIcon sx={{ fontSize: 40, color: alpha('#fff', 0.3) }} />
            </Box>
            <Typography variant="h6" sx={{ color: alpha('#fff', 0.5) }}>
              No businesses found matching your search criteria
            </Typography>
            <Typography variant="body2" sx={{ color: alpha('#fff', 0.3), mt: 1 }}>
              Try different keywords or check the spelling
            </Typography>
          </Box>
        )}
      </Container>

      {/* Modern Payment Modal */}
      <Dialog 
        open={paymentModalOpen} 
        onClose={handleClosePaymentModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(15,15,25,0.98), rgba(10,10,20,0.98))',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: '1px solid rgba(139,92,246,0.3)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 4, pb: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              border: '2px solid rgba(16,185,129,0.5)'
            }}
          >
            <PaymentIcon sx={{ fontSize: 40, color: '#10b981' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', mb: 1 }}>
            $1.00
          </Typography>
          <Typography variant="body1" sx={{ color: alpha('#fff', 0.7) }}>
            Search Fee
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          {paymentStatus === 'idle' && (
            <>
              <Box sx={{ 
                mb: 3, 
                p: 2, 
                borderRadius: 2, 
                background: alpha('#a78bfa', 0.1),
                border: '1px solid rgba(139,92,246,0.2)'
              }}>
                <Typography variant="caption" sx={{ color: alpha('#fff', 0.5), display: 'block', mb: 0.5 }}>
                  SEARCHING FOR
                </Typography>
                <Typography variant="body1" sx={{ color: '#a78bfa', fontWeight: 600 }}>
                  "{searchQuery}"
                </Typography>
                <Typography variant="caption" sx={{ color: alpha('#fff', 0.4), display: 'block', mt: 0.5 }}>
                  Type: {searchTypes[tabValue]}
                </Typography>
              </Box>
              
              <MuiTextField
                fullWidth
                label="DSSN (Digital Social Security Number)"
                value={dssn}
                onChange={(e) => setDssn(e.target.value)}
                placeholder="Enter your DSSN"
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    background: alpha('#fff', 0.05),
                    borderRadius: 2,
                    '& fieldset': { borderColor: alpha('#a78bfa', 0.3) },
                    '&:hover fieldset': { borderColor: '#a78bfa' }
                  },
                  '& .MuiInputLabel-root': { color: alpha('#fff', 0.7) },
                  '& input': { color: 'white' }
                }}
              />
              
              <Typography variant="caption" sx={{ color: alpha('#fff', 0.4), display: 'block', textAlign: 'center' }}>
                A payment request will be sent to your Digital Liberia mobile app
              </Typography>
            </>
          )}
          
          {paymentStatus === 'processing' && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#8b5cf6', mb: 3, width: '60px !important', height: '60px !important' }} />
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Processing Payment
              </Typography>
              <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                {paymentMessage}
              </Typography>
              <Box sx={{ mt: 3, p: 2, borderRadius: 2, background: alpha('#8b5cf6', 0.1) }}>
                <Typography variant="caption" sx={{ color: alpha('#fff', 0.5) }}>
                  Please check your mobile device and approve the payment
                </Typography>
              </Box>
            </Box>
          )}
          
          {paymentStatus === 'completed' && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.2))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  animation: 'scaleUp 0.5s ease-out',
                  '@keyframes scaleUp': {
                    '0%': { transform: 'scale(0)' },
                    '100%': { transform: 'scale(1)' }
                  }
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 48, color: '#10b981' }} />
              </Box>
              <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 700, mb: 1 }}>
                Payment Successful!
              </Typography>
              <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                {paymentMessage}
              </Typography>
            </Box>
          )}
          
          {paymentStatus === 'error' && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(220,38,38,0.2))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}
              >
                <WarningIcon sx={{ fontSize: 48, color: '#ef4444' }} />
              </Box>
              <Typography variant="h6" sx={{ color: '#ef4444', fontWeight: 700, mb: 1 }}>
                Payment Failed
              </Typography>
              <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                {paymentMessage}
              </Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {paymentStatus === 'idle' && (
            <>
              <Button 
                onClick={handleClosePaymentModal} 
                sx={{ 
                  color: alpha('#fff', 0.6),
                  '&:hover': { background: alpha('#fff', 0.05) }
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handlePaymentConfirmation}
                variant="contained"
                disabled={!dssn.trim()}
                sx={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  px: 4,
                  '&:hover': { 
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(16,185,129,0.4)'
                  },
                  transition: 'all 0.3s ease'
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
              fullWidth
              sx={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                '&:hover': { transform: 'translateY(-2px)' }
              }}
            >
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SearchPage;
