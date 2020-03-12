import React from 'react';
import {Stack, Switch, Route, Routes, Link} from 'earhart';
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

import {Stack as NativeStack, Route as NativeRoute} from 'earhart-native';

function Settings({}) {
  return (
    <NativeStack>
      <SafeAreaView className="flex-1">
        <View className="flex-1 bg-white">
          <Routes>
            <NativeRoute path="/">
              <SettingsHeader title="Settings" />
              <Index />
            </NativeRoute>

            <Route path="*">
              <Switch>
                <Routes>
                  <Route path="profile">
                    <User />
                  </Route>

                  <Route path="playback">
                    <SettingsHeader title="Playback" />
                    <Playback />
                  </Route>

                  <Route path="notifications">
                    <SettingsHeader title="Notifications" />
                    <Notifications />
                  </Route>
                </Routes>
              </Switch>
            </Route>
          </Routes>
        </View>
      </SafeAreaView>
    </NativeStack>
  );
}

function Index() {
  const user = useUser();

  return (
    <ScrollView className="flex-1 pb-12 px-4">
      <Link to="profile">
        <UserRow user={user} />
      </Link>

      <SettingsLink to="playback" title="Playback" />
      <SettingsLink to="notifications" title="Notifications" />

      <Logout />
    </ScrollView>
  );
}

function SettingsHeader({title}) {
  return (
    <View className="py-2 px-4 bg-white justify-center">
      <View>
        <Text className="text-3xl font-bold text-center">{title}</Text>

        <View className="absolute left-0">
          <Link to="../">
            <Text className="text-xl font-semibold text-center">Back</Text>
          </Link>
        </View>
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
        className="w-20 h-20 rounded-full"
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
