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
import EyeIcon from '@ant-design/icons/EyeOutlined'; // Import the view icon
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import api from '../../api/api';
import AddAssetDialog from '../../components/dialogs/AddAssets';

export default function AssetsTable() {
  const [assets, setAssets] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [editAsset, setEditAsset] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await api.get('/assets');
        if (res.data.success) {
          setAssets(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch assets', err);
      }
    };
    fetchAssets();
  }, []);

  const handleAddAsset = (newAsset) => {
    setAssets((prevAssets) => [...prevAssets, newAsset]);
    setOpenAddModal(false);
  };

  const handleEditAsset = (asset) => {
    setEditAsset(asset);
    setOpenAddModal(true);
  };

  const handleUpdateAsset = (updatedAsset) => {
    setAssets((prevAssets) =>
      prevAssets.map((asset) =>
        asset._id === updatedAsset._id ? updatedAsset : asset
      )
    );
    setOpenAddModal(false);
    setEditAsset(null);
  };

  const handleDeleteAsset = async (assetId) => {
    try {
      const res = await api.delete(`/assets/${assetId}`);
      if (res.data.success) {
        setAssets((prevAssets) => prevAssets.filter((asset) => asset._id !== assetId));
      }
    } catch (err) {
      console.error('Failed to delete asset', err);
    }
  };

  const handleViewAsset = (assetId) => {
    navigate(`/dashboard/asset/${assetId}`); // Navigate to the asset view page
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

  const filteredAssets = filterStatus
    ? assets.filter((asset) => asset.status === filterStatus)
    : assets;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h2" sx={{ mb: 3 }}>
        Assets List
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 200, mr: 2 }}>
            <InputLabel>Filter Status</InputLabel>
            <Select value={filterStatus} onChange={handleFilterChange} label="Filter Status">
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="Maintenance">Maintenance</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditAsset(null);
            setOpenAddModal(true);
          }}
        >
          Add Asset
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
                <TableCell>Asset Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Building</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAssets
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((asset) => (
                  <TableRow key={asset._id}>
                    <TableCell>{asset.assetName || 'N/A'}</TableCell>
                    <TableCell>{asset.category || 'N/A'}</TableCell>
                    <TableCell>{asset.building?.buildingName || 'N/A'}</TableCell>
                    <TableCell>{asset.status || 'N/A'}</TableCell>
                    <TableCell>{new Date(asset.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleViewAsset(asset._id)}>
                        <EyeIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleEditAsset(asset)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteAsset(asset._id)}>
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
            count={filteredAssets.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Card>

      <AddAssetDialog
        open={openAddModal}
        onClose={() => {
          setOpenAddModal(false);
          setEditAsset(null);
        }}
        onAssetAdded={editAsset ? handleUpdateAsset : handleAddAsset}
        initialValues={editAsset}
      />
    </Box>
  );
}