import { useState, useEffect } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import AddIcon from '@ant-design/icons/PlusOutlined';
import api from '../../../api/api';
import { TextField } from '@mui/material';
import toast from 'react-hot-toast';

// ============================|| ADD CUSTOMER FORM ||============================ //

const AddCustomerForm = ({ setOpen, fetchCustomers, initialValues, isEdit }) => {
  const [customerTypes, setCustomerTypes] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newCustomerTypeName, setNewCustomerTypeName] = useState('');
  const [modalError, setModalError] = useState('');

  // Fetch customer types on component mount
  useEffect(() => {
    const fetchCustomerTypes = async () => {
      try {
        const response = await api.get('/customer-types');
        if (response.data.success) {
          setCustomerTypes(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching customer types:', error);
      }
    };
    fetchCustomerTypes();
  }, []);

  // Handle modal open/close
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setNewCustomerTypeName('');
    setModalError('');
  };

  // Handle adding a new customer type
  const handleAddCustomerType = async () => {
    if (!newCustomerTypeName.trim()) {
      setModalError('Customer type name is required');
      return;
    }
    try {
      const response = await api.post('/customer-types', { name: newCustomerTypeName.trim() });
      if (response.data.success) {
        setCustomerTypes([...customerTypes, response.data.data]);
        toast.success('Customer type added successfully!');
        setNewCustomerTypeName('');
        handleCloseModal();
      }
    } catch (error) {
      setModalError(error.response?.data?.message || 'Failed to create customer type');
    }
  };

  // Handle form submission
  const handleSubmitCustomer = async (values, { setSubmitting, resetForm, setErrors }) => {
    try {
      let response;
      if (isEdit && initialValues && initialValues._id) {
        response = await api.put(`/customers/${initialValues._id}`, values);
      } else {
        response = await api.post('/customers', values);
      }
      if (response.data.success) {
        resetForm();
        toast.success(isEdit ? 'Customer updated successfully!' : 'Customer created successfully!');
        setOpen(false);
        fetchCustomers();
      }
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || (isEdit ? 'Failed to update customer' : 'Failed to create customer') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues ? {
          name: initialValues.name || '',
          customerType: initialValues.customerType?._id || initialValues.customerType || '',
          address: initialValues.address || '',
          website: initialValues.website || '',
          contactName: initialValues.contactName || '',
          contactPhone: initialValues.contactPhone || '',
          contactEmail: initialValues.contactEmail || '',
          description: initialValues.description || '',
          submit: null
        } : {
          name: '',
          customerType: '',
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
          name: Yup.string().required('Name is required').trim(),
          customerType: Yup.string().required('Customer Type is required'),
          address: Yup.string().required('Address is required').trim(),
          website: Yup.string().trim(),
          contactName: Yup.string().required('Contact Name is required').trim(),
          contactPhone: Yup.string().required('Contact Phone is required').trim(),
          contactEmail: Yup.string().required('Contact Email is required').email('Must be a valid email').trim(),
          description: Yup.string().trim()
        })}
        onSubmit={handleSubmitCustomer}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="name-signup">Name *</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.name && errors.name)}
                    id="name-signup"
                    type="text"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter customer name"
                  />
                </Stack>
                {touched.name && errors.name && (
                  <FormHelperText error id="helper-text-name-signup">
                    {errors.name}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="customer-type-signup">Customer Type *</InputLabel>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      fullWidth
                      sx={{ minWidth: '200px' }}
                      select
                      label="Customer Type *"
                      name="customerType"
                      value={values.customerType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(touched.customerType && errors.customerType)}
                      helperText={touched.customerType && errors.customerType}
                    >
                      {customerTypes.map((type) => (
                        <MenuItem key={type._id} value={type._id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <IconButton onClick={handleOpenModal} color="primary">
                      <AddIcon />
                    </IconButton>
                  </Stack>
                </Stack>
           
              </Grid>
              <Grid size={12}>
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
                    placeholder="Enter address"
                  />
                </Stack>
                {touched.address && errors.address && (
                  <FormHelperText error id="helper-text-address-signup">
                    {errors.address}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="website-signup">Website</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.website && errors.website)}
                    id="website-signup"
                    type="text"
                    value={values.website}
                    name="website"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter website"
                  />
                </Stack>
                {touched.website && errors.website && (
                  <FormHelperText error id="helper-text-website-signup">
                    {errors.website}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
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
                    placeholder="Enter contact name"
                  />
                </Stack>
                {touched.contactName && errors.contactName && (
                  <FormHelperText error id="helper-text-contact-name-signup">
                    {errors.contactName}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
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
                    placeholder="Enter contact phone"
                  />
                </Stack>
                {touched.contactPhone && errors.contactPhone && (
                  <FormHelperText error id="helper-text-contact-phone-signup">
                    {errors.contactPhone}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={12}>
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
                    placeholder="Enter contact email"
                  />
                </Stack>
                {touched.contactEmail && errors.contactEmail && (
                  <FormHelperText error id="helper-text-contact-email-signup">
                    {errors.contactEmail}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="description-signup">Description</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.description && errors.description)}
                    id="description-signup"
                    value={values.description}
                    name="description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    placeholder="Enter description"
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
                    {isEdit ? 'Update Customer' : 'Add Customer'}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>

      {/* Modal for adding a new customer type */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Customer Type</DialogTitle>
        <DialogContent>
          <Stack sx={{ gap: 1, mt: 2 }}>
            <InputLabel htmlFor="new-customer-type">Customer Type*</InputLabel>
            <OutlinedInput
              fullWidth
              id="new-customer-type"
              type="text"
              value={newCustomerTypeName}
              onChange={(e) => setNewCustomerTypeName(e.target.value)}
              placeholder="Enter customer type"
            />
            {modalError && (
              <FormHelperText error id="helper-text-new-customer-type">
                {modalError}
              </FormHelperText>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddCustomerType} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddCustomerForm;
