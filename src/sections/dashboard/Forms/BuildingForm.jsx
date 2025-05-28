import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import toast from 'react-hot-toast';
import api from '../../../api/api';
import { over } from 'lodash-es';

// ============================|| BUILDING - ADD ||============================ //

export default function AddBuilding() {
  const navigate = useNavigate();

  const processFormSubmission = async (values, { setErrors, setStatus, setSubmitting }, event) => {
    try {
      if (event) {
        event.preventDefault();
      }

      const response = await api.post('/buildings', {
        buildingName: values.buildingName,
        address: values.address,
        contactPerson: values.contactPerson,
        contactNumber: values.contactNumber,
        email: values.email,
      });

      if (response.data.success) {
        toast.success('Building added successfully!'); // Replace with your desired route
      } else {
        toast.error('Failed to add building. Please try again.');
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
    <Formik
      initialValues={{
        buildingName: '',
        address: '',
        contactPerson: '',
        contactNumber: '',
        email: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        buildingName: Yup.string().max(255).required('Building Name is required'),
        address: Yup.string().max(255).required('Address is required'),
        contactPerson: Yup.string().max(255).required('Contact Person is required'),
        contactNumber: Yup.string()
          .matches(/^\+?[\d\s-]{10,}$/, 'Please enter a valid phone number')
          .required('Contact Number is required'),
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
      })}
      onSubmit={processFormSubmission}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
        <form noValidate onSubmit={handleSubmit} style={{ overflow: 'hidden' }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel htmlFor="building-name-signup">Building Name *</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.buildingName && errors.buildingName)}
                  id="building-name-signup"
                  type="text"
                  value={values.buildingName}
                  name="buildingName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter Building Name"
                />
              </Stack>
              {touched.buildingName && errors.buildingName && (
                <FormHelperText error id="helper-text-building-name-signup">
                  {errors.buildingName}
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
                  placeholder="Enter Building Address"
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
                <InputLabel htmlFor="contact-person-signup">Contact Person *</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.contactPerson && errors.contactPerson)}
                  id="contact-person-signup"
                  type="text"
                  value={values.contactPerson}
                  name="contactPerson"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter Contact Person"
                />
              </Stack>
              {touched.contactPerson && errors.contactPerson && (
                <FormHelperText error id="helper-text-contact-person-signup">
                  {errors.contactPerson}
                </FormHelperText>
              )}
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel htmlFor="contact-number-signup">Contact Number *</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.contactNumber && errors.contactNumber)}
                  id="contact-number-signup"
                  type="text"
                  value={values.contactNumber}
                  name="contactNumber"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter Contact Number"
                />
              </Stack>
              {touched.contactNumber && errors.contactNumber && (
                <FormHelperText error id="helper-text-contact-number-signup">
                  {errors.contactNumber}
                </FormHelperText>
              )}
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel htmlFor="email-signup">Email *</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                  id="email-signup"
                  type="email"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter Email"
                />
              </Stack>
              {touched.email && errors.email && (
                <FormHelperText error id="helper-text-email-signup">
                  {errors.email}
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
                <Button fullWidth type="submit" size="large" variant="contained" color="primary">
                  Submit
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}