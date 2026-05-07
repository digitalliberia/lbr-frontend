import Dashboard from './Dashboard';
export default Dashboard;
EOF

# Create ApplicationsListPage
cat > src/pages/lbr/ApplicationsListPage.js << 'EOF'
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
  InputAdornment
} from '@mui/material';
import { lbrAPI } from '../../services/api';
import SearchIcon from '@mui/icons-material/Search';

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
        app.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.registration_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.owner_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFiltered(filtered);
    }
  };

  const getStatusChip = (status) => {
    const colors = {
      pending: 'warning',
      submitted: 'warning',
      in_review: 'info',
      approved: 'success',
      rejected: 'error'
    };
    return <Chip label={status?.toUpperCase() || 'PENDING'} color={colors[status] || 'default'} size="small" />;
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
      <Typography variant="h4" gutterBottom>All Applications</Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
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
                  <TableCell>{getStatusChip(app.registration_status)}</TableCell>
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
