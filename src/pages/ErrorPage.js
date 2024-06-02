import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// material-ui
import { Grid, Typography } from '@mui/material';
import Empty from 'assets/images/error/empty/index';

// project import
import MainCard from 'components/MainCard';
import { activeItem } from 'store/reducers/menu';

const ErrorPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(activeItem({ openItem: [] }));
  }, []);

  return (
    <MainCard>
      <Grid 
        container 
        spacing={2} 
        direction="column" 
        justifyContent="center" 
        style={{ textAlign: 'center', padding: '16px' }}
      >
        <Grid item sx={{ width: '100%' }} container justifyContent="center">
          <Empty width="38%" />
        </Grid>
        <Grid item>
          <Typography variant="h4">
            404 - Page Not Found
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">
            The page you are looking for does not exist.
          </Typography>
        </Grid>
      </Grid>
    </MainCard>
);
}
export default ErrorPage;
