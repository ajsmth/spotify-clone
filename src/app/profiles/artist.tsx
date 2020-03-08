import React from 'react';
import {ScrollView, ImageBackground, Text, View, Image} from 'react-native';
import {useArtistContext} from '../../providers/artist-provider';
import {useParams} from '../../earhart/router';
import {styles} from '../../styles';
import {spotify} from '../../services/spotify-client';
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
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <ImageBackground
        style={{height: 400, padding: 15}}
        source={{uri: artist.images[0]?.url}}>
        <View style={{flex: 1}} />
        <Text
          style={[styles.h2, styles.bold, {color: 'white', lineHeight: 40}]}>
          {artist.name}
        </Text>
      </ImageBackground>

      <View style={{padding: 15}}>
        <View>
          <Text style={[styles.paragraph, styles.semibold]}>Popular</Text>
          {tracks.map((track, index) => {
            return (
              <View
                key={track.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                <Text style={[styles.paragraph, {marginRight: 10}]}>
                  {index + 1}
                </Text>
                <Image
                  style={{height: 50, width: 50, marginRight: 10}}
                  source={{uri: track.album.images[0]?.url}}
                />

                <Text style={[styles.paragraph, styles.semibold]}>
                  {track.name}
                </Text>
              </View>
            );
          })}
        </View>

        <View>
          <Text style={[styles.paragraph, styles.semibold]}>Albums</Text>
          {albums.map((album, index) => {
            return (
              <View
                key={album.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                <Text style={[styles.paragraph, {marginRight: 10}]}>
                  {index + 1}
                </Text>
                <Image
                  style={{height: 50, width: 50, marginRight: 10}}
                  source={{uri: album.images[0]?.url}}
                />

                <Text style={[styles.paragraph, styles.semibold]}>
                  {album.name}
                </Text>
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
