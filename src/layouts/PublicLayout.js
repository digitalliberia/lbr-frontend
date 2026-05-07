import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, useTheme, Fade } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import RoleSwitcher from '../components/RoleSwitcher';
import PublicIcon from '@mui/icons-material/Public';
import FlagIcon from '@mui/icons-material/Flag';
import VerifiedIcon from '@mui/icons-material/Verified';
import SearchIcon from '@mui/icons-material/Search';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

// Heartbeat animation for the flag
const heartbeat = keyframes`
  0% {
    transform: scale(1);
  }
  25% {
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

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const rotateGlow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(255,215,0,0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(255,215,0,0.8);
  }
  100% {
    box-shadow: 0 0 5px rgba(255,215,0,0.5);
  }
`;

// Styled components for modern effects
const GlassAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.08)',
  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
}));

const NavButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  color: '#002868',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
  padding: '6px 16px',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: 0,
    height: '2px',
    background: 'linear-gradient(90deg, #BF0A30, #002868)',
    transition: 'all 0.3s ease',
    transform: 'translateX(-50%)',
  },
  '&:hover': {
    background: 'linear-gradient(135deg, #002868 0%, #BF0A30 100%)',
    color: 'white',
    transform: 'translateY(-2px)',
    '&::before': {
      width: '80%',
    },
  },
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #002868 0%, #BF0A30 50%, #002868 100%)',
  borderRadius: '30px',
  padding: theme.spacing(10, 4),
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)',
    backgroundSize: '60px 60px',
    animation: `${shimmer} 3s linear infinite`,
    pointerEvents: 'none',
  },
}));

const LiberianFlag = styled(Box)(({ theme }) => ({
  width: '80px',
  height: '50px',
  position: 'relative',
  background: 'linear-gradient(90deg, #BF0A30 0%, #BF0A30 33%, #FFFFFF 33%, #FFFFFF 66%, #002868 66%, #002868 100%)',
  borderRadius: '8px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
  margin: '0 auto',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  animation: `${heartbeat} 2s ease-in-out infinite`,
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 12px 28px rgba(0,0,0,0.3)',
  },
  '&::before': {
    content: '"★"',
    position: 'absolute',
    top: '50%',
    left: '49%',
    transform: 'translate(-50%, -50%)',
    color: '#FFFFFF',
    fontSize: '24px',
    textShadow: '0 0 5px rgba(0,0,0,0.3)',
    zIndex: 1,
    animation: `${rotateGlow} 2s ease-in-out infinite`,
  },
}));

const Footer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #002868 0%, #001a4d 100%)',
  color: 'white',
  padding: theme.spacing(6, 0, 3),
  marginTop: 'auto',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #BF0A30, #FFFFFF, #BF0A30)',
  },
}));

const StatCard = styled(Box)(({ theme }) => ({
  background: 'rgba(255,255,255,0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  padding: theme.spacing(3),
  textAlign: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    background: 'rgba(255,255,255,0.2)',
  },
}));

const PublicLayout = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const theme = useTheme();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <GlassAppBar position="sticky">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box sx={{ 
              width: 40, 
              height: 25, 
              background: 'linear-gradient(90deg, #BF0A30 0%, #BF0A30 33%, #FFFFFF 33%, #FFFFFF 66%, #002868 66%, #002868 100%)',
              borderRadius: '4px',
              mr: 1.5,
              position: 'relative',
              '&::before': {
                content: '"★"',
                position: 'absolute',
                top: '50%',
                left: '49%',
                transform: 'translate(-50%, -50%)',
                color: '#FFFFFF',
                fontSize: '12px',
              },
            }} />
            <Typography variant="h6" sx={{ 
              fontWeight: 800, 
              background: 'linear-gradient(135deg, #002868 0%, #BF0A30 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '-0.5px',
            }}>
              Liberia Business Registry
            </Typography>
            <Typography variant="caption" sx={{ ml: 1, color: '#666', display: { xs: 'none', sm: 'block' } }}>
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

      <HeroSection>
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <LiberianFlag />
          
          <Fade in timeout={1000}>
            <Box>
              <Typography variant="h1" sx={{ 
                fontWeight: 800, 
                color: 'white',
                textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
                mb: 2,
                fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
                mt: 3
              }}>
                LBR Business Registry
              </Typography>
              <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.95)', mb: 2, fontWeight: 500 }}>
                Republic of Liberia • Ministry of Commerce & Industry
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', maxWidth: 700, margin: '0 auto', fontSize: '1.1rem' }}>
                Empowering Liberian enterprises through transparent, efficient, and modern business registration services
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 4, flexWrap: 'wrap' }}>
                <StatCard>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#FFD700' }}>10K+</Typography>
                  <Typography variant="body2">Registered Businesses</Typography>
                </StatCard>
                <StatCard>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#FFD700' }}>24/7</Typography>
                  <Typography variant="body2">Online Access</Typography>
                </StatCard>
                <StatCard>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#FFD700' }}>100%</Typography>
                  <Typography variant="body2">Digital Process</Typography>
                </StatCard>
              </Box>
            </Box>
          </Fade>
        </Box>
      </HeroSection>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>

      <Footer>
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 4, mb: 4 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <FlagIcon /> About LBR
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.8 }}>
                The Liberia Business Registry (LBR) is the official government platform for business registration, verification, and compliance monitoring.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <LiberianFlag sx={{ width: 50, height: 30, animation: 'none', '&:hover': { animation: `${heartbeat} 2s ease-in-out infinite` } }} />
              </Box>
            </Box>
            
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Quick Links</Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
                {['Business Search', 'Register Business', 'Verify Certificate', 'Fee Schedule', 'Download Forms'].map((item) => (
                  <Box component="li" key={item} sx={{ mb: 1 }}>
                    <Link to="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.9, transition: 'opacity 0.3s', '&:hover': { opacity: 1 } }}>
                      {item}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Box>
            
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Contact Information</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <LocationOnIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2">Ministry of Commerce, Monrovia</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <PhoneIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2">+231 (0) 77 123 4567</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <EmailIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2">info@lbr.gov.lr</Typography>
              </Box>
            </Box>
            
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Liberia's Heritage</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Box component="span" sx={{ fontSize: 30, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.2)' } }}>🦁</Box>
                <Box component="span" sx={{ fontSize: 30, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.2)' } }}>🌴</Box>
                <Box component="span" sx={{ fontSize: 30, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.2)' } }}>⚓</Box>
                <Box component="span" sx={{ fontSize: 30, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.2)' } }}>🏝️</Box>
                <Box component="span" sx={{ fontSize: 30, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.2)' } }}>🌍</Box>
              </Box>
              <Typography variant="body2" sx={{ fontStyle: 'italic', opacity: 0.9 }}>
                "The Love of Liberty Brought Us Here"
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 1 }}>
                Established 1847
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
