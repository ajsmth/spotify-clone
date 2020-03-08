import React from 'react';
import {Stack, Switch, Route, Routes, Link} from '../../earhart';
import {Text, View, Image} from 'react-native';
import {useAuth} from '../../providers/auth-provider';
import {User} from './user';
import {Playback} from './playback';
import {styles} from '../../styles';
import {Notifications} from './notifications';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import {useUser} from '../../providers/user-provider';

function Settings({}) {
  return (
    <Stack>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <Routes>
          <Route path="/">
            <SettingsHeader title='Settings' />
            <Index />
          </Route>

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
    </Stack>
  );
}

function Index() {
  const user = useUser();

  return (
    <ScrollView style={{flex: 1, paddingBottom: 50, paddingHorizontal: 20}}>
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
    <View
      style={{
        padding: 10,
        backgroundColor: 'white',
        justifyContent: 'center',
      }}>
      <Link to="../" style={{position: 'absolute', left: 10}}>
        <Text style={{textAlign: 'center', fontSize: 20, fontWeight: '500'}}>
          Back
        </Text>
      </Link>

      <Text style={[styles.h3, styles.bold, {textAlign: 'center'}]}>
        {title}
      </Text>
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 30,
          paddingVertical: 10,
        }}>
        <Text style={{fontSize: 20, fontWeight: '500'}}>{title}</Text>
        <Text style={{fontSize: 20, fontWeight: '500'}}>→</Text>
      </View>
    </Link>
  );
}



interface IUserRow {
  user: IUser;
}

function UserRow({user}: IUserRow) {
  return (
    <View style={{flexDirection: 'row', marginBottom: 50, marginTop: 20}}>
      <Image
        style={{width: 100, height: 100, borderRadius: 50}}
        source={{uri: user?.images[0].url}}
      />

      <View style={{justifyContent: 'center', marginLeft: 15}}>
        <Text style={{fontSize: 24, fontWeight: '600'}}>
          {user?.display_name}
        </Text>
        <Text style={{fontSize: 18, fontWeight: '500', marginTop: 10}}>
          View Profile
        </Text>
      </View>
    </View>
  );
}

function Logout() {
  const {logout} = useAuth();

  return (
    <View style={{marginTop: 40, alignItems: 'center'}}>
      <TouchableOpacity
        onPress={logout}
        style={{
          paddingHorizontal: 50,
          paddingVertical: 20,
          borderRadius: 40,
          borderWidth: 1,
        }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            letterSpacing: 1.5,
            textTransform: 'uppercase',
          }}>
          Log Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export {Settings};
