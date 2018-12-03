import { isNumber } from 'lodash';

export const getIdFromUrl = (url) => {
  const arr = url.slice(0, -1).split('/');
  const id = arr.pop();
  if (isNumber(id)) {
    return id;
  }
  return arr.pop();
}
