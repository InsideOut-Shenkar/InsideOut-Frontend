// assets
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';

// icons
const icons = {
  AssessmentOutlinedIcon
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const prediction = {
  id: 'group-prediction',
  title: 'prediction',
  type: 'group',
  children: [
    {
      id: 'risk-assessment',
      title: 'Risk Assessment',
      type: 'item',
      url: '/risk-assessment',
      icon: icons.AssessmentOutlinedIcon,
      breadcrumbs: false
    }
  ]
};

export default prediction;
