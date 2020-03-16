import {Animated, ViewStyle} from 'react-native';

function interpolate(
  offset: Animated.Value,
  pageInterpolation?: any,
): ViewStyle {
  if (!pageInterpolation) {
    return {};
  }

  return Object.keys(pageInterpolation).reduce((styles: any, key: any) => {
    const currentStyle = pageInterpolation[key];

    if (Array.isArray(currentStyle)) {
      const _style = currentStyle.map((interpolationConfig: any) =>
        interpolate(offset, interpolationConfig),
      );

      styles[key] = _style;
      return styles;
    }

    if (typeof currentStyle === 'object') {
      styles[key] = offset.interpolate(currentStyle);
      return styles;
    }

    return styles;
  }, {});
}

export {interpolate};
