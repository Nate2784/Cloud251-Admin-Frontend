import React, { useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from 'components/Navbar';
import Sidebar from 'components/Sidebar';
import { useGetUserQuery } from 'state/api';

const Layout = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userId = useSelector((state) => state.global.userId);
  const { data } = useGetUserQuery(userId);
  const location = useLocation();

  // Determine if the current route is /login
  const isLoginPage = location.pathname === '/login';

  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      {!isLoginPage && (
        <Sidebar
          user={data || {}}
          isNonMobile={isNonMobile}
          drawerWidth="250px"
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      )}
      <Box flexGrow={1}>
        {!isLoginPage && (
          <Navbar
            user={data || {}}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        )}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
