import React from 'react';
import {
  Navigator,
  Stack,
  Route,
  Tabs,
  Link,
  Switch,
  Header,
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
import {useArtistContext} from '../../providers/artist-provider';
import {useAlbumContext} from '../../providers/album-provider';
import {usePlaylistContext} from '../../providers/playlist-provider';
import {interpolate} from '../shared/interpolate';

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function Library() {
  const [artists] = useArtistContext();
  const [albums] = useAlbumContext();
  const [playlists] = usePlaylistContext();

  const lookup = {
    artist: artists,
    album: albums,
    playlist: playlists,
  };

  return (
    <SafeAreaView className="flex-1">
      <Navigator>
        <Stack>
          <Route path="/library">
            <Header title="Music" largeTitle backgroundColor="transparent" />
            <Index />
          </Route>

          <Route path="/library/:profile/:id">
            <Header
              title={({params}) =>
                lookup[params.profile]?.lookup[params.id]?.name || ''
              }
              largeTitle
              backgroundColor="transparent"
            />
            <Profiles />
          </Route>
        </Stack>
      </Navigator>
    </SafeAreaView>
  );
}

function Index() {
  const animatedIndex = React.useRef(new Animated.Value(0));

  return (
    <Navigator>
      <View className="px-4 mt-24">
        <View className="flex-row">
          <FeedHeader
            index={0}
            animatedValue={animatedIndex.current}
            to="/library/artists">
            Artists
          </FeedHeader>
          <FeedHeader
            index={1}
            animatedValue={animatedIndex.current}
            to="/library/albums">
            Albums
          </FeedHeader>
          <FeedHeader
            index={2}
            animatedValue={animatedIndex.current}
            to="/library/playlists">
            Playlists
          </FeedHeader>
        </View>
      </View>

      <Tabs animatedValue={animatedIndex.current}>
        <Route path="/library/artists">
          <Artists to="/library/artist" />
        </Route>

        <Route path="/library/albums">
          <Albums to="/library/album" />
        </Route>

        <Route path="/library/playlists">
          <Playlists to="/library/playlist" />
        </Route>
      </Tabs>
    </Navigator>
  );
}

function Profiles() {
  return (
    <Navigator initialIndex={-1}>
      <View className="flex-1 bg-white">
        <View className="mt-24 flex-1">
          <Switch keepAlive={false}>
            <Route path="/library/artist/:id">
              <Artist />
            </Route>
            <Route path="/library/album/:id">
              <Album />
            </Route>
            <Route path="/library/playlist/:id">
              <Playlist />
            </Route>
          </Switch>
        </View>
      </View>
    </Navigator>
  );
}

function FeedHeader({children, to, animatedValue, index = 0}) {
  const styles = interpolate(Animated.subtract(index, animatedValue), {
    opacity: {
      inputRange: [-1, 0, 1],
      outputRange: [0.75, 1, 0.75],
      extrapolate: 'clamp',
    },
  });

  return (
    <Link to={to}>
      <Animated.Text
        style={{fontSize: 24, fontWeight: '600', marginRight: 10, ...styles}}>
        {children}
      </Animated.Text>
    </Link>
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
