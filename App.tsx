/**
 * Music App Clone w/ earhart
 */

import React from 'react';
import {Text} from 'react-native';
import {NativeRouter as Router, useRouter} from 'earhart';

import {Login} from './src/app/auth/login';
import {Main} from './src/main';
import {AuthProvider} from './src/providers/auth-provider';
import {PlaylistProvider} from './src/providers/playlist-provider';
import {AlbumProvider} from './src/providers/album-provider';
import {TrackProvider} from './src/providers/track-provider';
import {UserProvider} from './src/providers/user-provider';
import {ArtistProvider} from './src/providers/artist-provider';
import {enableScreens} from 'react-native-screens'

enableScreens()

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

function AppProviders({children}) {
  return (
    <Router>
      <PlaylistProvider>
        <AlbumProvider>
          <TrackProvider>
            <ArtistProvider>{children}</ArtistProvider>
          </TrackProvider>
        </AlbumProvider>
      </PlaylistProvider>
    </Router>
  );
}

function Location() {
  const {location} = useRouter();
  return (
    <Text style={{position: 'absolute', bottom: 50, left: 20}}>
      {location.pathname}
    </Text>
  );
}

export {AppProviders};

export default App;
