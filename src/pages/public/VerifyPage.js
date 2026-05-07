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
  CircularProgress
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            Verify Business Certificate
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary" paragraph>
            Enter the QR code, Registration Number, or Certificate Number to verify
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, my: 4 }}>
            <TextField
              fullWidth
              label="Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter QR Code, Registration Number, or Certificate Number"
              onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
            />
            <Button
              variant="contained"
              onClick={handleVerify}
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Verify'}
            </Button>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {result && (
            <Box sx={{ mt: 4 }}>
              <Alert severity="success" icon={<VerifiedIcon />} sx={{ mb: 3 }}>
                This certificate is VALID and AUTHENTIC
              </Alert>
              
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>Certificate Details</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">Business Name</Typography>
                      <Typography variant="body1" gutterBottom><strong>{result.business_name}</strong></Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">Registration Number</Typography>
                      <Typography variant="body1" gutterBottom><strong>{result.registration_number}</strong></Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">Certificate Number</Typography>
                      <Typography variant="body1" gutterBottom><strong>{result.certificate_number}</strong></Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">Tax ID (TIN)</Typography>
                      <Typography variant="body1" gutterBottom><strong>{result.tax_id || 'N/A'}</strong></Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">Issue Date</Typography>
                      <Typography variant="body1" gutterBottom>
                        {new Date(result.issued_at).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Chip 
                        label="VERIFIED" 
                        color="success" 
                        sx={{ mt: 1 }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default VerifyPage;
