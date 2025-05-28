import { useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

// project import
import NavItem from './NavItem';
import { useGetMenuMaster } from 'api/menu';

// assets
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';

// ==============================|| NAV COLLAPSE ||============================== //

const NavCollapse = ({ menu, level }) => {
  const [open, setOpen] = useState(false);
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const handleClick = () => {
    setOpen(!open);
  };

  // menu collapse for sub-levels
  const menus = menu.children?.map((item) => {
    switch (item.type) {
      case 'collapse':
        return <NavCollapse key={item.id} menu={item} level={level + 1} />;
      case 'item':
        return <NavItem key={item.id} item={item} level={level + 1} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  const Icon = menu.icon;
  const menuIcon = menu.icon ? (
    <Icon style={{ fontSize: drawerOpen ? '1rem' : '1.25rem' }} />
  ) : (
    false
  );

  const textColor = 'text.primary';
  const iconSelectedColor = 'primary.main';

  return (
    <>
      <ListItemButton
        sx={{
          zIndex: 1201,
          pl: drawerOpen ? `${level * 28}px` : 1.5,
          py: !drawerOpen && level === 1 ? 1.25 : 1,
          ...(drawerOpen && {
            '&:hover': {
              bgcolor: 'primary.lighter'
            }
          }),
          ...(!drawerOpen && {
            '&:hover': {
              bgcolor: 'transparent'
            },
            '&.Mui-selected': {
              '&:hover': {
                bgcolor: 'transparent'
              },
              bgcolor: 'transparent'
            }
          })
        }}
        selected={open}
        onClick={handleClick}
      >
        {menuIcon && (
          <ListItemIcon
            sx={{
              minWidth: 28,
              color: open ? iconSelectedColor : textColor,
              ...(!drawerOpen && {
                borderRadius: 1.5,
                width: 36,
                height: 36,
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  bgcolor: 'secondary.lighter'
                }
              }),
              ...(!drawerOpen &&
                open && {
                  bgcolor: 'primary.lighter',
                  '&:hover': {
                    bgcolor: 'primary.lighter'
                  }
                })
            }}
          >
            {menuIcon}
          </ListItemIcon>
        )}
        
        {(drawerOpen || (!drawerOpen && level !== 1)) && (
          <ListItemText
            primary={
              <Typography variant="h6" color={open ? 'primary' : textColor}>
                {menu.title}
              </Typography>
            }
            secondary={
              menu.caption && (
                <Typography variant="caption" color="secondary">
                  {menu.caption}
                </Typography>
              )
            }
          />
        )}
        
        {(drawerOpen || (!drawerOpen && level !== 1)) && (
          <Box sx={{ ml: 1 }}>
            {open ? <CaretUpOutlined style={{ fontSize: '0.75rem' }} /> : <CaretDownOutlined style={{ fontSize: '0.75rem' }} />}
          </Box>
        )}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List
          component="div"
          disablePadding
          sx={{
            position: 'relative',
            '&:after': {
              content: "''",
              position: 'absolute',
              left: '32px',
              top: 0,
              height: '100%',
              width: '1px',
              opacity: drawerOpen ? 1 : 0,
              background: theme => theme.palette.primary.light
            }
          }}
        >
          {menus}
        </List>
      </Collapse>
    </>
  );
};

NavCollapse.propTypes = {
  menu: PropTypes.object,
  level: PropTypes.number
};

export default NavCollapse;