import { useEffect, useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import AddIcon from '@ant-design/icons/PlusOutlined';
import DeleteIcon from '@ant-design/icons/DeleteOutlined';
import { Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, MenuItem, TextField } from '@mui/material';
import toast from 'react-hot-toast';
import axios from 'axios';
import { border, borderRadius } from '@mui/system';
import api from '../../../api/api';

// ============================|| WORK ORDER - REGISTER ||============================ //

export default function WorkOrderRegister() {
  const [tasks, setTasks] = useState([]);
  const [parts, setParts] = useState([]);
  const [newTask, setNewTask] = useState({ taskName: '', taskType: '' });
  const [newPart, setNewPart] = useState({ partName: '', quantity: 1 });
  const [isRecurring, setIsRecurring] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [recurringWO, setRecurringWO] = useState('- Select -');
  const [categories, setCategories] = useState([]);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [vendors, setVendors] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [assets, setAssets] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [users, setUsers] = useState([]); // New state for users
  const [teams, setTeams] = useState([]); // New state for teams

  const handleAddTask = () => {
    if (newTask.taskName.trim()) {
      setTasks([...tasks, { ...newTask, taskName: newTask.taskName.trim() }]);
      setNewTask({ taskName: '', taskType: '' });
    }
  };

  useEffect(() => {
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

    const fetchVendors = async () => {
      try {
        const res = await api.get('/vendors');
        if (res.data.success) {
          setVendors(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load vendors', err);
      }
    };

    const fetchBuildings = async () => {
      try {
        const res = await api.get('/buildings');
        if (res.data.success) {
          setBuildings(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load buildings', err);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await api.get('/users'); // Assuming endpoint exists
        if (res.data.success) {
          setUsers(res.data.data); // Assuming response has users array
        }
      } catch (err) {
        console.error('Failed to load users', err);
      }
    };

    const fetchTeams = async () => {
      try {
        const res = await api.get('/teams'); // Assuming endpoint exists
        if (res.data.success) {
          setTeams(res.data.data); // Assuming response has teams array
        }
      } catch (err) {
        console.error('Failed to load teams', err);
      }
    };

    fetchBuildings();
    fetchCategories();
    fetchVendors();
    fetchUsers();
    fetchTeams();
  }, []);

  const handleBuildingChange = async (e, setFieldValue) => {
    const buildingId = e.target.value;
    setSelectedBuilding(buildingId);
    setFieldValue('building', buildingId);
    if (buildingId) {
      try {
        const res = await api.get(`/assets/building/${buildingId}`);
        if (res.data.success) {
          setAssets(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load assets', err);
        toast.error('Failed to load assets');
      }
    } else {
      setAssets([]);
    }
  };

  const handleRemoveTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleAddPart = () => {
    if (newPart.partName.trim() && newPart.quantity > 0) {
      setParts([...parts, { ...newPart, partName: newPart.partName.trim() }]);
      setNewPart({ partName: '', quantity: 1 });
    }
  };

  const handleRemovePart = (index) => {
    setParts(parts.filter((_, i) => i !== index));
  };

  const handleCheckboxChange = (e) => {
    setIsRecurring(e.target.checked);
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('startDate', values.startDate);
      formData.append('dueDate', values.dueDate);
      formData.append('priority', values.priority);
      formData.append('category', values.category);
      formData.append('description', values.description);
      formData.append('building', values.building);
      formData.append('asset', values.asset);
      formData.append('assigneeType', values.assigneeType);
      formData.append('assignedTo', values.assignedTo);
      formData.append('vendor', values.vendor);
      formData.append('recurringWO', recurringWO);

      if (photo) {
        formData.append('photo', photo);
      }

      tasks.forEach((task, index) => {
        formData.append(`tasks[${index}][taskName]`, task.taskName);
        formData.append(`tasks[${index}][taskType]`, task.taskType);
      });

      parts.forEach((part, index) => {
        formData.append(`parts[${index}][partName]`, part.partName);
        formData.append(`parts[${index}][quantity]`, part.quantity);
      });

      const response = await fetch('/api/workorders', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const result = await response.json();
      if (result.success) {
        alert('Work order added!');
      } else {
        alert(result.message || 'Failed to create work order');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting work order');
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          title: '',
          startDate: '',
          dueDate: '',
          priority: 'Medium',
          category: '',
          description: '',
          building: '',
          asset: '',
          assigneeType: 'Individual',
          assignedTo: '',
          vendor: '',
          recurringWO: ''
        }}
        validationSchema={Yup.object().shape({
          title: Yup.string().required('Work Order Title is required'),
          startDate: Yup.date().required('Start Date is required'),
          dueDate: Yup.date().required('Due Date is required'),
          priority: Yup.string().required('Priority is required'),
          category: Yup.string().required('Category is required'),
          description: Yup.string().required('Description is required'),
          building: Yup.string().required('Building is required'),
          asset: Yup.string().required('Asset is required'),
          assigneeType: Yup.string().required('Assignee Type is required'),
          assignedTo: Yup.string().required('Assigned To is required'),
          vendor: Yup.string(),
          recurringWO: Yup.string().when('isRecurring', {
            is: true,
            then: Yup.string().required('Recurring Work Order is required')
          })
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, touched, values, setFieldValue }) => (
          <form noValidate>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="title-signup">Work Order Title*</InputLabel>
                  <OutlinedInput
                    id="title-signup"
                    type="text"
                    value={values.title}
                    name="title"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter title"
                    fullWidth
                    error={Boolean(touched.title && errors.title)}
                  />
                </Stack>
                {touched.title && errors.title && (
                  <FormHelperText error id="helper-text-title-signup">
                    {errors.title}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="start-date-signup">Start Date*</InputLabel>
                  <OutlinedInput
                    id="start-date-signup"
                    type="date"
                    value={values.startDate}
                    name="startDate"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    fullWidth
                    error={Boolean(touched.startDate && errors.startDate)}
                  />
                </Stack>
                {touched.startDate && errors.startDate && (
                  <FormHelperText error id="helper-text-start-date-signup">
                    {errors.startDate}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="due-date-signup">Due Date*</InputLabel>
                  <OutlinedInput
                    id="due-date-signup"
                    type="date"
                    value={values.dueDate}
                    name="dueDate"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    fullWidth
                    error={Boolean(touched.dueDate && errors.dueDate)}
                  />
                </Stack>
                {touched.dueDate && errors.dueDate && (
                  <FormHelperText error id="helper-text-due-date-signup">
                    {errors.dueDate}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="priority-signup">Priority*</InputLabel>
                  <OutlinedInput
                    id="priority-signup"
                    value={values.priority}
                    name="priority"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    select
                    fullWidth
                    error={Boolean(touched.priority && errors.priority)}
                  >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                  </OutlinedInput>
                </Stack>
                {touched.priority && errors.priority && (
                  <FormHelperText error id="helper-text-priority-signup">
                    {errors.priority}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack sx={{ gap: 1 }} direction="row" alignItems="start">
                  <TextField
                    fullWidth
                    sx={{ minWidth: '200px' }}
                    select
                    label="Category"
                    name="category"
                    value={values.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.category && errors.category)}
                    helperText={touched.category && errors.category}
                  >
                    <MenuItem value="">- Select -</MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat._id} value={cat.name}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <IconButton
                    color="primary"
                    onClick={() => setOpenCategoryModal(true)}
                    sx={{ padding: 2, borderRadius: '8px', border: '1px solid #ccc', height: '40px' }}
                  >
                    <AddIcon />
                  </IconButton>
                </Stack>
              </Grid>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="description-signup">Description*</InputLabel>
                  <OutlinedInput
                    id="description-signup"
                    value={values.description}
                    name="description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    fullWidth
                    error={Boolean(touched.description && errors.description)}
                  />
                </Stack>
                {touched.description && errors.description && (
                  <FormHelperText error id="helper-text-description-signup">
                    {errors.description}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack sx={{ gap: 1 }} alignItems="start">
                  <InputLabel htmlFor="building-signup">Building*</InputLabel>
                  <TextField
                    fullWidth
                    sx={{ minWidth: '200px' }}
                    select
                    label="Building"
                    name="building"
                    value={values.building}
                    onChange={(e) => {
                      handleBuildingChange(e, setFieldValue);
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                    error={Boolean(touched.building && errors.building)}
                    helperText={touched.building && errors.building}
                  >
                    <MenuItem value="">- Select -</MenuItem>
                    {buildings.map((building) => (
                      <MenuItem key={building._id} value={building._id}>
                        {building.buildingName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="asset-signup">Asset*</InputLabel>
                  <TextField
                    fullWidth
                    sx={{ minWidth: '200px' }}
                    select
                    label="Asset"
                    name="asset"
                    value={values.asset}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.asset && errors.asset)}
                    helperText={touched.asset && errors.asset}
                  >
                    <MenuItem value="">- Select -</MenuItem>
                    {assets.map((asset) => (
                      <MenuItem key={asset._id} value={asset._id}>
                        {asset.assetName || asset._id}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="assignee-type-signup">Assignee Type*</InputLabel>
                  <TextField
                    select
                    id="assignee-type-signup"
                    value={values.assigneeType}
                    name="assigneeType"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      setFieldValue('assignedTo', ''); // Reset assignedTo when type changes
                    }}
                    fullWidth
                    error={Boolean(touched.assigneeType && errors.assigneeType)}
                    helperText={touched.assigneeType && errors.assigneeType}
                  >
                    <MenuItem value="Individual">Individual</MenuItem>
                    <MenuItem value="Team">Team</MenuItem>
                  </TextField>
                </Stack>
                {touched.assigneeType && errors.assigneeType && (
                  <FormHelperText error id="helper-text-assignee-type-signup">
                    {errors.assigneeType}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="assigned-to-signup">Assigned To*</InputLabel>
                  <TextField
                    select
                    id="assigned-to-signup"
                    value={values.assignedTo}
                    name="assignedTo"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    fullWidth
                    error={Boolean(touched.assignedTo && errors.assignedTo)}
                    helperText={touched.assignedTo && errors.assignedTo}
                  >
                    <MenuItem value="">- Select -</MenuItem>
                    {values.assigneeType === 'Individual'
                      ? users.map((user) => (
                          <MenuItem key={user._id} value={user._id}>
                            {user.name || user.email || user._id} {/* Adjust based on your user model */}
                          </MenuItem>
                        ))
                      : teams.map((team) => (
                          <MenuItem key={team._id} value={team._id}>
                            {team.name || team._id} {/* Adjust based on your team model */}
                          </MenuItem>
                        ))}
                  </TextField>
                </Stack>
        
              </Grid>
              <Grid item xs={12}>
                <Stack sx={{ gap: 1 }} direction="row" alignItems="start">
                  <TextField
                    fullWidth
                    sx={{ minWidth: '200px' }}
                    select
                    label="Vendor"
                    name="vendor"
                    value={values.vendor}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.vendor && errors.vendor)}
                    helperText={touched.vendor && errors.vendor}
                  >
                    <MenuItem value="">- Select -</MenuItem>
                    {vendors.map((vendor) => (
                      <MenuItem key={vendor._id} value={vendor._id}>
                        {vendor.vendorName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
              </Grid>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <FormControlLabel
                    control={<Checkbox checked={isRecurring} onChange={handleCheckboxChange} name="isRecurring" />}
                    label="Is Recurring"
                  />
                </Stack>
              </Grid>
              {isRecurring && (
                <Grid item xs={12} md={6}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="recurringWO">Recurring WO</InputLabel>
                    <TextField
                      id="recurringWO"
                      name="recurringWO"
                      select
                      value={recurringWO}
                      sx={{ minWidth: '200px' }}
                      onChange={(e) => setRecurringWO(e.target.value)}
                      fullWidth
                      displayEmpty
                    >
                      <MenuItem value="- Select -">- Select -</MenuItem>
                      <MenuItem value="Daily">Daily</MenuItem>
                      <MenuItem value="Weekly">Weekly</MenuItem>
                      <MenuItem value="Every Month">Every Month</MenuItem>
                      <MenuItem value="Every 3 Months">Every 3 Months</MenuItem>
                      <MenuItem value="Every 6 Months">Every 6 Months</MenuItem>
                      <MenuItem value="Every year">Every year</MenuItem>
                    </TextField>
                  </Stack>
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="upload-photo">Upload Photo</InputLabel>
                  <OutlinedInput
                    id="upload-photo"
                    type="file"
                    fullWidth
                    name="photo"
                    inputProps={{ accept: 'image/*' }}
                    onChange={(e) => {
                      if (e.target.files.length > 0) {
                        setPhoto(e.target.files[0]);
                      }
                    }}
                  />
                </Stack>
              </Grid>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel>Tasks</InputLabel>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} md={5}>
                      <OutlinedInput
                        value={newTask.taskName}
                        onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
                        placeholder="Task Name"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <OutlinedInput
                        value={newTask.taskType}
                        onChange={(e) => setNewTask({ ...newTask, taskType: e.target.value })}
                        placeholder="Task Type"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <IconButton onClick={handleAddTask} color="primary">
                        <AddIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                  {tasks.map((task, index) => (
                    <Grid container spacing={1} alignItems="center" key={index} sx={{ mt: 1 }}>
                      <Grid item xs={12} md={5}>
                        <OutlinedInput value={task.taskName} disabled fullWidth />
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <OutlinedInput value={task.taskType} disabled fullWidth />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <IconButton onClick={() => handleRemoveTask(index)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                </Stack>
              </Grid>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel>Parts</InputLabel>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} md={5}>
                      <OutlinedInput
                        value={newPart.partName}
                        onChange={(e) => setNewPart({ ...newPart, partName: e.target.value })}
                        placeholder="Part Name"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <OutlinedInput
                        type="number"
                        value={newPart.quantity}
                        onChange={(e) => setNewPart({ ...newPart, quantity: parseInt(e.target.value) || 1 })}
                        placeholder="Quantity"
                        fullWidth
                        inputProps={{ min: 1 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <IconButton onClick={handleAddPart} color="primary">
                        <AddIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                  {parts.map((part, index) => (
                    <Grid container spacing={1} alignItems="center" key={index} sx={{ mt: 1 }}>
                      <Grid item xs={12} md={5}>
                        <OutlinedInput value={part.partName} disabled fullWidth />
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <OutlinedInput value={part.quantity} disabled fullWidth />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <IconButton onClick={() => handleRemovePart(index)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                </Stack>
              </Grid>
              <Grid size={12}>
                <AnimateButton>
                  <Button type="submit" fullWidth size="large" variant="contained" color="primary">
                    Add Work Order
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
      <Dialog open={openCategoryModal} onClose={() => setOpenCategoryModal(false)}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCategoryModal(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              try {
                await axios.post('http://localhost:5000/api/categories', { name: newCategory, type: 'workOrder' });
                setNewCategory('');
                setOpenCategoryModal(false);
                toast.success('Category added successfully');
                const res = await axios.get('http://localhost:5000/api/categories');
                const workOrderCategories = res.data.categories.filter((category) => category.type === 'workOrder');
                setCategories(workOrderCategories);
              } catch (err) {
                toast.error('Failed to add category');
              }
            }}
            variant="contained"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}