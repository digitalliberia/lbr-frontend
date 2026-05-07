import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Select, MenuItem, FormControl, Box, Typography } from '@mui/material';

const RoleSwitcher = () => {
  const navigate = useNavigate();
  const currentRole = localStorage.getItem('userRole') || 'public';

  const roles = [
    { value: 'public', label: '👤 Public Portal', path: '/' },
    { value: 'owner', label: '🏢 Owner Portal', path: '/owner' },
    { value: 'lbr_officer', label: '📋 LBR Portal', path: '/lbr' },
    { value: 'lra_officer', label: '💰 LRA Portal', path: '/lra' },
    { value: 'admin', label: '⚙️ Admin Portal', path: '/admin' },
  ];

  const handleRoleChange = (event) => {
    const role = event.target.value;
    const selectedRole = roles.find(r => r.value === role);
    
    // Set test token and role
    localStorage.setItem('token', `test-token-${role}`);
    localStorage.setItem('userRole', role);
    
    // Navigate to the portal
    navigate(selectedRole.path);
    
    // Reload to refresh layout
    window.location.reload();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography variant="body2" color="textSecondary">
        Test Mode:
      </Typography>
      <FormControl size="small">
        <Select
          value={currentRole}
          onChange={handleRoleChange}
          sx={{ bgcolor: 'white', minWidth: 180 }}
        >
          {roles.map((role) => (
            <MenuItem key={role.value} value={role.value}>
              {role.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default RoleSwitcher;
