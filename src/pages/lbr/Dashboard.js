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
  Tab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { lbrAPI } from '../../services/api';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AssignmentIcon from '@mui/icons-material/Assignment';

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

  const getStatusChip = (status, stage) => {
    const colors = {
      pending: 'warning',
      in_review: 'info',
      approved: 'success',
      rejected: 'error',
      needs_correction: 'warning'
    };
    const displayStatus = status || stage || 'pending';
    return <Chip label={displayStatus.toUpperCase()} color={colors[displayStatus] || 'default'} size="small" />;
  };

  const filteredApplications = () => {
    if (tabValue === 0) return applications;
    if (tabValue === 1) return applications.filter(a => a.workflow_status === 'pending');
    if (tabValue === 2) return applications.filter(a => a.workflow_status === 'in_review');
    if (tabValue === 3) return applications.filter(a => a.registration_status === 'approved');
    return applications;
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
      <Typography variant="h4" gutterBottom>LBR Officer Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <PendingIcon color="warning" sx={{ fontSize: 40 }} />
                <Typography variant="h3">{stats.pending || 0}</Typography>
              </Box>
              <Typography color="textSecondary">Pending Applications</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <AssignmentIcon color="info" sx={{ fontSize: 40 }} />
                <Typography variant="h3">{stats.in_review || 0}</Typography>
              </Box>
              <Typography color="textSecondary">In Review</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                <Typography variant="h3">{stats.approved || 0}</Typography>
              </Box>
              <Typography color="textSecondary">Approved</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <CancelIcon color="error" sx={{ fontSize: 40 }} />
                <Typography variant="h3">{stats.rejected || 0}</Typography>
              </Box>
              <Typography color="textSecondary">Rejected</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
          <Tab label="All Applications" />
          <Tab label="Pending" />
          <Tab label="In Review" />
          <Tab label="Approved" />
        </Tabs>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Business Name</TableCell>
                <TableCell>Registration Number</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Submitted Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredApplications().length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography sx={{ py: 4 }}>No applications found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplications().map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>{app.business_name}</TableCell>
                    <TableCell>{app.registration_number}</TableCell>
                    <TableCell>{app.owner_name}</TableCell>
                    <TableCell>{getStatusChip(app.registration_status, app.workflow_status)}</TableCell>
                    <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={() => navigate(`/lbr/review/${app.id}`)}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard;
