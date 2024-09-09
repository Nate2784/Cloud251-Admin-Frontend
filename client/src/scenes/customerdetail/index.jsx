import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Header from 'components/Header'; // Ensure this component exists
import Loader from '../../loader/Loader'; // Adjust the path if necessary
import { fetchRootUserById, activateRootUser, deactivateRootUser } from '../../state/api';

const CustomerDetail = () => {
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
        const data = await fetchRootUserById(id);
        setUser(data);
        setIsActive(data.active);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [id]);

  const handleActivateUser = async () => {
    try {
      await activateRootUser(id);
      setIsActive(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeactivateUser = async () => {
    try {
      await deactivateRootUser(id);
      setIsActive(false);
    } catch (error) {
      setError(error.message);
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
      <Typography variant="body1" color="error">{error}</Typography>
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
      <Header title="CUSTOMER DETAIL" subtitle={`Details of customer ID ${id}`} />
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
          <strong>Account Name:</strong> {user.accountName}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Status:</strong> {user.active ? 'Active' : 'Inactive'}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Expire Date:</strong> {user.expireDate ? new Date(user.expireDate).toLocaleDateString() : 'N/A'}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Closed Date:</strong> {user.closedDate ? new Date(user.closedDate).toLocaleDateString() : 'N/A'}
        </Typography>

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

export default CustomerDetail;
