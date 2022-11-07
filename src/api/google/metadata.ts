import { fetchGetWithBearer } from "../util/withBearer";

import { generateUrl } from "./generateUrl";

import type { GoogleFile, GoogleFileList } from "./type";

const PageSize = 100;

/**
 * Google Drive からファイルリストを入手
 * @param query 検索クエリ文字列 https://developers.google.com/drive/api/v3/ref-search-terms
 * @param token ページトークン
 */
const getFileListPart = async (
  accessToken: string,
  query: string,
  appData: boolean,
  token?: string | undefined,
): Promise<GoogleFileList> => {
  const url: string = generateUrl("https://www.googleapis.com/drive/v3/files", [
    ["spaces", appData && "appDataFolder"],
    ["fields", "nextPageToken, files(id, name)"],
    ["pageSize", PageSize],
    ["pageToken", token],
    ["orderBy", "name"],
    ["q", query],
  ]);

  const response: Response = await fetchGetWithBearer(url, accessToken);
  return await response.json();
};

/** ファイルリストをまとめて全ファイルリストを入手 */
export const getGoogleMetadata = async (
  accessToken: string,
  query: string,
  appData: boolean,
) => {
  let nextPageToken: string | undefined = undefined;
  let allFiles: GoogleFile[] = [];

  do {
    const files: GoogleFileList = await getFileListPart(
      accessToken,
      query,
      appData,
      nextPageToken,
    );

    allFiles = allFiles.concat(files.files);
    nextPageToken = files.nextPageToken;
  } while (nextPageToken);

  return allFiles;
};

export const getFileID = async (token: string, name: string, app: boolean) => {
  const files = await getFileListPart(token, `name = '${name}'`, app);
  return files?.files[0]?.id;
};
