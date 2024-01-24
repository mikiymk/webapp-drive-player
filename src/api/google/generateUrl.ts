export type Query = [string, string | number | boolean | undefined];

/**
 * GETリクエスト用のクエリ付きURLを作成する関数
 * @param url URL
 * @param querys ？の後につけるクエリの組リスト 値がundefinedの場合は組ごと飛ばす
 * @returns クエリ付きURL
 */
export const generateUrl = (url: string, querys: Query[]) => {
  return `${url}?${new URLSearchParams(
    querys
      .filter(([, value]) => value)
      .map(([key, value]) => [key, String(value)]),
  ).toString()}`;
};
