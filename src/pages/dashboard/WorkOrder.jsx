import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Tab,
  Tabs,
  Typography,
  Grid,
  Card,
  CardContent,
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
  TablePagination,
  alpha,
  useTheme
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import FilterOutlined from '@ant-design/icons/FilterOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import UnorderedListOutlined from '@ant-design/icons/UnorderedListOutlined';
import ProjectOutlined from '@ant-design/icons/ProjectOutlined';
import WorkOrderDialog from '../../components/dialogs/AddOrder';
import api from '../../api/api';

const priorityColors = {
  Low: { color: '#10b981', bg: '#ecfdf5' },
  Medium: { color: '#f59e0b', bg: '#fffbeb' },
  High: { color: '#ef4444', bg: '#fef2f2' }
};

const statusColors = {
  Open: { color: '#ef4444', bg: '#fef2f2' },
  'In Progress': { color: '#3b82f6', bg: '#eff6ff' },
  'On Hold': { color: '#8b5cf6', bg: '#f5f3ff' },
  Completed: { color: '#10b981', bg: '#ecfdf5' },
  Closed: { color: '#6b7280', bg: '#f9fafb' }
};

const statusColumns = [
  {
    key: 'Open',
    label: 'Open',
    gradient: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    borderColor: '#fca5a5',
    headerBg: '#fef2f2'
  },
  {
    key: 'In Progress',
    label: 'In Progress',
    gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    borderColor: '#93c5fd',
    minWidth: 500,
    headerBg: '#eff6ff'
  },
  {
    key: 'On Hold',
    label: 'On Hold',
    gradient: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
    borderColor: '#c4b5fd',
    headerBg: '#f5f3ff'
  },
  {
    key: 'Completed',
    label: 'Completed',
    gradient: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
    borderColor: '#6ee7b7',
    headerBg: '#ecfdf5'
  }
];

export default function WorkOrder() {
  const theme = useTheme();
  const [workOrders, setWorkOrders] = useState([]);
  const [viewMode, setViewMode] = useState('board');
  const [openAddModal, setOpenAddModal] = useState(false);
  const [editWorkOrder, setEditWorkOrder] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterCategory, setFilterCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchWorkOrders();
    fetchCategories();
  }, []); // Fetch on mount

  const handleViewModeChange = (event, newValue) => {
    setViewMode(newValue);
  };

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  const fetchWorkOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/workorders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) {
        setWorkOrders(response.data.data); // Assuming data is in response.data.data
      } else {
        setError('Failed to fetch work orders');
      }
    } catch (err) {
      setError(err.message || 'Server error');
      console.error('Fetch work orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data.success) {
        const workOrderCategories = res.data.categories.filter((category) => category.type === 'workOrder');
        setCategories(workOrderCategories);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    // Find the dragged work order
    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;
    if (sourceStatus === destStatus && source.index === destination.index) return;

    // Find the work order in the filtered list
    const workOrderId = filteredWorkOrders.filter((wo) => wo.status === sourceStatus)[source.index]._id;
    const updatedWorkOrders = [...workOrders];
    const workOrderIdx = updatedWorkOrders.findIndex((wo) => wo._id === workOrderId);
    if (workOrderIdx === -1) return;

    // Update status locally
    updatedWorkOrders[workOrderIdx] = { ...updatedWorkOrders[workOrderIdx], status: destStatus };
    setWorkOrders(updatedWorkOrders);

    // Update backend
    api
      .put(
        `/workorders/${workOrderId}`,
        { status: destStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )
      .catch((err) => console.error('Update status error:', err));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilterCategory(event.target.value);
  };

  const filteredWorkOrders = filterCategory ? workOrders.filter((wo) => wo.category === filterCategory) : workOrders;

  const CustomChip = ({ label, type, value }) => {
    const colors = type === 'priority' ? priorityColors[value] : statusColors[value];
    return (
      <Chip
        label={label}
        size="small"
        sx={{
          backgroundColor: colors?.bg || '#f3f4f6',
          color: colors?.color || '#374151',
          border: 'none',
          fontWeight: 500,
          fontSize: '0.75rem',
          height: '24px',
          '& .MuiChip-label': { px: 1.5 }
        }}
      />
    );
  };

  const handleEditWorkOrder = (workOrder) => {
    setEditWorkOrder(workOrder);
    setOpenEditModal(true);
  };

  const handleDeleteWorkOrder = async (id) => {
    try {
      await api.delete(`/workorders/${id}`);
      setWorkOrders((prev) => prev.filter((wo) => wo._id !== id));
    } catch (err) {
      alert('Failed to delete work order');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 4, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            mb: 1,
            fontWeight: 600,
            color: '#1f2937',
            fontSize: '2rem'
          }}
        >
          Work Orders
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#6b7280',
            fontSize: '1rem'
          }}
        >
          Manage and track your maintenance work orders
        </Typography>
      </Box>

      {/* Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Tabs
            value={viewMode}
            onChange={handleViewModeChange}
            sx={{
              '& .MuiTab-root': {
                minWidth: 'auto',
                px: 2,
                py: 1,
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#6b7280',
                '&.Mui-selected': { color: '#3b82f6' }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#3b82f6',
                height: 2,
                borderRadius: 1
              }
            }}
          >
            <Tab icon={<UnorderedListOutlined style={{ fontSize: 18 }} />} value="table" label="Table" iconPosition="start" />
            <Tab icon={<ProjectOutlined style={{ fontSize: 18 }} />} value="board" label="Board" iconPosition="start" />
          </Tabs>

          <FormControl
            size="small"
            sx={{
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                borderRadius: 2,
                '& fieldset': { borderColor: '#e5e7eb' },
                '&:hover fieldset': { borderColor: '#d1d5db' }
              }
            }}
          >
            <Select value={filterCategory} onChange={handleFilterChange} label="Filter Category" displayEmpty>
              <MenuItem value="">
                <em>All Categories</em>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat.name}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Button
          variant="contained"
          startIcon={<PlusOutlined />}
          onClick={handleOpenAddModal}
          sx={{
            backgroundColor: '#3b82f6',
            color: 'white',
            px: 3,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            '&:hover': {
              backgroundColor: '#2563eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }
          }}
        >
          Add Work Order
        </Button>
      </Box>

      {/* Table View */}
      {viewMode === 'table' && (
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            border: '1px solid #f3f4f6'
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Asset</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Start Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Submitted By</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredWorkOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((workOrder) => (
                  <TableRow
                    key={workOrder._id}
                    sx={{
                      '&:hover': { backgroundColor: '#f9fafb' }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{workOrder.title}</TableCell>
                    <TableCell>{workOrder.category}</TableCell>
                    <TableCell>{workOrder.asset}</TableCell>
                    <TableCell>
                      <CustomChip label={workOrder.priority} type="priority" value={workOrder.priority} />
                    </TableCell>
                    <TableCell>
                      <CustomChip label={workOrder.status} type="status" value={workOrder.status} />
                    </TableCell>
                    <TableCell>{workOrder.startDate}</TableCell>
                    <TableCell>{workOrder.dueDate}</TableCell>
                    <TableCell>
                      {workOrder.submittedBy.firstName} {workOrder.submittedBy.lastName || ''}
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" sx={{ mr: 1 }} onClick={() => handleEditWorkOrder(workOrder)}>
                        <EditOutlined />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteWorkOrder(workOrder._id)}>
                        <DeleteOutlined />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredWorkOrders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Card>
      )}

      {/* Board View */}
      {viewMode === 'board' && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Grid container spacing={3}>
            {statusColumns.map((column) => {
              const columnWorkOrders = filteredWorkOrders.filter((wo) => wo.status === column.key);

              return (
                <Grid item xs={12} sm={6} md={3} key={column.key} style={{ width: '23%' }}>
                  <Box
                    sx={{
                      background: column.gradient,
                      borderRadius: 3,
                      border: `2px dashed ${column.borderColor}`,
                      overflow: 'hidden',
                      height: 'fit-content',
                      minHeight: 600
                    }}
                  >
                    {/* Column Header */}
                    <Box
                      sx={{
                        backgroundColor: column.headerBg,
                        px: 3,
                        py: 2,
                        borderBottom: `1px solid ${column.borderColor}`
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: '#374151',
                          fontSize: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        {column.label}
                        <Chip
                          label={columnWorkOrders.length}
                          size="small"
                          sx={{
                            backgroundColor: 'white',
                            color: '#6b7280',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            height: '20px',
                            minWidth: '20px'
                          }}
                        />
                      </Typography>
                    </Box>

                    {/* Droppable Area */}
                    <Droppable droppableId={column.key}>
                      {(provided, snapshot) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          sx={{
                            p: 2,
                            minHeight: 550,
                            backgroundColor: snapshot.isDraggingOver ? alpha('#ffffff', 0.5) : 'transparent'
                          }}
                        >
                          {columnWorkOrders.map((workOrder, index) => (
                            <Draggable key={workOrder._id} draggableId={workOrder._id} index={index}>
                              {(provided, snapshot) => (
                                <Card
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  sx={{
                                    mb: 2,
                                    backgroundColor: 'white',
                                    borderRadius: 2,
                                    boxShadow: snapshot.isDragging
                                      ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                                      : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                                    border: '1px solid #f3f4f6',
                                    cursor: 'grab',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                    }
                                  }}
                                >
                                  <CardContent sx={{ p: 2.5 }}>
                                    {/* Card Header */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                      <Typography
                                        variant="h6"
                                        sx={{
                                          fontWeight: 600,
                                          color: '#1f2937',
                                          fontSize: '1rem',
                                          lineHeight: 1.3,
                                          flex: 1,
                                          mr: 1
                                        }}
                                      >
                                        {workOrder.title}
                                      </Typography>
                                      <CustomChip label={workOrder.priority} type="priority" value={workOrder.priority} />
                                    </Box>

                                    {/* Asset Info */}
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        color: '#6b7280',
                                        mb: 2,
                                        fontSize: '0.875rem'
                                      }}
                                    >
                                      {workOrder.category} • {workOrder.asset}
                                    </Typography>

                                    {/* Details */}
                                    <Box sx={{ space: 1.5 }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="body2" sx={{ color: '#374151', fontWeight: 500, minWidth: '60px' }}>
                                          Due:
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#6b7280', ml: 1 }}>
                                          {workOrder.dueDate}
                                        </Typography>
                                      </Box>

                                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="body2" sx={{ color: '#374151', fontWeight: 500, minWidth: '60px' }}>
                                          Assignee:
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#6b7280', ml: 1 }}>
                                          {workOrder.assigneeType === 'User'
                                            ? `${workOrder.assignedTo.firstName || ''} ${workOrder.assignedTo.lastName || ''}`.trim()
                                            : workOrder.assignedTo.name || 'N/A'}
                                        </Typography>
                                      </Box>
                                    </Box>

                                    {/* Actions */}
                                    <Box
                                      sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 1, borderTop: '1px solid #f3f4f6' }}
                                    >
                                      <IconButton
                                        size="small"
                                        sx={{
                                          color: '#6b7280',
                                          '&:hover': {
                                            backgroundColor: '#f3f4f6',
                                            color: '#374151'
                                          }
                                        }}
                                        onClick={() => handleEditWorkOrder(workOrder)}
                                      >
                                        <EditOutlined />
                                      </IconButton>
                                      <IconButton
                                        size="small"
                                        sx={{
                                          color: '#6b7280',
                                          '&:hover': {
                                            backgroundColor: '#fef2f2',
                                            color: '#ef4444'
                                          }
                                        }}
                                        onClick={() => handleDeleteWorkOrder(workOrder._id)}
                                      >
                                        <DeleteOutlined />
                                      </IconButton>
                                    </Box>
                                  </CardContent>
                                </Card>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </Box>
                      )}
                    </Droppable>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </DragDropContext>
      )}
      {/* Add/Edit Dialog */}
      <WorkOrderDialog
        openAddModal={openAddModal || openEditModal}
        handleCloseAddModal={() => { setOpenAddModal(false); setOpenEditModal(false); setEditWorkOrder(null); fetchWorkOrders(); }}
        initialValues={editWorkOrder}
        isEdit={!!editWorkOrder}
        fetchWorkOrders={fetchWorkOrders}
      />
    </Box>
  );
}