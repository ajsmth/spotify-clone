import React from 'react';
import {ImageBackground, Animated} from 'react-native';
import {useParams} from 'earhart';
import {ScrollView, Text, View, Image, Pressable} from '../shared/tailwind';
import {useArtistContext} from '../../providers/artist-provider';
import {useTrackContext} from '../../providers/track-provider';
import {api} from '../../services/api';
import {useAlbumContext} from '../../providers/album-provider';
import {
  SharedElement,
  useSharedElementInterpolation,
} from 'earhart-shared-element';
import { useSetTrackId } from '../../providers/player-provider';

const fadeInWhite = {
  opacity: {
    inputRange: [-1, 0, 1],
    outputRange: [0, 1, 0],
  },
};

function Background({children}) {
  const style = useSharedElementInterpolation(fadeInWhite);
  return (
    <Animated.View style={{backgroundColor: 'white', ...style}}>
      {children}
    </Animated.View>
  );
}

function Artist() {
  const params = useParams();
  const [state] = useArtistContext();

  const setTrackId = useSetTrackId()

  const tracks = useTracks(params.id);

  const artist = state.lookup[params.id];

  if (!artist) {
    return null;
  }


  return (
    <ScrollView className="flex-1">
      <Background>
        <View className="py-4 items-center">
          <SharedElement id={`artist-profile-image-${artist.id}`}>
            <View className="z-20">
              <Image
                className="w-56 h-56"
                source={{uri: artist.images[0]?.url}}
              />
            </View>
          </SharedElement>
        </View>

        <View className="items-start px-4">
          <SharedElement
            id={`artist-profile-name-${artist.id}`}
            config={{animated: 'fade', resize: 'clip', align: "left-center" }}>
            <Text className="font-semibold text-3xl">{artist.name}</Text>
          </SharedElement>
        </View>

        <TransitionBottom>
          <View className="p-4">
            {tracks.map(track => {
              return (
                <Pressable key={track.id} className="my-3" onPress={() => setTrackId(track.id)}>
                  <Text className="text-xl font-semibold">{track.name}</Text>

                  <Text className="mt-1 text-sm text-gray-700 font-medium">
                    {track.artists.map(artist => artist.name).join(', ')}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </TransitionBottom>
      </Background>
    </ScrollView>
  );
}

const transitionBottomStyle = {
  transform: [
    {
      translateY: {
        inputRange: [-1, 0, 1],
        outputRange: [-1000, 0, 600],
      },
    },
  ],
};

function TransitionBottom({children}) {
  const styles = useSharedElementInterpolation(transitionBottomStyle);

  return <Animated.View style={styles}>{children}</Animated.View>;
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
