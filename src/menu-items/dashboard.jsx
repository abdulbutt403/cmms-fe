import {
  DashboardOutlined,
  FileProtectOutlined,
  TeamOutlined,
  UserOutlined,
  ApartmentOutlined,
  ClusterOutlined
} from '@ant-design/icons';

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'work-order',
      title: 'Work Order',
      type: 'item',
      url: '/dashboard/work-order',
      icon: FileProtectOutlined,
      breadcrumbs: false
    },
    {
      id: 'vendors-customers',
      title: 'Vendors & Customers',
      type: 'collapse',
      icon: TeamOutlined,
      children: [
        {
          id: 'vendor-management',
          title: 'Vendor Management',
          type: 'item',
          url: '/dashboard/vendor-management',
          breadcrumbs: false
        },
        {
          id: 'customer-management',
          title: 'Customer Management',
          type: 'item',
          url: '/dashboard/customer-management',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'locations',
      title: 'Locations',
      type: 'collapse',
      icon: ApartmentOutlined,
      children: [
        {
          id: 'buildings',
          title: 'Buildings',
          type: 'item',
          url: '/dashboard/buildings',
          breadcrumbs: false
        },
        {
          id: 'assets',
          title: 'Assets',
          type: 'item',
          url: '/dashboard/assets',
          breadcrumbs: false
        },
        {
          id: 'parts',
          title: 'Parts',
          type: 'item',
          url: '/dashboard/parts',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'people',
      title: 'People',
      type: 'collapse',
      icon: UserOutlined,
      children: [
        {
          id: 'teams',
          title: 'Teams',
          type: 'item',
          url: '/dashboard/teams',
          breadcrumbs: false
        },
        {
          id: 'users',
          title: 'Users',
          type: 'item',
          url: '/dashboard/users',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default dashboard;