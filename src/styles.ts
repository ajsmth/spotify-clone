import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    marginHorizontal: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: '600',
  },

  h1: {
    fontSize: 49,
    lineHeight: 81
  },

  h2: {
    fontSize: 39,
    lineHeight: 65
  },

  h3: {
    fontSize: 32,
    lineHeight: 53
  },

  h4: {
    fontSize: 25,
    fontWeight: '600',
    lineHeight: 41.25
  },

  h5: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 33
  },

  paragraph: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 26.4
  },

  small: {
    fontSize: 12.8,
    fontWeight: '400',
    lineHeight: 21.12
  },

  tiny: {
    fontSize: 10.24,
    fontWeight: '400',
    lineHeight: 16.896
  },

  bold: {
    fontWeight: '800',
  },

  semibold: {
    fontWeight: '600',
  },

  normal: {
    fontWeight: '400',
  },
});

export {styles};
