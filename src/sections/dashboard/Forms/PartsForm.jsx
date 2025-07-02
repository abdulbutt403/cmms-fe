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
import { QRCode } from 'react-qr-code';

// project imports
import AnimateButton from 'components/@extended/AnimateButton';
import toast from 'react-hot-toast';

// assets
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from 'components/@extended/IconButton';
import AddIcon from '@ant-design/icons/PlusOutlined';
import api from '../../../api/api';

// ============================|| PART - ADD ||============================ //

export default function AddPartForm({onClose, initialValues, isEdit, onPartAdded}) {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [qrCodeValue, setQrCodeValue] = useState(initialValues && initialValues.qrCode ? initialValues.qrCode : '');
  const [categories, setCategories] = useState([]);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
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

    const fetchCustomers = async () => {
      try {
        const res = await api.get('/customers');
        if (res.data.success) {
          setCustomers(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load customers', err);
        toast.error('Failed to load customers');
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          const partCategories = res.data.categories.filter((category) => category.type === 'part');
          setCategories(partCategories);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
        toast.error('Failed to load categories');
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

    fetchBuildings();
    fetchCustomers();
    fetchCategories();
    fetchVendors();
    if (!isEdit) generateRandomQR();
    else if (initialValues && initialValues.qrCode) setQrCodeValue(initialValues.qrCode);
  }, []);

  const generateRandomQR = () => {
    setQrCodeValue(uuidv4());
  };

  const processFormSubmission = async (values, { setErrors, setStatus, setSubmitting }, event) => {
    try {
      if (event) {
        event.preventDefault();
      }
      const formData = new FormData();
      formData.append('partName', values.partName);
      formData.append('partNumber', values.partNumber);
      formData.append('category', values.category);
      formData.append('barCode', values.barCode);
      formData.append('availableQuantity', values.availableQuantity);
      formData.append('building', values.building);
      formData.append('customer', values.customer);
      formData.append('description', values.description);
      formData.append('manufacturer', values.manufacturer);
      formData.append('purchaseDate', values.purchaseDate);
      formData.append('purchaseCost', values.purchaseCost);
      formData.append('qrCode', qrCodeValue);
      if (values.partPhoto) {
        formData.append('partPhoto', values.partPhoto);
      }
      let response;
      if (isEdit && initialValues && initialValues._id) {
        response = await api.put(`/parts/${initialValues._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await api.post('/parts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      if (response.data.success) {
        setQrCodeValue(response.data.data.qrCode || qrCodeValue);
        toast.success(isEdit ? 'Part updated successfully!' : 'Part added successfully!');
        if (onPartAdded) onPartAdded(response.data.data);
        onClose();
      } else {
        toast.error(isEdit ? 'Failed to update part. Please try again.' : 'Failed to add part. Please try again.');
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

  // Default blank values
  const defaultInitialValues = {
    partName: '',
    partNumber: '',
    category: '',
    barCode: '',
    availableQuantity: 0,
    building: '',
    customer: '',
    description: '',
    manufacturer: '',
    purchaseDate: '',
    purchaseCost: 0,
    partPhoto: null,
    submit: null
  };

  // Merge initialValues (for edit) with defaults
  const formInitialValues = initialValues ? {
    ...defaultInitialValues,
    ...initialValues,
    category: initialValues.category?._id || initialValues.category || '',
    building: initialValues.building?._id || initialValues.building || '',
    customer: initialValues.customer?._id || initialValues.customer || '',
    manufacturer: initialValues.manufacturer?._id || initialValues.manufacturer || '',
    purchaseDate: initialValues.purchaseDate ? initialValues.purchaseDate.slice(0, 10) : '',
    partPhoto: null // never pre-fill photo
  } : defaultInitialValues;

  return (
    <>
      <Formik
        initialValues={formInitialValues}
        validationSchema={Yup.object().shape({
          partName: Yup.string().max(255).required('Part Name is required'),
          partNumber: Yup.string().max(255),
          category: Yup.string().max(255).required('Category is required'),
          barCode: Yup.string().max(255),
          availableQuantity: Yup.number().min(0, 'Available Quantity must be a positive number').required('Available Quantity is required'),
          building: Yup.string().required('Building is required'),
          customer: Yup.string(),
          description: Yup.string().max(1000),
          manufacturer: Yup.string().max(255),
          purchaseDate: Yup.date().nullable(),
          purchaseCost: Yup.number().min(0, 'Purchase Cost must be a positive number'),
          partPhoto: Yup.mixed(),
        })}
        onSubmit={processFormSubmission}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values, isSubmitting, setFieldValue }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="part-name-signup">Part Name *</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.partName && errors.partName)}
                    id="part-name-signup"
                    type="text"
                    value={values.partName}
                    name="partName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter Part Name"
                  />
                </Stack>
                {touched.partName && errors.partName && (
                  <FormHelperText error id="helper-text-part-name-signup">
                    {errors.partName}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="part-number-signup">Part Number</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.partNumber && errors.partNumber)}
                    id="part-number-signup"
                    type="text"
                    value={values.partNumber}
                    name="partNumber"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter Part Number"
                  />
                </Stack>
                {touched.partNumber && errors.partNumber && (
                  <FormHelperText error id="helper-text-part-number-signup">
                    {errors.partNumber}
                  </FormHelperText>
                )}
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
                  <InputLabel htmlFor="bar-code-signup">Bar Code</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.barCode && errors.barCode)}
                    id="bar-code-signup"
                    type="text"
                    value={values.barCode}
                    name="barCode"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter Bar Code"
                  />
                </Stack>
                {touched.barCode && errors.barCode && (
                  <FormHelperText error id="helper-text-bar-code-signup">
                    {errors.barCode}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="available-quantity-signup">Available Quantity *</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.availableQuantity && errors.availableQuantity)}
                    id="available-quantity-signup"
                    type="number"
                    value={values.availableQuantity}
                    name="availableQuantity"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter Available Quantity"
                  />
                </Stack>
                {touched.availableQuantity && errors.availableQuantity && (
                  <FormHelperText error id="helper-text-available-quantity-signup">
                    {errors.availableQuantity}
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
                <Stack sx={{ gap: 1 }}>
                  <TextField
                    fullWidth
                    select
                    label="Customer"
                    name="customer"
                    value={values.customer}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.customer && errors.customer)}
                    helperText={touched.customer && errors.customer}
                  >
                    <MenuItem value="">- Select -</MenuItem>
                    {customers.map((customer) => (
                      <MenuItem key={customer._id} value={customer._id}>
                        {customer.name}
                      </MenuItem>
                    ))}
                  </TextField>
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
                    {vendors.map((vendor) => (
                      <MenuItem key={vendor._id} value={vendor._id}>
                        {vendor.vendorName}
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
                  <InputLabel htmlFor="part-photo-upload">Part Photo</InputLabel>
                  <input
                    id="part-photo-upload"
                    name="partPhoto"
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      if (file) {
                        setFieldValue('partPhoto', file);
                      }
                    }}
                  />
                  <FormHelperText>Optional image for this part</FormHelperText>
                </Stack>
              </Grid>
              {qrCodeValue && (
                <Grid size={{ xs: 12 }}>
                  <Stack sx={{ gap: 1, alignItems: 'center' }}>
                    <InputLabel>QR Code</InputLabel>
                    <Box sx={{ mt: 2 }}>
                      <QRCode value={qrCodeValue} size={128} />
                    </Box>
                    <FormHelperText>This QR code is unique to this part.</FormHelperText>
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
                    {isEdit ? 'Update Part' : 'Add Part'}
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
                await api.post('/categories', { name: newCategoryName, type: 'part' });
                setNewCategoryName('');
                setOpenCategoryModal(false);
                toast.success('Category added successfully');
                const res = await api.get('/categories');
                const partCategories = res.data.categories.filter((category) => category.type === 'part');
                setCategories(partCategories);
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