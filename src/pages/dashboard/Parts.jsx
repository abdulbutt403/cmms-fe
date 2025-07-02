"use client";
import React, { useState, useEffect } from "react";
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
  Card,
} from "@mui/material";
import MainCard from "components/MainCard";
import AddIcon from "@ant-design/icons/PlusOutlined";
import EditIcon from "@ant-design/icons/EditOutlined";
import DeleteIcon from "@ant-design/icons/DeleteOutlined";
import EyeIcon from "@ant-design/icons/EyeOutlined";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import AddPartsDialog from "../../components/dialogs/AddParts";
export default function PartsTable() {
  const [parts, setParts] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [editPart, setEditPart] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    try {
      const res = await api.get("/parts");
      if (res.data.success) {
        setParts(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch parts", err);
    }
  };

  const handleAddPart = (newPart) => {
    setParts((prevParts) => [...prevParts, newPart]);
    setOpenAddModal(false);
  };

  const handleEditPart = (part) => {
    setEditPart(part);
    setOpenAddModal(true);
  };

  const handleUpdatePart = (updatedPart) => {
    setParts((prevParts) =>
      prevParts.map((part) =>
        part._id === updatedPart._id ? updatedPart : part
      )
    );
    setOpenAddModal(false);
    setEditPart(null);
  };

  const handleDeletePart = async (partId) => {
    try {
      const res = await api.delete(`/parts/${partId}`);
      if (res.data.success) {
        setParts((prevParts) => prevParts.filter((part) => part._id !== partId));
      }
    } catch (err) {
      console.error("Failed to delete part", err);
    }
  };

  const handleViewPart = (partId) => {
    navigate(`/dashboard/part/${partId}`);
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

  const filteredParts = filterStatus
    ? parts.filter((part) => part.status === filterStatus)
    : parts;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h2" sx={{ mb: 3 }}>
        Parts List
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FormControl sx={{ minWidth: 200, mr: 2 }}>
            <InputLabel>Filter Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={handleFilterChange}
              label="Filter Status"
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="In Stock">In Stock</MenuItem>
              <MenuItem value="Out of Stock">Out of Stock</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditPart(null);
            setOpenAddModal(true);
          }}
        >
          Add Part
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
                <TableCell>Part Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Building</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredParts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((part) => (
                  <TableRow key={part._id}>
                    <TableCell>{part.partName || "N/A"}</TableCell>
                    <TableCell>{part.category?.name || "N/A"}</TableCell>
                    <TableCell>{part.building?.buildingName || "N/A"}</TableCell>
                    <TableCell>{part.status || "N/A"}</TableCell>
                    <TableCell>{new Date(part.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewPart(part._id)}
                      >
                        <EyeIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEditPart(part)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeletePart(part._id)}
                      >
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
            count={filteredParts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Card>

      <AddPartsDialog
        open={openAddModal}
        onClose={() => {
          setOpenAddModal(false);
          setEditPart(null);
          fetchParts();
        }}
        onPartAdded={editPart ? handleUpdatePart : handleAddPart}
        initialValues={editPart}
      />
    </Box>
  );
}