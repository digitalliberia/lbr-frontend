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
  Paper,
  Avatar,
  Fade,
  Grow,
  IconButton,
  Tooltip
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { lbrAPI } from '../../services/api';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '24px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  animation: `${fadeInUp} 0.6s ease-out`,
}));

const SectionCard = styled(Card)(({ theme }) => ({
  borderRadius: '20px',
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
  },
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1.5, 0),
  borderBottom: '1px solid rgba(0,0,0,0.06)',
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const StatusBadge = styled(Chip)(({ theme, statuscolor }) => ({
  borderRadius: '20px',
  fontWeight: 700,
  fontSize: '0.85rem',
  padding: '4px 8px',
  background: statuscolor === 'approved' ? 'linear-gradient(135deg, #4CAF50, #45a049)' :
             statuscolor === 'rejected' ? 'linear-gradient(135deg, #f44336, #da190b)' :
             'linear-gradient(135deg, #ff9800, #fb8c00)',
  color: 'white',
  '& .MuiChip-label': {
    padding: '0 16px',
  },
}));

const ActionButton = styled(Button)(({ theme, actioncolor }) => ({
  borderRadius: '16px',
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '1rem',
  padding: '12px 32px',
  transition: 'all 0.3s ease',
  background: actioncolor === 'approve' ? 'linear-gradient(135deg, #4CAF50, #45a049)' :
             actioncolor === 'reject' ? 'linear-gradient(135deg, #f44336, #da190b)' :
             'linear-gradient(135deg, #1a1a2e, #16213e)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
  },
}));

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
        <CircularProgress sx={{ color: '#FFD700' }} />
      </Box>
    );
  }

  if (error || !application) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ borderRadius: '16px' }}>{error || 'Application not found'}</Alert>
        <Button onClick={() => navigate('/lbr')} sx={{ mt: 2 }}>Back to Dashboard</Button>
      </Container>
    );
  }

  const statusColor = application.registration_status === 'approved' ? 'approved' :
                      application.registration_status === 'rejected' ? 'rejected' : 'pending';

  return (
    <Fade in timeout={800}>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <StyledPaper>
          {/* Header */}
          <Box sx={{ 
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', 
            p: 4,
            color: 'white'
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <IconButton 
                  onClick={() => navigate('/lbr')} 
                  sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    Application Review
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Review and make decision on business registration
                  </Typography>
                </Box>
              </Box>
              <StatusBadge 
                label={application.registration_status?.toUpperCase() || 'PENDING'}
                statuscolor={statusColor}
              />
            </Box>
          </Box>

          <Box sx={{ p: 4 }}>
            <Grid container spacing={4}>
              {/* Business Information Section */}
              <Grid item xs={12} md={6}>
                <Grow in timeout={400}>
                  <SectionCard>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1} mb={3}>
                        <Avatar sx={{ bgcolor: 'rgba(33,150,243,0.1)', color: '#2196F3' }}>
                          <BusinessIcon />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Business Information
                        </Typography>
                      </Box>
                      
                      <InfoRow>
                        <Typography variant="body2" color="textSecondary">Business Name</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{application.business_name}</Typography>
                      </InfoRow>
                      <InfoRow>
                        <Typography variant="body2" color="textSecondary">Registration Number</Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{application.registration_number}</Typography>
                      </InfoRow>
                      <InfoRow>
                        <Typography variant="body2" color="textSecondary">Business Type</Typography>
                        <Typography variant="body2">{application.business_type || 'N/A'}</Typography>
                      </InfoRow>
                      <InfoRow>
                        <Typography variant="body2" color="textSecondary">Sector</Typography>
                        <Typography variant="body2">{application.sector || 'N/A'}</Typography>
                      </InfoRow>
                      <InfoRow>
                        <Typography variant="body2" color="textSecondary">Physical Address</Typography>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <LocationOnIcon sx={{ fontSize: 14, color: '#999' }} />
                          <Typography variant="body2">{application.physical_address || 'N/A'}</Typography>
                        </Box>
                      </InfoRow>
                      <InfoRow>
                        <Typography variant="body2" color="textSecondary">County</Typography>
                        <Typography variant="body2">{application.county || 'N/A'}</Typography>
                      </InfoRow>
                    </CardContent>
                  </SectionCard>
                </Grow>
              </Grid>

              {/* Owner Information Section */}
              <Grid item xs={12} md={6}>
                <Grow in timeout={500}>
                  <SectionCard>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1} mb={3}>
                        <Avatar sx={{ bgcolor: 'rgba(76,175,80,0.1)', color: '#4CAF50' }}>
                          <PersonIcon />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Owner Information
                        </Typography>
                      </Box>
                      
                      <InfoRow>
                        <Typography variant="body2" color="textSecondary">Full Name</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{application.owner_name}</Typography>
                      </InfoRow>
                      <InfoRow>
                        <Typography variant="body2" color="textSecondary">Email Address</Typography>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <EmailIcon sx={{ fontSize: 14, color: '#999' }} />
                          <Typography variant="body2">{application.owner_email}</Typography>
                        </Box>
                      </InfoRow>
                      <InfoRow>
                        <Typography variant="body2" color="textSecondary">Phone Number</Typography>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <PhoneIcon sx={{ fontSize: 14, color: '#999' }} />
                          <Typography variant="body2">{application.owner_phone}</Typography>
                        </Box>
                      </InfoRow>
                      <InfoRow>
                        <Typography variant="body2" color="textSecondary">DSSN</Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{application.dssn || 'Not provided'}</Typography>
                      </InfoRow>
                    </CardContent>
                  </SectionCard>
                </Grow>

                <Grow in timeout={600}>
                  <SectionCard sx={{ mt: 3 }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1} mb={3}>
                        <Avatar sx={{ bgcolor: 'rgba(255,152,0,0.1)', color: '#FF9800' }}>
                          <AttachMoneyIcon />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Tax Information
                        </Typography>
                      </Box>
                      
                      <InfoRow>
                        <Typography variant="body2" color="textSecondary">Tax ID (TIN)</Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{application.tax_id || 'Not provided'}</Typography>
                      </InfoRow>
                    </CardContent>
                  </SectionCard>
                </Grow>
              </Grid>

              {/* Review Decision Section */}
              <Grid item xs={12}>
                <Grow in timeout={700}>
                  <SectionCard>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1} mb={3}>
                        <Avatar sx={{ bgcolor: 'rgba(33,150,243,0.1)', color: '#2196F3' }}>
                          <AssignmentIcon />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Review Decision
                        </Typography>
                      </Box>
                      
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Comments / Decision Notes"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Enter your comments or reasons for decision..."
                        sx={{ mb: 4 }}
                        variant="outlined"
                        InputProps={{
                          sx: { borderRadius: '16px' }
                        }}
                      />
                      
                      <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
                        <ActionButton
                          variant="contained"
                          actioncolor="approve"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleDecision('approved')}
                          disabled={submitting}
                        >
                          {submitting ? 'Processing...' : 'Approve Application'}
                        </ActionButton>
                        <ActionButton
                          variant="contained"
                          actioncolor="reject"
                          startIcon={<CancelIcon />}
                          onClick={() => handleDecision('rejected')}
                          disabled={submitting}
                        >
                          {submitting ? 'Processing...' : 'Reject Application'}
                        </ActionButton>
                        <ActionButton
                          variant="outlined"
                          actioncolor="cancel"
                          onClick={() => navigate('/lbr')}
                          sx={{ background: 'transparent', border: '2px solid #1a1a2e', color: '#1a1a2e' }}
                        >
                          Cancel
                        </ActionButton>
                      </Box>
                    </CardContent>
                  </SectionCard>
                </Grow>
              </Grid>
            </Grid>
          </Box>
        </StyledPaper>
      </Container>
    </Fade>
  );
};

export default ApplicationReviewPage;
