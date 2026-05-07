import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem
} from '@mui/material';
import { adminAPI } from '../../services/api';
import AddIcon from '@mui/icons-material/Add';

const UsersManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    phone: '',
    full_name: '',
    user_type: 'owner',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      await adminAPI.createUser(newUser);
      setOpenDialog(false);
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">User Management</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add User
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>User Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.user_type?.toUpperCase()} 
                    size="small"
                    color={user.user_type === 'admin' ? 'error' : 'primary'}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.is_verified ? 'VERIFIED' : 'PENDING'} 
                    size="small"
                    color={user.is_verified ? 'success' : 'warning'}
                  />
                </TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Full Name"
            margin="normal"
            value={newUser.full_name}
            onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
          />
          <TextField
            fullWidth
            label="Phone"
            margin="normal"
            value={newUser.phone}
            onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
          />
          <TextField
            fullWidth
            select
            label="User Type"
            margin="normal"
            value={newUser.user_type}
            onChange={(e) => setNewUser({...newUser, user_type: e.target.value})}
          >
            <MenuItem value="owner">Business Owner</MenuItem>
            <MenuItem value="applicant">Applicant</MenuItem>
            <MenuItem value="lbr_officer">LBR Officer</MenuItem>
            <MenuItem value="lra_officer">LRA Officer</MenuItem>
            <MenuItem value="admin">Administrator</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={newUser.password}
            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateUser} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UsersManagementPage;
