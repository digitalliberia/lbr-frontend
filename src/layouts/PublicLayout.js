import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import RoleSwitcher from '../components/RoleSwitcher';
import VerifiedIcon from '@mui/icons-material/Verified';
import SearchIcon from '@mui/icons-material/Search';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ComputerIcon from '@mui/icons-material/Computer';
import GppGoodIcon from '@mui/icons-material/GppGood';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import SecurityIcon from '@mui/icons-material/Security';

// Subtle fade in animation only (no blinking)
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Heartbeat animation for stat cards
const heartbeat = keyframes`
  0% {
    transform: scale(1);
  }
  ￠ {
    transform: scale(1.05);
  }
  40% {
    transform: scale(1);
  }
  60% {
    transform: scale(1.03);
  }
  100% {
    transform: scale(1);
  }
`;

const GlassAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
}));

const NavButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  color: '#1a1a2e',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.95rem',
  padding: '8px 20px',
  transition: 'all 0.3s ease',
  borderRadius: '12px',
  '&:hover': {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    color: 'white',
    transform: 'translateY(-2px)',
  },
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  borderRadius: '24px',
  padding: theme.spacing(8, 4),
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  animation: `${fadeIn} 0.6s ease-out`,
}));

const Footer = styled(Box)(({ theme }) => ({
  background: '#1a1a2e',
  color: 'white',
  padding: theme.spacing(6, 0, 3),
  marginTop: 'auto',
  borderTop: '1px solid rgba(255,255,255,0.1)',
}));

const StatCard = styled(Box)(({ theme }) => ({
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  padding: theme.spacing(3),
  textAlign: 'center',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(255,255,255,0.1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-5px)',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
}));

const AnimatedStatNumber = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  color: '#FFD700',
  fontSize: '2.5rem',
  display: 'inline-block',
  animation: `${heartbeat} 2s ease-in-out infinite`,
  '&:hover': {
    animation: `${heartbeat} 1s ease-in-out infinite`,
  },
}));

const FeatureIconWrapper = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '16px',
  width: '60px',
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'rotate(10deg) scale(1.1)',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  },
}));

const PublicLayout = () => {
  return (
    <>
      <GlassAppBar position="sticky">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%231a1a2e'/%3E%3Cpolygon points='50,30 58,45 75,45 62,55 68,70 50,60 32,70 38,55 25,45 42,45' fill='%23FFD700'/%3E%3C/svg%3E"
              sx={{ width: 40, height: 40, mr: 1.5 }}
            />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.5px' }}>
                Liberia Business Registry
              </Typography>
              <Typography variant="caption" sx={{ color: '#666', display: { xs: 'none', sm: 'block' } }}>
                Ministry of Commerce & Industry
              </Typography>
            </Box>
          </Box>
          
          <RoleSwitcher />
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
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

      <HeroSection>
        <Box sx={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <Typography variant="h1" sx={{ 
            fontWeight: 800, 
            color: 'white',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            mb: 2,
            fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' },
            letterSpacing: '-1px',
          }}>
            Liberia Business Registry
          </Typography>
          <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.9)', mb: 3, fontWeight: 500 }}>
            Empowering Liberian Enterprise • Digital Transformation
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', maxWidth: 600, margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Register, verify, and manage businesses seamlessly with Liberia's official digital business registry platform
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 5, flexWrap: 'wrap' }}>
            <StatCard>
              <AnimatedStatNumber>10K+</AnimatedStatNumber>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                <BusinessIcon sx={{ fontSize: 18, color: '#FFD700' }} />
                <Typography variant="body2" sx={{ color: 'white' }}>Registered Businesses</Typography>
              </Box>
            </StatCard>
            <StatCard>
              <AnimatedStatNumber>24/7</AnimatedStatNumber>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                <AccessTimeIcon sx={{ fontSize: 18, color: '#FFD700' }} />
                <Typography variant="body2" sx={{ color: 'white' }}>Online Access</Typography>
              </Box>
            </StatCard>
            <StatCard>
              <AnimatedStatNumber>100%</AnimatedStatNumber>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                <ComputerIcon sx={{ fontSize: 18, color: '#FFD700' }} />
                <Typography variant="body2" sx={{ color: 'white' }}>Digital Process</Typography>
              </Box>
            </StatCard>
          </Box>
        </Box>
      </HeroSection>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Feature Cards Section */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3, mb: 6 }}>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <FeatureIconWrapper sx={{ margin: '0 auto', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <SearchIcon sx={{ fontSize: 32, color: 'white' }} />
            </FeatureIconWrapper>
            <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Smart Search</Typography>
            <Typography variant="body2" color="textSecondary">Find any business instantly with our advanced search engine</Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <FeatureIconWrapper sx={{ margin: '0 auto', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <GppGoodIcon sx={{ fontSize: 32, color: 'white' }} />
            </FeatureIconWrapper>
            <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Verify Authenticity</Typography>
            <Typography variant="body2" color="textSecondary">QR code verification for instant certificate validation</Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <FeatureIconWrapper sx={{ margin: '0 auto', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              <AppRegistrationIcon sx={{ fontSize: 32, color: 'white' }} />
            </FeatureIconWrapper>
            <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Easy Registration</Typography>
            <Typography variant="body2" color="textSecondary">Simple 3-step process to register your business online</Typography>
          </Box>
        </Box>

        <Outlet />
      </Container>

      <Footer>
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 4, mb: 4 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#FFD700' }}>
                About LBR
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.8 }}>
                The Liberia Business Registry (LBR) is the official government platform for business registration, verification, and compliance monitoring under the Ministry of Commerce & Industry.
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#FFD700' }}>
                Quick Links
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
                {['Business Search', 'Register Business', 'Verify Certificate', 'Fee Schedule', 'Download Forms'].map((item) => (
                  <Box component="li" key={item} sx={{ mb: 1 }}>
                    <Link to="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8, transition: 'opacity 0.3s', '&:hover': { opacity: 1 } }}>
                      {item}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Box>
            
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#FFD700' }}>
                Contact
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <LocationOnIcon sx={{ fontSize: 18, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Ministry of Commerce, Monrovia</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <PhoneIcon sx={{ fontSize: 18, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>+231 (0) 77 123 4567</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <EmailIcon sx={{ fontSize: 18, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>info@lbr.gov.lr</Typography>
              </Box>
            </Box>
            
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#FFD700' }}>
                Liberia's Heritage
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', opacity: 0.9, mb: 1 }}>
                "The Love of Liberty Brought Us Here"
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>
                Established 1847 • Republic of Liberia
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ textAlign: 'center', pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © 2026 Liberia Business Registry. All rights reserved. Empowering Liberian Enterprise
            </Typography>
          </Box>
        </Container>
      </Footer>
    </>
  );
};

export default PublicLayout;
