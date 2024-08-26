import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, useTheme, Button, Typography, Select, MenuItem, IconButton, /*TextField*/ } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import Header from 'components/Header';
import DataGridCustomToolbar from 'components/DataGridCustomToolbar';
import { Link, useParams } from 'react-router-dom';
import { fetchUsers, fetchUserById } from '../../state/api'; // Import fetchUserById

const Users = () => {
  const theme = useTheme();
  const { rootUserId } = useParams();

  const [rootUserName, setRootUserName] = useState(''); // State for the root user's name
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchUsers(rootUserId, page + 1, pageSize, sort, search);
        setData(result.users);
        setTotal(result.total);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize, sort, search, rootUserId]);

  useEffect(() => {
    const fetchRootUserName = async () => {
      try {
        const user = await fetchUserById(rootUserId);
        setRootUserName(`${user.firstName} ${user.lastName}`);
      } catch (error) {
        console.error('Error fetching root user details:', error);
      }
    };

    if (rootUserId) {
      fetchRootUserName();
    }
  }, [rootUserId]);

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
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'phoneNumber',
      headerName: 'Phone',
      flex: 1,
      renderCell: (params) => params.value.replace(/^(\d{3})(\d{3})(\d{4})/, '($1) $2-$3'),
    },
    {
      field: 'city',
      headerName: 'City',
      flex: 1,
    },
    {
      field: 'details',
      headerName: 'Details',
      flex: 1,
      renderCell: (params) => (
        <Link to={`/user/${params.row._id}`}>
          <Button variant="contained" color="primary">
            View Details
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="USERS" subtitle={`List of users under root user ${rootUserName}`} />
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
          rows={data}
          columns={columns}
          rowCount={total}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          sortingMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onSortModelChange={(newSortModel) => setSort(newSortModel[0] || {})}
          getRowId={(row) => row._id}
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
                isLoading={loading}
                total={total}
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

export default Users;
