import React, { useEffect, useState } from 'react';
import { Typography, Grid, Card, CardContent, Box, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { businessAPI } from '../../services/api';
import BusinessIcon from '@mui/icons-material/Business';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';

const OwnerDashboard = () => {
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
    pending: businesses.filter(b => b.registration_status === 'pending').length,
    active: businesses.filter(b => b.registration_status === 'active').length,
    payments: businesses.filter(b => b.payment_status === 'pending').length
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Owner Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <BusinessIcon color="primary" />
              <Typography variant="h4">{stats.total}</Typography>
              <Typography color="textSecondary">Total Businesses</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <BusinessIcon color="warning" />
              <Typography variant="h4">{stats.pending}</Typography>
              <Typography color="textSecondary">Pending Applications</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <PaymentIcon color="error" />
              <Typography variant="h4">{stats.payments}</Typography>
              <Typography color="textSecondary">Pending Payments</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <ReceiptIcon color="success" />
              <Typography variant="h4">{stats.active}</Typography>
              <Typography color="textSecondary">Active Certificates</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom>My Businesses</Typography>
      <Grid container spacing={2}>
        {businesses.map((business) => (
          <Grid item xs={12} key={business.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h6">{business.business_name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Reg No: {business.registration_number}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Status: {business.registration_status}
                    </Typography>
                  </Box>
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate(`/owner/applications?reg=${business.registration_number}`)}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OwnerDashboard;
