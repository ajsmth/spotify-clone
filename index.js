import 'react-native-gesture-handler';
import React from 'react';

// if (process.env.NODE_ENV === 'development') {
//   const whyDidYouRender = require('@welldone-software/why-did-you-render');
//   whyDidYouRender(React, {
//     trackAllPureComponents: true,
//   });
// }

// import MessageQueue from 'react-native/Libraries/BatchedBridge/MessageQueue';
// let count = 0;
// const spyFunction = msg => {
//   if (msg.module === 'UIManager') {
//     console.log(++count, msg);
//   }
// };

// MessageQueue.spy(spyFunction);

import {AppRegistry} from 'react-native';
import App from './App';

AppRegistry.registerComponent('SpotifyClone', () => App);
