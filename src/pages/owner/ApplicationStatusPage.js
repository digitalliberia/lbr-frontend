import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Button,
  CircularProgress,
  Paper,
  Grid,
  Alert
} from '@mui/material';
import { businessAPI } from '../../services/api';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import PaymentIcon from '@mui/icons-material/Payment';

const ApplicationStatusPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const queryParams = new URLSearchParams(location.search);
  const registrationNumber = queryParams.get('reg');

  useEffect(() => {
    if (registrationNumber) {
      fetchApplicationStatus();
    }
  }, [registrationNumber]);

  const fetchApplicationStatus = async () => {
    try {
      const response = await businessAPI.getStatus(registrationNumber);
      setApplication(response.data.data);
    } catch (err) {
      setError('Failed to load application status');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStageIndex = (stage) => {
    const stages = [
      'name_reservation',
      'business_info',
      'submitted',
      'lbr_review',
      'lra_assessment',
      'payment_pending',
      'payment_confirmed',
      'certificate_issued'
    ];
    const index = stages.indexOf(stage);
    return index !== -1 ? index : 0;
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active':
      case 'approved':
      case 'payment_confirmed':
        return <CheckCircleIcon color="success" />;
      case 'rejected':
        return <CancelIcon color="error" />;
      case 'payment_pending':
        return <PaymentIcon color="warning" />;
      default:
        return <PendingIcon color="warning" />;
    }
  };

  const stages = [
    'Name Reserved',
    'Information Submitted',
    'LBR Review',
    'Tax Assessment',
    'Payment',
    'Certificate Issued'
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !application) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Application not found'}</Alert>
        <Button onClick={() => navigate('/owner')} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  const currentStage = getStageIndex(application.application_stage);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Application Status</Typography>
          <Chip 
            icon={getStatusIcon(application.registration_status)}
            label={application.registration_status?.toUpperCase()}
            color={application.registration_status === 'active' ? 'success' : 'warning'}
            size="large"
          />
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">Business Name</Typography>
                <Typography variant="h6">{application.business_name}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">Registration Number</Typography>
                <Typography variant="h6">{application.registration_number}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">Business Type</Typography>
                <Typography>{application.business_type || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">Date Submitted</Typography>
                <Typography>{new Date(application.created_at).toLocaleDateString()}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Typography variant="h5" gutterBottom>Application Progress</Typography>
        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={currentStage} alternativeLabel>
            {stages.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {application.application_stage === 'payment_pending' && (
          <Alert severity="warning" action={
            <Button color="inherit" size="small" onClick={() => navigate(`/owner/payment/${application.id}`)}>
              Pay Now
            </Button>
          }>
            Payment is required to complete your registration. Please pay the assessed fees.
          </Alert>
        )}

        {application.application_stage === 'certificate_issued' && (
          <Alert severity="success" action={
            <Button color="inherit" size="small" onClick={() => navigate('/owner/certificates')}>
              View Certificate
            </Button>
          }>
            Your business registration is complete! Certificate has been issued.
          </Alert>
        )}

        {application.application_stage === 'rejected' && (
          <Alert severity="error">
            Your application has been rejected. Please contact LBR for more information.
          </Alert>
        )}

        <Box sx={{ mt: 3 }}>
          <Button variant="outlined" onClick={() => navigate('/owner')}>
            Back to Dashboard
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ApplicationStatusPage;
