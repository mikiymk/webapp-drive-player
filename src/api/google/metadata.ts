import { fetchGetWithBearer } from "../util/withBearer";

import { generateUrl } from "./generateUrl";

import type { GoogleFile, GoogleFileList } from "./type";

const PageSize = 100;

/**
 * Google Drive からファイルリストを入手
 * @param accessToken アクセストークン
 * @param query 検索クエリ文字列 https://developers.google.com/drive/api/v3/ref-search-terms
 * @param appData AppData空間のデータか？
 * @param token ページネーション用トークン
 * @returns ファイルのリストと次のページのトークン
 */
const getFileListPart = async (
  accessToken: string,
  query: string,
  appData: boolean,
  token?: string,
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
  return response.json() as Promise<GoogleFileList>;
};

/**
 * ページに分割されたファイルリストをまとめて入手する
 * @param accessToken アクセストークン
 * @param query 検索クエリ文字列
 * @param appData AppData空間か？
 * @returns ファイルのリスト
 */
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

/**
 * 指定した名前を持つファイルのIDを１つだけ取得する
 * @param token アクセストークン
 * @param name ファイル名
 * @param app AppData空間？
 * @returns 指定した名前を持つファイルID なかった場合はundefined
 */
export const getFileID = async (token: string, name: string, app: boolean) => {
  const files = await getFileListPart(token, `name = '${name}'`, app);
  return files.files[0]?.id;
};
