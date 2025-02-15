interface CreateRef {
  <T>(): [() => T | undefined, (value?: T) => void];
  <U>(initialValue: U): [() => U, (value: U) => void];
}

export const createRef: CreateRef = <T>(initialValue?: T) => {
  let current = initialValue;
  return [
    () => current,
    (value: T) => {
      current = value;
    },
  ];
};
