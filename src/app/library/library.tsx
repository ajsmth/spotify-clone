import React from 'react';
import {
  Navigator,
  Stack,
  NativeStack,
  NativeSwitch,
  Route,
  Tabs,
  Link,
  Tabbar,
  Switch,
} from '../../earhart';

import {
  Text,
  View,
  AnimatedText,
  SafeAreaView,
  Pressable,
} from '../shared/tailwind';

import {Playlists} from './playlists';
import {Artists} from './artists';
import {Albums} from './albums';

import {Playlist} from '../profiles/playlist';
import {Artist} from '../profiles/artist';
import {Album} from '../profiles/album';
import {
  SharedElements,
  useSharedElementInterpolation,
} from 'earhart-shared-element';
import {Animated} from 'react-native';
import {PerformantScreen} from '../shared/performant-screen';

function Library() {
  return (
    <SafeAreaView className="flex-1">
      <Navigator>
        <NativeStack>
          <Route path="/library">
            <Index />
          </Route>

          <Route path="/library/:profile/:id">
            <Link to="/library">
              <Text className="text-xl font-semibold">Back</Text>
            </Link>
            <Profiles />
          </Route>
        </NativeStack>
      </Navigator>
    </SafeAreaView>
  );
}

function Index() {
  return (
    <Navigator>
      <View className="px-4">
        <Text className="text-5xl font-extrabold">Music</Text>
      </View>

      <View className="px-4">
        <Tabbar>
          <SmallerTab to="/library/artists">Artists</SmallerTab>
          <SmallerTab to="/library/albums">Albums</SmallerTab>
          <SmallerTab to="/library/playlists">Playlists</SmallerTab>
        </Tabbar>
      </View>

      <Tabs>
        <Route path="/library/artists">
          <Artists to="/library/artists" />
        </Route>

        <Route path="/library/albums">
          <Albums to="/library/albums" />
        </Route>

        <Route path="/library/playlists">
          <Playlists to="/library/playlists" />
        </Route>
      </Tabs>
    </Navigator>
  );
}

function Profiles() {
  return (
    <Navigator initialIndex={-1}>
      <Switch>
        <Route path="/library/artists/:id">
          <Artist />
        </Route>
        <Route path="/library/albums/:id">
          <Album />
        </Route>
        <Route path="/library/playlists/:id">
          <Playlist backUrl="/library/playlists" />
        </Route>
      </Switch>
    </Navigator>
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
  return (
    <Link to={to}>
      <AnimatedText className="mr-4 font-semibold" style={[]}>
        {children}
      </AnimatedText>
    </Link>
  );
}

export {Library};
