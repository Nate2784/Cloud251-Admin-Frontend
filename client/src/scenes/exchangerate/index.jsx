import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, useTheme, Paper } from '@mui/material';
import { fetchExchangeRate, updateExchangeRate } from '../../state/api';

const ExchangeRate = () => {
  const theme = useTheme();
  const [exchangeRate, setExchangeRate] = useState('');
  const [newRate, setNewRate] = useState('');

  useEffect(() => {
    const getExchangeRate = async () => {
      try {
        const rate = await fetchExchangeRate();
        console.log('Fetched exchange rate:', rate); // Should log the correct rate
        setExchangeRate(rate);
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
      }
    };
    getExchangeRate();
  }, []);

  const handleUpdateRate = async () => {
    try {
      const updatedRate = await updateExchangeRate(newRate);
      console.log('Updated exchange rate:', updatedRate); // Debugging log
      setExchangeRate(updatedRate);
      setNewRate('');
    } catch (error) {
      console.error("Failed to update exchange rate:", error);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      bgcolor={theme.palette.background.default} // Background color from theme
      sx={{ padding: '2rem' }} // Add padding to container
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: '400px',
          textAlign: 'center',
          boxShadow: theme.shadows[5], // Shadow effect from theme
          backgroundColor: theme.palette.background.alt, // Alternative background color from theme
          borderRadius: '8px' // Optional: add rounded corners
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            mb: 2,
            color: theme.palette.text.primary // Text color from theme
          }}
        >
          Current Exchange Rate: {exchangeRate ? exchangeRate.toFixed(2) + " ETB": 'Loading...'}
        </Typography>
        <Box display="flex" flexDirection="column" gap="1.5rem">
          <TextField
            variant="outlined"
            label="New Exchange Rate"
            value={newRate}
            onChange={(e) => setNewRate(e.target.value)}
            fullWidth
            sx={{
              boxShadow: theme.shadows[2], // Shadow effect from theme
              borderColor: theme.palette.primary.main, // Border color from theme
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: theme.palette.primary.main, // Border color from theme
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.dark, // Hover border color from theme
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main, // Focused border color from theme
                }
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateRate}
            fullWidth
            sx={{
              boxShadow: theme.shadows[2], // Shadow effect from theme
            }}
          >
            Update Rate
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ExchangeRate;
