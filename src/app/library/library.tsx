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
  Redirect,
} from 'earhart';

import {Text, View, AnimatedText, SafeAreaView} from '../shared/tailwind';

import {Playlists} from './playlists';
import {Artists} from './artists';
import {Albums} from './albums';

import {Playlist} from '../profiles/playlist';
import {Artist} from '../profiles/artist';
import {Album} from '../profiles/album';

function Library() {
  return (
    <SafeAreaView className="flex-1">
      <Stack>
        <Routes>
          <Route path="*">
            <Music />
          </Route>

          <Route path="profile/*">
            <Profiles />
          </Route>

        </Routes>
      </Stack>
    </SafeAreaView>
  );
}

const baseUrl = `../`;

function Music({}) {
  return (
    <Tabs>
      <View className="px-4">
        <Text className="text-5xl font-extrabold">Music</Text>
      </View>

      <View className="px-4">
        <Tabbar>
          <SmallerTab to="playlists/">Playlists</SmallerTab>
          <SmallerTab to="artists/">Artists</SmallerTab>
          <SmallerTab to="albums/">Albums</SmallerTab>
        </Tabbar>
      </View>

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
    <Tab to={to}>
      <Text className="text-xl font-semibold">{children}</Text>
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

function Tab({to, children}) {
  const activeStyles = useInterpolation(activeStyle);

  return (
    <Link to={to}>
      <AnimatedText className="mr-4 font-semibold" style={[activeStyles]}>
        {children}
      </AnimatedText>
    </Link>
  );
}

export {Library};
