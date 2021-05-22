export const transformPosition = (userName, position) => {
  const arr = Object.keys(position || {})
  let newPosition = {}
  let curPosition = arr.find(pos => position[pos]?.user?.userName === userName);
  if (curPosition < 0 || !curPosition) {
    return position
  }
  let delta = curPosition - 1;
  arr.forEach((i) => {
    let newIndex = (i - delta + arr.length) % arr.length || arr.length;
    newPosition[newIndex] = position[i];
    newPosition[newIndex].rawPosition = i;
  })
  return newPosition;
}