import React from 'react';
import {View} from './app/shared/tailwind';
import {useNavigator} from './earhart';
import SpotifyIcon from './app/shared/spotify-icon';

import {Animated, Dimensions} from 'react-native';
import {interpolate} from './app/shared/interpolate';
import {api} from './services/api';
import {useAuth} from './providers/auth-provider';
import {useUser} from './providers/user-provider';

// there are two entry cases to handle
//  - already authorized -> home
//  - expired / unauthoried -> login

// on app load, check the user endpoint
// after login, check the user endpoint

function Startup({children}) {
  const navigator = useNavigator();
  const auth = useAuth();
  const {setUser} = useUser();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    api
      .get('/me')
      .then(user => {
        setUser(user);
        navigator.navigate('/home');
        setLoading(false);
      })
      .catch(error => {
        setUser(undefined);
        navigator.navigate('/auth/login');
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    if (auth.authorized) {
      api
        .get('/me')
        .then(user => {
          setUser(user);
          navigator.navigate('/home');
          setLoading(false);
        })
        .catch(error => {
          setUser(undefined);
          navigator.navigate('/auth/login');
          setLoading(false);
        });
    }

    if (auth.loading) {
      setLoading(true);
    }
  }, [auth.authorized, auth.loading]);

  return (
    <View className="flex-1">
      {children}

      <View
        className="absolute inset-0"
        pointerEvents={loading ? 'auto' : 'none'}>
        <IconLoader start={loading === false} />
      </View>
    </View>
  );
}

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

function IconLoader({start = false}) {
  const [finished, setFinished] = React.useState(false);
  const animatedValue = React.useRef(new Animated.Value(0));

  React.useEffect(() => {
    setFinished(false);

    if (start) {
      animatedValue.current.setValue(0);

      Animated.sequence([
        Animated.delay(500),
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
        setFinished(true);
      });
    }
  }, [start]);

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

  if (finished) {
    return null;
  }

  return (
    <View className="flex-1 items-center justify-center">
      <View className="absolute inset-0">
        <Animated.View style={[top, opacity]}>
          <View className="bg-gray-400" style={{height: screenHeight / 2}}>
            <View
              style={{height: screenHeight}}
              className="absolute bg-gray-400 bottom-0 left-0 right-0"
            />
          </View>
        </Animated.View>

        <Animated.View style={[bottom, opacity]}>
          <View className="bg-gray-400" style={{height: screenHeight / 2}}>
            <View
              style={{height: screenHeight}}
              className="absolute bg-gray-400 top-0 left-0 right-0"
            />
          </View>
        </Animated.View>
      </View>

      <Animated.View style={styles}>
        <View className="h-64 w-64 justify-center">
          <SpotifyIcon fill="black" height={64} />
        </View>
      </Animated.View>
    </View>
  );
}

export {Startup};
