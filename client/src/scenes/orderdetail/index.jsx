import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Header from 'components/Header'; // Make sure this component exists
import Loader from '../../loader/Loader'; // Adjust the path accordingly
import { fetchOrderById } from '../../state/api'; // Adjust the path accordingly

const OrderDetail = () => {
    const { id } = useParams();
    const theme = useTheme();
    const navigate = useNavigate(); // Hook to navigate programmatically
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getOrder = async () => {
            try {
                const orderData = await fetchOrderById(id);
                setOrder(orderData);
            } catch (error) {
                console.error('Error fetching order details:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        getOrder();
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
            <Typography variant="body1" color="error">Error fetching order details</Typography>
        </Box>
    );

    if (!order) return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: theme.palette.background.default,
            }}
        >
            <Typography variant="body1">Order not found</Typography>
        </Box>
    );

    return (
        <Box m="1.5rem 2.5rem">
            <Header title="ORDER DETAIL" subtitle={`Details of order ID ${id}`} />
            <Box
                sx={{
                    backgroundColor: theme.palette.background.default,
                    padding: '2rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Order ID: {order._id} {/* Assuming _id is used for the order ID */}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Order Type:</strong> {order.orderType}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Status:</strong> {order.status}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Total:</strong> ${order.total.toFixed(2)} {/* Format total to 2 decimal places */}
                </Typography>
                {order.order && order.order.vm && (
                    <Box mt="1rem">
                        <Typography variant="h6" gutterBottom>
                            VM Details
                        </Typography>
                        {order.order.vm.map((vm, index) => (
                            <Box key={index} mb="1rem">
                                <Typography variant="body1" gutterBottom>
                                    <strong>Name:</strong> {vm.name}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Image ID:</strong> {vm.imageId}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Disk Size:</strong> {vm.diskSize} GB
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Instance Type:</strong> {vm.instanceType}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>vCPU:</strong> {vm.vCPU}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>RAM:</strong> {vm.RAM} GB
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Duration:</strong> {vm.duration} hours
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}
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

export default OrderDetail;
