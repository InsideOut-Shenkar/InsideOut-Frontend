// material-ui
import { Container, Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION ||============================== //

const AuthFooter = () => {
  return (
    <Container maxWidth="xl">
      <Stack>
        <Typography variant="subtitle2" color="secondary" component="span">
          &copy; InsideOut 2024&nbsp;
          <Typography
            component={Link}
            variant="subtitle2"
            href="https://www.shenkar.ac.il/en/departments/engineering-software-department"
            target="_blank"
            underline="hover"
          >
            Shenkar Collge
          </Typography>
        </Typography>
      </Stack>
    </Container>
  );
};

export default AuthFooter;
