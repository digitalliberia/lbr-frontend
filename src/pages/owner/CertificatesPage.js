import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { businessAPI } from '../../services/api';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import QrCodeIcon from '@mui/icons-material/QrCode';
import DownloadIcon from '@mui/icons-material/Download';

const CertificatesPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await businessAPI.getMyBusinesses();
      const completed = response.data.data.filter(b => b.registration_status === 'active');
      setBusinesses(completed);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = (business) => {
    // In production, this would download the actual PDF certificate
    alert(`Downloading certificate for ${business.business_name}`);
  };

  const viewQRCode = (business) => {
    // In production, this would show the QR code
    alert(`QR Code for ${business.business_name}: ${business.registration_number}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Certificates
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Download and manage your business registration certificates
        </Typography>

        {businesses.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 6 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>No Certificates Available</Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                You don't have any active business certificates yet.
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/registration/name-reservation')}
              >
                Register a Business
              </Button>
            </CardContent>
          </Card>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Business Name</TableCell>
                  <TableCell>Registration Number</TableCell>
                  <TableCell>Issue Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {businesses.map((business) => (
                  <TableRow key={business.id}>
                    <TableCell>
                      <Typography variant="body1">{business.business_name}</Typography>
                    </TableCell>
                    <TableCell>{business.registration_number}</TableCell>
                    <TableCell>
                      {new Date(business.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label="ACTIVE" 
                        color="success" 
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={() => downloadCertificate(business)}
                        sx={{ mr: 1 }}
                      >
                        PDF
                      </Button>
                      <Button
                        size="small"
                        startIcon={<QrCodeIcon />}
                        onClick={() => viewQRCode(business)}
                      >
                        QR
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button variant="outlined" onClick={() => navigate('/owner')}>
            Back to Dashboard
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CertificatesPage;
