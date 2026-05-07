import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  Paper
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReceiptIcon from '@mui/icons-material/Receipt';

const SubmissionCompletePage = () => {
  const navigate = useNavigate();
  const registrationNumber = localStorage.getItem('registration_number');
  const businessName = localStorage.getItem('business_name');

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircleIcon sx={{ fontSize: 100, color: 'success.main', mb: 2 }} />
        
        <Typography variant="h4" gutterBottom color="success.main">
          Application Submitted Successfully!
        </Typography>
        
        <Alert severity="success" sx={{ my: 3 }}>
          Your business registration application has been received and is being processed.
        </Alert>
        
        <Card variant="outlined" sx={{ mb: 3, bgcolor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <ReceiptIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Application Details
            </Typography>
            <Typography variant="body1">
              <strong>Business Name:</strong> {businessName}
            </Typography>
            <Typography variant="body1">
              <strong>Registration Number:</strong> {registrationNumber}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Please save this registration number for tracking your application status.
            </Typography>
          </CardContent>
        </Card>
        
        <Typography variant="body2" color="textSecondary" paragraph>
          Your application will be reviewed by LBR officers. You will receive notifications about the status.
          The process typically takes 5-7 business days.
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/owner/applications')}
            sx={{ mr: 2 }}
          >
            Track Application
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
          >
            Return Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SubmissionCompletePage;
