// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import AuthGuard from 'components/AuthGuard';
import ScrollTop from 'components/ScrollTop';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => (
  <ThemeCustomization>
    <ScrollTop>
      <AuthGuard>
        <Routes />
      </AuthGuard>
    </ScrollTop>
  </ThemeCustomization>
);

export default App;
