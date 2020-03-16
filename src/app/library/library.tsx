import React from 'react';
import {
  Stack,
  Routes,
  Route,
  Tabs,
  Link,
  Tabbar,
  useInterpolation,
  Redirect,
  Switch,
} from 'earhart';

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

function Library() {
  return (
    <SafeAreaView className="flex-1">
      <Stack>
        <Routes>
          <Tabs path="/*">
            <View className="px-4">
              <Text className="text-5xl font-extrabold">Music</Text>
            </View>

            <View className="px-4">
              <Tabbar>
                <SmallerTab to="artists/*">Artists</SmallerTab>
                <SmallerTab to="albums/*">Albums</SmallerTab>
                <SmallerTab to="playlists/*">Playlists</SmallerTab>
              </Tabbar>
            </View>

            <Routes>
              <Route path="artists/*">
                <ArtistsShared />
              </Route>
              <Route path="albums/*">
                <AlbumsShared />
              </Route>

              <Route path="playlists/*">
                <Playlists to="../profile" />
              </Route>
            </Routes>
          </Tabs>

          <Route path="profile/:id">
            <Playlist backUrl="../../" />
          </Route>
        </Routes>
      </Stack>
    </SafeAreaView>
  );
}

function AlbumsShared() {
  return (
    <SharedElements>
      <Routes>
        <Route path="/">
          <Albums to="profile" />
        </Route>

        <Route path="profile/:id">
          <SlideIn>
            <View className="py-2 px-4 bg-white">
              <Link to="../../">
                <Text className="text-xl font-bold">Back</Text>
              </Link>
            </View>
          </SlideIn>
          <Album />
        </Route>
      </Routes>
    </SharedElements>
  );
}

function ArtistsShared() {
  return (
    <SharedElements>
      <Routes>
        <Route path="/">
          <Artists to="profile" />
        </Route>

        <Route path="profile/:id">
          <SlideIn>
            <View className="py-2 px-4 bg-white">
              <Link to="../../">
                <Text className="text-xl font-bold">Back</Text>
              </Link>
            </View>
          </SlideIn>
          <Artist />
        </Route>
      </Routes>
    </SharedElements>
  );
}

const slideInStyle = {
  transform: [
    {
      translateX: {
        inputRange: [-1, 0, 1],
        outputRange: [-600, 0, -600],
      },
    },
  ],
};

function SlideIn({children}) {
  const style = useSharedElementInterpolation(slideInStyle);
  return <Animated.View style={style}>{children}</Animated.View>;
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
