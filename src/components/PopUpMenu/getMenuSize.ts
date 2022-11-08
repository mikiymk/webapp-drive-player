/**
 * クリック位置から右下に出るので、右端や下端でメニューを出すとウインドウの外に出てしまうのを防ぐ
 *
 * @param offset クリック位置座標
 * @param menuSize メニュー要素の大きさ
 * @param winSize ウインドウの大きさ
 * @returns メニュー要素がすべてウインドウに入るような右上の座標
 */
export const getMenuSize = (
  offset: number,
  menuSize: number,
  winSize: number,
) => {
  return `${Math.trunc(
    offset + menuSize > winSize ? winSize - menuSize : offset,
  )}px`;
};
