import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Drawer,
  List, ListItem, ListItemIcon, ListItemText, Box, Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LogoutIcon from '@mui/icons-material/Logout';

const DashboardLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

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
          { text: 'Applications', icon: <BusinessIcon />, path: '/owner/applications' },
          { text: 'Payments', icon: <PaymentIcon />, path: '/owner/payments' },
          { text: 'Certificates', icon: <ReceiptIcon />, path: '/owner/certificates' }
        ];
      case 'lbr_officer':
        return [
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/lbr' },
          { text: 'Applications', icon: <BusinessIcon />, path: '/lbr/applications' }
        ];
      case 'lra_officer':
        return [
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/lra' },
          { text: 'Tax Assessment', icon: <PaymentIcon />, path: '/lra/assessments' }
        ];
      case 'admin':
        return [
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
          { text: 'Users', icon: <BusinessIcon />, path: '/admin/users' },
          { text: 'Audit Logs', icon: <ReceiptIcon />, path: '/admin/audit-logs' }
        ];
      default:
        return [];
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            LBR Portal - {userRole?.toUpperCase()}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {getMenuItems().map((item) => (
              <ListItem button key={item.text} onClick={() => {
                navigate(item.path);
                setDrawerOpen(false);
              }}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <ListItem button onClick={handleLogout}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </Box>
      </Drawer>
      <Box sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </>
  );
};

export default DashboardLayout;
