import {createProvider} from './create-provider';

const {Provider, useContext, useDispatch, useStore} = createProvider<IPlaylist>(
  'Playlist',
);

export {
  Provider as PlaylistProvider,
  useContext as usePlaylistContext,
  useDispatch as usePlaylistDispatch,
  useStore as usePlaylistStore,
};
