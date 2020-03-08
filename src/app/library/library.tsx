import React from 'react';
import {
  Stack,
  Routes,
  Route,
  Tabs,
  Link,
  Tabbar,
  Switch,
  useInterpolation,
} from '../../earhart';
import {Text, View, Animated} from 'react-native';
import {styles} from '../../styles';

import {Playlists} from './playlists';
import {Artists} from './artists';
import {Albums} from './albums';

import {Playlist} from '../profiles/playlist';
import {Artist} from '../profiles/artist';
import {Album} from '../profiles/album';

function Library() {
  return (
    <View style={{flex: 1}}>
      <Stack>
        <Routes>
          <Route path="/">
            <Music />
          </Route>

          <Route path="profile/*">
            <Profiles />
          </Route>
        </Routes>
      </Stack>
    </View>
  );
}

const baseUrl = `../`;

function Music({}) {
  return (
    <Tabs>
      <View style={{paddingHorizontal: 15}}>
        <Text style={[styles.h2, {marginRight: 30, fontWeight: '700'}]}>
          Music
        </Text>
      </View>

      <Tabbar style={{paddingHorizontal: 15}}>
        <SmallerTab to="playlists">Playlists</SmallerTab>
        <SmallerTab to="artists">Artists</SmallerTab>
        <SmallerTab to="albums">Albums</SmallerTab>
      </Tabbar>

      <Routes>
        <Route path="playlists">
          <Playlists to={`${baseUrl}/profile/playlists`} />
        </Route>

        <Route path="artists">
          <Artists to={`${baseUrl}/profile/artists`} />
        </Route>

        <Route path="albums">
          <Albums to={`${baseUrl}/profile/albums`} />
        </Route>
      </Routes>
    </Tabs>
  );
}

function Profiles({}) {
  return (
    <Switch>
      <Routes>
        <Route path="playlists/:id">
          <Playlist />
        </Route>

        <Route path="artists/:id">
          <Artist />
        </Route>

        <Route path="albums/:id">
          <Album />
        </Route>
      </Routes>
    </Switch>
  );
}

function SmallerTab({children, to}) {
  return (
    <Tab style={[styles.h5, styles.semibold]} to={to}>
      {children}
    </Tab>
  );
}

const activeStyle = {
  opacity: {
    inputRange: [-1, 0, 1],
    outputRange: [0.6, 1, 0.6],
    extrapolate: 'clamp',
  },
};

function Tab({to, children, style}) {
  const activeStyles = useInterpolation(activeStyle);

  return (
    <Link to={to} style={activeStyles}>
      <Animated.Text style={[{marginRight: 15, fontWeight: '600'}, style]}>
        {children}
      </Animated.Text>
    </Link>
  );
}

export {Library};
