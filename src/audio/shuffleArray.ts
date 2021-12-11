class ShuffleArray<T> implements Iterable<T> {
  private readonly _array: T[];
  private _indexArray: number[];

  constructor(array: Iterable<T> | ArrayLike<T>, shuffled: boolean) {
    this._array = Array.from(array);
    this._indexArray = makeArray(this._array.length);
    if (shuffled) {
      shuffle(this._indexArray);
    }
  }

  set shuffle(value: boolean) {
    this._indexArray = makeArray(this.length);
    if (value) {
      shuffle(this._indexArray);
    }
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

const makeArray = (length: number): number[] => {
  return Array.from({ length }).map((_, i) => i);
};

const random = (limit: number): number => {
  return Math.floor(Math.random() * limit);
};

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

export default ShuffleArray;