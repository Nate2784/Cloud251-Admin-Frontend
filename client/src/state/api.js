import { createApi,fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import axios from 'axios';

// Base URL for the API
const API_URL = 'http://102.23.206.244';
const WORKER_API_URL = 'http://102.23.206.230';
const token = localStorage.getItem('authToken');
console.log(token);
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/admin-login`, { email, password });
    console.log(response.data);
    return response.data; 
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const fetchExchangeRate = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/get-rate`, {
      headers: {
        Authorization: `Bearer ${token} `,
      },
    });

    console.log('API response:', response.data.value);
    
    // Assuming the response is an array and we need to access the first item
    const rateObject = response.data[0];
    
    // Convert the value to a floating-point number
    const exchangeRate = parseFloat(rateObject.value);
    console.log('Fetched exchange rate (as float):', exchangeRate);

    return exchangeRate;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    throw error;
  }
};


export const updateExchangeRate = async (newRate) => {
  try {
    const response = await axios.put(`${API_URL}/auth/update-rate`, {exchangeRate: newRate,
       }, {headers: {
        Authorization: `Bearer ${token}`,
      },} );
    return response.data.exchangeRate.value;
  } catch (error) {
    console.error('Error updating exchange rate:', error);
    throw error;
  }
};

export const fetchRootAccounts = async (page = 1, pageSize = 20) => {
  try {
    // Request URL with pagination parameters
    const response = await axios.get(`${API_URL}/auth/get-root-accounts`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },}, {
      params: {
        page,
        pageSize,
      },
    });

    const { data } = response.data;
    const total = parseInt(response.headers['x-total-count'], 10) || data.length;

    return {
      accounts: data,
      total: Number(total),
    };
  } catch (error) {
    console.error('Error fetching root accounts:', error);
    throw new Error('Error fetching root accounts: ' + error.message);
  }
};

export const fetchRootUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/auth/root/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching root user by ID:', error);
    throw new Error('Error fetching root user by ID: ' + error.message);
  }
};

// Function to fetch users
export const fetchUsers = async (rootUserId, page = 1, pageSize = 20, sort = {}, search = '') => {
  try {
    const params = {
      _page: page,
      _limit: pageSize,
      _sort: sort.field || 'id',
      _order: sort.sort || 'asc',
      q: search,
      rootUserId, // Pass rootUserId to the API
    };

    const response = await axios.get(`${API_URL}/auth/get-users`, { params,
      headers: {
        Authorization: `Bearer ${token}`,
      }, });

    // Assuming total count is returned in a header or response
    const users = response.data.data || [];
    const total = parseInt(response.headers['x-total-count'], 10) || users.length;
    return {
      users,
      total,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/auth/user/${id}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },});
    const userData = response.data;
    
    return userData;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error.message);
    throw error;
  }
};

export const activateUser = async (id) => {
  try {
    const response = await axios.put(
      `${API_URL}/auth/user/activate/${id}`,
      {}, // No data to send, so an empty object is passed
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error activating user:', error);
    throw error;
  }
};

export const deactivateUser = async (id) => {
  try {
    const response = await axios.put(
      `${API_URL}/auth/user/deactivate/${id}`,
      {}, // No data to send
      {
          headers: {
            Authorization: `Bearer ${token}`,
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deactivating user:', error.response ? error.response.data : error.message);
    throw error;
  }
};



export const fetchCompanies = async (page = 1, pageSize = 20, sort = {}, search = '') => {
  try {
    const params = {
      _page: page,
      _limit: pageSize,
      _sort: sort.field || 'id',
      _order: sort.sort || 'asc',
      q: search
    };
    
    const response = await axios.get(`${API_URL}/auth/get-companies`, { params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
     });
    const data = response.data.data;
    const total = parseInt(response.headers['x-total-count'], 10) || data.length;
    return {
      companies: data,
      total
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchCompanyById = async (companyId) => {
  try {
    const response = await axios.get(`${API_URL}/auth/company/${companyId}`,{},{
      headers: {
        Authorization: `Bearer ${token}`,
      },});
      console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSubscriptions = async (page = 1, pageSize = 20, sort = {}, search = '') => {
  try {
    const params = {
      _page: page,
      _limit: pageSize,
      _sort: sort.field || 'id',
      _order: sort.sort || 'asc',
      q: search
    };
    
    const response = await axios.get(`${API_URL}/auth/get-subscriptions`, { params,
      headers: {
        Authorization: `Bearer ${token}`,
      }, });
    const data = response.data.data;
    const total = parseInt(response.headers['x-total-count'], 10) || data.length;
    return {
      subscriptions: data,
      total
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchSubscriptionById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/auth/subscription/${id}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription by ID:', error);
    throw error;
  }
};

export const fetchTransactions = async (page = 1, pageSize = 20, sort = {}, search = '') => {
    try {
      const response = await axios.get(`${API_URL}/auth/get-transactions`, {
        params: {
          _page: page,
          _limit: pageSize,
          _sort: sort.field,
          _order: sort.order,
          q: search,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
    const data = response.data.data;
    const total = parseInt(response.headers['x-total-count'], 10) || data.length;
  
      return {
        transactions: data,
        total,
      };
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  };

  export const fetchTransactionById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/auth/transaction/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },}); 

      return response.data;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  };

  export const fetchOrders = async (page, pageSize, sort, search) => {
    try {
      // Set up query parameters for pagination, sorting, and searching
      const params = {
        _page: page,
        _limit: pageSize,
        _sort: sort.field || 'id', // Default sort by 'id' if no sort is provided
        _order: sort.sort || 'asc', // Default sort order 'asc' if no order is provided
        q: search || '', // Query string for searching, default to an empty string if no search is provided
      };
  
      const response = await axios.get(`${WORKER_API_URL}/order`, { params,
        headers: {
          Authorization: `Bearer ${token}`,
        },}); 
      const data = response.data.data;
      const total = parseInt(response.headers['x-total-count'], 10) || data.length;
  
      return {
        orders: data,
        total,
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  };

  export const fetchOrderById = async (id) => {
    try {
        const response = await axios.get(`${WORKER_API_URL}/order/${id}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },}); // Adjust endpoint as necessary
        return response.data.data;
    } catch (error) {
        console.error('Error fetching order:', error);
        throw error;
    }
};

export const api = createApi({
    baseQuery:fetchBaseQuery({ 
        baseUrl: `` 
    }),
    reducerPath: "AdminApi",
    tagTypes:["User","Products","Customers","Transactions","Geograpghy","Admins","Performance","Dashboard"],
    endpoints: (build) =>({
        getUser: build.query({
            query: (id) => `general/user/${id}`, 
            providesTags:["User"]
        }),
        getProducts: build.query({
            query: () => 'client/products',
            providesTags:["Products"]
        }),
        getUsers: build.query({
            query: () => 'auth/get-users',
            providesTags:["Users"]
        }),
        getTransactions: build.query({
            query:({ page,pageSize,sort,search }) =>({
                url:'client/transactions',
                method:'GET',
                params:{page,pageSize,sort,search}
            }),
            providesTags:["Transactions"]
        }),
        getGeography: build.query({
            query: () => 'client/geography',
            providesTags:["Geography"]
        }),
        getSales: build.query({
            query:() => 'sales/sales',
            providesTags:["Sales"]
        }),
        getAdmins: build.query({
            query:() => 'management/admins',
            provideTags:["Admins"]
        }),
        getPerformance: build.query({
            query:(id) => `management/performance/${id}`,
            provideTags:["Performance"]
        }),
        getDashboard: build.query({
            query:() => 'general/dashboard',
            providesTags:["Dashboard"]
        })
    })
})

export const { useGetUserQuery,useGetProductsQuery,useGetUsersQuery,useGetTransactionsQuery,useGetGeographyQuery, useGetSalesQuery ,useGetAdminsQuery, useGetPerformanceQuery,useGetDashboardQuery } = api