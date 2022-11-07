export type Query = [string, string | number | boolean | undefined];
export const generateUrl = (url: string, querys: Query[]) => {
  return (
    url +
    "?" +
    querys
      .map(param)
      .filter((v) => v)
      .join("&")
  );
};

const param = ([key, value]: Query) => {
  return !!value && key + "=" + encodeURIComponent(value);
};
