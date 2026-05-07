import React, { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Avatar,
  Fade,
  Grow
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { lbrAPI } from '../../services/api';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

// Modern animations
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

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(33, 150, 243, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0);
  }
`;

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
  borderRadius: '20px',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #FFD700, #FFA500)',
  },
}));

const StatNumber = styled(Typography)(({ theme }) => ({
  fontSize: '3rem',
  fontWeight: 800,
  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  marginBottom: theme.spacing(1),
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '20px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  overflow: 'hidden',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
  '& th': {
    color: 'white',
    fontWeight: 700,
    fontSize: '0.9rem',
  },
}));

const StatusChip = styled(Chip)(({ theme, statuscolor }) => ({
  borderRadius: '12px',
  fontWeight: 600,
  fontSize: '0.75rem',
  background: statuscolor === 'success' ? 'linear-gradient(135deg, #4CAF50, #45a049)' :
             statuscolor === 'error' ? 'linear-gradient(135deg, #f44336, #da190b)' :
             statuscolor === 'warning' ? 'linear-gradient(135deg, #ff9800, #fb8c00)' :
             'linear-gradient(135deg, #2196F3, #1976D2)',
  color: 'white',
  '& .MuiChip-label': {
    padding: '0 12px',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
}));

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await lbrAPI.getApplications();
      setApplications(response.data.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await lbrAPI.getStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getStatusColor = (status, stage) => {
    const displayStatus = status || stage || 'pending';
    if (displayStatus === 'approved') return 'success';
    if (displayStatus === 'rejected') return 'error';
    if (displayStatus === 'pending') return 'warning';
    return 'info';
  };

  const getStatusLabel = (status, stage) => {
    const displayStatus = status || stage || 'pending';
    return displayStatus.toUpperCase();
  };

  const filteredApplications = () => {
    if (tabValue === 0) return applications;
    if (tabValue === 1) return applications.filter(a => a.workflow_status === 'pending' || a.registration_status === 'pending');
    if (tabValue === 2) return applications.filter(a => a.workflow_status === 'in_review');
    if (tabValue === 3) return applications.filter(a => a.registration_status === 'approved');
    return applications;
  };

  const totalApplications = applications.length;
  const approvalRate = totalApplications > 0 ? ((stats.approved || 0) / totalApplications * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: '#FFD700' }} />
      </Box>
    );
  }

  return (
    <Fade in timeout={800}>
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#1a1a2e' }}>
            LBR Officer Dashboard
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Monitor and manage business registration applications
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Grow in timeout={600}>
              <StyledCard>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Avatar sx={{ bgcolor: 'rgba(255,215,0,0.2)', color: '#FFD700' }}>
                      <PendingIcon />
                    </Avatar>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Total Pending
                    </Typography>
                  </Box>
                  <StatNumber>{stats.pending || 0}</StatNumber>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    Awaiting review
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grow>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Grow in timeout={700}>
              <StyledCard>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Avatar sx={{ bgcolor: 'rgba(33,150,243,0.2)', color: '#2196F3' }}>
                      <AssignmentIcon />
                    </Avatar>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      In Review
                    </Typography>
                  </Box>
                  <StatNumber>{stats.in_review || 0}</StatNumber>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    Under assessment
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grow>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Grow in timeout={800}>
              <StyledCard>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Avatar sx={{ bgcolor: 'rgba(76,175,80,0.2)', color: '#4CAF50' }}>
                      <ThumbUpIcon />
                    </Avatar>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Approved
                    </Typography>
                  </Box>
                  <StatNumber>{stats.approved || 0}</StatNumber>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    Successfully approved
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grow>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Grow in timeout={900}>
              <StyledCard>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Avatar sx={{ bgcolor: 'rgba(244,67,54,0.2)', color: '#f44336' }}>
                      <ThumbDownIcon />
                    </Avatar>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Rejected
                    </Typography>
                  </Box>
                  <StatNumber>{stats.rejected || 0}</StatNumber>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    Applications rejected
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grow>
          </Grid>
        </Grid>

        {/* Performance Card */}
        <Card sx={{ mb: 4, borderRadius: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
              <Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mb: 1 }}>
                  Overall Performance
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: 'white' }}>
                  {approvalRate}%
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Application Approval Rate
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'white', opacity: 0.8 }} />
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Total Processed: {totalApplications}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <StyledTableContainer component={Paper}>
          <Tabs 
            value={tabValue} 
            onChange={(e, v) => setTabValue(v)} 
            sx={{ 
              px: 2, 
              pt: 2,
              borderBottom: '1px solid rgba(0,0,0,0.08)',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
              },
              '& .Mui-selected': {
                color: '#FFD700',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#FFD700',
              },
            }}
          >
            <Tab label="All Applications" />
            <Tab label="Pending" />
            <Tab label="In Review" />
            <Tab label="Approved" />
          </Tabs>

          <TableContainer>
            <Table>
              <StyledTableHead>
                <TableRow>
                  <TableCell>Business Name</TableCell>
                  <TableCell>Registration Number</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Submitted Date</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {filteredApplications().length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Box sx={{ py: 8, textAlign: 'center' }}>
                        <AssignmentIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                        <Typography variant="h6" color="textSecondary">
                          No applications found
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          All caught up! Great job!
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApplications().map((app, index) => (
                    <TableRow 
                      key={app.id}
                      sx={{ 
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.02)',
                          transform: 'scale(1.01)',
                        },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {app.business_name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {app.registration_number}
                        </Typography>
                      </TableCell>
                      <TableCell>{app.owner_name}</TableCell>
                      <TableCell>
                        <StatusChip 
                          label={getStatusLabel(app.registration_status, app.workflow_status)}
                          statuscolor={getStatusColor(app.registration_status, app.workflow_status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(app.created_at).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <ActionButton
                          size="small"
                          variant="contained"
                          startIcon={<VisibilityIcon />}
                          onClick={() => navigate(`/lbr/review/${app.id}`)}
                          sx={{
                            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #16213e 0%, #1a1a2e 100%)',
                            },
                          }}
                        >
                          Review
                        </ActionButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </StyledTableContainer>
      </Box>
    </Fade>
  );
};

export default Dashboard;
