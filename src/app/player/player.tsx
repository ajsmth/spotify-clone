import React from 'react';
import {View, Text, Image, Pressable} from '../shared/tailwind';
import {Modalize} from 'react-native-modalize';
import {useTrackContext} from '../../providers/track-provider';
import {useTrackId} from '../../providers/player-provider';
import {api} from '../../services/api';
import {PlayIcon} from './play-icon';
import {PauseIcon} from './pause-icon';

const modalAnimationConfig = {
  timing: {
    duration: 240,
  },
  spring: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
  },
};

function Player() {
  const [playing, setPlaying] = React.useState(false);

  const trackId = useTrackId();
  const track = useTrack(trackId);

  const modalRef = React.useRef<Modalize>();

  function onOpen() {
    const modal = modalRef.current;

    if (modal) {
      modal.open();
    }
  }

  function onClose() {
    const modal = modalRef.current;

    if (modal) {
      modal.close();
    }
  }

  return (
    <>
      <PlayerButton
        onPress={onOpen}
        track={track}
        playing={playing}
        onPlayerPress={setPlaying}
      />
      <Modalize
        ref={modalRef as any}
        openAnimationConfig={modalAnimationConfig}
        closeAnimationConfig={modalAnimationConfig}>
        <PlayerFullScreen track={track} onBack={onClose} />
      </Modalize>
    </>
  );
}

interface IPlayerButton {
  track?: ITrack;
  playing: boolean;
  onPlayerPress: (playing: boolean) => void;
  onPress: () => void;
}

function PlayerButton({track, onPress, playing, onPlayerPress}: IPlayerButton) {
  return (
    <Pressable onPress={onPress}>
      <View>
        <View className="h-1">
          <View className="w-1/3 h-full bg-gray-600" />
        </View>
        <View className="flex-row justify-between">
          <Image
            className="w-12 h-12 bg-gray-800"
            source={{uri: track?.album?.images[0]?.url}}
          />
          <View className="px-2 flex-1 justify-center">
            <View className="flex-row items-center">
              <Text
                className="text-sm font-medium"
                style={{maxWidth: '50%'}}
                numberOfLines={1}>
                {track?.name}
              </Text>

              {track && <View className="mx-1 w-1 h-1 rounded-full bg-black" />}

              <Text
                className="text-sm font-medium text-gray-600"
                style={{maxWidth: '50%'}}
                numberOfLines={1}>
                {track?.artists[0]?.name}
              </Text>
            </View>
          </View>

          <Pressable
            className="w-12 h-12 p-2"
            onPress={() => onPlayerPress(!playing)}>
            {playing ? (
              <PauseIcon fill="black" style={{width: '100%', height: '100%'}} />
            ) : (
              <PlayIcon fill="black" />
            )}
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

interface IPlayerFullScreen {
  track?: ITrack;
  onBack: () => void;
}

function PlayerFullScreen({track, onBack}: IPlayerFullScreen) {
  return (
    <View className="flex-1 p-4 z-50">
      <View className="flex-1">
        <Pressable className="py-4" onPress={onBack}>
          <Text className="text-xl font-semibold">Back</Text>
        </Pressable>

        <View className="items-center p-4">
          <Image
            className="w-64 h-64 bg-gray-800"
            source={{uri: track?.album?.images[0]?.url}}
          />
        </View>
        <View className="mt-4 p-4">
          <View className="items-start">
            <Text className="text-3xl font-semibold">{track?.name}</Text>
          </View>

          <View className="items-start">
            <Text className="text-xl font-medium text-gray-600">
              {track?.artists[0]?.name}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function useTrack(trackId: string) {
  const [state, dispatch] = useTrackContext();

  React.useEffect(() => {
    if (trackId) {
      api.get(`/tracks/${trackId}`).then(track => {
        dispatch({
          type: 'UPDATE_SINGLE',
          data: track,
        });
      });
    }
  }, [trackId]);

  return state.lookup[trackId];
}

export {Player, PlayerFullScreen};
