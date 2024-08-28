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
      id: 'reports',
      title: 'Reports',
      type: 'item',
      url: '',
      icon: icons.ArticleOutlinedIcon,
      breadcrumbs: true
    }
  ]
};

export default dashboard;
