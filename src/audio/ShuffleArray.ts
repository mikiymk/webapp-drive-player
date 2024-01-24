/**
 * 元の並びを維持したままランダム並び替えをする配列
 */
export class ShuffleArray implements Iterable<string> {
  private readonly _array: string[];
  private _indexArray: number[];

  constructor(array: readonly string[], shuffled: boolean) {
    this._array = Array.from(array);
    this._indexArray = makeShuffledArray(this._array.length, shuffled);
  }

  /** シャッフル状態の切り替え */
  set shuffle(value: boolean) {
    this._indexArray = makeShuffledArray(this.length, value);
  }

  get length() {
    return this._array.length;
  }

  get(index: number): string | undefined {
    const arrayIndex = this._indexArray[index];
    if (arrayIndex === undefined) return undefined;
    return this._array[arrayIndex];
  }

  *[Symbol.iterator](): Generator<string, void, undefined> {
    for (let i = 0; i < this.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const item = this.get(i);
      if (item !== undefined) {
        yield item;
      }
    }
  }
}

/**
 * 要素が0からlength-1までの数字のlength個の配列を作る
 * @param length 配列の長さ
 * @returns 0からカウントアップする配列
 */
const makeArray = (length: number): number[] => {
  return Array.from({ length }, (_, i) => i);
};

/** 0以上limit未満の整数の乱数 */
const random = (limit: number): number => {
  return Math.floor(Math.random() * limit);
};

/** Fisher-Yatesシャッフル */
const shuffle = (array: number[]): number[] => {
  const len = array.length;
  for (let i = len - 1; i > 0; i--) {
    const j = random(i + 1);

    const ai = array[i];
    const aj = array[j];

    if (ai !== undefined && aj !== undefined) {
      array[i] = aj;
      array[j] = ai;
    }
  }

  return array;
};

const makeShuffledArray = (length: number, shuffled: boolean) => {
  const array = makeArray(length);

  return shuffled ? shuffle(array) : array;
};
