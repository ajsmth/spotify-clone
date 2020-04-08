import {createCache} from '../create-cache';
import {
  playlists,
  collections,
  tracks,
} from '../../providers/spotify-providers';

const playlistCache = createCache<IStore<IPlaylist>>('playlists');

playlists.subscribe(
  (state) => {
    if (state) {
      playlistCache.set(state);
    }
  },
  () => playlists.getState(),
);

function loadPlaylistsFromCache() {
  return playlistCache.get().then((cachedPlaylists) => {
    if (cachedPlaylists) {
      playlists.setState(cachedPlaylists);
    }

    return cachedPlaylists;
  });
}

const collectionsCache = createCache<IStore<ICollection>>('collections');

collections.subscribe(
  (state) => {
    if (state) {
      collectionsCache.set(state);
    }
  },
  () => collections.getState(),
);

function loadCollectionsFromCache() {
  return collectionsCache.get().then((cachedCollections) => {
    if (cachedCollections) {
      collections.setState(cachedCollections);
    }

    return cachedCollections;
  });
}

const trackCache = createCache<IStore<ITrack>>('tracks');

tracks.subscribe(
  (state) => {
    if (state) {
      trackCache.set(state);
    }
  },
  () => tracks.getState(),
);

function loadTracksFromCache() {
  return trackCache.get().then((cachedTracks) => {
    if (cachedTracks) {
      tracks.setState(cachedTracks);
    }

    return cachedTracks;
  });
}

export {loadPlaylistsFromCache, loadCollectionsFromCache, loadTracksFromCache};
