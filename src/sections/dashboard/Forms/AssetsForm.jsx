import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { v4 as uuidv4 } from 'uuid';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { QRCode } from 'react-qr-code'; // Changed from 'import QRCode from' to 'import { QRCode } from'

// project imports
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import toast from 'react-hot-toast';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from 'components/@extended/IconButton';
import AddIcon from '@ant-design/icons/PlusOutlined';
import api from '../../../api/api';

// ============================|| ASSET - ADD ||============================ //

export default function AssetsForm() {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([]);
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [categories, setCategories] = useState([]); // New state for categories
  const [openCategoryModal, setOpenCategoryModal] = useState(false); // State for modal
  const [newCategoryName, setNewCategoryName] = useState(''); //
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const res = await api.get('/buildings');
        if (res.data.success) {
          setBuildings(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load buildings', err);
        toast.error('Failed to load buildings');
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          // Filter categories where type is 'asset'
          const assetCategories = res.data.categories.filter((category) => category.type === 'asset');
          setCategories(assetCategories);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
        toast.error('Failed to load categories');
      }
    };

    const fetchVendors = async () => {
      try {
        const res = await api.get('/vendors'); // Assuming endpoint exists
        if (res.data.success) {
          setVendors(res.data.data); // Assuming response has vendors array
        }
      } catch (err) {
        console.error('Failed to load vendors', err);
      }
    };

    fetchBuildings();
    fetchCategories();
    fetchVendors(); // Fetch vendors when the component mounts
    generateRandomQR(); // Generate a random QR code when the component mounts
  }, []);

  const generateRandomQR = () => {
    // Require uuid for random generation
    setQrCodeValue(uuidv4());
  };

  const processFormSubmission = async (values, { setErrors, setStatus, setSubmitting }, event) => {
    try {
      if (event) {
        event.preventDefault();
      }

      const response = await api.post('/assets', {
        assetName: values.assetName,
        building: values.building,
        category: values.category,
        description: values.description,
        status: values.status,
        serialNumber: values.serialNumber,
        modelNumber: values.modelNumber,
        manufacturer: values.manufacturer,
        purchaseDate: values.purchaseDate,
        purchaseCost: values.purchaseCost,
        warrantyExpiryDate: values.warrantyExpiryDate,
        assignee: values.assignee,
        assignedTo: values.assignedTo
      });

      if (response.data.success) {
        setQrCodeValue(response.data.data.qrCode); // Ensure this line is present
        toast.success('Asset added successfully!');// Navigate after showing QR code
      } else {
        toast.error('Failed to add asset. Please try again.');
      }

      setStatus({ success: true });
      setSubmitting(false);
    } catch (err) {
      console.error('Error:', err.response ? err.response.data : err.message);
      setStatus({ success: false });
      setErrors({ submit: err.response ? err.response.data.message : err.message });
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          assetName: '',
          building: '',
          category: '',
          description: '',
          status: 'Active',
          serialNumber: '',
          modelNumber: '',
          manufacturer: '',
          purchaseDate: '',
          purchaseCost: 0,
          warrantyExpiryDate: '',
          assignee: 'User',
          assignedTo: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          assetName: Yup.string().max(255).required('Asset Name is required'),
          building: Yup.string().required('Building is required'),
          category: Yup.string().max(255).required('Category is required'),
          description: Yup.string().max(1000),
          status: Yup.string().oneOf(['Active', 'Inactive', 'Retired'], 'Invalid status').required('Status is required'),
          serialNumber: Yup.string().max(255),
          modelNumber: Yup.string().max(255),
          manufacturer: Yup.string().max(255),
          purchaseDate: Yup.date().nullable(),
          purchaseCost: Yup.number().min(0, 'Purchase Cost must be a positive number'),
          warrantyExpiryDate: Yup.date().nullable(),
          assignee: Yup.string().oneOf(['User', 'Team'], 'Invalid assignee type').required('Assignee type is required'),
          assignedTo: Yup.string().required('Assigned To is required')
        })}
        onSubmit={processFormSubmission}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values, isSubmitting }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="asset-name-signup">Asset Name *</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.assetName && errors.assetName)}
                    id="asset-name-signup"
                    type="text"
                    value={values.assetName}
                    name="assetName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter Asset Name"
                  />
                </Stack>
                {touched.assetName && errors.assetName && (
                  <FormHelperText error id="helper-text-asset-name-signup">
                    {errors.assetName}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Stack sx={{ gap: 1 }}>
                  <TextField
                    fullWidth
                    select
                    label="Building *"
                    name="building"
                    value={values.building}
                    onChange={handleChange}
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
              <Grid size={{ xs: 12 }}>
                <Stack sx={{ gap: 1 }} direction="row" alignItems="start">
                  <TextField
                    fullWidth
                    sx={{ minWidth: '200px' }}
                    select
                    label="Category *"
                    name="category"
                    value={values.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.category && errors.category)}
                    helperText={touched.category && errors.category}
                  >
                    <MenuItem value="">- Select -</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
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
              <Grid size={{ xs: 12 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="description-signup">Description</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.description && errors.description)}
                    id="description-signup"
                    multiline
                    rows={4}
                    value={values.description}
                    name="description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter Description"
                  />
                </Stack>
                {touched.description && errors.description && (
                  <FormHelperText error id="helper-text-description-signup">
                    {errors.description}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Stack sx={{ gap: 1 }}>
                  <TextField
                    fullWidth
                    select
                    label="Status *"
                    name="status"
                    value={values.status}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.status && errors.status)}
                    helperText={touched.status && errors.status}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                    <MenuItem value="Retired">Retired</MenuItem>
                  </TextField>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="serial-number-signup">Serial Number</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.serialNumber && errors.serialNumber)}
                    id="serial-number-signup"
                    type="text"
                    value={values.serialNumber}
                    name="serialNumber"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter Serial Number"
                  />
                </Stack>
                {touched.serialNumber && errors.serialNumber && (
                  <FormHelperText error id="helper-text-serial-number-signup">
                    {errors.serialNumber}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="model-number-signup">Model </InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.modelNumber && errors.modelNumber)}
                    id="model-number-signup"
                    type="text"
                    value={values.modelNumber}
                    name="modelNumber"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter Model"
                  />
                </Stack>
                {touched.modelNumber && errors.modelNumber && (
                  <FormHelperText error id="helper-text-model-number-signup">
                    {errors.modelNumber}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="manufacturer-signup">Vendor</InputLabel>
                  <TextField
                    fullWidth
                    sx={{ minWidth: '200px' }}
                    select
                    name="manufacturer"
                    value={values.manufacturer}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.manufacturer && errors.manufacturer)}
                    helperText={touched.manufacturer && errors.manufacturer}
                  >
                    <MenuItem value="">- Select -</MenuItem>
                    {vendors.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.vendorName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="purchase-date-signup">Purchase Date</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.purchaseDate && errors.purchaseDate)}
                    id="purchase-date-signup"
                    type="date"
                    value={values.purchaseDate}
                    name="purchaseDate"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </Stack>
                {touched.purchaseDate && errors.purchaseDate && (
                  <FormHelperText error id="helper-text-purchase-date-signup">
                    {errors.purchaseDate}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="purchase-cost-signup">Purchase Cost</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.purchaseCost && errors.purchaseCost)}
                    id="purchase-cost-signup"
                    type="number"
                    value={values.purchaseCost}
                    name="purchaseCost"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter Purchase Cost"
                  />
                </Stack>
                {touched.purchaseCost && errors.purchaseCost && (
                  <FormHelperText error id="helper-text-purchase-cost-signup">
                    {errors.purchaseCost}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="warranty-expiry-date-signup">Warranty Expiry Date</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.warrantyExpiryDate && errors.warrantyExpiryDate)}
                    id="warranty-expiry-date-signup"
                    type="date"
                    value={values.warrantyExpiryDate}
                    name="warrantyExpiryDate"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </Stack>
                {touched.warrantyExpiryDate && errors.warrantyExpiryDate && (
                  <FormHelperText error id="helper-text-warranty-expiry-date-signup">
                    {errors.warrantyExpiryDate}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Stack sx={{ gap: 1 }}>
                  <TextField
                    fullWidth
                    select
                    label="Assignee *"
                    name="assignee"
                    value={values.assignee}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.assignee && errors.assignee)}
                    helperText={touched.assignee && errors.assignee}
                  >
                    <MenuItem value="User">User</MenuItem>
                    <MenuItem value="Team">Team</MenuItem>
                  </TextField>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Stack sx={{ gap: 1 }}>
                  <TextField
                    fullWidth
                    select
                    label="Assigned To *"
                    name="assignedTo"
                    value={values.assignedTo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.assignedTo && errors.assignedTo)}
                    helperText={touched.assignedTo && errors.assignedTo}
                  >
                    <MenuItem value="">- Select -</MenuItem>
                    <MenuItem value="placeholder-user-or-team">Placeholder User/Team</MenuItem>
                    {/* Add more options later */}
                  </TextField>
                </Stack>
              </Grid>
              {qrCodeValue && (
                <Grid size={{ xs: 12 }}>
                  <Stack sx={{ gap: 1, alignItems: 'center' }}>
                    <InputLabel>QR Code</InputLabel>
                    <Box sx={{ mt: 2 }}>
                      <QRCode value={qrCodeValue} size={128} />
                    </Box>
                    <FormHelperText>This QR code is unique to this asset.</FormHelperText>
                    <Button variant="contained" color="secondary" onClick={generateRandomQR} sx={{ mt: 1 }}>
                      Generate Random QR
                    </Button>
                  </Stack>
                </Grid>
              )}
              {errors.submit && (
                <Grid size={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid size={12}>
                <AnimateButton>
                  <Button fullWidth type="submit" size="large" variant="contained" color="primary" disabled={isSubmitting}>
                    Add Asset
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
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCategoryModal(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              try {
                await api.post('/categories', { name: newCategoryName, type: 'asset' });
                setNewCategoryName('');
                setOpenCategoryModal(false);
                toast.success('Category added successfully');
                const res = await api.get('/categories');
                const assetCategories = res.data.categories.filter((category) => category.type === 'asset');
                setCategories(assetCategories);
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
