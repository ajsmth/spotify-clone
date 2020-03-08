import React from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';
import {Link, Stack, Routes, Route, Switch} from '../../earhart';
import {styles} from '../../styles';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import {Playlist} from '../profiles/playlist';
import {useUser} from '../../providers/user-provider';

function User() {
  const user = useUser();

  return (
    <Stack>
      <Routes>
        <Route path="/">
          <UserProfile user={user} />
        </Route>

        <Route path="*">
          <Switch>
            <Routes>
              <Route path="playlist/:id">
                <Playlist />
              </Route>

              <Route path="*">
                <NestedProfiles />
              </Route>
            </Routes>
          </Switch>
        </Route>
      </Routes>
    </Stack>
  );
}

interface IUserProfile {
  user: IUser;
}

function UserProfile({user}: IUserProfile) {
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ProfileScreenHeader />

      <ScrollView style={{flex: 1}}>
        <UserProfileInfo user={user} />
        <FindFriendsLink />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 30,
          }}>
          <ProfileNavigationLink name="Playlists" to="playlists" count={2} />
          <ProfileNavigationLink name="Followers" to="followers" count={9} />
          <ProfileNavigationLink name="Following" to="following" count={10} />
        </View>

        <View style={{padding: 15}}>
          <Text style={[styles.h4, styles.bold]}>Public Playlists</Text>
          <PlaylistRow playlistId="37i9dQZF1DX76Wlfdnj7AP" name="james" />
          <PlaylistRow playlistId="37i9dQZF1DX5gQonLbZD9s" name="bangers" />
        </View>
      </ScrollView>
    </View>
  );
}

function UserProfileInfo({user}) {
  return (
    <View style={{alignItems: 'center', marginBottom: 10}}>
      <Image
        source={{uri: user.images[0].url}}
        style={{height: 100, width: 100, borderRadius: 50}}
      />

      <Text style={[styles.h5, styles.bold]}>{user.display_name}</Text>
    </View>
  );
}

function FindFriendsLink() {
  return (
    <TouchableOpacity
      style={{
        alignSelf: 'center',
        borderWidth: StyleSheet.hairlineWidth,
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginBottom: 30,
      }}>
      <Text
        style={[
          styles.small,
          styles.bold,
          {
            textTransform: 'uppercase',
            letterSpacing: 1.2,
          },
        ]}>
        Find Friends
      </Text>
    </TouchableOpacity>
  );
}

function ProfileScreenHeader({}) {
  return (
    <View style={{padding: 15}}>
      <Link to="../">
        <Text style={[styles.paragraph, styles.bold]}>Back</Text>
      </Link>
    </View>
  );
}

function ProfileNavigationLink({to, name, count}) {
  return (
    <Link
      to={to}
      style={{
        paddingHorizontal: 10,
        paddingVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>{count}</Text>
      <Text style={[styles.small, {textTransform: 'uppercase'}]}>{name}</Text>
    </Link>
  );
}

function NestedProfiles() {
  return (
    <Switch>
      <Routes>
        <Route path="playlists">
          <UserPlaylists />
        </Route>

        <Route path="followers">
          <ProfileScreenHeader />
          <UserFollowers />
        </Route>

        <Route path="following">
          <ProfileScreenHeader />
          <UserFollowing />
        </Route>
      </Routes>
    </Switch>
  );
}

function UserPlaylists() {
  return (
    <Stack>
      <Routes>
        <Route path="/">
          <ProfileScreenHeader />

          <View style={{flex: 1, padding: 15, backgroundColor: 'white'}}>
            <PlaylistRow playlistId="37i9dQZF1DX76Wlfdnj7AP" name="james" />
            <PlaylistRow playlistId="37i9dQZF1DX5gQonLbZD9s" name="bangers" />
          </View>
        </Route>

        <Route path="playlist/:id">
          <Playlist />
        </Route>
      </Routes>
    </Stack>
  );
}

function UserFollowers() {
  return (
    <ScrollView style={{flex: 1, padding: 15, backgroundColor: 'white'}}>
      <UserRow />
      <UserRow />
      <UserRow />
      <UserRow />
      <UserRow />
      <UserRow />
      <UserRow />
      <UserRow />
      <UserRow />
    </ScrollView>
  );
}

function UserFollowing() {
  return (
    <ScrollView style={{flex: 1, padding: 15, backgroundColor: 'white'}}>
      <UserRow />
      <UserRow />
      <UserRow />
      <UserRow />
      <UserRow />
      <UserRow />
      <UserRow />
    </ScrollView>
  );
}

function UserRow({}) {
  return (
    <View style={{flexDirection: 'row', marginVertical: 15}}>
      <View
        style={{
          height: 50,
          width: 50,
          borderRadius: 25,
          backgroundColor: 'gray',
          marginRight: 10,
        }}
      />

      <View>
        <Text style={[styles.paragraph, styles.bold]}>Andrew Smith</Text>
        <Text style={[styles.small, {color: 'gray'}]}>24 Followers</Text>
      </View>
    </View>
  );
}

function PlaylistRow({playlistId, name}) {
  return (
    <Link
      to={`playlist/${playlistId}`}
      style={{flexDirection: 'row', marginVertical: 15}}>
      <View
        style={{
          height: 50,
          width: 50,
          backgroundColor: 'gray',
          marginRight: 10,
        }}
      />

      <View style={{justifyContent: 'center'}}>
        <Text style={[styles.small, styles.bold]}>{name}</Text>
        <Text style={[styles.small, {color: 'gray', lineHeight: 14}]}>
          0 followers
        </Text>
      </View>
    </Link>
  );
}

export {User};
