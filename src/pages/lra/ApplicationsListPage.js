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
  Button,
  CircularProgress,
  TextField,
  InputAdornment
} from '@mui/material';
import { lraAPI } from '../../services/api';
import SearchIcon from '@mui/icons-material/Search';

const ApplicationsListPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    filterBusinesses();
  }, [searchTerm, businesses]);

  const fetchBusinesses = async () => {
    try {
      const response = await lraAPI.getBusinessesForAssessment();
      setBusinesses(response.data.data);
      setFiltered(response.data.data);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBusinesses = () => {
    if (!searchTerm) {
      setFiltered(businesses);
    } else {
      const filtered = businesses.filter(b => 
        b.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.registration_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.owner_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFiltered(filtered);
    }
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
      <Typography variant="h4" gutterBottom>Businesses for Tax Assessment</Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by business name, registration number, or owner..."
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
              <TableCell>Business Type</TableCell>
              <TableCell>Sector</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography sx={{ py: 4 }}>No businesses pending assessment</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((business) => (
                <TableRow key={business.id}>
                  <TableCell>{business.business_name}</TableCell>
                  <TableCell>{business.registration_number}</TableCell>
                  <TableCell>{business.business_type || 'N/A'}</TableCell>
                  <TableCell>{business.sector || 'N/A'}</TableCell>
                  <TableCell>{business.owner_name}</TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      size="small"
                      onClick={() => navigate(`/lra/assess/${business.id}`)}
                    >
                      Assess Tax
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
