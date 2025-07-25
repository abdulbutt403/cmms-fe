// material-ui
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import MonthlyBarChart from 'sections/dashboard/default/MonthlyBarChart';
import ReportAreaChart from 'sections/dashboard/default/ReportAreaChart';
import UniqueVisitorCard from 'sections/dashboard/default/UniqueVisitorCard';
import SaleReportCard from 'sections/dashboard/default/SaleReportCard';
import OrdersTable from 'sections/dashboard/default/OrdersTable';

// assets
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';

import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';

import React, { useEffect, useState } from 'react';
import api from '../../api/api';

// Enhanced avatar style with softer appearance
const avatarSX = {
  width: 40,
  height: 40,
  fontSize: '1rem',
  borderRadius: '12px', // More rounded corners
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)' // Subtle shadow
};

// Enhanced action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

// Enhanced card styling
const cardSX = {
  borderRadius: '16px', // Rounded corners
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)', // Softer shadow
  border: '1px solid rgba(0,0,0,0.04)', // Subtle border
  transition: 'all 0.3s ease', // Smooth transitions
  '&:hover': {
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    transform: 'translateY(-2px)'
  }
};

// Enhanced list item styling
const listItemSX = {
  borderRadius: '12px',
  mb: 1,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.02)',
    transform: 'translateX(4px)'
  }
};

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const [assetCount, setAssetCount] = useState(0);
  const [vendorCount, setVendorCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [workOrders, setWorkOrders] = useState([]);

  useEffect(() => {
    async function fetchCounts() {
      setLoading(true);
      try {
        const [assetsRes, vendorsRes, usersRes, customersRes, workOrdersRes] = await Promise.all([
          api.get('/assets'),
          api.get('/vendors'),
          api.get('/users'),
          api.get('/customers'),
          api.get('/workorders'),
        ]);
        setAssetCount(Array.isArray(assetsRes.data.data) ? assetsRes.data.data.length : 0);
        setVendorCount(Array.isArray(vendorsRes.data.data) ? vendorsRes.data.data.length : 0);
        setUserCount(Array.isArray(usersRes.data.data) ? usersRes.data.data.length : 0);
        setCustomerCount(Array.isArray(customersRes.data.data) ? customersRes.data.data.length : 0);
        setWorkOrders(Array.isArray(workOrdersRes.data.data) ? workOrdersRes.data.data : []);
      } catch (err) {
        setAssetCount(0);
        setVendorCount(0);
        setUserCount(0);
        setCustomerCount(0);
        setWorkOrders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  // Chart data logic
  function getChartData(view) {
    const now = new Date();
    if (view === 'monthly') {
      // Last 12 months
      const months = [];
      const monthLabels = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push(d);
        monthLabels.push(d.toLocaleString('default', { month: 'short', year: '2-digit' }));
      }
      const createdData = months.map((month, idx) => {
        const nextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);
        return workOrders.filter(w => {
          const created = new Date(w.createdAt);
          return created >= month && created < nextMonth;
        }).length;
      });
      const completedData = months.map((month, idx) => {
        const nextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);
        return workOrders.filter(w => {
          if (w.status !== 'Completed') return false;
          const completed = new Date(w.updatedAt || w.createdAt);
          return completed >= month && completed < nextMonth;
        }).length;
      });
      return { labels: monthLabels, createdData, completedData };
    } else {
      // Current week (Sun-Sat)
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0,0,0,0);
      const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const createdData = Array(7).fill(0);
      const completedData = Array(7).fill(0);
      workOrders.forEach(w => {
        const created = new Date(w.createdAt);
        if (created >= startOfWeek && created < new Date(startOfWeek.getTime() + 7*24*60*60*1000)) {
          const day = created.getDay();
          createdData[day]++;
        }
        if (w.status === 'Completed') {
          const completed = new Date(w.updatedAt || w.createdAt);
          if (completed >= startOfWeek && completed < new Date(startOfWeek.getTime() + 7*24*60*60*1000)) {
            const day = completed.getDay();
            completedData[day]++;
          }
        }
      });
      return { labels, createdData, completedData };
    }
  }

  // State for chart view toggle
  const [chartView, setChartView] = useState('monthly');
  const { labels, createdData, completedData } = getChartData(chartView);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 600,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}
        >
          Dashboard
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <Box sx={cardSX}>
          <AnalyticEcommerce title="Total Assets" count={loading ? '...' : assetCount} />
        </Box>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <Box sx={cardSX}>
          <AnalyticEcommerce title="Total Vendors" count={loading ? '...' : vendorCount} />
        </Box>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <Box sx={cardSX}>
          <AnalyticEcommerce title="Total Users" count={loading ? '...' : userCount} />
        </Box>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <Box sx={cardSX}>
          <AnalyticEcommerce title="Total Customers" count={loading ? '...' : customerCount} />
        </Box>
      </Grid>
      <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />
      
      {/* row 2 */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <Box sx={cardSX}>
          <UniqueVisitorCard view={chartView} setView={setChartView} createdData={createdData} completedData={completedData} labels={labels} />
        </Box>
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>Income Overview</Typography>
          </Grid>
          <Grid />
        </Grid>
        <MainCard 
          sx={{ 
            mt: 2, 
            ...cardSX,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          }} 
          content={false}
        >
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack sx={{ gap: 2 }}>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                This Week Statistics
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#2c3e50' }}>$7,650</Typography>
            </Stack>
          </Box>
          <MonthlyBarChart />
        </MainCard>
      </Grid>
      
      {/* row 3 */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>Recent Orders</Typography>
          </Grid>
          <Grid />
        </Grid>
        <MainCard sx={{ mt: 2, ...cardSX }} content={false}>
          <OrdersTable />
        </MainCard>
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>Analytics Report</Typography>
          </Grid>
          <Grid />
        </Grid>
        <MainCard sx={{ mt: 2, ...cardSX }} content={false}>
          <List sx={{ p: 1, '& .MuiListItemButton-root': { py: 2, ...listItemSX } }}>
            <ListItemButton sx={listItemSX}>
              <ListItemText 
                primary={
                  <Typography sx={{ fontWeight: 500 }}>Company Finance Growth</Typography>
                } 
              />
              <Typography variant="h5" sx={{ color: 'success.main', fontWeight: 600 }}>+45.14%</Typography>
            </ListItemButton>
            <ListItemButton sx={listItemSX}>
              <ListItemText 
                primary={
                  <Typography sx={{ fontWeight: 500 }}>Company Expenses Ratio</Typography>
                } 
              />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>0.58%</Typography>
            </ListItemButton>
            <ListItemButton sx={listItemSX}>
              <ListItemText 
                primary={
                  <Typography sx={{ fontWeight: 500 }}>Business Risk Cases</Typography>
                } 
              />
              <Typography variant="h5" sx={{ color: 'success.main', fontWeight: 600 }}>Low</Typography>
            </ListItemButton>
          </List>
          <ReportAreaChart />
        </MainCard>
      </Grid>
      
      {/* row 4 */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <Box sx={cardSX}>
          <SaleReportCard />
        </Box>
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>Transaction History</Typography>
          </Grid>
          <Grid />
        </Grid>
        <MainCard sx={{ mt: 2, ...cardSX }} content={false}>
          <List
            component="nav"
            sx={{
              px: 1,
              py: 1,
              '& .MuiListItemButton-root': {
                py: 1.5,
                px: 2,
                borderRadius: '12px',
                mb: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.02)',
                  transform: 'translateX(4px)'
                },
                '& .MuiAvatar-root': avatarSX,
                '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
              }
            }}
          >
            <ListItem
              component={ListItemButton}
              secondaryAction={
                <Stack sx={{ alignItems: 'flex-end' }}>
                  <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600, color: 'success.main' }}>
                    + $1,430
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    78%
                  </Typography>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ 
                  color: 'success.main', 
                  bgcolor: 'success.lighter',
                  ...avatarSX
                }}>
                  <GiftOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={<Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Order #002434</Typography>} 
                secondary="Today, 2:00 AM" 
              />
            </ListItem>
            <ListItem
              component={ListItemButton}
              secondaryAction={
                <Stack sx={{ alignItems: 'flex-end' }}>
                  <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600, color: 'success.main' }}>
                    + $302
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    8%
                  </Typography>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ 
                  color: 'primary.main', 
                  bgcolor: 'primary.lighter',
                  ...avatarSX
                }}>
                  <MessageOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={<Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Order #984947</Typography>} 
                secondary="5 August, 1:45 PM" 
              />
            </ListItem>
            <ListItem
              component={ListItemButton}
              secondaryAction={
                <Stack sx={{ alignItems: 'flex-end' }}>
                  <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600, color: 'success.main' }}>
                    + $682
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    16%
                  </Typography>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ 
                  color: 'error.main', 
                  bgcolor: 'error.lighter',
                  ...avatarSX
                }}>
                  <SettingOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={<Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Order #988784</Typography>} 
                secondary="7 hours ago" 
              />
            </ListItem>
          </List>
        </MainCard>
        <MainCard sx={{ 
          mt: 2, 
          ...cardSX,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <Stack sx={{ gap: 3 }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid>
                <Stack>
                  <Typography variant="h5" noWrap sx={{ color: 'white', fontWeight: 600 }}>
                    Help & Support Chat
                  </Typography>
                  <Typography variant="caption" noWrap sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Typical replay within 5 min
                  </Typography>
                </Stack>
              </Grid>
              <Grid>
                <AvatarGroup sx={{ 
                  '& .MuiAvatar-root': { 
                    width: 36, 
                    height: 36,
                    border: '2px solid white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  } 
                }}>
                  <Avatar alt="Remy Sharp" src={avatar1} />
                  <Avatar alt="Travis Howard" src={avatar2} />
                  <Avatar alt="Cindy Baker" src={avatar3} />
                  <Avatar alt="Agnes Walker" src={avatar4} />
                </AvatarGroup>
              </Grid>
            </Grid>
            <Button 
              size="large" 
              variant="contained" 
              sx={{ 
                textTransform: 'capitalize',
                backgroundColor: 'white',
                color: '#667eea',
                borderRadius: '12px',
                fontWeight: 600,
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Need Help?
            </Button>
          </Stack>
        </MainCard>
      </Grid>
    </Grid>
  );
}