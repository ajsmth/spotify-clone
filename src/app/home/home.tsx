import React from 'react';
import {Switch, Route, Routes, useFocusLazy, Redirect} from 'earhart';
import {Playlist} from '../profiles/playlist';
import {HomeFeed} from './home-feed';
import {Settings} from '../settings/settings';
import {View} from 'react-native';
import {Stack as NativeStack, Route as NativeRoute} from 'earhart-native';


function Home() {
  return (
    <NativeStack>
      <Routes>
        <Route path="/*">
          <Index />
        </Route>

        <Route path="profile/*">
          <Profiles />
        </Route>

      </Routes>
    </NativeStack>
  );
}

function Index() {
  return (
    <NativeStack>
      <Routes>
        <NativeRoute path="/*" screenProps={{stackPresentation: 'push'}}>
          <HomeFeed />
        </NativeRoute>

        <NativeRoute
          path="settings/*"
          screenProps={{stackPresentation: 'push'}}>
          <Settings />
        </NativeRoute>
      </Routes>
    </NativeStack>
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



export {Home};
