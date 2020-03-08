jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  const TouchableOpacity = require('react-native/Libraries/Components/Touchable/TouchableOpacity');
  const Flatlist = require('react-native/Libraries/Lists/FlatList');
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    /* Buttons */
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    TouchableOpacity: TouchableOpacity,
    /* Other */
    FlatList: Flatlist,
    gestureHandlerRootHOC: jest.fn(),
    Directions: {},
  };
});

jest.mock('react-native/Libraries/Linking/Linking', () => {
  let callbacks = [];

  return {
    openLink: ({url}) => callbacks.map(cb => cb({url})),
    getInitialURL: jest.fn().mockResolvedValue(''),
    addEventListener: (_, cb) => callbacks.push(cb),
    removeEventListener: (_, cb) =>
      (callbacks = callbacks.filter(c => c !== cb)),
  };
});

jest.mock('react-native-app-auth', () => {
  const authMock = {
    authorize: jest.fn().mockResolvedValue(),
    refresh: jest.fn().mockResolvedValue(),
    revoke: jest.fn().mockResolvedValue(),
  };

  return authMock;
});

jest.mock('react-native-keychain', () => {
  const keychainMock = {
    SECURITY_LEVEL_ANY: 'MOCK_SECURITY_LEVEL_ANY',
    SECURITY_LEVEL_SECURE_SOFTWARE: 'MOCK_SECURITY_LEVEL_SECURE_SOFTWARE',
    SECURITY_LEVEL_SECURE_HARDWARE: 'MOCK_SECURITY_LEVEL_SECURE_HARDWARE',
    setGenericPassword: jest.fn().mockResolvedValue(),
    getGenericPassword: jest.fn().mockResolvedValue(),
    resetGenericPassword: jest.fn().mockResolvedValue(),
    getInternetCredentials: jest.fn().mockResolvedValue(),
  };

  return keychainMock;
});
