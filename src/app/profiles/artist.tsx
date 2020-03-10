import React from 'react';
import {ImageBackground} from 'react-native';
import {ScrollView, Text, View, Image} from '../shared/tailwind';
import {useArtistContext} from '../../providers/artist-provider';
import {useParams} from '../../earhart/router';
import {useTrackContext} from '../../providers/track-provider';
import {api} from '../../services/api';
import {useAlbumContext} from '../../providers/album-provider';

function Artist() {
  const params = useParams();
  const [state] = useArtistContext();

  const albums = useAlbums(params.id);
  const tracks = useTracks(params.id);

  const artist = state.lookup[params.id];

  if (!artist) {
    return null;
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <ImageBackground
        style={{height: 400, padding: 15}}
        source={{uri: artist.images[0]?.url}}>
        <View className="flex-1" />
        <Text className="text-4xl font-bold text-white">{artist.name}</Text>
      </ImageBackground>

      <View className="p-4">
        <View>
          <Text className="mb-3 text-2xl font-semibold">Popular</Text>
          {tracks.map((track, index) => {
            return (
              <View key={track.id} className="flex-row items-center my-3">
                <Text className="text-base mr-3">{index + 1}</Text>
                <Image
                  className="w-12 h-12 mr-2"
                  source={{uri: track.album.images[0]?.url}}
                />

                <Text className="text-base font-semibold">{track.name}</Text>
              </View>
            );
          })}
        </View>

        <View className="mt-6">
          <Text className="text-2xl font-semibold">Albums</Text>
          {albums.map((album, index) => {
            return (
              <View key={album.id} className="flex-row items-center my-3">
                <Text className="text-base mr-3">{index + 1}</Text>
                <Image
                  className="w-12 h-12 mr-2"
                  source={{uri: album.images[0]?.url}}
                />

                <Text className="text-base font-semibold">{album.name}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

function useTracks(id: string) {
  const [state, dispatch] = useTrackContext();
  const [trackIds, setTrackIds] = React.useState([]);

  React.useEffect(() => {
    api.get(`/artists/${id}/tracks`).then(tracks => {
      dispatch({
        type: 'UPDATE_MANY',
        data: tracks,
      });

      setTrackIds(tracks.map(track => track.id));
    });
  }, [id]);

  return trackIds.map(id => state.lookup[id]);
}

function useAlbums(id: string) {
  const [state, dispatch] = useAlbumContext();
  const [albumIds, setAlbumIds] = React.useState([]);

  React.useEffect(() => {
    api.get(`/artists/${id}/albums`).then(albums => {
      dispatch({
        type: 'UPDATE_MANY',
        data: albums,
      });

      setAlbumIds(albums.map(album => album.id));
    });
  }, [id]);

  return albumIds.map(id => state.lookup[id]);
}

export {Artist};
