import React from 'react';
import {
  ScrollView,
  Text,
  View,
  ImageBackground,
  Image,
  Animated,
} from 'react-native';
import {styles} from '../../styles';
import {useParams, PagerGestureContainer, Pager} from '../../earhart';
import {useTrackContext} from '../../providers/track-provider';
import {api} from '../../services/api';
import {useAlbumContext} from '../../providers/album-provider';

function useTracks(params: any) {
  const [state, dispatch] = useTrackContext();
  const [trackIds, setTrackIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    api.get(`/albums/${params.id}/tracks`).then((tracks: ITrack[]) => {
      console.log({tracks});
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
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{alignItems: 'center', padding: 15}}>
        <Image
          style={{height: 200, width: 200}}
          source={{uri: album.images[0]?.url}}
        />
      </View>

      <View style={{padding: 15}}>
        <Text style={[styles.h3, styles.semibold]}>{album.name}</Text>
        {tracks.map(track => {
          return (
            <View key={track.id} style={{marginVertical: 10}}>
              <Text style={[styles.h5, styles.semibold]}>{track.name}</Text>

              <View>
                <Text>
                  {track.artists.map(artist => artist.name).join(', ')}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

export {Album};
