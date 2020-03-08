import {createProvider} from './create-provider';

const {Provider, useContext, useDispatch, useStore} = createProvider<ITrack>(
  'Track',
);

export {
  Provider as TrackProvider,
  useContext as useTrackContext,
  useDispatch as useTrackDispatch,
  useStore as useTrackStore,
};
