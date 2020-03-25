import React from 'react';
import {useNavigator} from '../../earhart';
import {ScrollView, Text, View, Image, Pressable} from '../shared/tailwind';
import {useArtistContext} from '../../providers/artist-provider';
import {useTrackContext} from '../../providers/track-provider';
import {api} from '../../services/api';
import {useAlbumContext} from '../../providers/album-provider';
import {useSetTrackId} from '../../providers/player-provider';

function Artist() {
  const {params} = useNavigator();
  const [state] = useArtistContext();

  const setTrackId = useSetTrackId();

  const tracks = useTracks(params.id);

  const artist = state.lookup[params.id];

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
        {tracks.map(track => {
          return (
            <Pressable
              key={track.id}
              className="my-3"
              onPress={() => setTrackId(track.id)}>
              <Text className="text-xl font-semibold">{track.name}</Text>

              <Text className="mt-1 text-sm text-gray-700 font-medium">
                {track.artists.map(artist => artist.name).join(', ')}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

function useTracks(id: string) {
  const [state, dispatch] = useTrackContext();
  const [trackIds, setTrackIds] = React.useState([]);

  React.useEffect(() => {
    if (id) {
      api.get(`/artists/${id}/tracks`).then(tracks => {
        dispatch({
          type: 'UPDATE_MANY',
          data: tracks,
        });

        setTrackIds(tracks.map(track => track.id));
      });
    }
  }, [id]);

  return trackIds.map(id => state.lookup[id]);
}

function useAlbums(id: string) {
  const [state, dispatch] = useAlbumContext();
  const [albumIds, setAlbumIds] = React.useState([]);

  React.useEffect(() => {
    if (id) {
      api.get(`/artists/${id}/albums`).then(albums => {
        dispatch({
          type: 'UPDATE_MANY',
          data: albums,
        });

        setAlbumIds(albums.map(album => album.id));
      });
    }
  }, [id]);

  return albumIds.map(id => state.lookup[id]);
}

export {Artist};
