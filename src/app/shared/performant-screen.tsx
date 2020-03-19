import React from 'react';
import {View} from './tailwind';
import {InteractionManager} from 'react-native';

function PerformantScreen({children}) {
  const [afterInteractions, setAfterInteractions] = React.useState(false);

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setAfterInteractions(true);
    });
  }, []);

  return afterInteractions ? children : null;
}

export {PerformantScreen};
