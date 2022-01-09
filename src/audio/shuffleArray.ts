/**
 * 元の並びを維持したままランダム並び替えをする配列
 */
class ShuffleArray<T> implements Iterable<T> {
  private readonly _array: T[];
  private _indexArray: number[];

  constructor(array: Iterable<T> | ArrayLike<T>, shuffled: boolean) {
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

  get(index: number) {
    return this._array[this._indexArray[index]];
  }

  [Symbol.iterator](): ShuffleIterator<T> {
    return new ShuffleIterator(this);
  }
}

/** ShuffleArray のイテレータ */
class ShuffleIterator<T> implements Iterator<T, undefined> {
  private readonly _array: ShuffleArray<T>;
  private _index = 0;

  constructor(array: ShuffleArray<T>) {
    this._array = array;
  }

  next(): IteratorResult<T, undefined> {
    if (this._index < this._array.length) {
      return {
        done: false,
        value: this._array.get(this._index++),
      };
    } else {
      return {
        done: true,
        value: undefined,
      };
    }
  }
}

/** 0 <= n < length の配列を作る */
const makeArray = (length: number): number[] => {
  return Array.from({ length }).map((_, i) => i);
};

/** 0 <= n < limit の整数乱数 */
const random = (limit: number): number => {
  return Math.floor(Math.random() * limit);
};

/** Fisher–Yates shuffle */
const shuffle = <T>(array: T[]): T[] => {
  const len = array.length;
  for (let i = len - 1; i > 0; i--) {
    const j = random(i + 1);

    const tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }

  return array;
};

const makeShuffledArray = (length: number, shuffled: boolean) => {
  if (shuffled) {
    return shuffle(makeArray(length));
  } else {
    return makeArray(length);
  }
};

export default ShuffleArray;
