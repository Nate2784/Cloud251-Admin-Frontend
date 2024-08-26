import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Header from 'components/Header';
import Loader from '../../loader/Loader'; // Adjust the path accordingly
import { fetchCompanyById } from '../../state/api'; // Make sure this function is imported

const CompanyDetail = () => {
  const theme = useTheme();
  const navigate = useNavigate(); // Hook to navigate programmatically
  const { id } = useParams(); // Get company ID from URL
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCompany = async () => {
      try {
        const result = await fetchCompanyById(id);
        setCompany(result);
      } catch (error) {
        console.error('Error fetching company details:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getCompany();
  }, [id]);

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
      <Typography variant="body1" color="error">Error loading company details</Typography>
    </Box>
  );

  if (!company) return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Typography variant="body1">Company not found</Typography>
    </Box>
  );

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="COMPANY DETAIL" subtitle={`Details of company ID ${id}`} />
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h5" gutterBottom>
          {company.companyName}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>TIN Number:</strong> {company.TINNumber}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Industry:</strong> {company.industry || 'N/A'}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Uploaded Document:</strong>
        </Typography>
        {company.uploadedDocument ? (
          <Box>
            <Typography variant="body2">
              <strong>Filename:</strong> {company.uploadedDocument.filename || 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>Path:</strong> {company.uploadedDocument.path || 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>Mimetype:</strong> {company.uploadedDocument.mimetype || 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>Size:</strong> {company.uploadedDocument.size ? `${company.uploadedDocument.size} bytes` : 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>Upload Date:</strong> {company.uploadedDocument.uploadDate ? new Date(company.uploadedDocument.uploadDate).toLocaleDateString() : 'N/A'}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2">No Document Uploaded</Typography>
        )}
        <Typography variant="body1" gutterBottom>
          <strong>User Count:</strong> {company.userCount}
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

export default CompanyDetail;
