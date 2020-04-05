import {createProvider2} from './create-provider';

const {Provider, store, useContext} = createProvider2('PlaylistCollection');

export {
  Provider as PlaylistCollectionProvider,
  store as playlistCollectionStore,
  useContext as usePlaylistCollectionContext,
};
