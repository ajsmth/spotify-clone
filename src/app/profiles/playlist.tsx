import React from 'react';
import {Animated, LayoutChangeEvent, Switch, SectionList} from 'react-native';


import {Link, useParams} from '../../earhart';
import {Image, Text, View, SafeAreaView, Pressable} from '../shared/tailwind';
import {api} from '../../services/api';

import {usePlaylistContext} from '../../providers/playlist-provider';
import {useTrackContext} from '../../providers/track-provider';
import {useSetTrackId} from '../../providers/player-provider';

interface IPlaylistView {
  animatedValue?: Animated.Value;
}

function Playlist({animatedValue}: IPlaylistView) {
  const params = useParams<{id: string}>();

  const scrollY = React.useRef(animatedValue || new Animated.Value(0));

  const [state] = usePlaylistContext();
  const playlist = state.lookup[params.id || ''];

  const tracks = useTracks(params.id);

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

  // HERO SECTION TRANSLATIONS
  const clampHeroSection = React.useMemo(
    () =>
      Animated.add(
        // we want the hero section to appear to not move when scrolling
        // we can do this by setting its translation value to the current scroll value
        scrollY,
        // we also need it to shift up a little bit at first, otherwise it looks strange when elements above it are moving but it isn't
        // we can do this by subtracting values from the current scroll position within a specific range
        // in this case, we'll shift it up until we've scrolled beyond the search section
        scrollY.interpolate({
          // inputRange cannot be in a negative order - make it a minimum of 0
          inputRange: [0, Math.max(50, 0)],
          outputRange: [0, -25],
          // we also want it to shift down when the user pulls down, so we clamp the above range with 'extrapolateRight'
          // using just 'extrapolate' would clamp the scroll value in both directions
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
        renderItem={({item}) =>
          item === 'download' ? <DownloadRow /> : <MemoTrackRow track={item} />
        }
        sections={[{data: ['download', ...tracks]}]}
        stickySectionHeadersEnabled
        renderSectionHeader={() => (
          <View>
            <ShufflePlayButton />
          </View>
        )}
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
      </View>
    </View>
  );
}

function DownloadRow() {
  return (
    <View className="pt-6 pb-4 flex-row justify-between items-center bg-white">
      <Text className="text-base font-bold">Download</Text>
      <Switch />
    </View>
  );
}

function TrackRow({track}) {
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

const SEARCH_HEIGHT = 50;
const HERO_HEIGHT = 300;

// a wrapper component for translating position with animated values
// doesn't do much, but it cleans up the markup a little bit
function TranslationContainer({children, translateY}: any) {
  return (
    <Animated.View style={{transform: [{translateY}]}}>
      {children}
    </Animated.View>
  );
}

function Header({backUrl = '../../../', children}: any) {
  return (
    <View className="px-4 py-1 flex-row items-center">
      <View>
        <Link to={backUrl}>
          <Text className="text-base font-bold">Back</Text>
        </Link>
      </View>

      <View className="flex-1">{children}</View>

      <View>
        <Pressable onPress={console.log}>
          <Text className="px-2 text-sm">...</Text>
        </Pressable>
      </View>
    </View>
  );
}

const SHUFFLE_PLAY_BUTTON_HEIGHT = 60;
const SHUFFLE_PLAY_BUTTON_OFFSET = SHUFFLE_PLAY_BUTTON_HEIGHT / 2;

function ShufflePlayButton({children}: any) {
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

const TRACK_CACHE = {};

function useTracks(playlistId?: string) {
  const [state, dispatch] = useTrackContext();
  const [trackIds, setTrackIds] = React.useState([]);

  React.useEffect(() => {
    if (playlistId) {
      const cachedTracks = TRACK_CACHE[playlistId];
      if (cachedTracks) {
        setTrackIds(cachedTracks);
      } else {
        setTrackIds([]);

        api.get(`/playlists/${playlistId}/tracks`).then(tracks => {
          dispatch({
            type: 'UPDATE_MANY',
            data: tracks,
          });

          const trackIds = tracks.map(track => track.id);
          TRACK_CACHE[playlistId] = trackIds;

          setTrackIds(trackIds);
        });
      }
    }
  }, [playlistId]);

  const tracks = trackIds.map(id => state.lookup[id]).filter(Boolean);
  return tracks;
}

export {Playlist};

function getLayout({nativeEvent: {layout}}: LayoutChangeEvent) {
  return layout;
}
