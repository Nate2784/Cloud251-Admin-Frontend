import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, useTheme, Button, Typography, Select, MenuItem, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import Header from 'components/Header';
import DataGridCustomToolbar from 'components/DataGridCustomToolbar';
import { Link } from 'react-router-dom';
import { fetchSubscriptions } from '../../state/api';

const Subscriptions = () => {
  const theme = useTheme();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await fetchSubscriptions(page + 1, pageSize, sort, search);
        setData(result);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize, sort, search]);

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(0);
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const columns = [
    { field: '_id', headerName: 'ID', flex: 1 },
    { field: 'subscriptionTotal', headerName: 'Total Amount', flex: 1 },
    {
      field: 'dueDate',
      headerName: 'Due Date',
      flex: 1,
      type: 'date',
      valueGetter: (params) => new Date(params.value),
    },
    {
      field: 'rootUserId',
      headerName: 'Root User ID',
      flex: 1,
      renderCell: (params) => (
        <Link to={`/customer/${params.value}`} style={{ textDecoration: 'none' }}>
          <Typography color="secondary" variant="body2" sx={{ textDecoration: 'underline' }}>
            {params.value}
          </Typography>
        </Link>
      ),
    },
    {
      field: 'orders',
      headerName: 'Orders',
      flex: 1,
      renderCell: (params) => (
        <Box>
          {params.value.length > 0 ? params.value.map(orderId => (
            <Link to={`/orders/${orderId}`} key={orderId} style={{ textDecoration: 'none', display: 'block' }}>
              <Typography variant="body2" sx={{ color: theme.palette.secondary.main, textDecoration: 'underline' }}>
                {orderId}
              </Typography>
            </Link>
          )) : 'No orders'}
        </Box>
      ),
    },
    {
      field: 'transactions',
      headerName: 'Transactions',
      flex: 1,
      renderCell: (params) => (
        <Box>
          {params.value.length > 0 ? params.value.map(transaction => (
            <Link to={`/transactions/${transaction.transactionId}`} key={transaction.transactionId} style={{ textDecoration: 'none', display: 'block' }}>
              <Typography variant="body2" sx={{ color: theme.palette.secondary.main, textDecoration: 'underline' }}>
                {transaction.transactionId}
              </Typography>
            </Link>
          )) : 'No transactions'}
        </Box>
      ),
    },
    {
      field: 'view',
      headerName: 'View',
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/subscriptions/${params.row._id}`}>
          <Button variant="contained" color="primary">
            View Details
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="SUBSCRIPTIONS" subtitle="List of all subscriptions" />
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
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={(data && data.subscriptions) || []}
          columns={columns}
          rowCount={(data && data.total) || 0}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          sortingMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onSortModelChange={(newSortModel) => setSort(newSortModel[0])}
          components={{
            Toolbar: DataGridCustomToolbar,
            Pagination: (props) => (
              <CustomPagination
                {...props}
                page={page}
                setPage={setPage}
                pageSize={pageSize}
                handlePageSizeChange={handlePageSizeChange}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                isLoading={isLoading}
                total={(data && data.total) || 0}
                theme={theme}
              />
            ),
          }}
          componentsProps={{
            toolbar: { searchInput, setSearchInput, setSearch },
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

export default Subscriptions;
