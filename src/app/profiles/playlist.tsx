import React from 'react';
import {
  Animated,
  TouchableOpacity,
  LayoutRectangle,
  LayoutChangeEvent,
  TextInput,
  StyleSheet,
  Switch,
  Button,
  InteractionManager,
} from 'react-native';

import {
  Image,
  Text,
  View,
  SafeAreaView,
  Pressable,
  AnimatedText,
} from '../shared/tailwind';

import {useParams, PagerGestureContainer, Pager, Link} from 'earhart';
import {api} from '../../services/api';
import {PerformantScreen} from '../home/home';
import {usePlaylistContext} from '../../providers/playlist-provider';
import {useTrackContext} from '../../providers/track-provider';

const EMPTY_RECT = {
  x: 0,
  y: 0,
  height: 0,
  width: 0,
};

function getLayout({nativeEvent: {layout}}: LayoutChangeEvent) {
  return layout;
}

function Playlist({backUrl = ''}) {
  const params = useParams();

  const scrollY = React.useRef(new Animated.Value(0));

  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY.current}}}],
    {useNativeDriver: true},
  );

  // so far, we've been using hardcoded values to get the layout right
  // in reality, the content will determine these values - so we can track these changes via onLayout

  // it looks like there are 2 variables we need to calculate the heights of:
  // the search section, and the hero section
  const [searchLayout, setSearchLayout] = React.useState<LayoutRectangle>(
    EMPTY_RECT,
  );

  const [heroLayout, setHeroLayout] = React.useState<LayoutRectangle>(
    EMPTY_RECT,
  );

  // HERO SECTION TRANSLATIONS
  const clampHeroSection = Animated.add(
    // we want the hero section to appear to not move when scrolling
    // we can do this by setting its translation value to the current scroll value
    scrollY.current,
    // we also need it to shift up a little bit at first, otherwise it looks strange when elements above it are moving but it isn't
    // we can do this by subtracting values from the current scroll position within a specific range
    // in this case, we'll shift it up until we've scrolled beyond the search section
    scrollY.current.interpolate({
      // inputRange cannot be in a negative order - make it a minimum of 0
      inputRange: [0, Math.max(searchLayout.height, 0)],
      outputRange: [0, -searchLayout.height],
      // we also want it to shift down when the user pulls down, so we clamp the above range with 'extrapolateRight'
      // using just 'extrapolate' would clamp the scroll value in both directions
      extrapolateRight: 'clamp',
    }),
  );

  // SHUFFLE BUTTON TRANSLATIONS
  const heroBottom = heroLayout.height + searchLayout.height;

  const clampShuffleButton = Animated.add(
    // make the button maintain its position during scroll - i.e the center of the window
    scrollY.current,
    // transition the button up until it reaches the top (hero section + search section + shuffle offset)
    scrollY.current.interpolate({
      // inputRange cannot be in negative order -- make it a minimum of 0
      inputRange: [0, Math.max(0, heroBottom - SHUFFLE_PLAY_BUTTON_OFFSET)],
      outputRange: [0, -heroBottom + SHUFFLE_PLAY_BUTTON_OFFSET],
      // after reaching the ~300 points translation, maintain the position at the top
      extrapolateRight: 'clamp',
    }),
  );

  const [state] = usePlaylistContext();
  const [trackIds, setTrackIds] = React.useState([]);

  const [tracksStore, update] = useTrackContext();
  const playlist = state.lookup[params.id];

  React.useEffect(() => {
    if (params.id) {
      api.get(`/playlists/${params.id}/tracks`).then(tracks => {
        update({
          type: 'UPDATE_MANY',
          data: tracks,
        });

        setTrackIds(tracks.map(track => track.id));
      });
    }
  }, [params.id]);

  if (!playlist) {
    return null;
  }

  const tracks = trackIds.map(id => tracksStore.lookup[id]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Header backUrl={backUrl}>
        <AnimatedText
          className="p-2 border-2 text-center text-2xl font-semibold"
          style={{
            opacity: scrollY.current.interpolate({
              inputRange: [0, searchLayout.height, heroBottom],
              outputRange: [0, 0, 1],
              extrapolate: 'clamp',
            }),
          }}>{`${playlist.name}`}</AnimatedText>
      </Header>
      <Animated.ScrollView
        removeClippedSubviews
        contentOffset={{y: searchLayout.height}}
        onScroll={handleScroll}
        // prevent flash from initial layout + content offset scrolling
        style={{flex: 1, opacity: searchLayout.height ? 1 : 0}}>
        <SearchPlaylists
          onLayout={(event: LayoutChangeEvent) =>
            setSearchLayout(getLayout(event))
          }>
          <SearchFilters />
        </SearchPlaylists>

        <TranslationContainer translateY={clampHeroSection}>
          <PlaylistHero
            onLayout={(event: LayoutChangeEvent) =>
              setHeroLayout(getLayout(event))
            }>
            <AboutPlaylist playlist={playlist} />
          </PlaylistHero>
        </TranslationContainer>
        <PlaylistItems tracks={tracks}>
          <TranslationContainer translateY={clampShuffleButton}>
            <ShufflePlayButton />
          </TranslationContainer>
        </PlaylistItems>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

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

function SearchPlaylists({children, ...rest}: any) {
  return <View {...rest}>{children}</View>;
}

function PlaylistHero({children, ...rest}: any) {
  return (
    <View
      {...rest}
      style={{
        padding: 10,
        paddingBottom: SHUFFLE_PLAY_BUTTON_HEIGHT,
      }}>
      {children}
    </View>
  );
}

function PlaylistItems({
  tracks,
  children,
}: {
  tracks: any;
  children: React.ReactNode;
}) {
  return (
    <View className="bg-white">
      <View className="z-20">{children}</View>
      <View
        className="p-4 z-10"
        style={{
          transform: [{translateY: -SHUFFLE_PLAY_BUTTON_OFFSET}],
          marginBottom: -SHUFFLE_PLAY_BUTTON_OFFSET,
        }}>
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-base font-bold">Download</Text>
          <Switch />
        </View>

        {tracks.slice(0, 5).map((track, index) => (
          <PlaylistRow track={track} key={`${track.id}-${index}`} />
        ))}
        {/* save some performance by delaying rendering of items off screen until after interactions */}
        <PerformantScreen>
          {tracks.slice(6).map((track, index) => (
            <PlaylistRow track={track} key={`${track.id}-${index}`} />
          ))}
        </PerformantScreen>
      </View>
    </View>
  );
}

function PlaylistRow({track}: {track: any}) {
  return (
    <View className="mb-6">
      <Text className="text-base font-bold">{track.name}</Text>
      <View className="flex-row items-center">
        <Text className="font-medium text-gray-600">
          {track.artists[0].name}
        </Text>
        <View className="mx-1 w-1 h-1 rounded-full bg-gray-600" />
        <Text className="font-medium text-gray-600" numberOfLines={1}>
          {track.album.name}
        </Text>
      </View>
    </View>
  );
}

const SHUFFLE_PLAY_BUTTON_HEIGHT = 60;
const SHUFFLE_PLAY_BUTTON_OFFSET = SHUFFLE_PLAY_BUTTON_HEIGHT / 2;

function ShufflePlayButton({children}: any) {
  return (
    <View
      style={{
        transform: [
          {
            // shifts the button up halfway
            translateY: -SHUFFLE_PLAY_BUTTON_OFFSET,
          },
        ],
      }}>
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

function SearchFilters({}) {
  return (
    <View className="px-4 flex-row justify-between">
      <TextInput
        style={{
          flex: 1,
          borderRadius: 4,
          paddingVertical: 15,
          fontSize: 16,
          fontWeight: '600',
          marginRight: 20,
        }}
        placeholder="Find in playlist"
      />
      <Pressable className="px-2 h-10 justify-center rounded-lg border border-gray-700">
        <Text className="text-base font-semibold">Filters</Text>
      </Pressable>
    </View>
  );
}

function AboutPlaylist({playlist}: {playlist: IPlaylist}) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const animatedIndex = React.useRef(new Animated.Value(0)).current;

  return (
    <View>
      <View className="justify-center items-center">
        <PagerGestureContainer>
          <View className="overflow-hidden" style={{width: 200, height: 200}}>
            <Pager
              pageSize={200}
              activeIndex={activeIndex}
              onChange={setActiveIndex}
              animatedIndex={animatedIndex}
              style={{
                width: playlist.images.length * 200,
                flexDirection: 'row',
              }}>
              {playlist.images.map(image => {
                return (
                  <Image
                    source={{uri: image.url}}
                    key={image.url}
                    style={{height: 200, width: 200}}
                  />
                );
              })}
            </Pager>
          </View>
        </PagerGestureContainer>
      </View>

      <View className="items-center">
        <Text className="mt-3 text-xl font-bold">{playlist.name}</Text>
        <Pressable
          className="px-8 py-2 my-3 border"
          style={{
            borderRadius: 30,
          }}>
          <Text className="text-sm uppercase font-semibold">Follow</Text>
        </Pressable>

        <View className="flex-row items-center">
          <Text className="text-gray-600 font-normal">897 Followers</Text>
          <View className="mx-2 w-1 h-1 bg-gray-600 rounded-full" />
          <Text className="text-gray-600 font-normal">by Spotify</Text>
        </View>
      </View>
    </View>
  );
}

export {Playlist};
