import React from 'react';
import {Switch, Route, Navigator, Link, Stack, Header} from '../../earhart';
import {
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  Pressable,
} from '../shared/tailwind';
import {useAuth} from '../../providers/auth-provider';
import {User} from './user';
import {Playback} from './playback';
import {Notifications} from './notifications';
import {useUser} from '../../providers/user-provider';

import {Animated} from 'react-native';
import {Playlist} from '../profiles/playlist';
import {usePlaylistContext} from '../../providers/playlist-provider';

function Settings({}) {
  const [state] = usePlaylistContext();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Navigator>
        <Stack>
          <Route path="/home/settings">
            <Header title="Settings" />
            <Index />
          </Route>

          <Route path="/home/settings/*">
            <Header title="Settings" />

            <Navigator initialIndex={-1}>
              <Switch keepAlive={false}>
                <Route path="/home/settings/user">
                  <User />
                </Route>
                <Route path="/home/settings/preferences">
                  <Preferences />
                </Route>
              </Switch>
            </Navigator>
          </Route>

          <Route path="/home/settings/playlist/:id">
            <Header title={({params}) => state.lookup[params.id]?.name || ''} />
            <Playlist />
          </Route>
        </Stack>
      </Navigator>
    </SafeAreaView>
  );
}

function Preferences() {
  return (
    <Navigator initialIndex={-1}>
      <Switch keepAlive={false}>
        <Route path="/home/settings/preferences/notifications">
          <SettingsHeader title="Notifications" />
          <Notifications />
        </Route>

        <Route path="/home/settings/preferences/playback">
          <SettingsHeader title="Playback" />
          <Playback />
        </Route>
      </Switch>
    </Navigator>
  );
}

function Index() {
  const user = useUser();

  return (
    <ScrollView className="flex-1 pb-12 px-4">
      <Link to="/home/settings/user">
        <UserRow user={user} />
      </Link>

      <SettingsLink to="/home/settings/preferences/playback" title="Playback" />
      <SettingsLink
        to="/home/settings/preferences/notifications"
        title="Notifications"
      />

      <Logout />
    </ScrollView>
  );
}

function SettingsHeader({title}) {
  return (
    <View className="py-2 px-4 bg-white justify-center">
      <View>
        <Text className="text-3xl font-bold text-center">{title}</Text>
      </View>
    </View>
  );
}

interface ISettingsLink {
  to: string;
  title: string;
}

function SettingsLink({to, title}: ISettingsLink) {
  return (
    <Link to={`${to}`}>
      <View className="mb-8 py-2 flex-row justify-between">
        <Text className="text-xl font-semibold">{title}</Text>
        <Text className="text-xl font-semibold">→</Text>
      </View>
    </Link>
  );
}

interface IUserRow {
  user: IUser;
}

function UserRow({user}: IUserRow) {
  return (
    <View className="flex-row mb-12 mt-8">
      <Image
        style={{height: 80, width: 80, borderRadius: 40}}
        source={{uri: user?.images[0].url}}
      />

      <View className="ml-4 justify-center">
        <Text className="text-2xl font-semibold">{user?.display_name}</Text>
        <Text className="text-lg font-medium mt-2">View Profile</Text>
      </View>
    </View>
  );
}

function Logout() {
  const {logout} = useAuth();

  return (
    <View style={{marginTop: 40, alignItems: 'center'}}>
      <Pressable
        className="px-6 py-3 border"
        onPress={logout}
        style={{
          borderRadius: 40,
        }}>
        <Text
          className="text-lg font-medium uppercase"
          style={{
            letterSpacing: 1.5,
          }}>
          Log Out
        </Text>
      </Pressable>
    </View>
  );
}

export {Settings};
