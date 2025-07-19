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
import api from '../../api/api';
import AddVendorDialog from '../../components/dialogs/AddVendor';

export default function VendorsTable() {
  const [vendors, setVendors] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [editVendor, setEditVendor] = useState(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
      try {
        const res = await api.get('/vendors');
        if (res.data.success) {
          setVendors(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch vendors', err);
      }
  };

  const handleAddVendor = (newVendor) => {
    setVendors((prevVendors) => [...prevVendors, newVendor]);
    setOpenAddModal(false);
  };

  const handleEditVendor = (vendor) => {
    setEditVendor(vendor);
    setOpenAddModal(true);
  };

  const handleUpdateVendor = (updatedVendor) => {
    setVendors((prevVendors) =>
      prevVendors.map((vendor) =>
        vendor._id === updatedVendor._id ? updatedVendor : vendor
      )
    );
    setOpenAddModal(false);
    setEditVendor(null);
  };

  const handleDeleteVendor = async (vendorId) => {
    try {
      const res = await api.delete(`/vendors/${vendorId}`);
      if (res.data.success) {
        setVendors((prevVendors) => prevVendors.filter((vendor) => vendor._id !== vendorId));
      }
    } catch (err) {
      console.error('Failed to delete vendor', err);
    }
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredVendors = filterStatus
    ? vendors.filter((vendor) => vendor.status === filterStatus)
    : vendors;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h2" sx={{ mb: 3 }}>
        Vendors List
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 200, mr: 2 }}>
            <InputLabel>Filter Status</InputLabel>
            <Select value={filterStatus} onChange={handleFilterChange} label="Filter Status">
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditVendor(null);
            setOpenAddModal(true);
          }}
        >
          Add Vendor
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
                <TableCell>Vendor Name</TableCell>
                <TableCell>Vendor Type</TableCell>
                <TableCell>Contact Name</TableCell>
                <TableCell>Contact Phone</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVendors
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((vendor) => (
                  <TableRow key={vendor._id}>
                    <TableCell>{vendor.vendorName || 'N/A'}</TableCell>
                    <TableCell>{vendor.vendorType?.name || vendor.vendorType || 'N/A'}</TableCell>
                    <TableCell>{vendor.contactName || 'N/A'}</TableCell>
                    <TableCell>{vendor.contactPhone || 'N/A'}</TableCell>
                    <TableCell>{new Date(vendor.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleEditVendor(vendor)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteVendor(vendor._id)}>
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
            count={filteredVendors.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Card>

      <AddVendorDialog
        open={openAddModal}
        setOpen={setOpenAddModal}
        fetchVendors={fetchVendors}
        onClose={() => {
          setOpenAddModal(false);
          setEditVendor(null);
        }}
        onVendorAdded={editVendor ? handleUpdateVendor : handleAddVendor}
        initialValues={editVendor}
        isEdit={!!editVendor}
      />
    </Box>
  );
}