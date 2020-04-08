import React from 'react';
import {Animated, Dimensions} from 'react-native';
import {View} from './tailwind';
import {interpolate} from './interpolate';
import SpotifyIcon from './spotify-icon';

const springConfig = {
  stiffness: 1000,
  damping: 500,
  mass: 3,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
  useNativeDriver: true,
};

const {height: screenHeight} = Dimensions.get('window');

type AppLoaderStatus = 'idle' | 'loading' | 'success' | 'error';

interface IAppLoader {
  children: React.ReactNode;
}

const AppLoaderContext = React.createContext({
  enter: () => {},
  success: () => {},
  error: () => {},
});

function AppLoader({children}: IAppLoader) {
  const [status, setStatus] = React.useState<AppLoaderStatus>('idle');

  const animatedValue = React.useRef(new Animated.Value(0));
  const errorAnimatedValue = React.useRef(new Animated.Value(0));

  React.useEffect(() => {
    if (status === 'loading') {
      Animated.sequence([
        Animated.spring(animatedValue.current, {
          toValue: 0,
          ...springConfig,
        }),
      ]).start();
    }

    if (status === 'success') {
      animatedValue.current.setValue(0);

      Animated.sequence([
        Animated.delay(300),
        Animated.spring(animatedValue.current, {
          toValue: 0.5,
          ...springConfig,
        }),
        Animated.delay(300),
        Animated.spring(animatedValue.current, {
          toValue: 1,
          ...springConfig,
        }),
      ]).start(() => {
        setStatus('idle');
      });
    }

    if (status === 'error') {
      Animated.sequence([
        Animated.delay(300),
        Animated.spring(errorAnimatedValue.current, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.spring(animatedValue.current, {
          toValue: 1,
          ...springConfig,
        }),
      ]).start(() => {
        errorAnimatedValue.current.setValue(0);
        setStatus('idle');
      });
    }
  }, [status]);

  const enter = React.useCallback(() => setStatus('loading'), []);
  const success = React.useCallback(() => setStatus('success'), []);
  const error = React.useCallback(() => setStatus('error'), []);

  const styles = interpolate(animatedValue.current, {
    transform: [
      {
        scale: {
          inputRange: [0, 0.5, 1],
          outputRange: [1, 0.9, 5],
        },
      },
    ],
    opacity: {
      inputRange: [0, 0.5, 0.6],
      outputRange: [1, 1, 0],
    },
  });

  const top = interpolate(animatedValue.current, {
    transform: [
      {
        translateY: {
          inputRange: [0, 0.5, 1],
          outputRange: [0, screenHeight / 2, -screenHeight],
        },
      },
    ],
  });

  const bottom = interpolate(animatedValue.current, {
    transform: [
      {
        translateY: {
          inputRange: [0, 0.5, 1],
          outputRange: [0, -screenHeight / 2, screenHeight],
        },
      },
    ],
  });

  const opacity = interpolate(animatedValue.current, {
    opacity: {
      inputRange: [0, 0.8, 1],
      outputRange: [1, 1, 0],
    },
  });

  const shakeOnError = interpolate(errorAnimatedValue.current, {
    transform: [
      {
        translateX: {
          inputRange: [0, 0.1, 0.5, 0.9, 1],
          outputRange: [0, -20, 20, -10, 0],
        },
      },
    ],
  });

  return (
    <AppLoaderContext.Provider value={{enter, success, error}}>
      <View className="flex-1">
        {children}

        <View
          className="absolute inset-0"
          pointerEvents={status === 'idle' ? 'none' : 'auto'}>
          <View className="flex-1 items-center justify-center">
            <View className="absolute inset-0">
              <Animated.View style={[top, opacity]}>
                <View
                  className="bg-gray-400"
                  style={{height: screenHeight / 2}}>
                  <View
                    style={{height: screenHeight}}
                    className="absolute bg-gray-400 bottom-0 left-0 right-0"
                  />
                </View>
              </Animated.View>

              <Animated.View style={[bottom, opacity]}>
                <View
                  className="bg-gray-400"
                  style={{height: screenHeight / 2}}>
                  <View
                    style={{height: screenHeight}}
                    className="absolute bg-gray-400 top-0 left-0 right-0"
                  />
                </View>
              </Animated.View>
            </View>

            <Animated.View style={[styles]}>
              <View className="h-64 w-64 justify-center">
                <Animated.View style={shakeOnError}>
                  <SpotifyIcon fill="black" height={64} />
                </Animated.View>
              </View>
            </Animated.View>
          </View>
        </View>
      </View>
    </AppLoaderContext.Provider>
  );
}

function useAppLoader() {
  return React.useContext(AppLoaderContext);
}

export {AppLoader, useAppLoader};
