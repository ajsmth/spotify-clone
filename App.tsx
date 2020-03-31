/**
 * Music App Clone w/ earhart
 */

import React from 'react';
import {Text} from 'react-native';
import {
  Router,
  useDeepLinking,
  useHistory,
  Navigator,
  Switch,
  Route,
} from './src/earhart';

import {Main} from './src/main';
import {AuthProvider} from './src/providers/auth-provider';
import {enableScreens} from 'react-native-screens';
import {PlaylistProvider} from './src/providers/playlist-provider';
import {AlbumProvider} from './src/providers/album-provider';
import {TrackProvider} from './src/providers/track-provider';
import {PlayerProvider} from './src/providers/player-provider';
import {CategoryProvider} from './src/providers/category-provider';
import {ArtistProvider} from './src/providers/artist-provider';
import {Login} from './src/app/auth/login';
import {Startup} from './src/startup';
import { UserProvider } from './src/providers/user-provider';

enableScreens();

function App() {
  return (
    <AppProviders>
      <Navigator>
        <Startup>
          <Switch>
            <Route path="/*">
              <Main />
            </Route>

            <Route path="/auth/login">
              <Login />
            </Route>
          </Switch>
        </Startup>
      </Navigator>

      <Location />
    </AppProviders>
  );
}

function AppProviders({children}) {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <PlaylistProvider>
            <AlbumProvider>
              <TrackProvider>
                <PlayerProvider>
                  <CategoryProvider>
                    <ArtistProvider>{children}</ArtistProvider>
                  </CategoryProvider>
                </PlayerProvider>
              </TrackProvider>
            </AlbumProvider>
          </PlaylistProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
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
