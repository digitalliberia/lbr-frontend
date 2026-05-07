import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Tabs,
  Tab,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import { publicAPI } from '../../services/api';

const SearchPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const searchTypes = ['Business Name', 'Registration Number', 'Tax ID (TIN)', 'Owner Name'];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const type = searchTypes[tabValue].toLowerCase().replace(/ /g, '_');
      const response = await publicAPI.search(searchQuery, type);
      setResults(response.data.data);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'success',
      pending: 'warning',
      suspended: 'error',
      expired: 'default',
      revoked: 'error'
    };
    return colors[status] || 'info';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Business Registry Search
      </Typography>
      <Typography variant="body1" align="center" color="textSecondary" paragraph>
        Search for registered businesses, verify registration status, and check compliance
      </Typography>

      <Paper elevation={3} sx={{ mb: 4, p: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
          {searchTypes.map((type, idx) => (
            <Tab key={idx} label={type} />
          ))}
        </Tabs>

        <Grid container spacing={2}>
          <Grid item xs={12} md={9}>
            <TextField
              fullWidth
              label={`Enter ${searchTypes[tabValue]}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSearch}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {results.length > 0 && (
        <Typography variant="h6" sx={{ mb: 2 }}>
          Found {results.length} result(s)
        </Typography>
      )}

      <Grid container spacing={3}>
        {results.map((business, idx) => (
          <Grid item xs={12} key={idx}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <BusinessIcon color="primary" />
                      <Typography variant="h5">
                        {business.business_name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Registration Number: {business.registration_number}
                    </Typography>
                    {business.tax_id && (
                      <Typography variant="body2" color="textSecondary">
                        TIN: {business.tax_id}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
                    <Chip
                      label={business.registration_status.toUpperCase()}
                      color={getStatusColor(business.registration_status)}
                      size="medium"
                    />
                    {business.is_blacklisted && (
                      <Chip
                        label="BLACKLISTED"
                        color="error"
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      Registered: {new Date(business.date_registered).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      Business Type: {business.business_type || 'Not specified'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {results.length === 0 && searchQuery && !loading && !error && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="textSecondary">
            No businesses found matching your search criteria
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default SearchPage;
