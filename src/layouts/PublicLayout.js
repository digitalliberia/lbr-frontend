import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import RoleSwitcher from '../components/RoleSwitcher';

const PublicLayout = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            LBR Business Registry System
          </Typography>
          <RoleSwitcher />
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/search">Search</Button>
          <Button color="inherit" component={Link} to="/verify">Verify</Button>
          <Button color="inherit" component={Link} to="/register">Register</Button>
          <Button color="inherit" component={Link} to="/login">Login</Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Box sx={{ mt: 2, mb: 2, p: 1, bgcolor: '#fff3cd', borderRadius: 1 }}>
          <Typography variant="body2" color="textSecondary" align="center">
            🔧 TEST MODE: Use the dropdown to switch between portals. No login required for testing.
          </Typography>
        </Box>
        <Outlet />
      </Container>
      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: '#f5f5f5' }}>
        <Container maxWidth="sm">
          <Typography variant="body2" color="textSecondary" align="center">
            © 2026 LBR Business Registry System. Testing Version
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default PublicLayout;
