import {createProvider} from './create-provider';

const {Provider, useContext, useDispatch, useStore} = createProvider<IAlbum>(
  'Album',
);

export {
  Provider as AlbumProvider,
  useContext as useAlbumContext,
  useDispatch as useAlbumDispatch,
  useStore as useAlbumStore,
};
