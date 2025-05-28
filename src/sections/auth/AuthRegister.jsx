import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
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

import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import axios from 'axios';
import toast from 'react-hot-toast';

// ============================|| JWT - REGISTER ||============================ //

export default function AuthRegister() {
  const navigate = useNavigate();
  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  const [searchParams] = useSearchParams();
  const auth = searchParams.get('auth'); // get auth and set route based on that

  useEffect(() => {
    changePassword('');
  }, []);


 const processFormSubmission = async (values, { setErrors, setStatus, setSubmitting }, event) => { 
    try {
      // Prevent default form submission
      if (event) {
        event.preventDefault();
      }
      

      try {
        const response = await axios.post('http://localhost:5000/api/auth/register', {
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
          companyName: values.companyName,
        });
        if (response.data.success && response.data.token) {
          console.log('Response:', response.data);
          toast.success('Successfully registered!');
          navigate('/login'); // Replace '/dashboard' with your desired route
        } else {
          toast.error('Registration failed. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error.response ?  error.response.data : error.message);
        throw error; // Re-throw the error to handle it in the outer catch block
      }
     
      
      // Your API call would go here
      // For example:
      // const response = await registerUser(values);
      
      setStatus({ success: true });
      setSubmitting(false);
      
      // Optionally redirect user after successful submission
      // history.push('/login');
      
    } catch (err) {
      console.error(err);
      setStatus({ success: false });
      setErrors({ submit:  err.response ?  err.response.data.message : err.message});
      setSubmitting(false);
    }
  };


  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          companyName: '',
          submit: null,
          agreeTerms: false
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string()
            .required('Password is required')
            .test('no-leading-trailing-whitespace', 'Password cannot start or end with spaces', (value) => value === value.trim())
            .max(10, 'Password must be less than 10 characters'),
          confirmPassword: Yup.string()
            .required('Confirm Password is required')
            .oneOf([Yup.ref('password'), null], 'Passwords must match'),
          firstName: Yup.string().max(255).required('First Name is required'),
          lastName: Yup.string().max(255).required('Last Name is required'),
          companyName: Yup.string().max(255),
          agreeTerms: Yup.boolean().oneOf([true], 'You must agree to the terms and conditions')
        })}
        onSubmit={processFormSubmission}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} >
            <Grid container spacing={3}>
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
                    placeholder="Enter Your Email Address"
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="helper-text-email-signup">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="password-signup">Password *</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-signup"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changePassword(e.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="******"
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="helper-text-password-signup">
                    {errors.password}
                  </FormHelperText>
                )}
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="confirm-password-signup">Confirm Password *</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                    id="confirm-password-signup"
                    type={showPassword ? 'text' : 'password'}
                    value={values.confirmPassword}
                    name="confirmPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="******"
                  />
                </Stack>
                {touched.confirmPassword && errors.confirmPassword && (
                  <FormHelperText error id="helper-text-confirm-password-signup">
                    {errors.confirmPassword}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="first-name-signup">First Name *</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.firstName && errors.firstName)}
                    id="first-name-signup"
                    type="text"
                    value={values.firstName}
                    name="firstName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter Your First Name"
                  />
                </Stack>
                {touched.firstName && errors.firstName && (
                  <FormHelperText error id="helper-text-first-name-signup">
                    {errors.firstName}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="last-name-signup">Last Name *</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.lastName && errors.lastName)}
                    id="last-name-signup"
                    type="text"
                    value={values.lastName}
                    name="lastName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter Your Last Name"
                  />
                </Stack>
                {touched.lastName && errors.lastName && (
                  <FormHelperText error id="helper-text-last-name-signup">
                    {errors.lastName}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="companyName-signup">companyName Name</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.companyName && errors.companyName)}
                    id="companyName-signup"
                    value={values.companyName}
                    name="companyName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter Your companyName Name"
                  />
                </Stack>
                {touched.companyName && errors.companyName && (
                  <FormHelperText error id="helper-text-companyName-signup">
                    {errors.companyName}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.agreeTerms}
                      onChange={(e) => handleChange({ target: { name: 'agreeTerms', value: e.target.checked } })}
                      name="agreeTerms"
                    />
                  }
                  label="By checking this box, you agree to our Term and Conditions"
                />
                {touched.agreeTerms && errors.agreeTerms && (
                  <FormHelperText error>{errors.agreeTerms}</FormHelperText>
                )}
              </Grid>
              {errors.submit && (
                <Grid size={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid size={12}>
                <AnimateButton>
                  <Button fullWidth type='submit' size="large" variant="contained" color="primary">
                    Register
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}