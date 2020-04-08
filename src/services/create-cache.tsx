import AsyncStorage from '@react-native-community/async-storage'

function createCache<T>(key: string) {
  function get() {
    return AsyncStorage.getItem(key).then((cachedData: string | null) => {
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      return undefined;
    });
  }

  function set(data: T) {
    return AsyncStorage.setItem(key, JSON.stringify(data));
  }

  function clear() {
    return AsyncStorage.removeItem(key);
  }

  return {
    get,
    set,
    clear,
  };
}

export { createCache }