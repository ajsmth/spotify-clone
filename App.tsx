/**
 * Music App Clone w/ earhart
 */

import React from 'react';
import {Text} from 'react-native';
import {Router, useDeepLinking, useHistory} from './src/earhart';

import {Login} from './src/app/auth/login';
import {Main} from './src/main';
import {AuthProvider} from './src/providers/auth-provider';
import {UserProvider} from './src/providers/user-provider';
import {enableScreens} from 'react-native-screens';

enableScreens();

function App() {
  return (
    <AppProviders>
      <AuthProvider>
        {({user}) =>
          user ? (
            <UserProvider user={user}>
              <Main />
            </UserProvider>
          ) : (
            <Login />
          )
        }
      </AuthProvider>

      <Location />
    </AppProviders>
  );
}

function DeepLinking() {
  useDeepLinking();

  return null;
}

function AppProviders({children}) {
  return <Router>{children}</Router>;
}

function Location() {
  const history = useHistory();

  const [location, setLocation] = React.useState(history.location.pathname);

  React.useEffect(() => {
    return history.listen(location => {
      setLocation(location.pathname);
    });
  }, [history]);

  return (
    <Text style={{position: 'absolute', bottom: 50, left: 20}}>{location}</Text>
  );
}

export {AppProviders};

export default App;
