import {createProvider} from './create-provider';

const {Provider, useContext, useDispatch, useStore} = createProvider<IArtist>(
  'Artist',
);

export {
  Provider as ArtistProvider,
  useContext as useArtistContext,
  useDispatch as useArtistDispatch,
  useStore as useArtistStore,
};
