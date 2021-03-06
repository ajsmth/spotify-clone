import React from 'react';
import {Animated, Switch, SectionList} from 'react-native';
import {useParams} from '../../earhart';
import {Image, Text, View, SafeAreaView, Pressable} from '../shared/tailwind';
import {api} from '../../services/api';

import {useSetTrackId} from '../../providers/player-provider';
import {
  usePlaylists,
  useTracks,
  useCollections,
} from '../../providers/spotify-providers';

interface IPlaylistView {
  animatedValue?: Animated.Value;
}

function Playlist({animatedValue}: IPlaylistView) {
  const params = useParams<{id: string}>();

  const scrollY = React.useRef(animatedValue || new Animated.Value(0));

  const lookup = usePlaylists((state) => state.lookup);
  const playlist = lookup[params.id || ''];

  const tracks = usePlaylistTracks(params.id);

  if (!playlist) {
    return null;
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <PlaylistItems
        playlist={playlist}
        tracks={tracks}
        scrollY={scrollY.current}
      />
    </SafeAreaView>
  );
}

interface IPlaylistItems {
  playlist: IPlaylist;
  tracks: ITrack[];
  scrollY: Animated.Value;
}

const ROW_HEIGHT = 60;

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

function PlaylistItems({playlist, tracks, scrollY}: IPlaylistItems) {
  const handleScroll = React.useMemo(
    () =>
      Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}], {
        useNativeDriver: true,
      }),
    [],
  );

  const clampHeroSection = React.useMemo(
    () =>
      Animated.add(
        scrollY,
        scrollY.interpolate({
          inputRange: [0, Math.max(50, 0)],
          outputRange: [0, -25],
          extrapolateRight: 'clamp',
        }),
      ),
    [],
  );

  const scaleHeroSection = React.useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [-40, 0],
        outputRange: [1.1, 1],
        extrapolateRight: 'clamp',
      }),
    [],
  );

  return (
    <View className="flex-1">
      <AnimatedSectionList
        onScroll={handleScroll}
        ListHeaderComponent={
          <View className="my-4">
            <Animated.View
              style={{
                transform: [
                  {translateY: clampHeroSection},
                  {scale: scaleHeroSection},
                ],
              }}>
              <PlaylistHeader playlist={playlist} />
            </Animated.View>
          </View>
        }
        removeClippedSubviews
        getItemLayout={(_, index) => ({
          length: ROW_HEIGHT,
          offset: ROW_HEIGHT * index,
          index,
        })}
        contentContainerStyle={{padding: 15}}
        initialNumToRender={5}
        keyExtractor={(item: ITrack | string) => item.id || '0'}
        // first row should be the download row
        renderItem={({item}) =>
          item === 'download' ? <DownloadRow /> : <MemoTrackRow track={item} />
        }
        sections={[{data: ['download', ...tracks]}]}
        stickySectionHeadersEnabled
        renderSectionHeader={() => <ShufflePlayButton />}
      />
    </View>
  );
}

function PlaylistHeader({playlist}: {playlist: IPlaylist}) {
  return (
    <View>
      <View className="justify-center items-center">
        <View className="overflow-hidden" style={{width: 200, height: 200}}>
          <Image
            source={{uri: playlist.images[0]?.url}}
            style={{height: 200, width: 200}}
          />
        </View>
        <View className="my-4">
          <Text className="text-2xl font-semibold text-gray-800">
            {playlist.name}
          </Text>
        </View>
      </View>
    </View>
  );
}

interface ITrackRow {
  track: ITrack;
}
function TrackRow({track}: ITrackRow) {
  const setTrackId = useSetTrackId();

  return (
    <View className="pb-6 bg-white">
      <Pressable onPress={() => setTrackId(track.id)}>
        <Text className="text-base font-bold">{track.name}</Text>
        <View className="flex-row items-center">
          <Text className="font-medium text-gray-600">
            {track.artists[0].name}
          </Text>
          <View className="mx-1 w-1 h-1 rounded-full bg-gray-600" />
          <Text className="flex-1 font-medium text-gray-600" numberOfLines={1}>
            {track.album.name}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const MemoTrackRow = React.memo(TrackRow);

function DownloadRow() {
  return (
    <View className="pt-6 pb-4 flex-row justify-between items-center bg-white">
      <Text className="text-base font-bold">Download</Text>
      <Switch />
    </View>
  );
}

const SHUFFLE_PLAY_BUTTON_HEIGHT = 60;

function ShufflePlayButton() {
  return (
    <View>
      <View
        className="absolute top-0 left-0 right-0 bg-white"
        style={{
          height: '50%',
        }}
      />
      <Pressable
        className="w-64 items-center justify-center"
        style={{
          alignSelf: 'center',
          height: SHUFFLE_PLAY_BUTTON_HEIGHT,
          borderRadius: 30,
          backgroundColor: '#1DB954',
        }}>
        <Text
          className="text-lg font-bold uppercase text-white tracking-wide"
          style={{
            letterSpacing: 1.25,
          }}>
          Shuffle Play
        </Text>
      </Pressable>
    </View>
  );
}

function usePlaylistTracks(playlistId: string) {
  const lookup = useTracks((state) => state.lookup);
  const update = useTracks((state) => state.update);

  const add = useCollections((state) => state.update);

  React.useEffect(() => {
    if (playlistId) {
      api.get(`/playlists/${playlistId}/tracks`).then((tracks) => {
        const trackIds = tracks.map((track) => track.id);

        update(tracks);

        const collection: ICollection = {
          id: playlistId,
          ids: trackIds,
        };

        add([collection]);
      });
    }
  }, [playlistId]);

  const trackIds = useCollections((state) => state.lookup[playlistId]?.ids || []);
  return trackIds.map((id) => lookup[id]);
}

export {Playlist};
