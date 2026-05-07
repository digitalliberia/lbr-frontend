import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import { businessAPI } from '../../services/api';
import BusinessIcon from '@mui/icons-material/Business';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

const Dashboard = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await businessAPI.getMyBusinesses();
      setBusinesses(response.data.data);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: businesses.length,
    pending: businesses.filter(b => b.registration_status === 'pending' || b.application_stage === 'submitted').length,
    active: businesses.filter(b => b.registration_status === 'active').length,
    payments: businesses.filter(b => b.application_stage === 'payment_pending').length
  };

  const getStatusChip = (status) => {
    const colors = {
      active: 'success',
      pending: 'warning',
      approved: 'info',
      rejected: 'error',
      payment_pending: 'warning',
      payment_confirmed: 'success'
    };
    return <Chip label={status?.toUpperCase()} color={colors[status] || 'default'} size="small" />;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Owner Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <BusinessIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h3">{stats.total}</Typography>
              </Box>
              <Typography color="textSecondary">Total Businesses</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <PendingIcon color="warning" sx={{ fontSize: 40 }} />
                <Typography variant="h3">{stats.pending}</Typography>
              </Box>
              <Typography color="textSecondary">Pending Applications</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <PaymentIcon color="error" sx={{ fontSize: 40 }} />
                <Typography variant="h3">{stats.payments}</Typography>
              </Box>
              <Typography color="textSecondary">Pending Payments</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                <Typography variant="h3">{stats.active}</Typography>
              </Box>
              <Typography color="textSecondary">Active Certificates</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom>My Business Applications</Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Business Name</TableCell>
              <TableCell>Registration Number</TableCell>
              <TableCell>Application Stage</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date Submitted</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {businesses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" sx={{ py: 4 }}>
                    No businesses found. 
                    <Button onClick={() => navigate('/registration/name-reservation')} sx={{ ml: 2 }}>
                      Register a Business
                    </Button>
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              businesses.map((business) => (
                <TableRow key={business.id}>
                  <TableCell>{business.business_name}</TableCell>
                  <TableCell>{business.registration_number}</TableCell>
                  <TableCell>{business.application_stage?.replace(/_/g, ' ').toUpperCase()}</TableCell>
                  <TableCell>{getStatusChip(business.registration_status)}</TableCell>
                  <TableCell>{new Date(business.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => navigate(`/owner/applications?reg=${business.registration_number}`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {stats.payments > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>Pending Payments</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Business Name</TableCell>
                  <TableCell>Amount Due</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {businesses
                  .filter(b => b.application_stage === 'payment_pending')
                  .map((business) => (
                    <TableRow key={business.id}>
                      <TableCell>{business.business_name}</TableCell>
                      <TableCell>${business.amount_due || 'N/A'}</TableCell>
                      <TableCell>{business.due_date ? new Date(business.due_date).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell>
                        <Button 
                          variant="contained" 
                          color="primary"
                          size="small"
                          onClick={() => navigate(`/owner/payment/${business.id}`)}
                        >
                          Pay Now
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
