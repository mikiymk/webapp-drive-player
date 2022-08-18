type CreateRef = {
  <T>(): [() => T | undefined, (value?: T) => void];
  <T>(initialValue: T): [() => T, (value: T) => void];
};

export const createRef: CreateRef = <T>(initialValue?: T) => {
  let current = initialValue;
  return [
    () => current,
    (value: T) => {
      current = value;
    },
  ];
};
