import React from 'react';
import {Animated} from 'react-native';
import {Link, Routes} from 'earhart';
import {Stack, Route} from 'earhart-native';
import {
  SharedElement,
  useSharedElementInterpolation,
} from 'earhart-shared-element';

import {View, Image, Text, ScrollView} from '../shared/tailwind';
import {Playlist} from '../profiles/playlist';
import {useUser} from '../../providers/user-provider';
import {api} from '../../services/api';
import {usePlaylistContext} from '../../providers/playlist-provider';

function User() {
  const user = useUser();
  return (
    <Stack>
      <UserProfileInfo user={user} />

      <Routes>
        <UserProfile path="/" />
        <Playlist
          backUrl="../../"
          path="playlist/:id"
          screenProps={{stackPresentation: 'modal'}}
        />
      </Routes>
    </Stack>
  );
}

function UserProfile({path}) {
  const user = useUser();

  const [state, dispatch] = usePlaylistContext();
  const [playlistIds, setPlaylistIds] = React.useState([]);

  React.useEffect(() => {
    api.get(`/users/${user.id}/playlists?public=true`).then(playlists => {
      dispatch({
        type: 'UPDATE_MANY',
        data: playlists,
      });

      setPlaylistIds(playlists.map(playlist => playlist.id));
    });
  }, [user.id]);

  const playlists = playlistIds
    .map(id => state.lookup[id])
    .filter(playlist => playlist.public);

  return (
    <View className="flex-1">
      <ScrollView className="flex-1">
        <TransitionBottom>
          <View className="flex-1 p-4 bg-white">
            <Text className="text-2xl font-bold">Public Playlists</Text>
            <View style={{minHeight: 500}}>
              {playlists.map(playlist => {
                return <PlaylistRow key={playlist.id} playlist={playlist} />;
              })}
            </View>
          </View>
        </TransitionBottom>
      </ScrollView>
    </View>
  );
}

const bottomStyle = {
  transform: [
    {
      translateY: {
        inputRange: [-1, 0, 1],
        outputRange: [-1000, 0, 1000],
      },
    },
  ],
};

function TransitionBottom({children}) {
  const styles = useSharedElementInterpolation(bottomStyle);
  return <Animated.View style={{flex: 1, ...styles}}>{children}</Animated.View>;
}

function UserProfileInfo({user}) {
  return (
    <View className="mb-3 items-center">
      <SharedElement id="user-profile-image">
        <Image
          style={{height: 120, width: 120, borderRadius: 60}}
          source={{uri: user.images[0].url}}
        />
      </SharedElement>
      <SharedElement id="user-name">
        <Text className="mt-2 text-xl font-bold">{user.display_name}</Text>
      </SharedElement>
    </View>
  );
}

function PlaylistRow({playlist}: {playlist: IPlaylist}) {
  return (
    <Link to={`playlist/${playlist.id}`}>
      <View className="my-4 flex-row">
        <Image
          className="mr-3 w-12 h-12 rounded-full"
          source={{uri: playlist.images[0]?.url}}
        />

        <View className="justify-center">
          <Text className="text-sm font-bold">{playlist.name}</Text>
          <Text className="mt-1 text-xs text-gray-600">0 followers</Text>
        </View>
      </View>
    </Link>
  );
}

export {User};
