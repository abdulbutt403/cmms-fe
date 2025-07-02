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
import AddBuildingDialog from '../../components/dialogs/AddBuilding';

export default function BuildingsTable() {
  const [buildings, setBuildings] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [editBuilding, setEditBuilding] = useState(null);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const res = await api.get('/buildings');
        if (res.data.success) {
          setBuildings(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch buildings', err);
      }
    };
    fetchBuildings();
  }, []);

  const handleAddBuilding = (newBuilding) => {
    setBuildings((prevBuildings) => [...prevBuildings, newBuilding]);
    setOpenAddModal(false);
  };

  const handleEditBuilding = (building) => {
    setEditBuilding(building);
    setOpenAddModal(true);
  };

  const handleUpdateBuilding = (updatedBuilding) => {
    setBuildings((prevBuildings) =>
      prevBuildings.map((building) =>
        building._id === updatedBuilding._id ? updatedBuilding : building
      )
    );
    setOpenAddModal(false);
    setEditBuilding(null);
  };

  const handleDeleteBuilding = async (buildingId) => {
    try {
      const res = await api.delete(`/buildings/${buildingId}`);
      if (res.data.success) {
        setBuildings((prevBuildings) => prevBuildings.filter((building) => building._id !== buildingId));
      }
    } catch (err) {
      console.error('Failed to delete building', err);
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

  const filteredBuildings = filterStatus
    ? buildings.filter((building) => building.status === filterStatus)
    : buildings;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h2" sx={{ mb: 3 }}>
        Buildings List
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
            setEditBuilding(null);
            setOpenAddModal(true);
          }}
        >
          Add Building
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
                <TableCell>Building Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBuildings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((building) => (
                  <TableRow key={building._id}>
                    <TableCell>{building.buildingName || 'N/A'}</TableCell>
                    <TableCell>{building.address || 'N/A'}</TableCell>
                    <TableCell>{building.status || 'N/A'}</TableCell>
                    <TableCell>{new Date(building.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleEditBuilding(building)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteBuilding(building._id)}>
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
            count={filteredBuildings.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Card>

      <AddBuildingDialog
        open={openAddModal}
        onClose={() => {
          setOpenAddModal(false);
          setEditBuilding(null);
        }}
        onBuildingAdded={editBuilding ? handleUpdateBuilding : handleAddBuilding}
        initialValues={editBuilding}
        isEdit={!!editBuilding}
      />
    </Box>
  );
}