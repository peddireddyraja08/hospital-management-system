import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Breadcrumbs,
  Link,
  InputBase,
  alpha,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ScienceIcon from '@mui/icons-material/Science';
import BiotechIcon from '@mui/icons-material/Biotech';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import PaymentIcon from '@mui/icons-material/Payment';
import HotelIcon from '@mui/icons-material/Hotel';
import BadgeIcon from '@mui/icons-material/Badge';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import InventoryIcon from '@mui/icons-material/Inventory';
import MedicationIcon from '@mui/icons-material/Medication';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import TimelineIcon from '@mui/icons-material/Timeline';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { useAuth } from '../context/AuthContext';
import { criticalAlertAPI } from '../services/api';

const drawerWidth = 240;

const menuSections = [
  {
    title: 'Clinical',
    icon: <MedicalServicesIcon />,
    items: [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
      { text: 'Patients', icon: <PeopleOutlineIcon />, path: '/patients' },
      { text: 'Doctors', icon: <LocalHospitalIcon />, path: '/doctors' },
      { text: 'Appointments', icon: <CalendarTodayOutlinedIcon />, path: '/appointments' },
      { text: 'Medical Records', icon: <DescriptionOutlinedIcon />, path: '/medical-records' },
    ],
  },
  {
    title: 'Laboratory',
    icon: <ScienceIcon />,
    items: [
      { text: 'Lab Orders', icon: <AssignmentOutlinedIcon />, path: '/lab-tests' },
      { text: 'Critical Alerts', icon: <NotificationsIcon />, path: '/critical-alerts' },
      { text: 'Lab Test Catalog', icon: <AssignmentOutlinedIcon />, path: '/lab-catalog' },
      { text: 'Sample Management', icon: <BiotechIcon />, path: '/samples' },
      { text: 'Walk-in Lab Requests', icon: <PersonAddIcon />, path: '/lab/walk-in' },
      { text: 'QC Materials', icon: <InventoryIcon />, path: '/qc/materials' },
      { text: 'QC Data Entry', icon: <AssignmentOutlinedIcon />, path: '/qc/data-entry' },
    ],
  },
  {
    title: 'Inpatient',
    icon: <HotelIcon />,
    items: [
      // Operations Submenu
      { 
        text: 'Operations', 
        icon: <AnalyticsIcon />, 
        isSubmenu: true,
        items: [
          { text: 'Operations Dashboard', icon: <AnalyticsIcon />, path: '/hospital-operations' },
          { text: 'IPD Dashboard', icon: <DashboardIcon />, path: '/ipd' },
          { text: 'Bed Map', icon: <HotelIcon />, path: '/bed-map' },
        ]
      },
      // Clinical Submenu
      { 
        text: 'Clinical', 
        icon: <MedicalServicesIcon />, 
        isSubmenu: true,
        items: [
          { text: 'Patient Timeline', icon: <TimelineIcon />, path: '/patient-timeline' },
          { text: 'Nursing Task Board', icon: <CheckBoxIcon />, path: '/task-board' },
        ]
      },
      // Bed & Facility Submenu
      { 
        text: 'Bed & Facility', 
        icon: <HotelIcon />, 
        isSubmenu: true,
        items: [
          { text: 'Floor Management', icon: <DashboardIcon />, path: '/floors' },
          { text: 'Ward Management', icon: <MedicalServicesIcon />, path: '/wards' },
          { text: 'Bed Management', icon: <HotelIcon />, path: '/beds' },
          { text: 'Bed Creation', icon: <PersonAddIcon />, path: '/beds/create' },
        ]
      },
      // Analytics Submenu
      { 
        text: 'Analytics', 
        icon: <AnalyticsIcon />, 
        isSubmenu: true,
        items: [
          { text: 'IPD Analytics', icon: <AnalyticsIcon />, path: '/ipd-analytics' },
        ]
      },


      // Discharge
      { 
        text: 'Discharge', 
        icon: <HotelIcon />, 
        isSubmenu: true,
        items: [
          { text: 'Discharge Wizard', icon: <HotelIcon />, path: '/discharge-wizard' },
        ]
      },
    ],
  },
  {
    title: 'Pharmacy',
    icon: <LocalPharmacyIcon />,
    items: [
      { text: 'Pharmacy Inventory', icon: <InventoryIcon />, path: '/pharmacy' },
      { text: 'Dispensing', icon: <MedicationIcon />, path: '/pharmacy/dispense' },
    ],
  },
  {
    title: 'Billing & Finance',
    icon: <PaymentIcon />,
    items: [
      { text: 'Billing', icon: <ReceiptIcon />, path: '/billing' },
      { text: 'Payments', icon: <AccountBalanceWalletIcon />, path: '/payments' },
    ],
  },
  {
    title: 'Administration',
    icon: <SettingsIcon />,
    items: [
      { text: 'Staff', icon: <BadgeIcon />, path: '/staff' },
      { text: 'User Roles', icon: <AdminPanelSettingsIcon />, path: '/user-roles' },
      { text: 'System Settings', icon: <SettingsIcon />, path: '/settings' },
    ],
  },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [alertCount, setAlertCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  // Fetch critical alert count
  React.useEffect(() => {
    const fetchAlertCount = async () => {
      try {
        const response = await criticalAlertAPI.getCount();
        if (response.data.success) {
          setAlertCount(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching alert count:', error);
      }
    };

    fetchAlertCount();
    // Poll every 30 seconds
    const interval = setInterval(fetchAlertCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSectionToggle = (sectionTitle) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const handleSubmenuToggle = (submenuKey) => {
    setOpenSections(prev => ({
      ...prev,
      [submenuKey]: !prev[submenuKey]
    }));
  };

  // Check if user has required role
  const hasRole = (requiredRoles) => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.includes(user?.role);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate('/login');
  };

  // Generate breadcrumbs from current path
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(x => x);
    return paths.map((path, index) => ({
      label: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' '),
      path: '/' + paths.slice(0, index + 1).join('/')
    }));
  };

  const drawer = (
    <Box sx={{ bgcolor: '#F9FAFB', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, bgcolor: '#1565C0', color: 'white' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          MediCare
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
          Hospital Management System
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
        <List sx={{ width: '100%' }} component="nav">
          {menuSections.map((section, sectionIndex) => (
            <Box key={section.title} sx={{ mb: 0.5 }}>
              <ListItemButton 
                onClick={() => handleSectionToggle(section.title)}
                sx={{ 
                  mx: 1,
                  borderRadius: 1,
                  transition: 'all 0.2s',
                  '&:hover': { 
                    bgcolor: alpha('#1565C0', 0.08),
                    transform: 'translateX(2px)'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: '#1565C0' }}>
                  {section.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={section.title} 
                  primaryTypographyProps={{ 
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: '#374151'
                  }}
                />
                {openSections[section.title] ? 
                  <ExpandLess sx={{ color: '#9CA3AF', fontSize: 20 }} /> : 
                  <ExpandMore sx={{ color: '#9CA3AF', fontSize: 20 }} />
                }
              </ListItemButton>
              <Collapse in={openSections[section.title]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {section.items.map((item) => {
                    // Check role-based visibility
                    if (item.roles && !hasRole(item.roles)) {
                      return null;
                    }

                    // Handle submenu items
                    if (item.isSubmenu) {
                      const submenuKey = `${section.title}-${item.text}`;
                      return (
                        <Box key={item.text}>
                          <ListItemButton 
                            onClick={() => handleSubmenuToggle(submenuKey)}
                            sx={{ 
                              pl: 5,
                              py: 0.75,
                              mx: 1,
                              my: 0.25,
                              borderRadius: 1,
                              transition: 'all 0.2s',
                              '&:hover': { 
                                bgcolor: alpha('#1565C0', 0.08),
                                transform: 'translateX(4px)'
                              }
                            }}
                          >
                            <ListItemIcon sx={{ 
                              minWidth: 36, 
                              color: '#6B7280',
                              '& svg': { fontSize: 18 }
                            }}>
                              {item.icon}
                            </ListItemIcon>
                            <ListItemText 
                              primary={item.text} 
                              primaryTypographyProps={{ 
                                fontSize: '0.8125rem',
                                fontWeight: 500,
                                color: '#374151'
                              }}
                            />
                            {openSections[submenuKey] ? 
                              <ExpandLess sx={{ color: '#9CA3AF', fontSize: 18 }} /> : 
                              <ExpandMore sx={{ color: '#9CA3AF', fontSize: 18 }} />
                            }
                          </ListItemButton>
                          <Collapse in={openSections[submenuKey]} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                              {item.items.map((subItem) => {
                                const isActive = location.pathname === subItem.path;
                                return (
                                  <ListItem key={subItem.text} disablePadding>
                                    <ListItemButton 
                                      onClick={() => navigate(subItem.path)}
                                      sx={{ 
                                        pl: 9,
                                        py: 0.5,
                                        mx: 1,
                                        my: 0.25,
                                        borderRadius: 1,
                                        transition: 'all 0.2s',
                                        bgcolor: isActive ? alpha('#1565C0', 0.12) : 'transparent',
                                        '&:hover': { 
                                          bgcolor: isActive ? alpha('#1565C0', 0.18) : alpha('#1565C0', 0.08),
                                          transform: 'translateX(4px)'
                                        }
                                      }}
                                    >
                                      <ListItemIcon sx={{ 
                                        minWidth: 32, 
                                        color: isActive ? '#1565C0' : '#9CA3AF',
                                        '& svg': { fontSize: 18 }
                                      }}>
                                        {subItem.icon}
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary={subItem.text} 
                                        primaryTypographyProps={{ 
                                          fontSize: '0.75rem',
                                          fontWeight: isActive ? 600 : 400,
                                          color: isActive ? '#1565C0' : '#6B7280'
                                        }}
                                      />
                                    </ListItemButton>
                                  </ListItem>
                                );
                              })}
                            </List>
                          </Collapse>
                        </Box>
                      );
                    }

                    // Handle regular menu items
                    const isActive = location.pathname === item.path;
                    return (
                      <ListItem key={item.text} disablePadding>
                        <ListItemButton 
                          onClick={() => navigate(item.path)}
                          sx={{ 
                            pl: 5,
                            py: 0.75,
                            mx: 1,
                            my: 0.25,
                            borderRadius: 1,
                            transition: 'all 0.2s',
                            bgcolor: isActive ? alpha('#1565C0', 0.12) : 'transparent',
                            '&:hover': { 
                              bgcolor: isActive ? alpha('#1565C0', 0.18) : alpha('#1565C0', 0.08),
                              transform: 'translateX(4px)'
                            }
                          }}
                        >
                          <ListItemIcon sx={{ 
                            minWidth: 36, 
                            color: isActive ? '#1565C0' : '#6B7280',
                            '& svg': { fontSize: 20 }
                          }}>
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText 
                            primary={item.text} 
                            primaryTypographyProps={{ 
                              fontSize: '0.8125rem',
                              fontWeight: isActive ? 600 : 400,
                              color: isActive ? '#1565C0' : '#6B7280'
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              </Collapse>
            </Box>
          ))}
        </List>
      </Box>
      <Divider />
      <List sx={{ py: 1 }}>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={handleLogout}
            sx={{
              mx: 1,
              borderRadius: 1,
              transition: 'all 0.2s',
              '&:hover': { 
                bgcolor: alpha('#E53935', 0.08),
                transform: 'translateX(2px)'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: '#E53935' }}>
              <LogoutIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{ 
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#E53935'
              }} 
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'white',
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <Toolbar sx={{ minHeight: 64 }}>
          <IconButton
            color="primary"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Search Bar */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: 2,
              backgroundColor: alpha('#000', 0.05),
              '&:hover': { backgroundColor: alpha('#000', 0.08) },
              marginRight: 2,
              marginLeft: 0,
              width: { xs: '100%', sm: 'auto' },
              maxWidth: 400,
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              px: 2,
            }}
          >
            <SearchIcon sx={{ color: '#6B7280', mr: 1 }} />
            <InputBase
              placeholder="Search patients, doctors..."
              sx={{ color: '#374151', fontSize: '0.875rem', flex: 1 }}
            />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Right Side Actions */}
          <IconButton 
            onClick={() => navigate('/critical-alerts')}
            sx={{ 
              mr: 1,
              transition: 'all 0.2s',
              '&:hover': { transform: 'scale(1.05)' }
            }}
          >
            <Badge badgeContent={alertCount} color="error">
              <NotificationsIcon sx={{ color: '#6B7280' }} />
            </Badge>
          </IconButton>

          <IconButton 
            onClick={handleProfileMenuOpen}
            sx={{ 
              ml: 1,
              transition: 'all 0.2s',
              '&:hover': { transform: 'scale(1.05)' }
            }}
          >
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36, 
                bgcolor: '#1565C0',
                fontSize: '0.875rem'
              }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
        </Toolbar>
        
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <Box sx={{ px: 3, py: 1, bgcolor: '#FAFAFA', borderTop: '1px solid #E5E7EB' }}>
            <Breadcrumbs 
              separator={<NavigateNextIcon fontSize="small" sx={{ color: '#9CA3AF' }} />}
              sx={{ fontSize: '0.8125rem' }}
            >
              <Link
                underline="hover"
                color="#6B7280"
                href="/"
                onClick={(e) => { e.preventDefault(); navigate('/'); }}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  '&:hover': { color: '#1565C0' }
                }}
              >
                <DashboardIcon sx={{ mr: 0.5, fontSize: 16 }} />
                Home
              </Link>
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return isLast ? (
                  <Typography key={crumb.path} color="#1565C0" sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                    {crumb.label}
                  </Typography>
                ) : (
                  <Link
                    key={crumb.path}
                    underline="hover"
                    color="#6B7280"
                    href={crumb.path}
                    onClick={(e) => { e.preventDefault(); navigate(crumb.path); }}
                    sx={{ '&:hover': { color: '#1565C0' } }}
                  >
                    {crumb.label}
                  </Link>
                );
              })}
            </Breadcrumbs>
          </Box>
        )}
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { mt: 1, minWidth: 200 }
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #E5E7EB' }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>
            {user?.username}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#6B7280' }}>
            {user?.role || 'Administrator'}
          </Typography>
        </Box>
        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}>
          My Profile
        </MenuItem>
        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/settings'); }}>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: '#E53935' }}>
          <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Notification Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { mt: 1, minWidth: 320, maxHeight: 400 }
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #E5E7EB' }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>
            Notifications
          </Typography>
        </Box>
        <MenuItem>
          <Box>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
              New Lab Result Available
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#6B7280' }}>
              Patient: John Doe - CBC Test
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
              Appointment Reminder
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#6B7280' }}>
              Dr. Smith - 2:00 PM Today
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
              QC Material Expiring Soon
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#6B7280' }}>
              Hematology Control Level 1
            </Typography>
          </Box>
        </MenuItem>
      </Menu>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: '#F9FAFB',
          minHeight: '100vh',
        }}
      >
        <Box sx={{ minHeight: breadcrumbs.length > 0 ? 120 : 72 }} />
        <Box
          sx={{
            animation: 'fadeIn 0.3s ease-in',
            '@keyframes fadeIn': {
              '0%': { opacity: 0, transform: 'translateY(10px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
