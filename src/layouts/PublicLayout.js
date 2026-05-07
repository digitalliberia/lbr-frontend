import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import RoleSwitcher from '../components/RoleSwitcher';
import PublicIcon from '@mui/icons-material/Public';
import FlagIcon from '@mui/icons-material/Flag';
import VerifiedIcon from '@mui/icons-material/Verified';
import SearchIcon from '@mui/icons-material/Search';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';

// Styled components for modern effects
const GlassAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
}));

const NavButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  color: '#1a237e',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
  padding: '6px 16px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
    color: 'white',
    transform: 'translateY(-2px)',
  },
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '20px',
  padding: theme.spacing(8, 4),
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
}));

const FloatingIcon = styled(Box)(({ theme }) => ({
  position: 'absolute',
  opacity: 0.1,
  fontSize: '200px',
  bottom: '-50px',
  right: '-50px',
  transform: 'rotate(15deg)',
}));

const Footer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  color: 'white',
  padding: theme.spacing(6, 0, 3),
  marginTop: 'auto',
}));

const PublicLayout = () => {
  const theme = useTheme();

  return (
    <>
      <GlassAppBar position="sticky">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <FlagIcon sx={{ color: '#1a237e', mr: 1, fontSize: 28 }} />
            <Typography variant="h5" sx={{ 
              fontWeight: 700, 
              background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}>
              LBR Registry
            </Typography>
            <Typography variant="caption" sx={{ ml: 1, color: '#666' }}>
              Republic of Liberia
            </Typography>
          </Box>
          
          <RoleSwitcher />
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 2 }}>
            <NavButton component={Link} to="/" startIcon={<HomeIcon />}>
              Home
            </NavButton>
            <NavButton component={Link} to="/search" startIcon={<SearchIcon />}>
              Search
            </NavButton>
            <NavButton component={Link} to="/verify" startIcon={<VerifiedIcon />}>
              Verify
            </NavButton>
            <NavButton component={Link} to="/register" startIcon={<AppRegistrationIcon />}>
              Register
            </NavButton>
            <NavButton component={Link} to="/login" startIcon={<LoginIcon />}>
              Login
            </NavButton>
          </Box>
        </Toolbar>
      </GlassAppBar>

      {/* Hero Section with Liberian Flag Colors */}
      <HeroSection>
        <FloatingIcon>
          <PublicIcon />
        </FloatingIcon>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ 
              width: 60, 
              height: 40, 
              background: 'linear-gradient(90deg, #BF0A30 0%, #BF0A30 33%, #FFFFFF 33%, #FFFFFF 66%, #002868 66%, #002868 100%)',
              borderRadius: 1,
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }} />
          </Box>
          <Typography variant="h2" sx={{ 
            fontWeight: 800, 
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            mb: 2
          }}>
            LBR Business Registry
          </Typography>
          <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.95)', mb: 3 }}>
            Republic of Liberia • Ministry of Commerce
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', maxWidth: 600, margin: '0 auto' }}>
            Empowering Liberian businesses through transparent and efficient registration services
          </Typography>
        </Box>
      </HeroSection>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>

      {/* Modern Footer with Liberia Map and Culture */}
      <Footer>
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 4, mb: 4 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                About LBR
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.8 }}>
                The Liberia Business Registry (LBR) is the official government platform for business registration, verification, and compliance monitoring.
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Quick Links
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
                {['Business Search', 'Register Business', 'Verify Certificate', 'Fee Schedule'].map((item) => (
                  <Box component="li" key={item} sx={{ mb: 1 }}>
                    <Link to="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.9, '&:hover': { opacity: 1 } }}>
                      {item}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Box>
            
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Contact
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                📍 Ministry of Commerce, Monrovia
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                📞 +231 (0) 77 123 4567
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                ✉️ info@lbr.gov.lr
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Liberia's Culture
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Box component="span" sx={{ fontSize: 30 }}>🦁</Box>
                <Box component="span" sx={{ fontSize: 30 }}>🌴</Box>
                <Box component="span" sx={{ fontSize: 30 }}>⚓</Box>
                <Box component="span" sx={{ fontSize: 30 }}>🏝️</Box>
              </Box>
              <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mt: 1 }}>
                "The Love of Liberty Brought Us Here"
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ textAlign: 'center', pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              © 2026 Liberia Business Registry. All rights reserved. Empowering Liberian Enterprise
            </Typography>
          </Box>
        </Container>
      </Footer>
    </>
  );
};

export default PublicLayout;
