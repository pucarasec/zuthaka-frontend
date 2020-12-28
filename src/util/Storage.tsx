import { object } from 'yup'

const Keys = {
  User: 'User',
  LauncherPins: 'LauncherPins',
  ListenerPins: 'ListenerPins',
  DetachedSize: 'DetachedSize',
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

const saveItem = <T extends object | string = object>(
  llave: StorageKeys,
  data: T,
): object | string => {
  if (typeof data === 'object') {
    const fromstring = JSON.stringify(data)
    localStorage.setItem(llave, fromstring)
    return data
  } else {
    localStorage.setItem(llave, data as string)
    return data
  }
}

const removeItem = (key: StorageKeys) => {
  localStorage.removeItem(key)
}

export default {
  getItem,
  saveItem,
  removeItem,
}
