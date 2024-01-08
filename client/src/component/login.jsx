import {useContext, useState,useEffect}from 'react';
import {useHistory} from "react-router-dom"
import { Avatar,Button,CssBaseline,TextField,Link,Paper,Box,Grid,Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { login } from '../services/api';
import {AccountContext} from "../context/accountProvider";

const defaultTheme = createTheme();

export default function SignInSide() {
  const {setAccount, account} = useContext(AccountContext);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');

  const history = useHistory();

  useEffect(() => {
    if (account) {
      history.push("/")
    }
  }, [account,history]);
  


  const handleSubmit = async(event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);


    const email = data.get('email');
    const password = data.get('password');
    form.reset();

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
      const user = await login(email, password);
      console.log(user,'---------------');
      if(!user){
        setLoginError('Username and password does not matched');
        return;
      }
      else {
        setAccount(user?.data);
        await localStorage.setItem("account", JSON.stringify(user?.data))
        history.push('/');
      }
     
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            {loginError && (
            <Typography color="error" align="center" mt={2}>
              {loginError}
            </Typography>
          )}
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                error={Boolean(emailError)}
                helperText={emailError}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={Boolean(passwordError)}
                helperText={passwordError}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container justifyContent={"flex-end"}>
                <Grid item>
                  <Link href="/signup">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
