import React from 'react';
import {Navigator, Switch} from '../../earhart';

// only mount one screen, unmount any routes that dont match
function SwitchRouter({children}) {
  return (
    <Navigator initialIndex={-1}>
      <Switch keepAlive={false}>{children}</Switch>
    </Navigator>
  );
}

export { SwitchRouter }
