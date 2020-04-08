import {createCache} from '../create-cache';
import {user} from '../../providers/user-provider';

const cache = createCache<IUser | null>('user');

user.subscribe(
  (state) => {
    if (state) {
      cache.set(state.user);
    }
  },
  () => user.getState(),
);

function loadUserFromCache() {
  return cache.get().then((cachedUser: IUser | null) => {
    if (cachedUser) {
      user.setState({user: cachedUser});
    } else {
      cache.clear();
    }

    return cachedUser;
  });
}

export {loadUserFromCache};
