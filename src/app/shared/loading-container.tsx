import React from 'react';
import {Animated} from 'react-native';
import {interpolate} from './interpolate';

function LoadingContainer({
  children,
  loading,
  interpolation = {},
  config = {},
}) {
  const animValue = React.useRef(new Animated.Value(loading ? 0 : 1));
  React.useEffect(() => {
    Animated.spring(animValue.current, {
      toValue: loading ? 0 : 1,
      useNativeDriver: true,
      ...config,
    }).start();
  }, [loading]);

  const styles = interpolate(animValue.current, interpolation);

  return <Animated.View style={{...styles}}>{children}</Animated.View>;
}

export {LoadingContainer};
