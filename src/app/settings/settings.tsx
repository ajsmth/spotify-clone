import React from 'react';
import {
  Switch,
  Route,
  Navigator,
  Link,
  Stack,
  Header,
  useNavigator,
} from '../../earhart';
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
import {Playlist} from '../profiles/playlist';
import {usePlaylistContext} from '../../providers/playlist-provider';
import {SwitchRouter} from '../shared/switch-router';

function Settings({}) {
  const [state] = usePlaylistContext();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Navigator>
        <Stack>
          <Route path="/home/settings">
            <Header title="Settings" largeTitle backgroundColor="white">
              <Header.Left>
                <Link to="/home">
                  <Text className="text-xl font-semibold">Back</Text>
                </Link>
              </Header.Left>
            </Header>
            <SafeAreaView className="flex-1">
              <Index />
            </SafeAreaView>
          </Route>

          <Route path="/home/settings/:type">
            <Header
              title={({params}) => capitalize(params.type) || ''}
              largeTitle
              backgroundColor="white"
            />

            <SafeAreaView className="flex-1">
              <SwitchRouter>
                <Route path="/home/settings/profile">
                  <User />
                </Route>
                <Route path="/home/settings/preferences">
                  <Preferences />
                </Route>
              </SwitchRouter>
            </SafeAreaView>
          </Route>

          <Route path="/home/*/playlist/:id" stackPresentation="modal">
            <Header
              title={({params}) => state.lookup[params.id]?.name || ''}
              backgroundColor="white"
            />
            <Playlist />
          </Route>
        </Stack>
      </Navigator>
    </SafeAreaView>
  );
}

function Preferences() {
  return (
    <SwitchRouter>
      <Route path="/home/settings/preferences/notifications">
        <SettingsHeader title="Notifications" />
        <Notifications />
      </Route>

      <Route path="/home/settings/preferences/playback">
        <SettingsHeader title="Playback" />
        <Playback />
      </Route>
    </SwitchRouter>
  );
}

function Index() {
  const {user} = useUser();

  if (!user) {
    return null;
  }

  return (
    <ScrollView className="flex-1 pb-12 px-4">
      <Link to="/home/settings/profile">
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

function Logout() {
  const navigator = useNavigator();
  const {logout} = useAuth();

  return (
    <View style={{marginTop: 40, alignItems: 'center'}}>
      <Pressable
        className="px-6 py-3 border"
        onPress={() => {
          logout();
          navigator.navigate('/auth/login');
        }}
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

function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
