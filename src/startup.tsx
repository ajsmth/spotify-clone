import React from 'react';
import {View} from './app/shared/tailwind';
import {useNavigator} from './earhart';
import {api} from './services/api';

import {useUser} from './providers/user-provider';
import {loadUserFromCache} from './services/caches/user';
import {useAppLoader} from './app/shared/app-loader';
import {
  loadPlaylistsFromCache,
  loadCollectionsFromCache,
  loadTracksFromCache,
} from './services/caches/spotify-data';

// load in necessary data for starting the app
// this includes cached data from previous user sessions
async function startup() {
  let user = await loadUserFromCache();

  if (!user) {
    user = await api.get('/me').catch(() => {
      throw new Error('Invalid credentials when fetching user');
    });
  }

  await loadPlaylistsFromCache();
  await loadCollectionsFromCache();
  await loadTracksFromCache();

  return user as IUser;
}

function Startup({children}) {
  const navigator = useNavigator();
  const updateUser = useUser((state) => state.update);
  const [loading, setLoading] = React.useState(true);
  const {enter, success} = useAppLoader();

  React.useEffect(() => {
    // display app loader
    enter();

    startup()
      .then((user) => {
        updateUser(user);
        // exit app loader
        success();
        setLoading(false);
        navigator.navigate('/home');
      })
      .catch(() => {
        updateUser(null);
        // exit app loader - use success because its not really an error
        // if they havent logged in
        success();
        setLoading(false);
        navigator.navigate('/auth/login');
      });
  }, []);

  return <View className="flex-1">{loading === false ? children : null}</View>;
}

export {Startup};
