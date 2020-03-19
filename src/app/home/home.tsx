import React from 'react';
import {Routes} from 'earhart';
import { Stack } from 'earhart-native'

import {Playlist} from '../profiles/playlist';
import {HomeFeed} from './home-feed';
import {Settings} from '../settings/settings';

function Home() {
  return (
    <Stack>
      <Routes>
        <Index path="/*" />
        <Playlist path="profile/playlists/:id" backUrl="../../../" />
      </Routes>
    </Stack>
  );
}

function Index({path}) {
  return (
    <Stack>
      <Routes>
        <HomeFeed path="/*" />
        <Settings path="settings/*" />
      </Routes>
    </Stack>
  );
}

export {Home};
