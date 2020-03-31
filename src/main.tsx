import React from 'react';
import {View, Text, SafeAreaView} from './app/shared/tailwind';
import {Home} from './app/home/home';
import {Library} from './app/library/library';
import {Search} from './app/search/search';
import {Player} from './app/player/player';
import {Route, Navigator, Link, Switch} from './earhart';
import {useUser} from './providers/user-provider';

function Main() {
  const {user} = useUser();

  if (!user) {
    return null;
  }

  return (
    <Navigator>
      <Switch>
        <Route path="/home">
          <Home />
        </Route>

        <Route path="/search">
          <Search />
        </Route>

        <Route path="/library">
          <Library />
        </Route>
      </Switch>

      <Player />
      <MainTabbar />
      <SafeAreaView />
    </Navigator>
  );
}

function MainTabbar() {
  return (
    <View className="flex-row">
      <MainTab to="/home">
        <Text style={{textAlign: 'center'}}>Home</Text>
      </MainTab>

      <MainTab to="/search">
        <Text style={{textAlign: 'center'}}>Search</Text>
      </MainTab>

      <MainTab to="/library">
        <Text style={{textAlign: 'center'}}>Library</Text>
      </MainTab>
    </View>
  );
}

// const activeStyles = useInterpolation(activeTabs);
function MainTab({children, to}: any) {
  return (
    <Link
      to={to}
      style={{flex: 1, height: 65, justifyContent: 'center'}}
      options={{latest: true}}>
      <View>{children}</View>
    </Link>
  );
}

function Screen({children}: any) {
  return <View className="flex-1 justify-center items-center">{children}</View>;
}

export {Main};
