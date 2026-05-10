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
import { motion, AnimatePresence } from 'framer-motion';
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

  const MotionCard = motion(Card);
  const MotionBox = motion(Box);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 8,
        position: 'relative',
        overflow: 'hidden',
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
        <MotionCard
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{
            backdropFilter: 'blur(10px)',
            background: alpha('#fff', 0.95),
            borderRadius: 6,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.2) inset',
            overflow: 'hidden'
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
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <VerifiedIcon sx={{ fontSize: 80, color: 'white', mb: 2, filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.2))' }} />
            </motion.div>
            <Typography 
              variant="h2" 
              sx={{ 
                color: 'white', 
                fontWeight: 800,
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                letterSpacing: '-0.02em',
                mb: 1
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
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
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
                    minWidth: 140,
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

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
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
                </motion.div>
              )}

              {result && (
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
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
                          <MotionBox
                            whileHover={{ scale: 1.02 }}
                            sx={{
                              p: 2,
                              borderRadius: 3,
                              background: alpha('#667eea', 0.05),
                              transition: 'all 0.3s ease'
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
                          </MotionBox>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <MotionBox
                            whileHover={{ scale: 1.02 }}
                            sx={{
                              p: 2,
                              borderRadius: 3,
                              background: alpha('#667eea', 0.05),
                              transition: 'all 0.3s ease'
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
                          </MotionBox>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <MotionBox
                            whileHover={{ scale: 1.02 }}
                            sx={{
                              p: 2,
                              borderRadius: 3,
                              background: alpha('#667eea', 0.05),
                              transition: 'all 0.3s ease'
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
                          </MotionBox>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <MotionBox
                            whileHover={{ scale: 1.02 }}
                            sx={{
                              p: 2,
                              borderRadius: 3,
                              background: alpha('#667eea', 0.05),
                              transition: 'all 0.3s ease'
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
                          </MotionBox>
                        </Grid>

                        <Grid item xs={12}>
                          <MotionBox
                            whileHover={{ scale: 1.02 }}
                            sx={{
                              p: 2,
                              borderRadius: 3,
                              background: alpha('#667eea', 0.05),
                              transition: 'all 0.3s ease'
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
                          </MotionBox>
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
                </MotionBox>
              )}
            </AnimatePresence>
          </CardContent>
        </MotionCard>
      </Container>
    </Box>
  );
};

export default VerifyPage;
