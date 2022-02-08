import { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import AuthContext from './store/auth-context';
import Layout from './components/Layout/Layout';
import UserProfile from './components/Profile/UserProfile';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Layout>
      <Switch>
        { isLoggedIn &&
          <Route path='/' exact>
            <HomePage />
          </Route>
        }
        { !isLoggedIn &&
          <Route path='/auth'>
            <AuthPage />
          </Route>
        }
        { isLoggedIn &&
          <Route path='/profile'>
            <UserProfile />
          </Route>
        }
        <Route path='*'>
          { !isLoggedIn && <Redirect to='/auth' /> }
          { isLoggedIn && <Redirect to='/' /> }
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
