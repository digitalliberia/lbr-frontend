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
  Tabs,
  Tab
} from '@mui/material';
import { lbrAPI } from '../../services/api';
import SearchIcon from '@mui/icons-material/Search';

const ApplicationsListPage = () => {
  const [applications, setApplications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [searchTerm, applications, tabValue]);

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
    let result = applications;
    
    // Filter by tab
    if (tabValue === 1) {
      result = result.filter(a => a.registration_status === 'pending' || a.workflow_status === 'pending');
    } else if (tabValue === 2) {
      result = result.filter(a => a.workflow_status === 'in_review');
    } else if (tabValue === 3) {
      result = result.filter(a => a.registration_status === 'approved');
    } else if (tabValue === 4) {
      result = result.filter(a => a.registration_status === 'rejected');
    }
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(app => 
        app.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.registration_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.owner_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFiltered(result);
  };

  const getStatusChip = (status, stage) => {
    const colors = {
      pending: 'warning',
      submitted: 'warning',
      in_review: 'info',
      approved: 'success',
      rejected: 'error',
      active: 'success'
    };
    const displayStatus = status || stage || 'pending';
    return <Chip label={displayStatus.toUpperCase()} color={colors[displayStatus] || 'default'} size="small" />;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Applications Management</Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
          <Tab label="All" />
          <Tab label="Pending" />
          <Tab label="In Review" />
          <Tab label="Approved" />
          <Tab label="Rejected" />
        </Tabs>
        
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by business name, registration number, or owner name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Business Name</TableCell>
              <TableCell>Registration #</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography sx={{ py: 4 }}>No applications found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>{app.business_name}</TableCell>
                  <TableCell>{app.registration_number}</TableCell>
                  <TableCell>{app.owner_name}</TableCell>
                  <TableCell>{getStatusChip(app.registration_status, app.workflow_status)}</TableCell>
                  <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button 
                      size="small" 
                      variant="contained"
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
    </Container>
  );
};

export default ApplicationsListPage;
