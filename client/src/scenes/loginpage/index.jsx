import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, useTheme, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../state/api';

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/customers');
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);
      const token = data.token;
      const admin = data.admin;

      localStorage.setItem('authToken', token);
      localStorage.setItem('userInfo', JSON.stringify(admin));

      console.log('Login successful');
      navigate('/customers');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      setIsSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setIsSnackbarOpen(false);
    setError(null);
  };

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Box
        width={400}
        p={4}
        borderRadius={2}
        sx={{
          backgroundColor: theme.palette.background.alt,
          boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Typography variant="h2" mb={2} color={theme.palette.secondary.main} textAlign="center">
          Login
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            input: { color: theme.palette.text.primary },
            label: { color: theme.palette.text.secondary },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: theme.palette.neutral.main,
              },
              '&:hover fieldset': {
                borderColor: theme.palette.secondary.main,
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.secondary.main,
              },
            },
          }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            input: { color: theme.palette.text.primary },
            label: { color: theme.palette.text.secondary },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: theme.palette.neutral.main,
              },
              '&:hover fieldset': {
                borderColor: theme.palette.secondary.main,
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.secondary.main,
              },
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          sx={{
            mt: 2,
            color: theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.background.default,
            backgroundColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Login
        </Button>
      </Box>

      {/* Error Snackbar */}
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position at the top center
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;
