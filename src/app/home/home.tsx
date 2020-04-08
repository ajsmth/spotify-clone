import React from 'react';
import {Animated} from 'react-native';
import {Stack, Navigator, Route, Header, useParams} from '../../earhart';
import {Playlist} from '../profiles/playlist';
import {HomeFeed} from './home-feed';
import {Settings} from '../settings/settings';
import {interpolate} from '../shared/interpolate';
import { usePlaylists } from '../../providers/spotify-providers';

function Home() {
  const scrollY = React.useRef(new Animated.Value(0));

  return (
    <StackNavigator>
      <Route path="/home">
        <Header title="Home" hidden />
        <Index />
      </Route>

      <Route path="/home/playlists/:id">
        <Header backgroundColor="white">
          <FadeInHeader scrollY={scrollY.current} />
        </Header>

        <Playlist animatedValue={scrollY.current} />
      </Route>
    </StackNavigator>
  );
}

function StackNavigator({children}) {
  return (
    <Navigator>
      <Stack>{children}</Stack>
    </Navigator>
  );
}

function Index() {
  return (
    <StackNavigator>
      <Route path="/home">
        <HomeFeed />
      </Route>

      <Route path="/home/settings">
        <Settings />
      </Route>
    </StackNavigator>
  );
}

interface IFadeInHeader {
  scrollY: Animated.Value;
}

const fadeInHeader = {
  opacity: {
    inputRange: [0, 200],
    outputRange: [0, 1],
  },
};

function FadeInHeader({scrollY}: IFadeInHeader) {
  const styles = interpolate(scrollY, fadeInHeader);
  const lookup = usePlaylists(state => state.lookup)
  const params = useParams();

  return (
    <Header.Center>
      <Animated.Text style={{fontSize: 24, fontWeight: '600', ...styles}}>
        {lookup[params.id]?.name || ''}
      </Animated.Text>
    </Header.Center>
  );
}

export {Home};
