import React, { useState } from 'react';
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
  Chip,
  CircularProgress,
  alpha,
  Paper
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import BusinessIcon from '@mui/icons-material/Business';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { publicAPI } from '../../services/api';

const VerifyPage = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!verificationCode.trim()) return;
    
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const response = await publicAPI.verify(verificationCode);
      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Certificate not found.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 8,
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeIn 0.6s ease-out',
        '@keyframes fadeIn': {
          from: { opacity: 0 },
          to: { opacity: 1 }
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }
      }}
    >
      <Container maxWidth="lg">
        <Card
          sx={{
            backdropFilter: 'blur(10px)',
            background: alpha('#fff', 0.95),
            borderRadius: 6,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.2) inset',
            overflow: 'hidden',
            animation: 'slideUp 0.6s ease-out',
            '@keyframes slideUp': {
              from: { 
                opacity: 0,
                transform: 'translateY(30px)'
              },
              to: { 
                opacity: 1,
                transform: 'translateY(0)'
              }
            }
          }}
        >
          {/* Modern Header with Gradient */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              py: 6,
              px: 4,
              textAlign: 'center',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -20,
                left: 0,
                right: 0,
                height: 40,
                background: 'inherit',
                filter: 'blur(20px)',
                opacity: 0.5
              }
            }}
          >
            <Box
              sx={{
                animation: 'scaleIn 0.4s ease-out',
                '@keyframes scaleIn': {
                  from: { 
                    transform: 'scale(0)'
                  },
                  to: { 
                    transform: 'scale(1)'
                  }
                }
              }}
            >
              <VerifiedIcon sx={{ fontSize: 80, color: 'white', mb: 2, filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.2))' }} />
            </Box>
            <Typography 
              variant="h2" 
              sx={{ 
                color: 'white', 
                fontWeight: 800,
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                letterSpacing: '-0.02em',
                mb: 1,
                fontSize: { xs: '2rem', sm: '3rem', md: '3.75rem' }
              }}
            >
              Certificate Verification
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: alpha('#fff', 0.9),
                fontWeight: 500
              }}
            >
              Verify business authenticity instantly
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {/* Search Section */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 4,
                background: alpha('#667eea', 0.05),
                border: `1px solid ${alpha('#667eea', 0.2)}`
              }}
            >
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexDirection: { xs: 'column', sm: 'row' } }}>
                <Box sx={{ flex: 1, width: '100%' }}>
                  <TextField
                    fullWidth
                    label="Verification Code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="QR Code, Registration Number, or Certificate Number"
                    onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        background: 'white',
                        '&:hover fieldset': {
                          borderColor: '#667eea'
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: <QrCodeScannerIcon sx={{ mr: 1, color: '#667eea' }} />
                    }}
                  />
                </Box>
                <Button
                  variant="contained"
                  onClick={handleVerify}
                  disabled={loading}
                  sx={{
                    minWidth: { xs: '100%', sm: 140 },
                    height: 56,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 15px rgba(102,126,234,0.4)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(102,126,234,0.5)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify Now'}
                </Button>
              </Box>
            </Paper>

            {error && (
              <Box
                sx={{
                  animation: 'slideInLeft 0.4s ease-out',
                  '@keyframes slideInLeft': {
                    from: { 
                      opacity: 0,
                      transform: 'translateX(-20px)'
                    },
                    to: { 
                      opacity: 1,
                      transform: 'translateX(0)'
                    }
                  }
                }}
              >
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 3,
                    boxShadow: '0 4px 12px rgba(211,47,47,0.2)'
                  }}
                >
                  {error}
                </Alert>
              </Box>
            )}

            {result && (
              <Box
                sx={{
                  animation: 'slideUp 0.5s ease-out',
                  '@keyframes slideUp': {
                    from: { 
                      opacity: 0,
                      transform: 'translateY(20px)'
                    },
                    to: { 
                      opacity: 1,
                      transform: 'translateY(0)'
                    }
                  }
                }}
              >
                {/* Success Banner */}
                <Alert 
                  severity="success" 
                  icon={<VerifiedIcon />} 
                  sx={{ 
                    mb: 4, 
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                    color: 'white',
                    '& .MuiAlert-icon': { color: 'white' },
                    '& .MuiAlert-message': { fontWeight: 600 }
                  }}
                >
                  ✓ CERTIFICATE IS VALID & AUTHENTIC
                </Alert>
                
                {/* Details Card */}
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: `1px solid ${alpha('#667eea', 0.2)}`,
                    background: 'white'
                  }}
                >
                  {/* Header */}
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                      px: 4,
                      py: 3,
                      borderBottom: `3px solid #667eea`
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#2d3748' }}>
                      Certificate Details
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4a5568', mt: 0.5 }}>
                      Verified business information
                    </Typography>
                  </Box>

                  {/* Content */}
                  <Box sx={{ p: 4 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            background: alpha('#667eea', 0.05),
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.02)',
                              boxShadow: '0 4px 12px rgba(102,126,234,0.15)'
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <BusinessIcon sx={{ color: '#667eea', mr: 1, fontSize: 20 }} />
                            <Typography variant="caption" sx={{ color: '#667eea', fontWeight: 600, letterSpacing: 1 }}>
                              BUSINESS NAME
                            </Typography>
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748' }}>
                            {result.business_name}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            background: alpha('#667eea', 0.05),
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.02)',
                              boxShadow: '0 4px 12px rgba(102,126,234,0.15)'
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <ConfirmationNumberIcon sx={{ color: '#667eea', mr: 1, fontSize: 20 }} />
                            <Typography variant="caption" sx={{ color: '#667eea', fontWeight: 600, letterSpacing: 1 }}>
                              REGISTRATION NUMBER
                            </Typography>
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748', fontFamily: 'monospace' }}>
                            {result.registration_number}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            background: alpha('#667eea', 0.05),
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.02)',
                              boxShadow: '0 4px 12px rgba(102,126,234,0.15)'
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <ReceiptIcon sx={{ color: '#667eea', mr: 1, fontSize: 20 }} />
                            <Typography variant="caption" sx={{ color: '#667eea', fontWeight: 600, letterSpacing: 1 }}>
                              CERTIFICATE NUMBER
                            </Typography>
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748', fontFamily: 'monospace' }}>
                            {result.certificate_number}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            background: alpha('#667eea', 0.05),
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.02)',
                              boxShadow: '0 4px 12px rgba(102,126,234,0.15)'
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <BusinessIcon sx={{ color: '#667eea', mr: 1, fontSize: 20 }} />
                            <Typography variant="caption" sx={{ color: '#667eea', fontWeight: 600, letterSpacing: 1 }}>
                              TAX ID (TIN)
                            </Typography>
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748', fontFamily: 'monospace' }}>
                            {result.tax_id || 'N/A'}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            background: alpha('#667eea', 0.05),
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.02)',
                              boxShadow: '0 4px 12px rgba(102,126,234,0.15)'
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarTodayIcon sx={{ color: '#667eea', mr: 1, fontSize: 20 }} />
                            <Typography variant="caption" sx={{ color: '#667eea', fontWeight: 600, letterSpacing: 1 }}>
                              ISSUE DATE
                            </Typography>
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748' }}>
                            {new Date(result.issued_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                          <Chip 
                            icon={<CheckCircleIcon />}
                            label="VERIFIED CERTIFICATE" 
                            color="success"
                            sx={{
                              px: 2,
                              py: 2.5,
                              fontSize: '0.9rem',
                              fontWeight: 700,
                              borderRadius: 2,
                              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                              color: 'white',
                              '& .MuiChip-icon': { color: 'white' }
                            }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default VerifyPage;
