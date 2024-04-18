// assets
import { DashboardOutlined } from '@ant-design/icons';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

// icons
const icons = {
  DashboardOutlined,
  ArticleOutlinedIcon
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'reports',
      title: 'Reports',
      type: 'item',
      url: 'dashboard/reports',
      icon: icons.ArticleOutlinedIcon,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
