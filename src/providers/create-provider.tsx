import React from 'react';
import produce from 'immer';

interface Entity {
  id: string;
}

interface IStore<T extends Entity> {
  lookup: {[key: string]: T};
  ids: string[];
}

type IStoreUpdateManyAction<T extends Entity> = {
  type: 'UPDATE_MANY';
  data: T[];
};

type IStoreUpdateSingleAction<T extends Entity> = {
  type: 'UPDATE_SINGLE';
  data: T;
};

type IStoreUpdateActions<T extends Entity> =
  | IStoreUpdateSingleAction<T>
  | IStoreUpdateManyAction<T>;

function createStore<T extends Entity>() {
  const reducer = produce(
    (draft: IStore<T>, action: IStoreUpdateActions<T>) => {
      switch (action.type) {
        case 'UPDATE_MANY':
          action.data.forEach(item => {
            draft.lookup[item.id] = item;

            if (draft.ids.indexOf(item.id) === -1) {
              draft.ids.push(item.id);
            }
          });

          break;
        case 'UPDATE_SINGLE':
          draft.lookup[action.data.id] = action.data;

          if (draft.ids.indexOf(action.data.id) === -1) {
            draft.ids.push(action.data.id);
          }

          break;

        default: {
          throw new Error('Invalid action');
        }
      }
    },
  );

  return reducer as Reducer<T>;
}

type Dispatch<T extends Entity> = React.Dispatch<IStoreUpdateActions<T>>;

type Reducer<T extends Entity> = (
  state: IStore<T>,
  action: IStoreUpdateActions<T>,
) => IStore<T>;

function createProvider<T extends Entity>(name: string) {
  const Store = React.createContext<IStore<T> | undefined>(undefined);
  const Dispatch = React.createContext<Dispatch<T> | undefined>(undefined);

  Store.displayName = `${name}Context`;

  const reducer = createStore<T>();

  const initialState: IStore<T> = {
    lookup: {},
    ids: [],
  };

  function Provider({children}: {children: React.ReactNode}) {
    const [state, dispatch] = React.useReducer<Reducer<T>>(
      reducer,
      initialState,
    );

    return (
      <Store.Provider value={state}>
        <Dispatch.Provider value={dispatch}>{children}</Dispatch.Provider>
      </Store.Provider>
    );
  }

  Provider.displayName = `${name}Provider`;

  function useStore() {
    const state = React.useContext(Store);

    if (!state) {
      throw new Error(
        `use${name}Store must be used within a ${Provider.displayName}`,
      );
    }

    return state;
  }

  function useDispatch() {
    const dispatch = React.useContext(Dispatch);

    if (!dispatch) {
      throw new Error(
        `use${name}Store must be used within a ${Provider.displayName}`,
      );
    }

    return dispatch;
  }

  function useContext() {
    const dispatch = React.useContext(Dispatch);
    const store = React.useContext(Store);

    if (!store || !dispatch) {
      throw new Error(
        `use${name}Context must be used within a ${Provider.displayName}`,
      );
    }

    return [store, dispatch] as [IStore<T>, Dispatch<T>];
  }

  return {
    Provider,
    useStore,
    useDispatch,
    useContext,
  };
}

import create from 'zustand';
import {createCache} from '../services/cache-data';

type UpdateFn<T> = (item: T | T[]) => void;

function createProvider2<T extends Entity>(name: string) {
  const Store = React.createContext<IStore<T> | undefined>(undefined);
  const Update = React.createContext<UpdateFn<T> | undefined>(undefined);

  Store.displayName = `${name}Context`;

  const [useStore, store] = create(set => {
    const initialState = {
      lookup: {},
      ids: [],
    };

    return initialState;
  });

  const cache = createCache(name, () => Promise.resolve({}))

  function Provider({children}) {
    const set = store.setState;

    React.useEffect(() => {
      cache.load().then(data => {
        store.setState(data);
        setLoaded(true);
      });
    }, []);

    const [loaded, setLoaded] = React.useState(false);

    function update(data: T | T[]) {
      if (Array.isArray(data)) {
        set(state => {
          data.forEach(item => {
            if (state.ids.indexOf(item.id) === -1) {
              state.ids.push(item.id);
            }

            state.lookup[item.id] = item;
          });
        });
      } else {
        let item = data;

        set(state => {
          if (state.ids.indexOf(item.id) === -1) {
            state.ids.push(item.id);
          }

          state.lookup[item.id] = item;
        });
      }
    }

    const state = useStore(state => state);

    if (!loaded) {
      return null;
    }

    return (
      <Store.Provider value={state}>
        <Update.Provider value={update}>{children}</Update.Provider>
      </Store.Provider>
    );
  }

  Provider.displayName = `${name}Provider`;

  function useContext() {
    const state = React.useContext(Store);
    const update = React.useContext(Update);

    if (!store || !update) {
      throw new Error(
        `use${name}Context must be used within a ${Provider.displayName}`,
      );
    }
    return [state, update];
  }

  return {
    useContext,
    store,
    Provider,
  };
}

export {createProvider, createProvider2};
