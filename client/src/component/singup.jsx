import {useState, useContext, useEffect}from 'react';
import { useHistory } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { singup } from '../services/api';
import {AccountContext} from "../context/accountProvider";

const defaultTheme = createTheme();

export default function SignUp() {
  const {account} = useContext(AccountContext);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [firstnameError, setFirstnameError] = useState('');
  const [lastnameError, setLastnameError] = useState('');
  const [singUpError, setSingUpError] = useState('');

  const history = useHistory();

  useEffect(() => {
    if (account) {
      history.push("/")
    }
  }, [account, history]);

  const handleSubmit = async(event) => {
    event.preventDefault();
    const form  = event.currentTarget;
    const data = new FormData(form);
    const email = data.get('email');
    const password = data.get('password');
    const firstname = data.get('firstname');
    const lastname = data.get('lastname');

    form.reset();

    const userdata = {
      email,password,firstname,lastname
    }

    if (!firstname || firstname.length < 3) {
      setFirstnameError('Firstname at least have 3 characters');
      return;
    } else {
      setFirstnameError('');
    }
    if (!lastname || lastname.length < 3) {
      setLastnameError('lastname at least have 3 characters');
      return;
    } else {
      setLastnameError('');
    }

    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email address');
      return;
    } else {
      setEmailError('');
    }

    if (!password || password.length < 8 || password.length > 20) {
      setPasswordError('Password should be between 8 and 20 characters');
      return;
    } else {
      setPasswordError('');
    }


    try {
      const user = await singup(userdata);
      if(Object.keys(user?.data).length === 0) {
      
        setSingUpError(user?.message);
      }
      else{
        history.push('/login');
      }
      console.log(singUpError);
      
    } catch (error) {
      console.error('Singup failed:', error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          {singUpError && (
            <Typography color="error" align="center" mt={2}>
              {singUpError}
            </Typography>
          )}
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstname"
                  required
                  fullWidth
                  id="firstname"
                  label="First Name"
                  autoFocus
                  error={Boolean(firstnameError)}
                  helperText={firstnameError}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastname"
                  label="Last Name"
                  name="lastname"
                  autoComplete="family-name"
                  error ={Boolean(lastnameError)}
                  helperText = {lastnameError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  error ={Boolean(emailError)}
                  helperText ={emailError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  error ={Boolean(passwordError)}
                  helperText ={passwordError}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}