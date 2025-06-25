import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  TablePagination,
  Card
} from '@mui/material';
import MainCard from 'components/MainCard';
import AddIcon from '@ant-design/icons/PlusOutlined';
import EditIcon from '@ant-design/icons/EditOutlined';
import DeleteIcon from '@ant-design/icons/DeleteOutlined';
import api from '../../api/api';
import AddUserForm from '../../components/dialogs/AddUsers';

const userRoleColors = {
  admin: 'primary',
  manager: 'warning',
  technician: 'success'
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddModal, setOpenAddModal] = useState(false);

  useEffect(() => {


    fetchUsers();
  }, []);


      const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        if (response.data.success) {
          setUsers(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

  const handleAddUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setOpenAddModal(false);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      if (response.data.success) {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleFilterChange = (event) => {
    setFilterRole(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredUsers = filterRole ? users.filter((user) => user.userRole === filterRole) : users;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h2" sx={{ mb: 3 }}>
        Users List
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 200, mr: 2 }}>
            <InputLabel>Filter Role</InputLabel>
            <Select value={filterRole} onChange={handleFilterChange} label="Filter Role">
              <MenuItem value="">All Roles</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="technician">Technician</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAddModal(true)}>
          Add User
        </Button>
      </Box>
 <Card sx={{ 
          borderRadius: 3,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #f3f4f6'
        }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Job Title</TableCell>
                <TableCell>User Role</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.jobTitle || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip label={user.userRole} color={userRoleColors[user.userRole]} size="small" />
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteUser(user._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Card>

      <AddUserForm
        open={openAddModal}
        onClose={() => {
          setOpenAddModal(false);
          fetchUsers(); // Refresh the user list after closing the modal
        }}
        onSave={handleAddUser}
      />
    </Box>
  );
}