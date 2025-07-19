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
import AddTeamForm from '../../components/dialogs/AddTeam';

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [filterMembers, setFilterMembers] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [editTeam, setEditTeam] = useState(null);

  useEffect(() => {


    fetchTeams();
  }, []);


      const fetchTeams = async () => {
      try {
        const response = await api.get('/teams');
        if (response.data.success) {
          setTeams(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

  const handleAddTeam = (newTeam) => {
    setTeams((prevTeams) => [...prevTeams, newTeam]);
    setOpenAddModal(false);
  };

  const handleUpdateTeam = (updatedTeam) => {
    setTeams((prevTeams) => prevTeams.map((team) => team._id === updatedTeam._id ? updatedTeam : team));
    setOpenAddModal(false);
    setEditTeam(null);
  };

  const handleDeleteTeam = async (teamId) => {
    try {
      const response = await api.delete(`/teams/${teamId}`);
      if (response.data.success) {
        setTeams((prevTeams) => prevTeams.filter((team) => team._id !== teamId));
      }
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  const handleFilterChange = (event) => {
    setFilterMembers(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredTeams = filterMembers
    ? teams.filter((team) => {
        const memberCount = team.members.length;
        switch (filterMembers) {
          case '0':
            return memberCount === 0;
          case '1-5':
            return memberCount >= 1 && memberCount <= 5;
          case '6+':
            return memberCount > 5;
          default:
            return true;
        }
      })
    : teams;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h2" sx={{ mb: 3 }}>
        Teams List
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 200, mr: 2 }}>
            <InputLabel>Filter Members</InputLabel>
            <Select value={filterMembers} onChange={handleFilterChange} label="Filter Members">
              <MenuItem value="">All Teams</MenuItem>
              <MenuItem value="0">No Members</MenuItem>
              <MenuItem value="1-5">1-5 Members</MenuItem>
              <MenuItem value="6+">6+ Members</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditTeam(null); setOpenAddModal(true); }}>
          Add Team
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
                <TableCell>Team Name</TableCell>
                <TableCell>Members</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTeams.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((team) => (
                <TableRow key={team._id}>
                  <TableCell>{team.name}</TableCell>
                  <TableCell>
                    {team.members.length > 0
                      ? team.members.map((member) => `${member.firstName} ${member.lastName}`).join(', ')
                      : 'No Members'}
                  </TableCell>
                  <TableCell>{new Date(team.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => { setEditTeam(team); setOpenAddModal(true); }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteTeam(team._id)}>
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
            count={filteredTeams.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Card>

      <AddTeamForm
        open={openAddModal}
        onClose={() => {
          setOpenAddModal(false);
          setEditTeam(null);
          fetchTeams();
        }}
        onSave={editTeam ? handleUpdateTeam : handleAddTeam}
        initialValues={editTeam}
        isEdit={!!editTeam}
      />
    </Box>
  );
}