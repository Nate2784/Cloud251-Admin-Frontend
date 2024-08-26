import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, useTheme, IconButton, MenuItem, Select } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import Header from 'components/Header';
import Loader from '../../loader/Loader';
import { fetchRootAccounts } from '../../state/api';
import { useNavigate } from 'react-router-dom';

const Customers = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [rootAccounts, setRootAccounts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getRootAccounts = async () => {
      try {
        setLoading(true);
        const result = await fetchRootAccounts(page + 1, pageSize);
        setRootAccounts(result.accounts);
        setTotal(result.total);
      } catch (error) {
        console.error('Error fetching root accounts:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getRootAccounts();
  }, [page, pageSize]);

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(0); // Reset to first page when changing page size
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleDisplayUsersClick = (rootUserId) => {
    navigate(`/users/${rootUserId}`);
  };

  const columns = [
    {
      field: '_id',
      headerName: 'ID',
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/customer/${params.row._id}`)}
        >
          {params.row._id}
        </Button>
      ),
    },
    { field: 'accountName', headerName: 'Account Name', flex: 1 },
    {
      field: 'active',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (params.value ? 'Active' : 'Inactive'),
    },
    {
      field: 'expireDate',
      headerName: 'Expire Date',
      flex: 1,
      renderCell: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : 'N/A',
    },
    {
      field: 'closedDate',
      headerName: 'Closed Date',
      flex: 1,
      renderCell: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : 'N/A',
    },
    {
      field: 'displayUsers',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleDisplayUsersClick(params.row._id)}
        >
          Display Users
        </Button>
      ),
    },
  ];

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
      <Typography variant="body1" color="error">Error fetching root accounts</Typography>
    </Box>
  );

  if (rootAccounts.length === 0) return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Typography variant="body1">No root accounts found</Typography>
    </Box>
  );

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="CUSTOMERS" subtitle="List of Root Accounts" />
      <Box
        height="75vh"
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: theme.palette.primary.light,
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.5rem 1rem',
          },
          '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={loading}
          rows={rootAccounts}
          columns={columns}
          rowCount={total}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          getRowId={(row) => row._id}
          components={{
            Pagination: (props) => (
              <CustomPagination
                {...props}
                page={page}
                pageSize={pageSize}
                handlePageSizeChange={handlePageSizeChange}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                isLoading={loading}
                total={total}
                theme={theme}
              />
            ),
          }}
        />
      </Box>
    </Box>
  );
};

const CustomPagination = ({
  page,
  pageSize,
  handlePageSizeChange,
  handleNextPage,
  handlePreviousPage,
  isLoading,
  total,
  theme,
}) => {
  const start = page * pageSize + 1;
  const end = Math.min(total, start + pageSize - 1);

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
      <Box display="flex" alignItems="center">
        <Typography variant="body2" mr={1}>
          Rows per page:
        </Typography>
        <Select
          value={pageSize}
          onChange={handlePageSizeChange}
          size="small"
          disabled={isLoading}
          sx={{
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderRadius: '4px',
            padding: '0 0.5rem',
          }}
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </Box>
      <Box display="flex" alignItems="center">
        <Typography variant="body2" mr={1}>
          {start}–{end} of {total}
        </Typography>
        <IconButton
          onClick={handlePreviousPage}
          disabled={page === 0 || isLoading}
          sx={{
            color: theme.palette.secondary[300],
          }}
        >
          <ArrowBackIos />
        </IconButton>
        <IconButton
          onClick={handleNextPage}
          disabled={end >= total || isLoading}
          sx={{
            color: theme.palette.secondary[300],
          }}
        >
          <ArrowForwardIos />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Customers;
