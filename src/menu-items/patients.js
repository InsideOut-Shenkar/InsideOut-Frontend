// assets
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';

// icons
const icons = {
  PersonAddOutlinedIcon,
  GroupOutlinedIcon
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const patients = {
  id: 'group-patients',
  title: 'Patients',
  type: 'group',
  children: [
    {
      id: 'patients',
      title: 'Patients',
      type: 'item',
      url: '/patients',
      icon: icons.GroupOutlinedIcon,
      breadcrumbs: false
    },
    {
      id: 'add-patient',
      title: 'Add Patient',
      type: 'item',
      url: '/add-patient',
      icon: icons.PersonAddOutlinedIcon,
      breadcrumbs: false
    }
  ]
};

export default patients;
