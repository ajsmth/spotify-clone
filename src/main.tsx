import React from 'react';
import {View, Text, SafeAreaView} from './app/shared/tailwind';
import {
  Route,
  Link,
  Routes,
  useInterpolation,
  Tabbar,
  Redirect,
  Switch,
} from 'earhart';
import {Home} from './app/home/home';
import {Library} from './app/library/library';
import {Switch as NativeSwitch} from 'earhart-native';
import {Search} from './app/search/search';
import {Player, PlayerFullScreen} from './app/player/player';
import {SharedElements} from 'earhart-shared-element';

function Main() {
  return (
    <NativeSwitch>
      <Routes>
        <Route path="home/*">
          {null}
        </Route>

        <Route path="search/*">
          <Search />
        </Route>

        <Route path="library/*">
          {null}
        </Route>

        <Redirect to="/search/*" />
      </Routes>
      <Player />
      <MainTabbar />
      <SafeAreaView />
    </NativeSwitch>
  );
}

function MainTabbar() {
  return (
    <Tabbar>
      <MainTab
        to="home/*"
        style={{
          height: 65,
          flex: 1,
          justifyContent: 'center',
          borderWidth: 1,
        }}>
        <Text style={{textAlign: 'center'}}>Home</Text>
      </MainTab>

      <MainTab
        to="search/*"
        style={{
          height: 65,
          flex: 1,
          justifyContent: 'center',
          borderWidth: 1,
        }}>
        <Text style={{textAlign: 'center'}}>Search</Text>
      </MainTab>

      <MainTab
        to="library/*"
        style={{
          height: 65,
          flex: 1,
          borderWidth: 1,
          justifyContent: 'center',
        }}>
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
    <Link to={to} style={{flex: 1, height: 65, justifyContent: 'center'}}>
      {children}
    </Link>
  );
}

function Screen({children}: any) {
  return <View className="flex-1 justify-center items-center">{children}</View>;
}

export {Main};
