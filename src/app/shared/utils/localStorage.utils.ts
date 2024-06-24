export const setItemInLC = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const retrieveItemFromLC = (key: string): any => {
  const itemStr = localStorage.getItem(key);

  let item: any = null;
  if (itemStr) {
    item = JSON.parse(itemStr);
  }

  return item;
};
