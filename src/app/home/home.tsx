import React from 'react';
import {
  Navigator,
  Switch,
  Stack,
  Route,
  useRoute,
  Routes,
  useFocusLazy,
} from '../../earhart';
import {Playlist} from '../profiles/playlist';
import {HomeFeed} from './home-feed';
import {Settings} from '../settings/settings';
import {View} from 'react-native';

function Home() {
  return (
    <Stack>
      <Routes>
        <Route path="/">
          <Stack>
            <Routes>
              <Route path="/">
                <HomeFeed />
              </Route>

              <Route path="settings/*">
                <Settings />
              </Route>
            </Routes>
          </Stack>
        </Route>

        <Route path="profile/*">
          <Profiles />
        </Route>
      </Routes>
    </Stack>
  );
}

function Profiles() {
  return (
    <Switch>
      <Routes>
        <Route path="playlists/:id">
          <Playlist backUrl="../../../" />
        </Route>
      </Routes>
    </Switch>
  );
}

function PerformantScreen({children}) {
  const afterInteractions = useFocusLazy();

  return afterInteractions ? (
    children
  ) : (
    <View style={{flex: 1, backgroundColor: 'red'}} />
  );
}

export {Home, PerformantScreen};
