export const getHexColor = id => {
  const hash = id
    .split('')
    .reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);

  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
};
