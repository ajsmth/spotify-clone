import {Animated, ViewStyle} from 'react-native';

function interpolate(
  value:
    | Animated.Value
    | Animated.AnimatedAddition
    | Animated.AnimatedSubtraction,
  pageInterpolation?: any,
): ViewStyle {
  if (!pageInterpolation) {
    return {};
  }

  return Object.keys(pageInterpolation).reduce((styles: any, key: any) => {
    const currentStyle = pageInterpolation[key];

    if (Array.isArray(currentStyle)) {
      const _style = currentStyle.map((interpolationConfig: any) =>
        interpolate(value, interpolationConfig),
      );

      styles[key] = _style;
      return styles;
    }

    if (typeof currentStyle === 'object') {
      styles[key] = value.interpolate(currentStyle);
      return styles;
    }

    return styles;
  }, {});
}

export {interpolate};
