import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
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
  TextField,
  InputAdornment,
  Fade,
  Grow,
  Avatar
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { lbrAPI } from '../../services/api';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssignmentIcon from '@mui/icons-material/Assignment';

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
    padding: '16px',
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
  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    background: 'linear-gradient(135deg, #16213e 0%, #1a1a2e 100%)',
  },
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    '&.Mui-focused': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 16px rgba(33,150,243,0.2)',
    },
  },
}));

const StatsCard = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '20px',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
}));

const getStatusColor = (status) => {
  if (status === 'approved' || status === 'active') return 'success';
  if (status === 'rejected') return 'error';
  if (status === 'pending' || status === 'submitted') return 'warning';
  return 'info';
};

const getStatusLabel = (status) => {
  return status?.toUpperCase() || 'PENDING';
};

const ApplicationsListPage = () => {
  const [applications, setApplications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [searchTerm, applications]);

  const fetchApplications = async () => {
    try {
      const response = await lbrAPI.getApplications();
      setApplications(response.data.data);
      setFiltered(response.data.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    if (!searchTerm) {
      setFiltered(applications);
    } else {
      const filtered = applications.filter(app => 
        app.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.registration_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.owner_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFiltered(filtered);
    }
  };

  const totalApplications = applications.length;
  const pendingCount = applications.filter(a => a.registration_status === 'pending' || a.workflow_status === 'pending').length;
  const approvedCount = applications.filter(a => a.registration_status === 'approved').length;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: '#FFD700' }} />
      </Box>
    );
  }

  return (
    <Fade in timeout={800}>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#1a1a2e' }}>
            Applications Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Review and manage all business registration applications
          </Typography>
        </Box>

        <StatsCard>
          <Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mb: 1 }}>
              Total Applications
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'white' }}>
              {totalApplications}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mb: 1 }}>
              Pending Review
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#FFD700' }}>
              {pendingCount}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mb: 1 }}>
              Approved
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#4CAF50' }}>
              {approvedCount}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
            <AssignmentIcon sx={{ fontSize: 32, color: 'white' }} />
          </Avatar>
        </StatsCard>

        <StyledPaper>
          <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
            <SearchField
              fullWidth
              variant="outlined"
              placeholder="Search by business name, registration number, or owner name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#999' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <TableContainer>
            <Table>
              <StyledTableHead>
                <TableRow>
                  <TableCell>Business Name</TableCell>
                  <TableCell>Registration #</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Box sx={{ py: 8, textAlign: 'center' }}>
                        <BusinessIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                        <Typography variant="h6" color="textSecondary">
                          No applications found
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Try adjusting your search criteria
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((app, index) => (
                    <Grow in timeout={300 + index * 50} key={app.id}>
                      <TableRow 
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
                            label={getStatusLabel(app.registration_status)}
                            statuscolor={getStatusColor(app.registration_status)}
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
                          >
                            Review
                          </ActionButton>
                        </TableCell>
                      </TableRow>
                    </Grow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </StyledPaper>
      </Container>
    </Fade>
  );
};

export default ApplicationsListPage;
