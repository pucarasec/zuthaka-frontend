const Keys = {
  User: 'User',
  LauncherPins: 'LauncherPins',
  ListenerPins: 'ListenerPins',
}

type StorageKeys = keyof typeof Keys

const getItem = <T extends any = {}>(llave: StorageKeys): T | null => {
  const fromstring = localStorage.getItem(llave)
  if (fromstring) {
    return JSON.parse(fromstring)
  } else {
    return null
  }
}

const saveItem = (llave: StorageKeys, data: object): object => {
  const fromstring = JSON.stringify(data)
  localStorage.setItem(llave, fromstring)
  return data
}

const removeItem = (key: StorageKeys) => {
  localStorage.removeItem(key)
}

export default {
  getItem,
  saveItem,
  removeItem,
}
