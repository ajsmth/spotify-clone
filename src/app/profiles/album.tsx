import React from 'react';
import {ScrollView, Text, View, Image} from '../shared/tailwind';
import {useParams, PagerGestureContainer, Pager, useNavigator} from 'earhart';
import {useTrackContext} from '../../providers/track-provider';
import {api} from '../../services/api';
import {useAlbumContext} from '../../providers/album-provider';
import {
  SharedElement,
  useSharedElementInterpolation,
} from 'earhart-shared-element';
import {Animated, StyleSheet} from 'react-native';

function useTracks(params: any) {
  const [state, dispatch] = useTrackContext();
  const [trackIds, setTrackIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (params.id) {
      api.get(`/albums/${params.id}/tracks`).then((tracks: ITrack[]) => {
        dispatch({
          type: 'UPDATE_MANY',
          data: tracks,
        });

        setTrackIds(tracks.map(track => track.id));
      });
    }
  }, [params.id]);

  const tracks = trackIds.map(id => state.lookup[id]);

  return tracks;
}

const fadeInStyle = {
  opacity: {
    inputRange: [-1, 0, 1],
    outputRange: [0, 1, 0],
  },
};

const fadeInWhite = {
  opacity: {
    inputRange: [-1, 0, 1],
    outputRange: [0, 1, 0],
  },
};

function Background({children}) {
  const style = useSharedElementInterpolation(fadeInWhite);
  return <Animated.View style={{ backgroundColor: 'white', ...style}}>{children}</Animated.View>;
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
    <ScrollView className="flex-1">
      <Background>
        <View className="py-4 items-center">
          <SharedElement id={`album-profile-image-${album.id}`}>
            <View className="z-20">
              <Image
                className="w-56 h-56"
                source={{uri: album.images[0]?.url}}
              />
            </View>
          </SharedElement>
        </View>

        <View className="items-start px-4">
          <SharedElement id={`album-profile-name-${album.id}`}>
            <Text className="font-semibold text-3xl">{album.name}</Text>
          </SharedElement>

          <SharedElement id={`album-profile-artist-${album.id}`}>
            <Text className="text-lg font-medium text-gray-700">
              {album.artists[0]?.name}
            </Text>
          </SharedElement>
        </View>

        <TransitionBottom>
          <View className="p-4">
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

export {Album};
