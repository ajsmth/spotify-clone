import React from 'react';

const silentCache = {
  get: (name: string) => Promise.resolve(),
  set: (name: string, state: any) => Promise.resolve(state),
  clear: (name: string) => Promise.resolve(),
};

function create(initialState, update, cache = silentCache) {
  let providers = {};

  function load(names: string[]) {
    let promises: any[] = [];

    for (let i = 0; i < names.length; i++) {
      let name = names[i];
      let provider = providers[name];

      let promise = cache.get(name).then(state => provider.load(state));
      promises.push(promise);
    }

    return Promise.all(promises);
  }

  function clear(names: string[]) {
    let promises: any[] = [];

    for (let i = 0; i < names.length; i++) {
      let name = names[i];
      let provider = providers[name];

      let promise = cache.clear(name).then(() => provider.load(initialState));
      promises.push(promise);
    }

    return Promise.all(promises);
  }

  function get(name: string) {
    let provider = providers[name];

    if (!provider) {
      function updater(state, data) {
        const nextState = update(state, data);
        cache.set(name, nextState);
        return nextState;
      }

      providers[name] = createProvider(initialState, updater);
      provider = providers[name];
    }

    return provider;
  }

  function useProvider<T>(name: string) {
    const provider = React.useRef(get(name));
    const mounted = React.useRef(true);

    const [state, setState] = React.useState(provider.current.state());

    React.useEffect(() => {
      let unlisten = provider.current.listen(state => {
        if (mounted.current === true) {
          setState(state);
        }
      });

      return () => {
        mounted.current = false;
        unlisten();
      };
    }, []);

    return [state as T, provider.current.update];
  }

  return [
    useProvider,
    {
      providers: () => providers,
      load,
      clear,
      get,
    },
  ];
}

type Listener = (state) => void;

function createProvider(initialState, updater) {
  let state = initialState;
  let listeners: Listener[] = [];

  function update(data) {
    const nextState = updater(state, data);
    state = {...nextState};
    notify();

    return state;
  }

  function load(newState) {
    if (newState !== undefined) {
      state = {...newState};
      notify();
    }

    return state;
  }

  function listen(listener: Listener) {
    listeners.push(listener);

    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }

  function notify() {
    listeners.forEach(listener => listener(state));
  }

  return {
    state: () => state,
    update,
    listen,
    load,
  };
}

export {create};
