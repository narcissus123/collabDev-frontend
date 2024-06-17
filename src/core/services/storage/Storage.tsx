// save item in localStorage
const setItem = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};

// get an item from localStorage with its key
const getItem = (key: string): string => {
  if (localStorage.getItem(key)) return localStorage.getItem(key) as string;
  return "";
};

// remove specific item with its key from localStorage
const removeItem = (key: string): boolean => {
  if (!getItem(key)) return false;
  localStorage.removeItem(key);
  return true;
};

// cleare all localStorage of this site
const clearStorage = (): void => {
  window.localStorage.clear();
  window.localStorage.removeItem("user");
};

export { setItem, getItem, removeItem, clearStorage };
