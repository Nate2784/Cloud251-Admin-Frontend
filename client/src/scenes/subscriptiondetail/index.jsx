import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Header from 'components/Header'; // Ensure this component exists
import Loader from '../../loader/Loader'; // Adjust the path accordingly
import { fetchSubscriptionById } from '../../state/api'; // Adjust the path accordingly

const SubscriptionDetail = () => {
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSubscription = async () => {
      try {
        const result = await fetchSubscriptionById(id);
        setSubscription(result);
      } catch (error) {
        console.error('Error fetching subscription details:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getSubscription();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Loader />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Typography variant="body1" color="error">
          Error fetching subscription details
        </Typography>
      </Box>
    );
  }

  if (!subscription) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Typography variant="body1">Subscription not found</Typography>
      </Box>
    );
  }

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="SUBSCRIPTION DETAIL" subtitle={`Details of subscription ID ${subscription._id}`} />
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Subscription ID: {subscription._id}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Total Amount:</strong> ${subscription.subscriptionTotal}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Due Date:</strong> {new Date(subscription.dueDate).toLocaleDateString()}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Root User ID:</strong> 
          <Box
            component="span"
            onClick={() => navigate(`/customer/${subscription.rootUserId}`)}
            sx={{
              cursor: 'pointer',
              color: theme.palette.text.primary,
              textDecoration: 'none',
              '&:hover': {
                color: theme.palette.primary.main,
              },
            }}
          >
            {subscription.rootUserId}
          </Box>
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Orders:</strong> 
          {subscription.orders.length > 0 ? (
            subscription.orders.map((orderId, index) => (
              <Box
                key={index}
                component="span"
                onClick={() => navigate(`/orders/${orderId}`)}
                sx={{
                  cursor: 'pointer',
                  color: theme.palette.text.primary,
                  textDecoration: 'none',
                  '&:hover': {
                    color: theme.palette.primary.main,
                  },
                  marginRight: '0.5rem', // Add some space between order IDs
                }}
              >
                {orderId}
              </Box>
            ))
          ) : (
            'None'
          )}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Transactions:</strong>
        </Typography>
        {subscription.transactions.length > 0 ? (
          <Box>
            {subscription.transactions.map((transaction, index) => (
              <Box key={index} sx={{ marginBottom: '1rem' }}>
                <Typography variant="body2">
                  <strong>Transaction ID:</strong> 
                  <Box
                    component="span"
                    onClick={() => navigate(`/transactions/${transaction.transactionId}`)}
                    sx={{
                      cursor: 'pointer',
                      color: theme.palette.text.primary,
                      textDecoration: 'none',
                      '&:hover': {
                        color: theme.palette.primary.main,
                      },
                      marginLeft: '0.5rem', // Add some space between label and ID
                    }}
                  >
                    {transaction.transactionId}
                  </Box>
                </Typography>
                <Typography variant="body2">
                  <strong>Duration:</strong> {transaction.duration} months
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2">No Transactions</Typography>
        )}
        <Box mt="1rem">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(-1)} // Go back one page in the history
          >
            Go back
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SubscriptionDetail;
