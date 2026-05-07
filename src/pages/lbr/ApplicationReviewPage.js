import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  TextField,
  Divider,
  Paper
} from '@mui/material';
import { lbrAPI } from '../../services/api';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';

const ApplicationReviewPage = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplication();
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      const response = await lbrAPI.getApplication(applicationId);
      setApplication(response.data.data);
    } catch (error) {
      setError('Failed to load application');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (decision) => {
    setSubmitting(true);
    try {
      await lbrAPI.updateApplication(applicationId, {
        status: decision,
        comments: comments,
        next_stage: decision === 'approved' ? 'lra_assessment' : 'submitted'
      });
      navigate('/lbr');
    } catch (error) {
      setError('Failed to update application');
      console.error(error);
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

  if (error || !application) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Application not found'}</Alert>
        <Button onClick={() => navigate('/lbr')} sx={{ mt: 2 }}>Back</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Application Review</Typography>
          <Chip 
            label={application.registration_status?.toUpperCase() || 'PENDING'}
            color={application.registration_status === 'approved' ? 'success' : 'warning'}
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Business Information</Typography>
                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary">Business Name</Typography>
                  <Typography variant="body1"><strong>{application.business_name}</strong></Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary">Registration Number</Typography>
                  <Typography>{application.registration_number}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary">Business Type</Typography>
                  <Typography>{application.business_type || 'N/A'}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary">Sector</Typography>
                  <Typography>{application.sector || 'N/A'}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary">Physical Address</Typography>
                  <Typography>{application.physical_address || 'N/A'}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary">County</Typography>
                  <Typography>{application.county || 'N/A'}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Owner Information</Typography>
                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary">Owner Name</Typography>
                  <Typography>{application.owner_name}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary">Email</Typography>
                  <Typography>{application.owner_email}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary">Phone</Typography>
                  <Typography>{application.owner_phone}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary">DSSN</Typography>
                  <Typography>{application.dssn || 'N/A'}</Typography>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Tax Information</Typography>
                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary">Tax ID (TIN)</Typography>
                  <Typography>{application.tax_id || 'N/A'}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Review Decision
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Enter your comments or reasons for decision..."
                  sx={{ mb: 3 }}
                />
                <Box display="flex" gap={2}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleDecision('approved')}
                    disabled={submitting}
                  >
                    Approve Application
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => handleDecision('rejected')}
                    disabled={submitting}
                  >
                    Reject Application
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/lbr')}
                  >
                    Cancel
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ApplicationReviewPage;
