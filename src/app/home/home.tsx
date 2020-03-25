import React from 'react';
import {Routes, Stack} from 'earhart';

import {Playlist} from '../profiles/playlist';
import {HomeFeed} from './home-feed';
import {Settings} from '../settings/settings';

import {NativeStack, Navigator, Route} from '../../earhart';

function Home() {
  return (
    <Navigator>
      <NativeStack>
        <Route path="/home">
          <Index />
        </Route>

        <Route path="/home/playlists/:id">
          <Playlist backUrl="/home" />
        </Route>
      </NativeStack>
    </Navigator>
  );
}

function Index({path}) {
  return (
    <Navigator>
      <NativeStack>
        <Route path="/home">
          <HomeFeed />
        </Route>

        <Route path="/home/settings">
          <Settings />
        </Route>
      </NativeStack>
    </Navigator>
  );
}

export {Home};
