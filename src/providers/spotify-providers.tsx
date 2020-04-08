import React from 'react';
import produce from 'immer';
import create, {UseStore, StoreApi} from 'zustand';

interface IEntity {
  id: string;
}

interface IStore<T> {
  ids: string[];
  lookup: {[key: string]: T};
  update: (items: T[]) => void;
}

function createStore<T extends IEntity>(): [
  UseStore<IStore<T>>,
  StoreApi<IStore<T>>,
] {
  const [useStore, store] = create<IStore<T>>((set) => {
    return {
      lookup: {},
      ids: [],
      update: (items: T[]) =>
        set((state: IStore<T>) => {
          return produce(state, (draft) => {
            items.forEach((item) => {
              if (draft.ids.indexOf(item.id) === -1) {
                draft.ids.push(item.id);
              }

              draft.lookup[item.id] = {
                ...draft.lookup[item.id],
                ...item,
              };
            });
          });
        }),
    };
  });

  return [useStore, store];
}

const [usePlaylists, playlists] = createStore<IPlaylist>();
const [useTracks, tracks] = createStore<ITrack>();
const [useAlbums, albums] = createStore<IAlbum>();
const [useArtists, artists] = createStore<IArtist>();
const [useCategories, categories] = createStore<ICategory>();
const [useCollections, collections] = createStore<ICollection>();

export {
  usePlaylists,
  playlists,
  useTracks,
  tracks,
  useAlbums,
  albums,
  useArtists,
  artists,
  useCategories,
  categories,
  useCollections,
  collections,
};
