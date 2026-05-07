import React, { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Drawer,
  List, ListItem, ListItemIcon, ListItemText, Box, Divider, Avatar, Container
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CloseIcon from '@mui/icons-material/Close';

// Glass morphism effect for AppBar
const GlassAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    color: 'white',
    width: 280,
  },
}));

const MenuItemStyled = styled(ListItem)(({ theme }) => ({
  borderRadius: '12px',
  margin: '4px 8px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255,255,255,0.1)',
    transform: 'translateX(5px)',
  },
  '&.Mui-selected': {
    background: 'rgba(255,215,0,0.2)',
    borderLeft: `3px solid #FFD700`,
  },
}));

const LogoutButton = styled(ListItem)(({ theme }) => ({
  borderRadius: '12px',
  margin: '4px 8px',
  transition: 'all 0.3s ease',
  color: '#ff6b6b',
  '&:hover': {
    background: 'rgba(255,107,107,0.1)',
    transform: 'translateX(5px)',
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
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

const getRoleColor = (role) => {
  switch(role) {
    case 'owner':
      return '#4CAF50';
    case 'lbr_officer':
      return '#2196F3';
    case 'lra_officer':
      return '#FF9800';
    case 'admin':
      return '#f44336';
    default:
      return '#1a1a2e';
  }
};

const getRoleIcon = (role) => {
  switch(role) {
    case 'owner':
      return '🏢';
    case 'lbr_officer':
      return '📋';
    case 'lra_officer':
      return '💰';
    case 'admin':
      return '⚙️';
    default:
      return '👤';
  }
};

const getRoleDisplayName = (role) => {
  switch(role) {
    case 'owner':
      return 'Business Owner';
    case 'lbr_officer':
      return 'LBR Officer';
    case 'lra_officer':
      return 'LRA Officer';
    case 'admin':
      return 'Administrator';
    default:
      return 'User';
  }
};

const DashboardLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || 'owner';
  const roleColor = getRoleColor(userRole);
  const roleIcon = getRoleIcon(userRole);
  const roleDisplayName = getRoleDisplayName(userRole);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const getMenuItems = () => {
    switch(userRole) {
      case 'owner':
        return [
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/owner' },
          { text: 'My Applications', icon: <BusinessIcon />, path: '/owner/applications' },
          { text: 'Payments', icon: <PaymentIcon />, path: '/owner/payments' },
          { text: 'Certificates', icon: <ReceiptIcon />, path: '/owner/certificates' }
        ];
      case 'lbr_officer':
        return [
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/lbr' },
          { text: 'Applications', icon: <BusinessIcon />, path: '/lbr/applications' },
          { text: 'Verification Queue', icon: <VerifiedUserIcon />, path: '/lbr/verify' }
        ];
      case 'lra_officer':
        return [
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/lra' },
          { text: 'Tax Assessments', icon: <AssessmentIcon />, path: '/lra/assessments' },
          { text: 'Payment Reports', icon: <PaymentIcon />, path: '/lra/reports' }
        ];
      case 'admin':
        return [
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
          { text: 'User Management', icon: <PeopleIcon />, path: '/admin/users' },
          { text: 'Audit Logs', icon: <ReceiptIcon />, path: '/admin/audit-logs' },
          { text: 'System Settings', icon: <AssessmentIcon />, path: '/admin/settings' }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      <GlassAppBar position="sticky">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              edge="start" 
              onClick={() => setDrawerOpen(true)}
              sx={{ color: '#1a1a2e' }}
            >
              <MenuIcon />
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                component="img"
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%231a1a2e'/%3E%3Cpolygon points='50,30 58,45 75,45 62,55 68,70 50,60 32,70 38,55 25,45 42,45' fill='%23FFD700'/%3E%3C/svg%3E"
                sx={{ width: 35, height: 35, mr: 1.5 }}
              />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.5px' }}>
                  LBR Portal
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  {roleDisplayName}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: roleColor,
                width: 40,
                height: 40,
                fontSize: '1.2rem'
              }}
            >
              {roleIcon}
            </Avatar>
            <NavButton onClick={handleLogout} startIcon={<LogoutIcon />}>
              Logout
            </NavButton>
          </Box>
        </Toolbar>
      </GlassAppBar>

      <StyledDrawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: roleColor, width: 45, height: 45, fontSize: '1.5rem' }}>
                {roleIcon}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'white' }}>
                  {roleDisplayName}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Logged in as {userRole}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 2 }} />
          
          <List>
            {menuItems.map((item) => (
              <MenuItemStyled 
                button 
                key={item.text} 
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }}
                />
              </MenuItemStyled>
            ))}
          </List>
          
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 2 }} />
          
          <LogoutButton button onClick={handleLogout}>
            <ListItemIcon sx={{ color: '#ff6b6b', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }}
            />
          </LogoutButton>
        </Box>
      </StyledDrawer>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
      
      <Box component="footer" sx={{ 
        py: 3, 
        mt: 'auto', 
        textAlign: 'center',
        borderTop: '1px solid rgba(0,0,0,0.05)',
        bgcolor: '#f5f5f5'
      }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="textSecondary">
            © 2026 Liberia Business Registry. {roleDisplayName} Portal
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default DashboardLayout;
