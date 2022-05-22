import { fetchGet } from "./fetchGet";
import { generateUrl } from "./generateUrl";

const GET_PAGE_SIZE = 100;

type GoogleFileList = {
  files: { id: string; name: string }[];
  nextPageToken?: string;
};

/**
 * Google Drive からファイルリストを入手
 * @param query 検索クエリ文字列 https://developers.google.com/drive/api/v3/ref-search-terms
 * @param token ページトークン
 */
export const getList = async (
  accessToken: string,
  query: string,
  token?: string
): Promise<GoogleFileList> => {
  const url = generateUrl("https://www.googleapis.com/drive/v3/files", [
    ["fields", "nextPageToken, files(id, name)"],
    ["pageSize", GET_PAGE_SIZE],
    ["pageToken", token],
    ["orderBy", "name"],
    ["q", query],
  ]);

  const response = await fetchGet(url, accessToken);
  return await response.json();
};

export const getAppDataList = async (
  accessToken: string,
  query: string,
  token?: string
): Promise<GoogleFileList> => {
  const url = generateUrl("https://www.googleapis.com/drive/v3/files", [
    ["spaces", "appDataFolder"],
    ["fields", "nextPageToken, files(id, name)"],
    ["pageSize", GET_PAGE_SIZE],
    ["pageToken", token],
    ["orderBy", "name"],
    ["q", query],
  ]);

  const response = await fetchGet(url, accessToken);
  return await response.json();
};
