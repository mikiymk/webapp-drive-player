export function createRef<T>(): [() => T | undefined, (value?: T) => void];
export function createRef<T>(initialValue: T): [() => T, (value: T) => void];
export function createRef<T>(initialValue?: T) {
  let current = initialValue;
  return [
    () => current,
    (value: T) => {
      current = value;
    },
  ];
}
