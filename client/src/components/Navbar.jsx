import React, { useState, useEffect } from 'react';
import { LightModeOutlined, DarkModeOutlined, Menu as MenuIcon, ArrowDropDownOutlined } from '@mui/icons-material';
import FlexBetween from 'components/FlexBetween';
import { useDispatch } from 'react-redux';
import { setMode } from 'state';
import ProfileImage from 'assets/profile.png';
import { AppBar, Toolbar, useTheme, IconButton, Button, Box, Typography, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate(); // Use the useNavigate hook for redirection

  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState({ firstName: '', lastName: '' }); // State for user info

  const isOpen = Boolean(anchorEl);

  useEffect(() => {
    // Retrieve user info from local storage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setUser({ firstName: userInfo.firstName, lastName: userInfo.lastName });
    }
  }, []);

  const handleClick = (e) => setAnchorEl(e.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    // Remove the JWT token and user info from local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');

    // Redirect to the login page
    navigate('/login');
  };

  return (
    <AppBar sx={{ position: 'static', background: 'none', boxShadow: 'none' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* LEFT SIDE */}
        <FlexBetween>
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon />
          </IconButton>
        </FlexBetween>
        {/* RIGHT SIDE */}
        <FlexBetween gap="1.5rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === 'dark' ? (
              <DarkModeOutlined sx={{ fontSize: '25px' }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: '25px' }} />
            )}
          </IconButton>
          <FlexBetween>
            <Button
              onClick={handleClick}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                textTransform: 'none',
                gap: '1rem',
              }}
            >
              <Box
                component="img"
                alt="profile"
                src={ProfileImage}
                height="40px"
                width="40px"
                borderRadius="50%"
                sx={{ objectFit: 'cover' }}
              />
              <Box textAlign="left">
                <Typography fontWeight="bold" fontSize="0.85rem" sx={{ color: theme.palette.secondary[100] }}>
                  {user.firstName} {user.lastName}
                </Typography>
              </Box>
              <ArrowDropDownOutlined sx={{ color: theme.palette.secondary[300], fontSize: '25px' }} />
            </Button>
            <Menu anchorEl={anchorEl} open={isOpen} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
              <MenuItem onClick={handleLogout}>Log Out</MenuItem> {/* Call handleLogout on click */}
            </Menu>
          </FlexBetween>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
