import React from 'react';
import {View, Text, SafeAreaView} from './app/shared/tailwind';
import {Routes, useInterpolation, Redirect, Switch} from 'earhart';
import {Home} from './app/home/home';
import {Library} from './app/library/library';
import {Search} from './app/search/search';
import {Player} from './app/player/player';

import {Router, Route, Navigator, Link, Tabbar, NativeSwitch} from './earhart';
import {PlaylistProvider} from './providers/playlist-provider';
import {AlbumProvider} from './providers/album-provider';
import {TrackProvider} from './providers/track-provider';
import {PlayerProvider} from './providers/player-provider';
import {CategoryProvider} from './providers/category-provider';
import {ArtistProvider} from './providers/artist-provider';

function Providers({children}) {
  return (
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
  );
}

function Main() {
  return (
    <Router>
      <Providers>
        <Navigator>
          <NativeSwitch>
            <Route path="/home">
              <Home />
            </Route>

            <Route path="/search">
              <Search />
            </Route>

            <Route path="/library">
              <Library />
            </Route>
          </NativeSwitch>

          <MainTabbar />
        </Navigator>
      </Providers>
    </Router>
  );
}

function MainTabbar() {
  return (
    <Tabbar>
      <MainTab to="/home">
        <Text style={{textAlign: 'center'}}>Home</Text>
      </MainTab>

      <MainTab to="/search">
        <Text style={{textAlign: 'center'}}>Search</Text>
      </MainTab>

      <MainTab to="/library">
        <Text style={{textAlign: 'center'}}>Library</Text>
      </MainTab>
    </Tabbar>
  );
}

const activeTabs = {
  transform: [
    {
      scale: {
        inputRange: [-1, 0, 1],
        outputRange: [0.7, 1, 0.7],
        extrapolate: 'clamp',
      },
    },
  ],
};

// const activeStyles = useInterpolation(activeTabs);
function MainTab({children, to}: any) {
  return (
    <Link to={to} style={{flex: 1, height: 65, justifyContent: 'center'}} options={{ latest: true }}>
      <View>{children}</View>
    </Link>
  );
}

function Screen({children}: any) {
  return <View className="flex-1 justify-center items-center">{children}</View>;
}

export {Main};
