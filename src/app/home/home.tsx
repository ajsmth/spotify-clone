import React from 'react';

import {Playlist} from '../profiles/playlist';
import {HomeFeed} from './home-feed';
import {Settings} from '../settings/settings';

import {Stack, Navigator, Route, Header, useParams} from '../../earhart';
import {usePlaylistContext} from '../../providers/playlist-provider';
import {Animated} from 'react-native';

function Home() {
  const [state] = usePlaylistContext();
  const scrollY = React.useRef(new Animated.Value(0));

  return (
    <Navigator>
      <Stack>
        <Route path="/home">
          <Index />
        </Route>

        <Route path="/home/playlists/:id">
          <Header backgroundColor="transparent">
            {({params}) => {
              return (
                <Header.Center>
                  <FadeInHeader scrollY={scrollY.current}>
                    {state.lookup[params.id]?.name || ''}
                  </FadeInHeader>
                </Header.Center>
              );
            }}
          </Header>
          <Playlist animatedValue={scrollY.current} />
        </Route>
      </Stack>
    </Navigator>
  );
}

function Index() {
  return (
    <Navigator>
      <Stack>
        <Route path="/home">
          <HomeFeed />
        </Route>

        <Route path="/home/settings">
          <Settings />
        </Route>
      </Stack>
    </Navigator>
  );
}

interface IFadeInHeader {
  scrollY: Animated.Value;
  children: any;
}

function FadeInHeader({scrollY, children}: IFadeInHeader) {
  const styles = {
    opacity: scrollY.interpolate({
      inputRange: [0, 200],
      outputRange: [0, 1],
    }),
  };

  return (
    <Animated.Text style={{fontSize: 24, fontWeight: '600', ...styles}}>
      {children}
    </Animated.Text>
  );
}

export {Home};
