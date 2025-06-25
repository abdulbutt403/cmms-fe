import { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import {
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  MenuItem,
  TextField
} from '@mui/material';
import * as Yup from 'yup';
import AnimateButton from 'components/@extended/AnimateButton';
import api from '../../../api/api';
import toast from 'react-hot-toast';

export default function UserTeamForm({formType, closeModal}) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        if (res.data.success) {
          setUsers(res.data.data);
          console.log('Users loaded successfully:', res.data.data);
        }
      } catch (err) {
        console.error('Failed to load users', err);
      }
    };
    fetchUsers();
  }, []);

  const validationSchema = Yup.object().shape({
    firstName: formType === 'User' ? Yup.string().required('First Name is required') : Yup.string(),
    lastName: formType === 'User' ? Yup.string().required('Last Name is required') : Yup.string(),
    email: formType === 'User' ? Yup.string().email('Invalid email').required('Email is required') : Yup.string(),
    phone: formType === 'User' ? Yup.string().required('Phone is required') : Yup.string(),
    forAlertNotification: formType === 'User' ? Yup.string().required('For Alert Notification is required') : Yup.string(),
    jobTitle: formType === 'User' ? Yup.string().required('Job Title is required') : Yup.string(),
    password: formType === 'User' ? Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required') : Yup.string(),
    userRole: formType === 'User' ? Yup.string().required('User Role is required') : Yup.string(),
    teamName: formType === 'Team' ? Yup.string().required('Team Name is required') : Yup.string(),
    members: formType === 'Team' ? Yup.array().min(1, 'At least one member is required').required('Members are required') : Yup.array()
  });

  const handleSubmit = async (values) => {
    try {
      if (formType === 'User') {
        delete values.teamName;
        delete values.members;
        delete values.phone;
        delete values.forAlertNotification;
        const res = await api.post('/users', values);
        if (res.data.success) {
          toast.success('User added successfully!');
          closeModal(); // Close modal after successful submission
        }
      } else {
        const { teamName, members } = values;
        const res = await api.post('/teams', { name: teamName, members });
        if (res.data.success) {
          toast.success('Team added successfully!');
          closeModal(); // Close modal after successful submission
        }
      }
    } catch (err) {
      console.error('Failed to submit form', err);
      toast.error('Error submitting form');
    }
  };

  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        forAlertNotification: '',
        jobTitle: '',
        password: '',
        userRole: '',
        teamName: '',
        members: []
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, handleBlur, handleChange, touched, values, setFieldValue }) => (
        <Form noValidate style={{overflow: 'hidden'}}>
          <Grid container spacing={3}>
            {/* Form Type Selection */}
        

            {/* User Fields */}
            {formType === 'User' && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="first-name-signup">First Name*</InputLabel>
                    <OutlinedInput
                      id="first-name-signup"
                      type="text"
                      value={values.firstName}
                      name="firstName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      fullWidth
                      error={Boolean(touched.firstName && errors.firstName)}
                    />
                    {touched.firstName && errors.firstName && (
                      <FormHelperText error id="helper-text-first-name-signup">
                        {errors.firstName}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="last-name-signup">Last Name*</InputLabel>
                    <OutlinedInput
                      id="last-name-signup"
                      type="text"
                      value={values.lastName}
                      name="lastName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      fullWidth
                      error={Boolean(touched.lastName && errors.lastName)}
                    />
                    {touched.lastName && errors.lastName && (
                      <FormHelperText error id="helper-text-last-name-signup">
                        {errors.lastName}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="email-signup">Email*</InputLabel>
                    <OutlinedInput
                      id="email-signup"
                      type="email"
                      value={values.email}
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter email"
                      fullWidth
                      error={Boolean(touched.email && errors.email)}
                    />
                    {touched.email && errors.email && (
                      <FormHelperText error id="helper-text-email-signup">
                        {errors.email}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="phone-signup">Phone (WhatsApp)*</InputLabel>
                    <OutlinedInput
                      id="phone-signup"
                      type="text"
                      value={values.phone}
                      name="phone"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      fullWidth
                      error={Boolean(touched.phone && errors.phone)}
                    />
                    {touched.phone && errors.phone && (
                      <FormHelperText error id="helper-text-phone-signup">
                        {errors.phone}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="for-alert-notification-signup">For Alert Notification*</InputLabel>
                    <OutlinedInput
                      id="for-alert-notification-signup"
                      type="text"
                      value={values.forAlertNotification}
                      name="forAlertNotification"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter alert notification"
                      fullWidth
                      error={Boolean(touched.forAlertNotification && errors.forAlertNotification)}
                    />
                    {touched.forAlertNotification && errors.forAlertNotification && (
                      <FormHelperText error id="helper-text-for-alert-notification-signup">
                        {errors.forAlertNotification}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="job-title-signup">Job Title*</InputLabel>
                    <OutlinedInput
                      id="job-title-signup"
                      type="text"
                      value={values.jobTitle}
                      name="jobTitle"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter job title"
                      fullWidth
                      error={Boolean(touched.jobTitle && errors.jobTitle)}
                    />
                    {touched.jobTitle && errors.jobTitle && (
                      <FormHelperText error id="helper-text-job-title-signup">
                        {errors.jobTitle}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="password-signup">Password*</InputLabel>
                    <OutlinedInput
                      id="password-signup"
                      type="password"
                      value={values.password}
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter password"
                      fullWidth
                      error={Boolean(touched.password && errors.password)}
                    />
                    {touched.password && errors.password && (
                      <FormHelperText error id="helper-text-password-signup">
                        {errors.password}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="user-role-signup">User Role*</InputLabel>
                    <TextField
                      select
                      id="user-role-signup"
                      value={values.userRole}
                      name="userRole"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      fullWidth
                      error={Boolean(touched.userRole && errors.userRole)}
                      helperText={touched.userRole && errors.userRole}
                    >
                      <MenuItem value="">- Select -</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="manager">Manager</MenuItem>
                      <MenuItem value="technician">Technician</MenuItem>
                    </TextField>
                  </Stack>
                </Grid>
              </>
            )}

            {/* Team Fields */}
            {formType === 'Team' && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="team-name-signup">Team Name*</InputLabel>
                    <OutlinedInput
                      id="team-name-signup"
                      type="text"
                      value={values.teamName}
                      name="teamName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter team name"
                      fullWidth
                      error={Boolean(touched.teamName && errors.teamName)}
                    />
                    {touched.teamName && errors.teamName && (
                      <FormHelperText error id="helper-text-team-name-signup">
                        {errors.teamName}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
  <Stack sx={{ gap: 1 }}>
    <InputLabel htmlFor="members-signup">Members*</InputLabel>
    <TextField
      select
      id="members-signup"
      name="members"
      multiple
      value={values.members || []} // Ensure value is always an array
      onBlur={handleBlur}
      onChange={(e) => {
        const selected = Array.isArray(e.target.value) ? e.target.value : [];
        setFieldValue('members', selected);
      }}
      fullWidth
      error={Boolean(touched.members && errors.members)}
      helperText={touched.members && errors.members}
      SelectProps={{
        multiple: true,
      }}
    >
      {users
        .filter((user) => user.userRole === 'technician')
        .map((user) => (
          <MenuItem key={user._id} value={user._id}>
            {`${user.firstName} ${user.lastName} (${user.email})`}
          </MenuItem>
        ))}

    </TextField>
  </Stack>
</Grid>
              </>
            )}

            {/* Submit Button */}
            <Grid size={12}>
              <AnimateButton>
                <Button type="submit" fullWidth size="large" variant="contained" color="primary">
                  Submit
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}