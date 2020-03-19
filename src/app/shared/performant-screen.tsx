import React from 'react';
import {View} from './tailwind';
import {InteractionManager} from 'react-native';

function PerformantScreen({children}) {
  const [afterInteractions, setAfterInteractions] = React.useState(false);
  const mounted = React.useRef(true);

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (mounted.current) {
        setAfterInteractions(true);
      }
    });

    return () => {
      mounted.current = false;
    };
  }, []);

  return afterInteractions ? children : null;
}

export {PerformantScreen};
