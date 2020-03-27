import React from 'react';
import {ScrollView, Text, View, Image, Pressable} from '../shared/tailwind';
import {useNavigator} from '../../earhart';
import {useTrackContext} from '../../providers/track-provider';
import {api} from '../../services/api';
import {useAlbumContext} from '../../providers/album-provider';

function useTracks(albumId: string) {
  const [state, dispatch] = useTrackContext();
  const [trackIds, setTrackIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (albumId) {
      api
        .get(`/albums/${albumId}/tracks`)
        .then((tracks: ITrack[]) => {
          dispatch({
            type: 'UPDATE_MANY',
            data: tracks,
          });

          setTrackIds(tracks.map(track => track.id));
        })
        .catch(error => {
          console.log({error});
        });
    }
  }, [albumId]);

  const tracks = trackIds.map(id => state.lookup[id]);

  return tracks;
}

function Album() {
  const {params, activeIndex} = useNavigator();
  const [state] = useAlbumContext();

  const album = state.lookup[params.id];
  const tracks = useTracks(params.id);

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
        {tracks.map(track => {
          return (
            <Pressable key={track.id} className="my-3">
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

export {Album};
