import React from 'react';
import {View, Text, TextInput, SafeAreaView} from 'react-native';
import {
  Route,
  Link,
  Tabs,
  Routes,
  useInterpolation,
  Tabbar,
  Switch,
  Redirect,
} from './earhart';
import {styles} from './styles';
import {Home} from './app/home/home';
import {Library} from './app/library/library';

// the main navigator is the central tabs component that sits over top of the whole app
// it contains the links to home, search, library
function Main() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Switch keepAlive>
        <Routes>
          <Route path="home/*">
            <Home />
          </Route>

          <Route path="search/*">
            <Screen>
              <Text style={styles.title}>Search</Text>
              <TextInput placeholder="Test" />
            </Screen>
          </Route>

          <Route path="library/*">
            <Library />
          </Route>

          <Redirect to="library/playlists" />
        </Routes>

        <MainTabbar />
      </Switch>
    </SafeAreaView>
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

function MainTab({children, to}: any) {
  const activeStyles = useInterpolation(activeTabs);

  return (
    <Link
      to={to}
      style={{flex: 1, height: 65, justifyContent: 'center', ...activeStyles}}>
      {children}
    </Link>
  );
}

function Screen({children}: any) {
  return <View style={styles.screen}>{children}</View>;
}

export {Main};
