import React from 'react';
import {Animated} from 'react-native';
import {Navigator, Stack, Route, Tabs, Link, Header} from '../../earhart';
import {View, SafeAreaView} from '../shared/tailwind';
import {Playlists} from './playlists';
import {Artists} from './artists';
import {Albums} from './albums';
import {Playlist} from '../profiles/playlist';
import {Artist} from '../profiles/artist';
import {Album} from '../profiles/album';
import {useArtistContext} from '../../providers/artist-provider';
import {useAlbumContext} from '../../providers/album-provider';
import {usePlaylistContext} from '../../providers/playlist-provider';
import {interpolate} from '../shared/interpolate';
import {SwitchRouter} from '../shared/switch-router';

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
            <Header title="Music" largeTitle backgroundColor="white" />
            <SafeAreaView className="flex-1">
              <Index />
            </SafeAreaView>
          </Route>

          <Route path="/library/:profile/:id">
            <Header
              title={({params}) =>
                lookup[params.profile]?.lookup[params.id]?.name || ''
              }
              largeTitle
              backgroundColor="white"
            />
            <SafeAreaView className="flex-1">
              <Profiles />
            </SafeAreaView>
          </Route>
        </Stack>
      </Navigator>
    </SafeAreaView>
  );
}

function Index() {
  const animatedIndex = React.useRef(new Animated.Value(0));

  return (
    <View className="flex-1">
      <Tabbar animatedValue={animatedIndex.current} />

      <TabNavigator animatedValue={animatedIndex.current}>
        <Route path="/library/artists">
          <Artists to="/library/artist" />
        </Route>

        <Route path="/library/albums">
          <Albums to="/library/album" />
        </Route>

        <Route path="/library/playlists">
          <Playlists to="/library/playlist" />
        </Route>
      </TabNavigator>
    </View>
  );
}

function Tabbar({animatedValue}) {
  return (
    <View className="p-4">
      <View className="flex-row">
        <Tab index={0} animatedValue={animatedValue} to="/library/artists">
          Artists
        </Tab>
        <Tab index={1} animatedValue={animatedValue} to="/library/albums">
          Albums
        </Tab>
        <Tab index={2} animatedValue={animatedValue} to="/library/playlists">
          Playlists
        </Tab>
      </View>
    </View>
  );
}

function Profiles() {
  return (
    <SwitchRouter>
      <Route path="/library/artist/:id">
        <Artist />
      </Route>
      <Route path="/library/album/:id">
        <Album />
      </Route>
      <Route path="/library/playlist/:id">
        <Playlist />
      </Route>
    </SwitchRouter>
  );
}

const opacityStyles = {
  opacity: {
    inputRange: [-1, 0, 1],
    outputRange: [0.6, 1, 0.6],
    extrapolate: 'clamp',
  },
};

function Tab({children, to, animatedValue, index = 0}) {
  const styles = interpolate(
    Animated.subtract(index, animatedValue),
    opacityStyles,
  );

  return (
    <Link to={to}>
      <Animated.Text
        style={{fontSize: 24, fontWeight: '600', marginRight: 10, ...styles}}>
        {children}
      </Animated.Text>
    </Link>
  );
}

export {Library};

function TabNavigator({children, ...rest}) {
  return (
    <Navigator>
      <Tabs {...rest}>{children}</Tabs>
    </Navigator>
  );
}
