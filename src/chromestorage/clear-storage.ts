import type { StorageArea } from '@types/chrome';
/**
 * Clears all services from chrome.storage. You might use this when a user
 * logs out to make sure their data doesn't persist for the next user.
 *
 * @param storage an object using the Storage interface
 */
export function clearStorage(storage: StorageArea = chrome.storage.local) {
  const prefix = 'service:' // replace this with your prefix
  storage.get(null).then(items => {
    for (let key in items) {
      if (key?.startsWith(prefix)) {
        storage.remove(key)
      }
    }
  });
}
