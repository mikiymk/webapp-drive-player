export type Query = [string, string | number | boolean | undefined];
export const generateUrl = (url: string, querys: Query[]) => {
  return (
    url +
    "?" +
    new URLSearchParams(
      querys
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)]),
    ).toString()
  );
};
