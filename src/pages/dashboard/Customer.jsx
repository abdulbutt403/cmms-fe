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
  Typography,
  TablePagination,
  Card
} from '@mui/material';
import MainCard from 'components/MainCard';
import AddIcon from '@ant-design/icons/PlusOutlined';
import EditIcon from '@ant-design/icons/EditOutlined';
import DeleteIcon from '@ant-design/icons/DeleteOutlined';
import AddCustomerDialog from '../../components/dialogs/AddCustomer';
import api from '../../api/api';

export default function CustomersTable() {
  const [customers, setCustomers] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);

  useEffect(() => {

    fetchCustomers();
  }, []);


      const fetchCustomers = async () => {
      try {
        const res = await api.get('/customers');
        if (res.data.success) {
          setCustomers(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch customers', err);
      }
    };

  const handleAddCustomer = (newCustomer) => {
    setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
    setOpenAddModal(false);
  };

  const handleEditCustomer = (customer) => {
    setEditCustomer(customer);
    setOpenAddModal(true);
  };

  const handleUpdateCustomer = (updatedCustomer) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer._id === updatedCustomer._id ? updatedCustomer : customer
      )
    );
    setOpenAddModal(false);
    setEditCustomer(null);
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      const res = await api.delete(`/customers/${customerId}`);
      if (res.data.success) {
        setCustomers((prevCustomers) => prevCustomers.filter((customer) => customer._id !== customerId));
      }
    } catch (err) {
      console.error('Failed to delete customer', err);
    }
  };

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredCustomers = filterType
    ? customers.filter((customer) => customer.customerType?.name === filterType)
    : customers;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h2" sx={{ mb: 3 }}>
        Customers List
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 200, mr: 2 }}>
            <InputLabel>Filter by Type</InputLabel>
            <Select value={filterType} onChange={handleFilterChange} label="Filter by Type">
              <MenuItem value="">All Types</MenuItem>
              {/* Populate dynamically once CustomerType is fetched */}
            </Select>
          </FormControl>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditCustomer(null);
            setOpenAddModal(true);
          }}
        >
          Add Customer
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
                <TableCell>Customer Name</TableCell>
                <TableCell>Customer Type</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Contact Name</TableCell>
                <TableCell>Contact Phone</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((customer) => (
                  <TableRow key={customer._id}>
                    <TableCell>{customer.name || 'N/A'}</TableCell>
                    <TableCell>{customer.customerType?.name || 'N/A'}</TableCell>
                    <TableCell>{customer.address || 'N/A'}</TableCell>
                    <TableCell>{customer.contactName || 'N/A'}</TableCell>
                    <TableCell>{customer.contactPhone || 'N/A'}</TableCell>
                    <TableCell>{new Date(customer.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleEditCustomer(customer)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteCustomer(customer._id)}>
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
            count={filteredCustomers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Card>

      <AddCustomerDialog
        open={openAddModal}
        setOpen={setOpenAddModal}
        fetchCustomers={fetchCustomers}
        onClose={() => {
          setOpenAddModal(false);
          setEditCustomer(null);
        }}
        onCustomerAdded={editCustomer ? handleUpdateCustomer : handleAddCustomer}
        initialValues={editCustomer}
      />
    </Box>
  );
}