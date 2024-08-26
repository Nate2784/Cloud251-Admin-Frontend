import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, useTheme } from '@mui/material';
import Header from 'components/Header'; // Ensure this component exists
import Loader from '../../loader/Loader'; // Adjust the path if needed
import { fetchTransactionById } from '../../state/api'; // Adjust the path if necessary

const TransactionDetail = () => {
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTransaction = async () => {
      try {
        const transactionData = await fetchTransactionById(id);
        setTransaction(transactionData);
      } catch (error) {
        console.error('Error fetching transaction:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getTransaction();
  }, [id]);

  if (loading) return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full viewport height
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Loader />
    </Box>
  );

  if (error) return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Typography variant="body1" color="error">Error fetching transaction</Typography>
    </Box>
  );

  if (!transaction) return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Typography variant="body1">Transaction not found</Typography>
    </Box>
  );

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="TRANSACTION DETAIL" subtitle={`Details of transaction ID ${id}`} />
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Transaction ID: {transaction._id}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Payment Method:</strong> {transaction.paymentMethod}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Payment URL:</strong> <a href={transaction.paymentMethodInfo.paymentURL} target="_blank" rel="noopener noreferrer">{transaction.paymentMethodInfo.paymentURL}</a>
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Order ID:</strong> 
          <Box
            component="span"
            onClick={() => navigate(`/orders/${transaction.paymentMethodInfo.paymentBody.orderId}`)}
            sx={{
              cursor: 'pointer',
              color: theme.palette.text.primary,
              textDecoration: 'none',
              '&:hover': {
                color: theme.palette.primary.main,
              },
            }}
          >
            {transaction.paymentMethodInfo.paymentBody.orderId}
          </Box>
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Total:</strong> ${transaction.total}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Status:</strong> {transaction.status}
        </Typography>
        <Box mt="1rem">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(-1)} // Go back one page in history
          >
            Go Back
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TransactionDetail;
