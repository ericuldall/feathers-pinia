import { computed, watch } from 'vue-demi'
import { _ } from '@feathersjs/commons'
import debounce from 'just-debounce'
import type { StorageArea } from '@types/chrome';

// Writes data to chrome.storage 
export function writeToStorage(id: string, data: any, storage: StorageArea) {
  const compressed = JSON.stringify(data)
  storage.set({[id]: compressed})
}

// Moves data from chrome.storage into the store
export function hydrateStore(store: any, storage: StorageArea) {
  const data = storage.get([store.$id])
  if (data[store.$id]) {
    const hydrationData = JSON.parse(data[store.$id] as string) || {}
    Object.assign(store, hydrationData)
  }
  keepStoreHydrated(store, storage);
}

// Keeps store in sync with remote changes to storage
export function keepStoreHydrated(store: any, storage: StorageArea) {
  storage.onChanged.addListener(changes => {
    if (changes[store.$id]) {
      const hydrationData = JSON.parse(changes[store.$id] as string) || {}
      Object.assign(store, hydrationData)
    }
  });
}

/**
 *
 * @param store pinia store
 * @param keys an array of keys to watch and write to localStorage.
 */
export function syncWithStorage(store: any, stateKeys: Array<string>, storage: StorageArea = chrome.storage.local) {
  hydrateStore(store, storage)

  const debouncedWrite = debounce(writeToStorage, 500)
  const toWatch = computed(() => _.pick(store, ...stateKeys))

  watch(toWatch, (val) => debouncedWrite(store.$id, val, storage), { deep: true })
}
