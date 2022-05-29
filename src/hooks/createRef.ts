export const createRef = <T>(initialValue?: T) => {
  let current = initialValue;
  return [
    () => current,
    (value: T) => {
      current = value;
    },
  ] as const;
};
