import React from 'react';
import {ScrollView, Text, View, Image, Pressable} from '../shared/tailwind';
import {useNavigator} from '../../earhart';
import {api} from '../../services/api';
import {
  useAlbums,
  useTracks,
  useCollections,
} from '../../providers/spotify-providers';

function Album() {
  const {params} = useNavigator();
  const lookup = useAlbums((state) => state.lookup);

  const album = lookup[params.id];
  const tracks = useAlbumTracks(params.id);

  if (!album) {
    return null;
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="py-4 items-center">
        <View className="z-20">
          <Image className="w-56 h-56" source={{uri: album.images[0]?.url}} />
        </View>
      </View>

      <View className="items-start px-4">
        <Text className="font-semibold text-3xl">{album.name}</Text>

        <Text className="text-lg font-medium text-gray-700">
          {album.artists[0]?.name}
        </Text>
      </View>

      <View className="p-4">
        {tracks.map((track) => {
          return (
            <Pressable key={track.id} className="my-3">
              <Text className="text-xl font-semibold">{track.name}</Text>

              <Text className="mt-1 text-sm text-gray-700 font-medium">
                {track.artists.map((artist) => artist.name).join(', ')}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

function useAlbumTracks(albumId: string) {
  const lookup = useTracks((state) => state.lookup);
  const update = useTracks((state) => state.update);

  const add = useCollections((state) => state.update);

  React.useEffect(() => {
    if (albumId) {
      api.get(`/albums/${albumId}/tracks`).then((tracks: ITrack[]) => {
        update(tracks);

        const collection = {
          id: albumId,
          ids: tracks.map((t) => t.id),
        };

        add([collection]);
      });
    }
  }, [albumId]);

  const trackIds = useCollections((state) => state.lookup[albumId]?.ids || []);
  return trackIds.map((id) => lookup[id]);
}

export {Album};
