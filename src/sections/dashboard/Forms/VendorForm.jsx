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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import AddIcon from '@ant-design/icons/PlusOutlined';
import axios from 'axios';
import toast from 'react-hot-toast';
import api from '../../../api/api';

// ============================|| VENDOR - ADD ||============================ //

export default function AddVendor({setOpen, fetchVendors, initialValues, isEdit}) {
  const navigate = useNavigate();
  const [vendorTypes, setVendorTypes] = useState([]);
  const [openVendorTypeModal, setOpenVendorTypeModal] = useState(false);
  const [newVendorType, setNewVendorType] = useState('');

  useEffect(() => {
    const fetchVendorTypes = async () => {
      try {
        const res = await api.get('/vendor-types');
        if (res.data.success) {
          setVendorTypes(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load vendor types', err);
        toast.error('Failed to load vendor types');
      }
    };

    fetchVendorTypes();
  }, []);

  const processFormSubmission = async (values, { setErrors, setStatus, setSubmitting }, event) => {
    try {
      if (event) {
        event.preventDefault();
      }
      let response;
      if (isEdit && initialValues && initialValues._id) {
        response = await api.put(`/vendors/${initialValues._id}`, values);
      } else {
        response = await api.post('/vendors', values);
      }
      if (response.data.success) {
        toast.success(isEdit ? 'Vendor updated successfully!' : 'Vendor added successfully!');
        setOpen(false);
        fetchVendors();
      } else {
        toast.error(isEdit ? 'Failed to update vendor. Please try again.' : 'Failed to add vendor. Please try again.');
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
        initialValues={initialValues ? {
          vendorName: initialValues.vendorName || '',
          vendorType: initialValues.vendorType?._id || initialValues.vendorType || '',
          price: initialValues.price || 0,
          address: initialValues.address || '',
          website: initialValues.website || '',
          contactName: initialValues.contactName || '',
          contactPhone: initialValues.contactPhone || '',
          contactEmail: initialValues.contactEmail || '',
          description: initialValues.description || '',
          submit: null
        } : {
          vendorName: '',
          vendorType: '',
          price: 0,
          address: '',
          website: '',
          contactName: '',
          contactPhone: '',
          contactEmail: '',
          description: '',
          submit: null
        }}
        enableReinitialize
        validationSchema={Yup.object().shape({
          vendorName: Yup.string().max(255).required('Vendor Name is required'),
          vendorType: Yup.string().required('Vendor Type is required'),
          price: Yup.number().min(0, 'Price must be a positive number').required('Price is required'),
          address: Yup.string().max(255).required('Address is required'),
          website: Yup.string()
            .matches(
              /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
              'Please enter a valid website URL'
            )
            .required('Website is required'),
          contactName: Yup.string().max(255).required('Contact Name is required'),
          contactPhone: Yup.string()
            .matches(/^\+?[\d\s-]{10,}$/, 'Please enter a valid phone number')
            .required('Contact Phone is required'),
          contactEmail: Yup.string().email('Must be a valid email').max(255).required('Contact Email is required'),
          description: Yup.string().required('Description is required')
        })}
        onSubmit={processFormSubmission}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values, isSubmitting }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="vendor-name-signup">Vendor Name *</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.vendorName && errors.vendorName)}
                    id="vendor-name-signup"
                    type="text"
                    value={values.vendorName}
                    name="vendorName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter Vendor Name"
                  />
                </Stack>
                {touched.vendorName && errors.vendorName && (
                  <FormHelperText error id="helper-text-vendor-name-signup">
                    {errors.vendorName}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Stack sx={{ gap: 1 }} direction="row" alignItems="start">
                  <TextField
                    fullWidth
                    sx={{ minWidth: '200px' }}
                    select
                    label="Vendor Type *"
                    name="vendorType"
                    value={values.vendorType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.vendorType && errors.vendorType)}
                    helperText={touched.vendorType && errors.vendorType}
                  >
                    <MenuItem value="">- Select -</MenuItem>
                    {vendorTypes.map((type) => (
                      <MenuItem key={type._id} value={type._id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <IconButton
                    color="primary"
                    onClick={() => setOpenVendorTypeModal(true)}
                    sx={{ padding: 2, borderRadius: '8px', border: '1px solid #ccc', height: '40px' }}
                  >
                    <AddIcon />
                  </IconButton>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="price-signup">Price *</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.price && errors.price)}
                    id="price-signup"
                    type="number"
                    value={values.price}
                    name="price"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter Price"
                  />
                </Stack>
                {touched.price && errors.price && (
                  <FormHelperText error id="helper-text-price-signup">
                    {errors.price}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="address-signup">Address *</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.address && errors.address)}
                    id="address-signup"
                    type="text"
                    value={values.address}
                    name="address"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter Address"
                  />
                </Stack>
                {touched.address && errors.address && (
                  <FormHelperText error id="helper-text-address-signup">
                    {errors.address}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="website-signup">Website *</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.website && errors.website)}
                    id="website-signup"
                    type="text"
                    value={values.website}
                    name="website"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter Website URL"
                  />
                </Stack>
                {touched.website && errors.website && (
                  <FormHelperText error id="helper-text-website-signup">
                    {errors.website}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="contact-name-signup">Contact Name *</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.contactName && errors.contactName)}
                    id="contact-name-signup"
                    type="text"
                    value={values.contactName}
                    name="contactName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter Contact Name"
                  />
                </Stack>
                {touched.contactName && errors.contactName && (
                  <FormHelperText error id="helper-text-contact-name-signup">
                    {errors.contactName}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="contact-phone-signup">Contact Phone *</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.contactPhone && errors.contactPhone)}
                    id="contact-phone-signup"
                    type="text"
                    value={values.contactPhone}
                    name="contactPhone"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter Contact Phone"
                  />
                </Stack>
                {touched.contactPhone && errors.contactPhone && (
                  <FormHelperText error id="helper-text-contact-phone-signup">
                    {errors.contactPhone}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="contact-email-signup">Contact Email *</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.contactEmail && errors.contactEmail)}
                    id="contact-email-signup"
                    type="email"
                    value={values.contactEmail}
                    name="contactEmail"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter Contact Email"
                  />
                </Stack>
                {touched.contactEmail && errors.contactEmail && (
                  <FormHelperText error id="helper-text-contact-email-signup">
                    {errors.contactEmail}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="description-signup">Description *</InputLabel>
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
              {errors.submit && (
                <Grid size={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid size={12}>
                <AnimateButton>
                  <Button fullWidth type="submit" size="large" variant="contained" color="primary" disabled={isSubmitting}>
                    {isEdit ? 'Update Vendor' : 'Add Vendor'}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
      <Dialog open={openVendorTypeModal} onClose={() => setOpenVendorTypeModal(false)}>
        <DialogTitle>Add New Vendor Type</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Vendor Type"
            type="text"
            fullWidth
            value={newVendorType}
            onChange={(e) => setNewVendorType(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVendorTypeModal(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              try {
                await api.post('/vendor-types', { name: newVendorType });
                setNewVendorType('');
                setOpenVendorTypeModal(false);
                toast.success('Vendor Type added successfully');
                const res = await api.get('/vendor-types');
                setVendorTypes(res.data.data);
              } catch (err) {
                toast.error('Failed to add vendor type');
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