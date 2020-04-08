import React from 'react';
import {Link} from '../../earhart';
import {View, Image, Text, ScrollView} from '../shared/tailwind';
import {useUser} from '../../providers/user-provider';
import {api} from '../../services/api';
import {usePlaylists, useCollections} from '../../providers/spotify-providers';

function User({}) {
  const user = useUser((state) => state.user);
  const playlists = useUserPlaylists(user?.id || '');

  if (!user) {
    return null;
  }

  return (
    <View className="flex-1 pt-4 bg-white">
      <View className="mb-3 items-center">
        <Image
          style={{height: 120, width: 120, borderRadius: 60}}
          source={{uri: user.images[0].url}}
        />
        <Text className="mt-2 text-xl font-bold">{user.display_name}</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="flex-1 p-4 bg-white">
          <Text className="text-2xl font-bold">Public Playlists</Text>
          <View>
            {playlists.map((playlist) => {
              return <PlaylistRow key={playlist.id} playlist={playlist} />;
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function PlaylistRow({playlist}: {playlist: IPlaylist}) {
  return (
    <Link to={`/home/settings/playlist/${playlist.id}`}>
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

function useUserPlaylists(userId: string) {
  const lookup = usePlaylists((state) => state.lookup);
  const update = usePlaylists((state) => state.update);

  const add = useCollections((state) => state.update);

  React.useEffect(() => {
    if (userId) {
      api.get(`/users/${userId}/playlists?public=true`).then((playlists) => {
        update(playlists);

        const collection = {
          id: `${userId}-playlists`,
          ids: playlists.map((p) => p.id),
        };

        add([collection]);
      });
    }
  }, [userId]);

  const playlistIds = useCollections(
    (state) => state.lookup[`${userId}-playlists`]?.ids || [],
  );
  
  const playlists = playlistIds.map((id) => lookup[id]);

  return playlists;
}

export {User};
