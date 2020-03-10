import React from 'react';
import {ScrollView, Text, View, Image} from '../shared/tailwind';
import {useParams, PagerGestureContainer, Pager} from '../../earhart';
import {useTrackContext} from '../../providers/track-provider';
import {api} from '../../services/api';
import {useAlbumContext} from '../../providers/album-provider';

function useTracks(params: any) {
  const [state, dispatch] = useTrackContext();
  const [trackIds, setTrackIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    api.get(`/albums/${params.id}/tracks`).then((tracks: ITrack[]) => {
      dispatch({
        type: 'UPDATE_MANY',
        data: tracks,
      });

      setTrackIds(tracks.map(track => track.id));
    });
  }, [params.id]);

  const tracks = trackIds.map(id => state.lookup[id]);

  return tracks;
}

function Album() {
  const params = useParams();
  const [state] = useAlbumContext();

  const album = state.lookup[params.id];
  const tracks = useTracks(params);

  if (!album) {
    return null;
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="items-center py-4">
        <Image className="w-56 h-56" source={{uri: album.images[0]?.url}} />
      </View>

      <View className="p-4">
        <Text className="text-3xl font-semibold">{album.name}</Text>
        {tracks.map(track => {
          return (
            <View key={track.id} className="my-3">
              <Text className="text-xl font-semibold">{track.name}</Text>

              <Text className="mt-1 text-sm text-gray-700 font-medium">
                {track.artists.map(artist => artist.name).join(', ')}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

export {Album};
