import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from 'components/Header';
import Loader from '../../loader/Loader';
import { fetchUserById, activateUser, deactivateUser } from '../../state/api';

const UserDetail = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await fetchUserById(id);
        setUser(userData);
        setIsActive(userData.isActive);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [id]);

  const handleActivateUser = async () => {
    try {
      await activateUser(id);
      setIsActive(true);
    } catch (error) {
      console.error('Error activating user:', error);
      setError(error);
    }
  };

  const handleDeactivateUser = async () => {
    try {
      await deactivateUser(id);
      setIsActive(false);
    } catch (error) {
      console.error('Error deactivating user:', error);
      setError(error);
    }
  };

  if (loading) return (
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
      <Typography variant="body1" color="error">Error fetching data</Typography>
    </Box>
  );

  if (!user) return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Typography variant="body1">User not found</Typography>
    </Box>
  );

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="USER DETAIL" subtitle={`Details of user ID ${id}`} />
      <Box
        sx={{
          position: 'relative',
          backgroundColor: theme.palette.background.default,
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Button
          variant="contained"
          color={isActive ? "error" : "success"}
          sx={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
          }}
          onClick={isActive ? handleDeactivateUser : handleActivateUser}
        >
          {isActive ? 'Deactivate' : 'Activate'}
        </Button>

        <Typography variant="h5" gutterBottom>
          <strong>Full Name:</strong> {user.firstName} {user.middleName} {user.lastName}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Email:</strong> {user.email}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Username:</strong> {user.username}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Phone Number:</strong> {user.phoneNumber}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Account Type:</strong> {user.accountType}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>City:</strong> {user.city}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Province:</strong> {user.province}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Specific Address:</strong> {user.specificAddress}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Root User ID:</strong> 
          <Link 
            to={`/customer/${user.rootUserId}`} 
            style={{ 
              textDecoration: 'none', 
              color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
            }}
          >
            {user.rootUserId}
          </Link>
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Authenticated:</strong> {user.isVerified ? 'Yes' : 'No'}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Active Status:</strong> {isActive ? 'Active' : 'Inactive'}
        </Typography>

        <Typography variant="body1" gutterBottom>
          <strong>Plan:</strong> {user.plan ? user.plan.name : 'No plan assigned'}
        </Typography>

        <Box mt="2rem">
          <Typography variant="h6" gutterBottom>
            Transactions
          </Typography>
          {user.transactions && user.transactions.length > 0 ? (
            <Box>
              {user.transactions.map((transactionId) => (
                <Typography key={transactionId} variant="body2" gutterBottom>
                  <Link 
                    to={`/transactions/${transactionId}`} 
                    style={{ 
                      textDecoration: 'none', 
                      color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
                    }}
                  >
                    Transaction ID: {transactionId}
                  </Link>
                </Typography>
              ))}
            </Box>
          ) : (
            <Typography variant="body2">No transactions found</Typography>
          )}
        </Box>

        <Box mt="1rem">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default UserDetail;
