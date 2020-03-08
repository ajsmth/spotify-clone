import React from 'react';
import {
  View,
  Animated,
  SafeAreaView,
  TouchableOpacity,
  LayoutRectangle,
  LayoutChangeEvent,
  TextInput,
  StyleSheet,
  Text,
  Switch,
  Button,
  Image,
  InteractionManager,
} from 'react-native';
import {
  useParams,
  PagerGestureContainer,
  Pager,
  useNavigate,
} from '../../earhart';
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

function Playlist() {
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
      <Header>
        <Animated.Text
          style={{
            textAlign: 'center',
            fontSize: 18,
            fontWeight: '700',
            opacity: scrollY.current.interpolate({
              inputRange: [0, searchLayout.height, heroBottom],
              outputRange: [0, 0, 1],
              extrapolate: 'clamp',
            }),
          }}>{`${playlist.name}`}</Animated.Text>
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

// the following components are mean to be containers for content
// ordinarily, the height of a view will be determined by its content (it's intrinsic height)
// we're using preset heights here to get the approximate layout first

// any calculations involving the intrinsic height of a view (in later steps) will be calculated using the onLayout prop
// if this sounds confusing, it will be explained in a later step - dont worry about it for now

function Header({children}: any) {
  const navigate = useNavigate();

  return (
    <View
      style={{
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
      }}>
      <View style={{flex: 1, alignItems: 'flex-start'}}>
        <Button title="Back" onPress={() => navigate(-1)} />
      </View>

      <View style={{flex: 3}}>{children}</View>
      <View style={{flex: 1, alignItems: 'flex-end'}}>
        <Button title="..." onPress={console.log} />
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
    <View style={{backgroundColor: 'white'}}>
      <View style={{zIndex: 2}}>{children}</View>
      <View
        style={{
          padding: 20,
          zIndex: 1,
          transform: [{translateY: -SHUFFLE_PLAY_BUTTON_OFFSET}],
          marginBottom: -SHUFFLE_PLAY_BUTTON_OFFSET,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>Download</Text>
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
    <View style={{marginBottom: 20}}>
      <Text style={{fontSize: 16, fontWeight: 'bold'}}>{track.name}</Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{fontWeight: '500', color: 'rgba(0,0,0,0.6)'}}>
          {track.artists[0].name}
        </Text>
        <View
          style={{
            width: 4,
            height: 4,
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: 2,
            marginHorizontal: 4,
          }}
        />
        <Text
          style={{fontWeight: '500', color: 'rgba(0,0,0,0.6)'}}
          numberOfLines={1}>
          {track.album.name}
        </Text>
      </View>
    </View>
  );
}

const SHUFFLE_PLAY_BUTTON_HEIGHT = 60;
// offset is used to move the button slightly outside its container view
// this gives it the effect of sitting halway between the hero section and the playlist items section
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
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          backgroundColor: 'white',
        }}
      />
      <TouchableOpacity
        style={{
          alignSelf: 'center',
          justifyContent: 'center',
          height: SHUFFLE_PLAY_BUTTON_HEIGHT,
          width: 240,
          borderRadius: 30,
          backgroundColor: '#1DB954',
        }}>
        <Text
          style={{
            textAlign: 'center',
            textTransform: 'uppercase',
            color: 'white',
            fontWeight: '700',
            fontSize: 18,
            letterSpacing: 1.25,
          }}>
          Shuffle Play
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function SearchFilters({}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
      }}>
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
      <TouchableOpacity
        style={{
          borderRadius: 4,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          paddingHorizontal: 10,
          alignSelf: 'center',
        }}>
        <Text
          style={{
            fontSize: 16,
            lineHeight: 32,
            fontWeight: '600',
          }}>
          Filters
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function AboutPlaylist({playlist}: {playlist: IPlaylist}) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const animatedIndex = React.useRef(new Animated.Value(0)).current;

  return (
    <View>
      <View style={{height: 200, marginHorizontal: 20}}>
        <PagerGestureContainer>
          <View
            style={{
              flex: 1,
              overflow: 'hidden',
              width: 200,
              height: 200,
              alignSelf: 'center',
            }}>
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
      <View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 20, fontWeight: '700', marginVertical: 10}}>
          {playlist.name}
        </Text>
        <TouchableOpacity
          style={{
            borderRadius: 30,
            borderWidth: 1,
            paddingVertical: 5,
            paddingHorizontal: 30,
            marginVertical: 10,
          }}>
          <Text
            style={{
              fontSize: 14,
              textTransform: 'uppercase',
              fontWeight: '600',
            }}>
            Follow
          </Text>
        </TouchableOpacity>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{color: 'gray', fontWeight: '500'}}>897 Followers</Text>
          <View
            style={{
              width: 4,
              height: 4,
              backgroundColor: 'gray',
              borderRadius: 2,
              marginHorizontal: 5,
            }}
          />
          <Text style={{color: 'gray', fontWeight: '500'}}>by Spotify</Text>
        </View>
      </View>
    </View>
  );
}

export {Playlist};
