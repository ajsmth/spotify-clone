import React from 'react';
import {useParams} from '../../earhart';
import {ScrollView, Text, View, Image, Pressable} from '../shared/tailwind';
import {api} from '../../services/api';
import {useSetTrackId} from '../../providers/player-provider';
import {
  useTracks,
  useArtists,
  useCollections,
} from '../../providers/spotify-providers';

function Artist() {
  const params = useParams<{id: string}>();
  const lookup = useArtists((state) => state.lookup);

  const setTrackId = useSetTrackId();

  const tracks = useArtistTracks(params.id || '');
  const artist = lookup[params.id || ''];

  if (!artist) {
    return null;
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="py-4 items-center">
        <View className="z-20">
          <Image className="w-56 h-56" source={{uri: artist.images[0]?.url}} />
        </View>
      </View>

      <View className="items-start px-4">
        <Text className="font-semibold text-3xl">{artist.name}</Text>
      </View>

      <View className="p-4">
        {tracks.map((track) => {
          return (
            <Pressable
              key={track.id}
              className="my-3"
              onPress={() => setTrackId(track.id)}>
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

function useArtistTracks(id: string) {
  const lookup = useTracks((state) => state.lookup);
  const update = useTracks((state) => state.update);

  const add = useCollections((state) => state.update);

  React.useEffect(() => {
    if (id) {
      api.get(`/artists/${id}/tracks`).then((tracks) => {
        update(tracks);

        const collection = {
          id: id,
          ids: tracks.map((t) => t.id),
        };

        add([collection]);
      });
    }
  }, [id]);

  const trackIds = useCollections((state) => state.lookup[id]?.ids || []);
  return trackIds.map((id) => lookup[id]);
}

export {Artist};
