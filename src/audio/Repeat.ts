/**
 * リピート 全て
 * キュー内のすべての曲を繰り返す
 */
export const RepeatOn = "repeat on";

/**
 * リピート なし
 * キュー内のすべての曲を再生して繰り返ししない
 */
export const RepeatOff = "repeat off";

/**
 * リピート １つ
 * 現在再生している曲を繰り返す
 */
export const RepeatOne = "repeat one";

/**
 * リカバリー用のデフォルト値
 * リピート なしの値
 */
export const RepeatDefault = RepeatOff;

/**
 * リピート設定値の型
 * 全て・なし・一つのどれか
 */
export type RepeatType = typeof RepeatOn | typeof RepeatOff | typeof RepeatOne;

/**
 * リピート3種を順番に切り替える
 * なし→全て→１つ→なしの順番
 * @param repeat 切り替え前のリピート値
 * @returns 切り替え後のリピート値
 */
export const toggleRepeat = (repeat: RepeatType): RepeatType => {
  switch (repeat) {
    case RepeatOff:
      return RepeatOn;

    case RepeatOn:
      return RepeatOne;

    case RepeatOne:
      return RepeatOff;

    default:
      return RepeatDefault;
  }
};
